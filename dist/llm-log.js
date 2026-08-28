/**
 * LLM 更新动作日志(JSONL)——纯文件读写模块(无 engine 依赖,可单测)。
 * 文件位置:$DSH_HOME/plugin-center/llm-update-log.jsonl
 * 行格式:{"at":number,"name":string,"action":string,"detail":string,"status":...}
 * client 侧轮询 llm-update.result 依赖此文件做三态(执行中/成功/失败)。
 */
import { appendFile, mkdir, readFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { homedir } from 'node:os';
/** 日志文件路径(DSH_HOME 未设时回退 ~/.dsh)。 */
export function llmLogPath(dshHome = process.env.DSH_HOME) {
    return join(dshHome ?? join(homedir(), '.dsh'), 'plugin-center', 'llm-update-log.jsonl');
}
/** 追加一条记录(目录自动创建;失败静默——日志绝不阻断主流程)。 */
export async function appendLlmLog(entry, dshHome) {
    try {
        const file = llmLogPath(dshHome);
        await mkdir(dirname(file), { recursive: true });
        const line = JSON.stringify({ at: Date.now(), ...entry }) + '\n';
        await appendFile(file, line, 'utf8');
    }
    catch { /* best-effort */ }
}
/** 解析一行 JSON:合法且 name 匹配 → 记录;其他 → null。 */
export function parseLlmLogLine(line, name) {
    try {
        const rec = JSON.parse(line);
        if (rec.name !== name)
            return null;
        const status = rec.status === 'pending' || rec.status === 'running' || rec.status === 'success' || rec.status === 'failed' ? rec.status : 'running';
        return {
            at: typeof rec.at === 'number' ? rec.at : 0,
            name,
            action: typeof rec.action === 'string' ? rec.action : '',
            detail: typeof rec.detail === 'string' ? rec.detail : '',
            status,
        };
    }
    catch {
        return null;
    }
}
/** 读取某插件最近一条记录(逆序;文件缺失/全坏行 → null)。 */
export async function readLlmLogLatest(name, dshHome) {
    try {
        const text = await readFile(llmLogPath(dshHome), 'utf8');
        const lines = text.split('\n');
        for (let i = lines.length - 1; i >= 0; i--) {
            const line = lines[i]?.trim();
            if (line === undefined || line === '')
                continue;
            const rec = parseLlmLogLine(line, name);
            if (rec !== null)
                return rec;
        }
        return null;
    }
    catch {
        return null;
    }
}
/** 按文本扫最后一行含 name 的 JSON(提取解析出的 attr——测试断言用)。 */
export function extractLlmLogField(line) {
    try {
        return JSON.parse(line);
    }
    catch {
        return null;
    }
}
