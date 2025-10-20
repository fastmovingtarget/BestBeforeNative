//2025-10-20 : Created enumerator to better keep track of what state each context is in

export enum UpdateState {
    Loading,
    Failed,
    Successful,
    FailedDelete,
    FailedUpdate,
    FailedAdd
}
export enum SyncState {
    Loading,
    Failed,
    Successful,
}
