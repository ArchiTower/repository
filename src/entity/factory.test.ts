import { describe, it, beforeEach, expect, expectTypeOf } from "vitest"
import { makeEntityFactory } from "./factory"
import { Entity, EntityFactory } from "./interface"

type TestEntityData = {
  foo: string
  bar: number
  some: boolean
}

declare module "vitest" {
  export interface TestContext {
    factory: EntityFactory<TestEntityData>["createEntity"]
    recover: EntityFactory<TestEntityData>["recoverEntity"]
  }
}

describe("Entity", () => {
  beforeEach((context) => {
    const { createEntity, recoverEntity } = makeEntityFactory<TestEntityData>(
      context.syncKeys
    )
    context.factory = createEntity
    context.recover = recoverEntity
  })

  describe("createEntity", () => {
    it("Given data, When created entity, Then return new Entity with given data", ({
      fakeData,
      factory,
    }) => {
      const testEntity = factory(fakeData)

      expect(testEntity.foo).toBe(fakeData.foo)
      expectTypeOf(testEntity).toMatchTypeOf<
        Entity<TestEntityData, typeof fakeData>
      >()
    })

    it("Given Entity, When created, Then entity has id", ({
      faker,
      factory,
    }) => {
      const fakeData = {
        foo: faker.name.fullName(),
      }

      const testEntity = factory(fakeData)

      expect(testEntity.id).toBeDefined()
      expectTypeOf(testEntity.id).toMatchTypeOf<string>()
    })

    it("Given Entity, When created, Then entity is immutable", ({
      faker,
      factory,
    }) => {
      const fakeData = {
        foo: faker.name.fullName(),
      }

      const testEntity = factory(fakeData)

      expect(() => {
        // @ts-expect-error - we testing what TS know in runtime
        testEntity.foo = "Updated"
      }).toThrow()
    })

    it("Given entity & SyncKey, When created, Then has sync map initialized", ({
      fakeData,
      factory,
      syncKeys,
    }) => {
      const entity = factory(fakeData)

      expect(entity.isSynced(syncKeys[0])).toBe(false)
    })
  })

  describe("recoverEntity", () => {
    it("Given data, When recovering entity, Then return new Entity with given data & id", ({
      faker,
      recover,
    }) => {
      const fakeData = {
        id: faker.datatype.uuid(),
        foo: faker.name.fullName(),
        bar: faker.datatype.number(),
        some: faker.datatype.boolean(),
      }
      const testEntity = recover(fakeData)

      expect(testEntity.id).toBeDefined()
      expect(testEntity.id).toBe(fakeData.id)
      expect(testEntity.foo).toBe(fakeData.foo)
      expect(testEntity.bar).toBe(fakeData.bar)
      expect(testEntity.some).toBe(fakeData.some)
      expectTypeOf(testEntity).toMatchTypeOf<
        Entity<TestEntityData, typeof fakeData>
      >()
    })

    it("Given data without ID, when recovering entity, Then throw error", ({
      recover,
      fakeData,
    }) => {
      // @ts-expect-error - we testing what TS know in runtime
      expect(() => recover(fakeData)).toThrow()
    })
  })

  describe("Entity prototype", () => {
    it("Given Entity, When updated, Then return new Entity with updated data", ({
      fakeData,
      factory,
    }) => {
      const testEntity = factory(fakeData)
      expect(testEntity.foo).not.toEqual("Updated")

      const updatedEntity = testEntity.update({ foo: "Updated" })

      expect(updatedEntity.foo).toEqual("Updated")
      expect(updatedEntity.bar).toEqual(testEntity.bar)
    })

    it("Given Entity, When updated, Then entity still has the same id", ({
      fakeData,
      factory,
    }) => {
      const testEntity = factory(fakeData)
      const assignedId = testEntity.id

      const updatedEntity = testEntity.update({ foo: "Updated" })

      expect(updatedEntity.id).toEqual(assignedId)
    })

    it("Given Entity, When toObject() called, Then return object with data but without prototype", ({
      factory,
      fakeData,
    }) => {
      const testEntity = factory(fakeData)

      const obj = testEntity.toObject()

      expect(obj).toMatchObject(fakeData)
      expect(Object.getPrototypeOf(obj)).toMatchObject({})
    })
  })
})
