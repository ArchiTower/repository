import { describe, it, expect, expectTypeOf } from "vitest"
import { ReadonlyDeep } from "type-fest"
import { deepReadonly } from "./deepReadonly"

describe("Deep Readonly", () => {
  it("Given deep object, When deepReadonly is called, Then return deepReadonly object", () => {
    const obj = {
      foo: "bar",
      bar: {
        foo: "bar",
      },
    }

    const readonlyObj = deepReadonly(obj)

    // It must be the same object, mutation not copy
    expect(readonlyObj).toBe(obj)
    expect(readonlyObj.bar).toBe(obj.bar)
    expectTypeOf(readonlyObj).toMatchTypeOf<ReadonlyDeep<typeof obj>>()
    // Double check for runtime
    expect(() => {
      // @ts-expect-error - we testing what TS know in runtime
      readonlyObj.foo = "baz"
    }).toThrow()
    expect(() => {
      // @ts-expect-error - we testing what TS know in runtime
      readonlyObj.bar.foo = "baz"
    }).toThrow()
  })
})
