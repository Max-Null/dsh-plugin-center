/**
 * Hot disable/enable through the profile's user patch layer
 * (`<profileDir>/cordis.patch.yml`) — the mechanism dsh-market ports from
 * dsh-plugin-hub: a patch row `- id: X` + `disabled: true` stops that loader
 * entry, `disabled: false` force-enables one a lower layer disabled. The
 * official web profile re-composes via HMR (~1s, no restart); SSiD applies
 * the same file on every boot, so the choice survives restarts there.
 *
 * Writes are line-level (the patch dialect is simple for toggles: a row id
 * followed by an optional `disabled:` line), serialized so concurrent
 * toggles cannot interleave a read-modify-write, refused when the file is
 * not a plain entry list, and protected for host-infrastructure rows.
 */
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
/** Host infrastructure rows: disabling any of these breaks the very chain
 *  the patch layer runs on. Same list dsh-market uses. */
const PROTECTED_PATTERNS = [
    /^cordis:/u,
    /^@deepseek-ai\/cordis-plugin-/u,
    /^@deepseek-ai\/dsh-host-/u,
    /^@deepseek-ai\/dsh-client-modules$/u,
    /^@deepseek-ai\/dsh-client-connection$/u,
    /^@deepseek-ai\/dsh-client-hmr$/u,
    /^@deepseek-ai\/dsh-client-runtime$/u,
    /^@deepseek-ai\/dsh-client-locale$/u,
    /^@deepseek-ai\/dsh-client-web/u,
    /^@deepseek-ai\/dsh-web-frontend$/u,
    /^@deepseek-ai\/dsh-app-boot$/u,
    /^@deepseek-ai\/dsh-base$/u,
    /^@deepseek-ai\/dsh-web-app$/u,
];
function isProtected(id) {
    return PROTECTED_PATTERNS.some(pattern => pattern.test(id));
}
/** Official bundle entry ids (timer/llm/session/… from dsh-base and
 *  dsh-web-app patch inserts): disabling these breaks the core chain, so
 *  they refuse to toggle alongside the pattern-based protection above. */
function officialEntryIds(profileDir) {
    const ids = new Set();
    for (const pkg of ['@deepseek-ai/dsh-base', '@deepseek-ai/dsh-web-app']) {
        try {
            const patchPath = join(profileDir, 'node_modules', pkg, 'cordis.patch.yml');
            if (!existsSync(patchPath))
                continue;
            const text = readFileSync(patchPath, 'utf8');
            for (const match of text.matchAll(/^- id:\s*(\S+)\s*$/gmu))
                ids.add(match[1]);
        }
        catch { /* best-effort */ }
    }
    return ids;
}
/** What the user patch layer currently says about every row id. */
export function readDisabledState(patchPath) {
    const state = new Map();
    let text = '';
    try {
        text = existsSync(patchPath) ? readFileSync(patchPath, 'utf8') : '';
    }
    catch {
        return state;
    }
    let current = null;
    for (const line of text.split('\n')) {
        const row = /^- id:\s*(\S+)\s*$/u.exec(line);
        if (row !== null) {
            current = row[1];
            continue;
        }
        if (current === null)
            continue;
        const disabled = /^ {2}disabled:\s*(true|false)\s*$/u.exec(line);
        if (disabled !== null) {
            state.set(current, disabled[1] === 'true');
            current = null;
        }
    }
    return state;
}
/** Serialize toggles so concurrent writes cannot interleave. */
let toggleChain = Promise.resolve();
/**
 * Set one entry's disabled stance in the profile patch layer. The file is
 * only touched when the stance changes; a malformed file (not a plain
 * entry list) is reported instead of being made worse.
 * @param profileDir - the profile directory holding cordis.patch.yml.
 * @param id - the loader entry id to toggle.
 * @param disabled - the target stance.
 * @returns the outcome; `nowDisabled` mirrors the stance or null when refused.
 */
export function setDisabled(profileDir, id, disabled) {
    const run = toggleChain.then(async () => {
        if (isProtected(id) || officialEntryIds(profileDir).has(id)) {
            return { ok: false, detail: `"${id}" is host infrastructure and cannot be disabled`, nowDisabled: null };
        }
        const patchPath = join(profileDir, 'cordis.patch.yml');
        const current = readDisabledState(patchPath);
        if (current.get(id) === disabled) {
            return { ok: true, detail: `"${id}" is already ${disabled ? 'disabled' : 'enabled'}`, nowDisabled: disabled };
        }
        let text = '';
        try {
            text = existsSync(patchPath) ? readFileSync(patchPath, 'utf8') : '';
        }
        catch (error) {
            return { ok: false, detail: `read ${patchPath} failed: ${String(error)}`, nowDisabled: null };
        }
        // Malformed guard: a non-empty patch file must be a plain entry list.
        const first = text.trimStart().split('\n')[0] ?? '';
        if (text.trim() !== '' && !first.startsWith('- ')) {
            return { ok: false, detail: 'cordis.patch.yml is not a plain entry list; refusing to modify it', nowDisabled: null };
        }
        const lines = text === '' ? [] : text.split('\n');
        const out = [];
        let patched = false;
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            const row = /^- id:\s*(\S+)\s*$/u.exec(line);
            if (row !== null && row[1] === id) {
                // Find the row's disabled line (immediately after, if present) and
                // replace it; otherwise insert one right after the id line.
                out.push(line);
                const next = lines[i + 1];
                if (next !== undefined && /^ {2}disabled:\s*(true|false)\s*$/u.test(next)) {
                    out.push(`  disabled: ${String(disabled)}`);
                    i++;
                }
                else {
                    out.push(`  disabled: ${String(disabled)}`);
                }
                patched = true;
                continue;
            }
            out.push(line);
        }
        if (!patched) {
            // Append a new row (the file ends with a newline when non-empty).
            const tail = out.length > 0 && out[out.length - 1] !== '' ? '\n' : '';
            out.push(`${tail}- id: ${id}\n  disabled: ${String(disabled)}`);
        }
        try {
            writeFileSync(patchPath, out.join('\n') + '\n');
        }
        catch (error) {
            return { ok: false, detail: `write ${patchPath} failed: ${String(error)}`, nowDisabled: null };
        }
        return { ok: true, detail: '', nowDisabled: disabled };
    });
    toggleChain = run.catch(() => { });
    return run;
}
