//2025-10-22 : Added values to enums to differentiate results

//2025-10-20 : Created enumerator to better keep track of what state each context is in

export enum UpdateState {
    Loading = "UpdateLoading",
    Failed = "UpdateFailed",
    Successful = "UpdateSuccessful",
    FailedDelete = "UpdateFailedDelete",
    FailedUpdate = "UpdateFailedUpdate",
    FailedAdd = "UpdateFailedAdd"
}
export enum SyncState {
    Loading = "SyncLoading",
    Failed = "SyncFailed",
    Successful = "SyncSuccessful",
}
