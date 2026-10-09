//2026-10-09 : Fixed Sync flow on search entry
//2025-10-22 : Added values to enums to differentiate results
//2025-10-20 : Created enumerator to better keep track of what state each context is in

/**
 * Update State is used to track progress of an update having been sent to the server (such as add, edit, or delete operations).
 * The flow:
 * 1. Loading: The update request has been sent to the server and is in progress.
 * 2. Failed: The update request has failed.
 * 3. Successful: The update request has succeeded.
 * 4. FailedDelete: The delete operation has failed.
 * 5. FailedUpdate: The update operation has failed.
 * 6. FailedAdd: The add operation has failed.
 */
export enum UpdateState {
    Loading = "UpdateLoading",
    Failed = "UpdateFailed",
    Successful = "UpdateSuccessful",
    FailedDelete = "UpdateFailedDelete",
    FailedUpdate = "UpdateFailedUpdate",
    FailedAdd = "UpdateFailedAdd"
}

/*
 * Sync State is used when an update has been sent TO the sever (so add/edit/delete). Once an update is registered as having been successful, it requests Sync by setting SyncLoading
 * The rest state of the data is SyncState.Successful
 * The flow:
 * 1. Loading: The client is requesting data from the server.
 * 2. Failed: The request for data from the server has failed.
 * 3. Successful: The request for data from the server has succeeded.
 */
export enum SyncState {
    Loading = "SyncLoading",
    Failed = "SyncFailed",
    Successful = "SyncSuccessful",
}
