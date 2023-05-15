import {
  describe,
  it,
  expect,
  expectTypeOf,
  beforeEach,
  TestEntityData,
  PostsRelationDefinition,
} from "vitest"
import { makeInternalEntity, makeEntityProxy } from "./proxyFactory"
import { Entity, EntityInternal } from "./interface"
import { DeepReadonly } from "./types"

declare module "vitest" {
  export interface TestContext {
    fakeInternalEntity: EntityInternal<
      TestEntityData,
      TestEntityData,
      PostsRelationDefinition
    >
    entityProxy: Entity<TestEntityData, TestEntityData, PostsRelationDefinition>
  }
}

describe("Internal Entity", () => {
  it("Given data, syncKeys, When makeInternalEntity() called, Then return EntityInternal", ({
    fakeProto,
    fakeData,
    syncKeys,
  }) => {
    const result = makeInternalEntity(fakeProto, fakeData, syncKeys)

    expect(result).toBeTypeOf("object")
    expectTypeOf(result).toMatchTypeOf<
      EntityInternal<TestEntityData, typeof fakeData, PostsRelationDefinition>
    >()
  })

  it("Given data, syncKeys, id, When makeInternalEntity() called, Then return EntityInternal with id", ({
    fakeProto,
    fakeData,
    syncKeys,
  }) => {
    const result = makeInternalEntity(fakeProto, fakeData, syncKeys, "test")

    expect(result.id).toBe("test")
  })

  it("Given data, When makeInternalEntity() called, Then return EntityInternal with generated id", ({
    fakeProto,
    fakeData,
    syncKeys,
  }) => {
    const result = makeInternalEntity(fakeProto, fakeData, syncKeys)

    expect(result.id).toBeDefined()
    expectTypeOf(result.id).toMatchTypeOf<string>()
  })
})

describe("EntityProxy", () => {
  beforeEach((context) => {
    context.fakeInternalEntity = makeInternalEntity(
      context.fakeProto,
      context.fakeData,
      context.syncKeys
    )
    context.entityProxy = makeEntityProxy(context.fakeInternalEntity)
  })

  it("Given EntityInternal, When EntityProxy created, Then return EntityProxy", ({
    fakeData,
    entityProxy: entity,
  }) => {
    expect(entity).toBeTypeOf("object")
    expectTypeOf(entity).toMatchTypeOf<
      Entity<TestEntityData, typeof fakeData, PostsRelationDefinition>
    >()
  })

  it("Given EntityInternal, When EntityProxy created, Then EntityProxy is immutable", ({
    fakeInternalEntity: internalEntity,
    entityProxy: entity,
  }) => {
    expectTypeOf(entity).toMatchTypeOf<
      DeepReadonly<typeof internalEntity._data>
    >()
    expect(() => {
      // @ts-expect-error - checking immutability in runtime
      entity.foo = "test"
    }).toThrow()
    expect(() => {
      // @ts-expect-error - checking immutability in runtime
      entity.deep.foo = "test"
    }).toThrow()
  })

  it("Given EntityInternal, When EntityProxy created, Then EntityProxy has only data keys", ({
    fakeInternalEntity: internalEntity,
    entityProxy: entity,
  }) => {
    expect(Reflect.ownKeys(entity)).toStrictEqual(
      Reflect.ownKeys(internalEntity._data)
    )
  })

  it("Given two EntityInternal, Then they share common prototype", ({
    fakeInternalEntity: internalEntity,
  }) => {
    const entityOne = makeEntityProxy(internalEntity)
    const entityTwo = makeEntityProxy(internalEntity)

    expect(entityOne).not.toMatchObject(entityTwo)
    expect(Object.getPrototypeOf(entityOne)).toStrictEqual(
      Object.getPrototypeOf(entityTwo)
    )
  })

  it("Given EntityInternal, When EntityProxy created, Then EntityProxy restrict access to SyncMap", ({
    entityProxy: entity,
  }) => {
    expect(() => {
      // @ts-expect-error - checking in runtime
      entity._syncMap
    }).toThrow()
  })
})
