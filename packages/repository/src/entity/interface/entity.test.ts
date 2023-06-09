import {
  describe,
  it,
  expectTypeOf,
  PostsRelationDefinition,
  TestEntityData,
} from "vitest"
import { Entity } from "./entity"
import { AllowedEntityInput, EntityData } from "./data"

describe("interface", () => {
  it("Entity has relationship accessors according to defined relations", ({
    fakeData,
  }) => {
    type Test = Entity<
      TestEntityData,
      EntityData<typeof fakeData>,
      [PostsRelationDefinition]
    >

    expectTypeOf<Test["posts"]>().toEqualTypeOf<
      () => {
        id: string
        name: string
        authorId: string
      }[]
    >()
  })

  it("Entity can be created without relations", ({ fakeData }) => {
    type Test = Entity<TestEntityData, EntityData<typeof fakeData>>

    expectTypeOf<Test["id"]>().toEqualTypeOf<string>()
    expectTypeOf<Test["foo"]>().toEqualTypeOf<(typeof fakeData)["foo"]>()
    expectTypeOf<Test["deep"]>().toEqualTypeOf<
      Readonly<(typeof fakeData)["deep"]>
    >()
  })

  it("Entity has update method", ({ fakeData }) => {
    type Test = Entity<TestEntityData, EntityData<typeof fakeData>>

    expectTypeOf<Test["update"]>().toEqualTypeOf<
      (data: AllowedEntityInput<TestEntityData>) => Test
    >()
  })

  it("Entity has toObject method", ({ fakeData }) => {
    type Test = Entity<TestEntityData, EntityData<typeof fakeData>>

    expectTypeOf<Test["toObject"]>().toEqualTypeOf<
      () => EntityData<typeof fakeData>
    >()
  })

  it("Entity give readonly access to data", ({ fakeData }) => {
    type Test = Entity<TestEntityData, EntityData<typeof fakeData>>

    expectTypeOf<Test["foo"]>().toEqualTypeOf<
      Readonly<(typeof fakeData)["foo"]>
    >()
    expectTypeOf<Test["bar"]>().toEqualTypeOf<
      Readonly<(typeof fakeData)["bar"]>
    >()
    expectTypeOf<Test["deep"]>().toEqualTypeOf<
      Readonly<(typeof fakeData)["deep"]>
    >()
  })
})
