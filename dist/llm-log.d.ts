export type LlmLogStatus = 'pending' | 'running' | 'success' | 'failed';
export interface LlmLogEntry {
    name: string;
    action: string;
    detail: string;
    status: LlmLogStatus;
}
/** 最近一条记录(JSONL 逆序找 name 匹配;坏行跳过;无记录/文件缺失 → null)。 */
export interface LlmLogRecord {
    at: number;
    name: string;
    action: string;
    detail: string;
    status: LlmLogStatus;
}
/** 日志文件路径(DSH_HOME 未设时回退 ~/.dsh)。 */
export declare function llmLogPath(dshHome?: string | undefined): string;
/** 追加一条记录(目录自动创建;失败静默——日志绝不阻断主流程)。 */
export declare function appendLlmLog(entry: LlmLogEntry, dshHome?: string | undefined): Promise<void>;
/** 解析一行 JSON:合法且 name 匹配 → 记录;其他 → null。 */
export declare function parseLlmLogLine(line: string, name: string): LlmLogRecord | null;
/** 读取某插件最近一条记录(逆序;文件缺失/全坏行 → null)。 */
export declare function readLlmLogLatest(name: string, dshHome?: string | undefined): Promise<LlmLogRecord | null>;
/** 按文本扫最后一行含 name 的 JSON(提取解析出的 attr——测试断言用)。 */
export declare function extractLlmLogField(line: string): Record<string, unknown> | null;
