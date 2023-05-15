import { beforeEach } from "vitest"
import { Faker, faker } from "@faker-js/faker"
import type { RepositoryKey } from "src/repositoryKey"
import { makeSyncKey } from "src/entity/sync"
import { SyncKey } from "src/entity/interface"

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

  export type AuthorsRepositoryKey = RepositoryKey<
    {
      id: string
      name: string
    },
    "authors"
  >

  export type AuthorRelationDefinition = {
    readonly id: "author"
    readonly type: "belongs-to"
    readonly foreignRepository: AuthorsRepositoryKey
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
    authorsRelationship: AuthorRelationDefinition
    serializedEntity: string
  }
}

beforeEach((context) => {
  context.faker = faker
  context.syncKeys = [makeSyncKey("test")]
  context.fakeData = generateFakeObj(context.faker)
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
