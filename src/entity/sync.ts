import { Opaque } from "type-fest"

export type SyncKey = Opaque<string, "sync-key">

export enum SyncStatus {
  NOT_SYNCED = "not-synced",
  SYNCING = "syncing",
  SYNCED = "synced",
  ERROR = "error",
}

export type SyncDestination = {
  id: string | symbol
  status: SyncStatus
  lastSyncedAt?: Date
}

function makeSyncDestination(id: string | symbol): SyncDestination {
  return {
    id,
    status: SyncStatus.NOT_SYNCED,
    lastSyncedAt: undefined,
  }
}

export class SyncMap {
  private _map: Map<SyncKey, SyncDestination>

  public static makeSyncKey(id: string): SyncKey {
    return id as SyncKey
  }

  constructor(syncIds: SyncKey[]) {
    this._map = new Map()

    syncIds.forEach((id) => {
      this._map.set(id, makeSyncDestination(id))
    })
  }

  public checkStatus(id: SyncKey): boolean {
    const destination = this._map.get(id)

    if (!destination) {
      return false
    }

    if (!destination.lastSyncedAt) {
      return false
    }

    return destination.status === SyncStatus.SYNCED
  }

  public setStatus(id: SyncKey, promise: Promise<unknown>): void {
    const destination = this._map.get(id)

    if (destination) {
      promise
        .then((resolvedValue: unknown) => {
          destination.status = SyncStatus.SYNCED
          destination.lastSyncedAt = new Date()

          return resolvedValue
        })
        .catch(() => {
          destination.status = SyncStatus.ERROR
        })
    }
  }
}
