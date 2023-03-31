import { beforeEach, vi } from "vitest"
import { faker } from "@faker-js/faker"
import { SyncKey, SyncMap } from "src/entity/sync"
import { EntityPrototype } from "src/entity/interface"

declare module "vitest" {
  export type TestEntityData = {
    foo: string
    bar: number
    deep: {
      foo: string
      bar: string
    }
    some: boolean
  }

  export interface TestContext {
    faker: typeof faker
    fakeData: TestEntityData
    syncKeys: SyncKey[]
    fakeProto: EntityPrototype<TestEntityData, this["fakeData"]>
  }
}

beforeEach((context) => {
  context.faker = faker
  context.syncKeys = [SyncMap.makeSyncKey("test")]
  context.fakeData = {
    foo: context.faker.name.fullName(),
    bar: context.faker.datatype.number(),
    deep: {
      foo: context.faker.name.firstName(),
      bar: context.faker.name.lastName(),
    },
    some: context.faker.datatype.boolean(),
  }
  context.fakeProto = {
    update: vi.fn(),
    toObject: vi.fn(),
    isSynced: vi.fn(),
  }
})
