import { beforeEach, vi } from "vitest"
import { Faker, faker } from "@faker-js/faker"
import { SyncKey } from "src/entity/sync"
import { EntityPrototype } from "src/entity/interface"
import type { RepositoryKey } from "src/repositoryKey"
import { makeSyncKey } from "src/entity2/sync"

declare module "vitest" {
  export type TestRawEntityData = {
    foo: string
    bar: number
    deep: {
      foo: string
      bar: string
    }
    some: boolean
  }

  export type TestEntityData = TestRawEntityData & {
    id: string
  }

  export type PostsRelationDefinition = {
    readonly id: "posts"
    readonly type: "has-many"
    readonly foreignRepository: RepositoryKey<
      {
        id: string
        name: string
        authorId: string
      },
      "posts"
    >
    readonly foreignKey: "authorId"
    readonly localKey: "foo"
  }

  export type AuthorRelationDefinition = {
    readonly id: "author"
    readonly type: "belongs-to"
    readonly foreignRepository: RepositoryKey<
      {
        id: number
        name: string
      },
      "authors"
    >
    readonly foreignKey: "id"
    readonly localKey: "bar"
  }

  export interface TestContext {
    faker: typeof faker
    fakeData: ReturnType<typeof generateFakeObj>
    syncKeys: SyncKey[]
    // TODO: Delete it after refactoring
    foreignRepositoryKey: RepositoryKey<
      {
        id: string
        name: string
        authorId: string
      },
      "posts"
    >
    postsRepositoryKey: RepositoryKey<
      {
        id: string
        name: string
        authorId: string
      },
      "posts"
    >
    authorsRepositoryKey: RepositoryKey<
      {
        id: string
        name: string
      },
      "authors"
    >
    fakeProto: EntityPrototype<
      TestEntityData,
      this["fakeData"],
      PostsRelationDefinition
    >
  }
}

beforeEach((context) => {
  context.faker = faker
  context.syncKeys = [makeSyncKey("test")]
  context.fakeData = generateFakeObj(context.faker)
  context.fakeProto = {
    update: vi.fn(),
    toObject: vi.fn(),
    isSynced: vi.fn(),
    setSynced: vi.fn(),
    posts: vi.fn(),
  }
})

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
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
