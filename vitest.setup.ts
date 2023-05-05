import { beforeEach, vi } from "vitest"
import { Faker, faker } from "@faker-js/faker"
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
    fakeData: ReturnType<typeof generateFakeObj>
    syncKeys: SyncKey[]
    fakeProto: EntityPrototype<TestEntityData, this["fakeData"]>
  }
}

beforeEach((context) => {
  context.faker = faker
  context.syncKeys = [SyncMap.makeSyncKey("test")]
  context.fakeData = generateFakeObj(context.faker)
  context.fakeProto = {
    update: vi.fn(),
    toObject: vi.fn(),
    isSynced: vi.fn(),
    setSynced: vi.fn(),
  }
})

function generateFakeObj(faker: Faker) {
  return {
    foo: faker.name.fullName(),
    bar: faker.datatype.number(),
    deep: {
      foo: faker.name.firstName(),
      bar: faker.name.lastName(),
    },
    some: faker.datatype.boolean(),
  }
}
