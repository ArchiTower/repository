import { describe, it, expectTypeOf } from "vitest"
import { AllowedEntityInput, EntityData, EntitySchema } from "./data"

describe("data", () => {
  it("EntitySchema always have ID", () => {
    type Test = EntitySchema<{ foo: string }>
    type Test2 = EntitySchema<{ foo: string; id: number }>

    expectTypeOf<Test["id"]>().toEqualTypeOf<string>()
    expectTypeOf<Test2["id"]>().toEqualTypeOf<string>()
  })

  it("UserInputData is id-stripped, partial schema", () => {
    type Test = AllowedEntityInput<EntitySchema<{ foo: string; id: number }>>

    // @ts-expect-error -- testing types
    expectTypeOf<Test["id"]>().toEqualTypeOf<never>()
    expectTypeOf<Test["foo"]>().toEqualTypeOf<string | undefined>()
  })

  it("EntityData is always with ID, while other fields are partial", () => {
    type Test = EntityData<
      AllowedEntityInput<EntitySchema<{ foo: string; id: number }>>
    >

    expectTypeOf<Test["id"]>().toEqualTypeOf<string>()
    expectTypeOf<Test["foo"]>().toEqualTypeOf<string | undefined>()
  })
})
