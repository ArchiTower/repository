import { describe, it, expect, expectTypeOf, TestEntityData } from "vitest"
import { createInternalEntity } from "./proto"
import { DeepReadonly } from "./types"

describe("proto", () => {
  it("Keep type of given input data", ({ syncKeys }) => {
    const context = createInternalEntity<TestEntityData>(syncKeys)

    const entity = new context({
      id: "1",
      foo: "foo",
      bar: 1,
    })

    const result = entity.toObject()
    expect(result).toEqual({
      foo: "foo",
      bar: 1,
      id: "1",
    })
    expectTypeOf(result).toEqualTypeOf<
      DeepReadonly<{ foo: string; bar: number; id: string }>
    >()
  })

  it("Update method returns new instance with extended data", ({
    syncKeys,
  }) => {
    const context = createInternalEntity<TestEntityData>(syncKeys)

    const entity = new context({
      id: "1",
      foo: "foo",
      bar: 1,
    })

    const result = entity.update({
      foo: "foo2",
      some: true,
    })

    expect(result).not.toBe(entity)
    expect(result.toObject()).toEqual({
      foo: "foo2",
      bar: 1,
      id: "1",
      some: true,
    })
    // @ts-expect-error -- testing types
    expectTypeOf(result.toObject()).toEqualTypeOf<
      DeepReadonly<{ foo: string; bar: number; id: string; some: boolean }>
    >()
  })
})
