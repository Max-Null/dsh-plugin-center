/**
 * Update detection, changelog extraction, and install/update execution.
 * npm registry is the primary version source; changelog is commit-history
 * first (many community repos ship no release/tag/CHANGELOG — verified §7.2).
 */
import { spawn } from 'node:child_process';
import { appendFileSync, existsSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';
import { compareVersions, satisfies } from "./semver.js";
const UA = { 'User-Agent': 'dsh-plugin-center' };
/** Latest published version on the npm registry; null when unreachable/unpublished. */
export async function npmLatest(packageName) {
    for (const registry of ['https://registry.npmjs.org', 'https://registry.npmmirror.com']) {
        try {
            const res = await fetch(`${registry}/${packageName}/latest`, {
                signal: AbortSignal.timeout(8000),
            });
            if (res.ok)
                return (await res.json()).version ?? null;
        }
        catch { /* next registry */ }
    }
    return null;
}
/** Extract owner/repo from a package.json repository field. */
function repoOf(repoUrl) {
    if (repoUrl === null)
        return null;
    const match = /github\.com[/:]([^/]+)\/([^/.#]+)/.exec(repoUrl);
    if (match === null)
        return null;
    return { owner: match[1], repo: match[2] };
}
/** Commit-message changelog: the reliable source for repos without release notes. */
export async function fetchCommitChangelog(repoUrl, sinceIso) {
    const repo = repoOf(repoUrl);
    if (repo === null)
        return [];
    try {
        const res = await fetch(`https://api.github.com/repos/${repo.owner}/${repo.repo}/commits?since=${encodeURIComponent(sinceIso)}&per_page=20`, { headers: UA, signal: AbortSignal.timeout(15000) });
        if (!res.ok)
            return [];
        const commits = await res.json();
        return commits.map(c => c.commit.message.split('\n')[0]).filter(line => line !== '');
    }
    catch {
        return [];
    }
}
/**
 * Detect one plugin's update: compare local vs remote version, pull commit
 * changelog since `sinceIso`, and check DSH compatibility against the local
 * DSH version via the plugin's peer-dependency range.
 */
export async function detectUpdate(name, localVersion, repoUrl, compatRange, localDshVersion, sinceIso) {
    const latest = await npmLatest(name);
    if (latest === null || compareVersions(latest, localVersion) <= 0)
        return null;
    let compat = 'unknown';
    if (compatRange !== null) {
        compat = satisfies(localDshVersion, compatRange) ? 'compatible' : 'incompatible';
    }
    return {
        name,
        fromVersion: localVersion,
        toVersion: latest,
        changelog: await fetchCommitChangelog(repoUrl, sinceIso),
        compat,
        compatRange,
    };
}
/**
 * Append one pnpm operation to `<profileDir>/plugin-center-pnpm.log`: time,
 * command, cwd, exit, duration, and the captured output tail. Every install
 * and update lands here regardless of success, so a problem on any machine
 * can be diagnosed by copying the log (2026-08-22: SSiD 更新慢/失败复盘需要
 * 现场证据；日志写失败绝不影响主流程）。
 */
export function logPnpm(profileDir, args, result) {
    try {
        const file = join(profileDir, 'plugin-center-pnpm.log');
        const line = [
            `${new Date().toISOString()} $ pnpm ${args.join(' ')}`,
            `  cwd=${profileDir}`,
            `  ${result.ok ? 'ok' : 'FAIL'} duration=${result.durationMs}ms`,
            result.detail === '' ? '' : `  ${result.detail.split('\n').map(s => `  ${s}`).join('\n')}`,
            '---',
            '',
        ].join('\n');
        appendFileSync(file, line);
    }
    catch { /* logging must never break the install path */ }
}
/** pnpm 候选命令：GUI 进程 PATH 常缺用户级 npm 全局目录；且 Windows 上
 *  CreateProcess 只找 pnpm.exe（.cmd/.ps1 必须经 shell）——2026-08-17 实测
 *  spawn('pnpm', shell:false) 直接 ENOENT，更新永远假成功。 */
export function pnpmCandidates() {
    const commands = ['pnpm', 'pnpm.cmd'];
    const userNpm = join(homedir(), 'AppData', 'Roaming', 'npm');
    for (const name of ['pnpm.cmd', 'pnpm.exe', 'pnpm']) {
        const candidate = join(userNpm, name);
        if (existsSync(candidate))
            commands.push(candidate);
    }
    return commands;
}
function runOne(command, args, cwd) {
    return new Promise((resolve) => {
        let child;
        try {
            // shell: true —— Windows 下 .cmd shim 必须经 shell 才能 spawn；
            // windowsHide —— GUI 宿主下不弹 cmd 窗口（2026-08-18 用户实测闪烁）。
            // stdio 走默认 pipe：捕获 pnpm 输出，失败时把尾部输出放进 detail
            // （2026-08-22 起——此前 inherit 只有 exit code，SSiD 下更新失败
            // 无法诊断；宿主进程（web/electron）非 DSH 工具沙箱，pipe 可用）。
            child = spawn(command, [...args], { cwd, shell: true, windowsHide: true });
        }
        catch (e) {
            resolve({ ok: false, detail: e instanceof Error ? e.message : String(e), durationMs: 0 });
            return;
        }
        const started = Date.now();
        // 15 分钟硬超时：pnpm 可能卡在 supply-chain 全量验证/网络重试上
        // （2026-08-22 SSiD 下「更新中」长时间不结束的防御），超时杀掉并报错。
        let timedOut = false;
        const timer = setTimeout(() => {
            timedOut = true;
            child.kill();
        }, 15 * 60_000);
        let out = '';
        child.stdout?.on('data', (d) => { out += d.toString(); });
        child.stderr?.on('data', (d) => { out += d.toString(); });
        child.on('error', e => { clearTimeout(timer); resolve({ ok: false, detail: e.message, durationMs: Date.now() - started }); });
        child.on('close', code => {
            clearTimeout(timer);
            const durationMs = Date.now() - started;
            if (code === 0)
                resolve({ ok: true, detail: '', durationMs });
            const tail = out.trim();
            const header = timedOut ? 'timed out after 15 minutes' : `exit code ${code ?? 1}`;
            resolve({ ok: false, detail: `${header}${tail === '' ? '' : `\n${tail.slice(-4000)}`}`, durationMs });
        });
    });
}
/**
 * Run pnpm in the profile directory, trying each candidate command in turn.
 * Output is captured (no named-pipe stdio — the host process is the web or
 * electron main process, not the DSH tool sandbox); the exit code and the
 * captured tail are the result this layer returns, and every attempt is
 * appended to the profile's plugin-center-pnpm.log.
 */
export async function runPnpm(args, cwd) {
    let last = { ok: false, detail: 'no pnpm candidate found', durationMs: 0 };
    for (const command of pnpmCandidates()) {
        last = await runOne(command, args, cwd);
        if (last.ok)
            break;
    }
    logPnpm(cwd, args, last);
    return last;
}
/** Install a package into the web profile, mirroring `dsh plugin add` semantics. */
export async function installPlugin(packageSpec, profileDir) {
    // `-w` is required: every profile ships a pnpm-workspace.yaml.
    return runPnpm(['add', '-w', packageSpec], profileDir);
}
/**
 * Update a package to the given version, mirroring `dsh plugin add <pkg>`.
 * The exact version is required: with a bare package name, pnpm 11's
 * `minimumReleaseAge` supply-chain policy silently refuses a too-recent
 * latest (exit 0, nothing installed) — a false-success update. An explicit
 * `<name>@<version>` pins the target and pnpm records it in
 * `minimumReleaseAgeExclude` itself (2026-08-18, reproduced in-process).
 */
export async function updatePlugin(packageName, version, profileDir) {
    return runPnpm(['add', '-w', `${packageName}@${version}`], profileDir);
}
