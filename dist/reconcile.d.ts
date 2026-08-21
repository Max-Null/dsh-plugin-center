/** Snapshot of the profile's declared dependencies (keys only). */
export declare function readDependencyKeys(profileDir: string): ReadonlySet<string>;
/** Human feedback for the install toast, joined by `；`. */
export interface ReconcileOutcome {
    note: string;
}
/**
 * Compare the dependency set against `before`; for each new entry, read the
 * installed manifest and either register the bundle or report the truth.
 * Best-effort: never throws (the install itself already succeeded).
 */
export declare function reconcileInstalled(profileDir: string, before: ReadonlySet<string>): ReconcileOutcome;
