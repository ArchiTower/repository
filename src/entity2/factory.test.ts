/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  describe,
  it,
  expect,
  expectTypeOf,
  TestRawEntityData,
  beforeEach,
} from "vitest"
import { entityModelFactory } from "./factory"
import { makeRepositoryKey } from "src/repositoryKey"

describe("Entity: Factories", () => {
  beforeEach((context) => {
    context.authorsRepositoryKey = makeRepositoryKey<
      {
        id: string
        name: string
      },
      "authors"
    >("authors")
  })

  describe("Entity: Model Factory", () => {
    it("Given schema, When model factory called, Then return context factory", () => {
      const result = entityModelFactory<TestRawEntityData>()

      expect(result).toBeInstanceOf(Function)
    })
  })

  describe("Entity: Context Factory", () => {
    it("Given schema, relations, sync keys, When context factory called, Then return entity factories", ({
      syncKeys,
      authorsRepositoryKey,
    }) => {
      const result = entityModelFactory<TestRawEntityData>()(
        [
          {
            id: "author",
            type: "belongs-to",
            foreignRepository: authorsRepositoryKey,
            foreignKey: "id",
            localKey: "bar",
          },
        ],
        syncKeys
      )

      expect(result).toEqual(
        expect.objectContaining({
          createEntity: expect.any(Function),
          recoverEntity: expect.any(Function),
        })
      )
    })

    it("Given schema, relations, When context factory called, Then return entity factories", ({
      authorsRepositoryKey,
    }) => {
      const result = entityModelFactory<TestRawEntityData>()([
        {
          id: "author",
          type: "belongs-to",
          foreignRepository: authorsRepositoryKey,
          foreignKey: "id",
          localKey: "bar",
        },
      ])

      expect(result).toEqual(
        expect.objectContaining({
          createEntity: expect.any(Function),
          recoverEntity: expect.any(Function),
        })
      )
    })

    it("Given schema, When context factory called, Then return entity factories", () => {
      const result = entityModelFactory<TestRawEntityData>()()

      expect(result).toEqual(
        expect.objectContaining({
          createEntity: expect.any(Function),
          recoverEntity: expect.any(Function),
        })
      )
    })
  })

  describe("Entity: Entity Factory", () => {
    it.todo(
      "Given schema, When entity factory called, Then return entity",
      () => {}
    )

    it.todo(
      "Given schema, relations, When entity factory called, Then return entity with relations",
      () => {}
    )

    it.todo(
      "Given schema, sync keys, When entity factory called, Then return entity with sync keys",
      () => {}
    )
  })
})
