import {
  describe,
  it,
  expect,
  expectTypeOf,
  beforeEach,
  TestEntityData,
} from "vitest"
import { makeInternalEntity, makeEntityProxy } from "./proxyFactory"
import { Entity, EntityInternal } from "./interface"

declare module "vitest" {
  export interface TestContext {
    fakeInternalEntity: EntityInternal<TestEntityData, TestEntityData>
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
      EntityInternal<TestEntityData, typeof fakeData>
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
  })

  it("Given EntityInternal, When EntityProxy created, Then return EntityProxy", ({
    fakeInternalEntity: internalEntity,
    fakeData,
  }) => {
    const entity = makeEntityProxy(internalEntity)

    expect(entity).toBeTypeOf("object")
    expectTypeOf(entity).toMatchTypeOf<
      Entity<TestEntityData, typeof fakeData>
    >()
  })

  it("Given EntityInternal, When EntityProxy created, Then EntityProxy is immutable", ({
    fakeInternalEntity: internalEntity,
  }) => {
    const entity = makeEntityProxy(internalEntity)

    expect(() => {
      // @ts-expect-error - checking immutability in runtime
      entity.foo = "test"
    }).toThrow()
  })

  it("Given EntityInternal, When EntityProxy created, Then EntityProxy has only data keys", ({
    fakeInternalEntity: internalEntity,
  }) => {
    const entity = makeEntityProxy(internalEntity)

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
})
