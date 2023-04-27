import { describe, it, expect, beforeEach, expectTypeOf } from "vitest"
import { SyncMap, SyncKey } from "./sync"

declare module "vitest" {
  export interface TestContext {
    syncMapDestinationId: SyncKey
  }
}

describe("SyncMap", () => {
  beforeEach((context) => {
    context.syncMapDestinationId = SyncMap.makeSyncKey("destination-id")
  })

  describe("SyncKey", () => {
    it("Given string, When SyncMap.makeSyncKey is called, Then return SyncKey", () => {
      const syncKey = SyncMap.makeSyncKey("test")

      expect(syncKey).toBe("test")
      expectTypeOf(syncKey).toMatchTypeOf<SyncKey>()
    })
  })

  it("Given one destination ID, When SyncMap is created, Then SyncMap has one destination", ({
    syncMapDestinationId: destinationId,
  }) => {
    const syncMap = new SyncMap([destinationId])

    expect(syncMap.checkStatus(destinationId)).toBe(false)
  })

  it("Given couple destination IDs, When SyncMap is created, Then SyncMap has many destinations", ({
    syncMapDestinationId: firstDestinationId,
  }) => {
    const secondDestinationId = SyncMap.makeSyncKey("other-destination-id")

    const syncMap = new SyncMap([firstDestinationId, secondDestinationId])

    expect(syncMap.checkStatus(firstDestinationId)).toBe(false)
    expect(syncMap.checkStatus(secondDestinationId)).toBe(false)
  })

  it("Given SyncMap with one destination & one unsettled promise, When set status & promise resolved, Then it is synced", async ({
    syncMapDestinationId: destinationId,
  }) => {
    const syncMap = new SyncMap([destinationId])
    expect(syncMap.checkStatus(destinationId)).toBe(false)
    const promise = new Promise((resolve) => {
      resolve(true)
    })

    syncMap.setStatus(destinationId, promise)
    expect(syncMap.checkStatus(destinationId)).toBe(false)

    await promise

    expect(syncMap.checkStatus(destinationId)).toBe(true)
  })

  it("Given SyncMap with one destination & one unsettled promise, When set status & promise rejects, Then it is not synced", async ({
    syncMapDestinationId: destinationId,
  }) => {
    const syncMap = new SyncMap([destinationId])
    expect(syncMap.checkStatus(destinationId)).toBe(false)
    const promise = new Promise((resolve, reject) => {
      reject(new Error("test"))
    })

    syncMap.setStatus(destinationId, promise)
    expect(syncMap.checkStatus(destinationId)).toBe(false)

    // eslint-disable-next-line @typescript-eslint/no-empty-function
    await promise.catch(() => {})

    expect(syncMap.checkStatus(destinationId)).toBe(false)
  })
})
