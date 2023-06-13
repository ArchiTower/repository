import { describe, it, expect, vi, expectTypeOf } from "vitest"
import { observerFactory } from "./observerFactory"
import { Observer } from "./types"

describe("ObserverFactory", () => {
  describe("Interface", () => {
    it("Given factory, When create, Then return trigger & observe functions", () => {
      const { trigger, observe } = observerFactory()

      expect(trigger).toBeInstanceOf(Function)
      expect(observe).toBeInstanceOf(Function)
    })

    it("Given factory, When create, Then create a new set of trigger & observe functions", () => {
      const { trigger, observe } = observerFactory()
      const { trigger: trigger2, observe: observe2 } = observerFactory()

      expect(trigger).not.toBe(trigger2)
      expect(observe).not.toBe(observe2)
    })

    describe("observe()", () => {
      it("Given factory, When create without actions, Then observe() can create one subscription without name", () => {
        const { observe } = observerFactory()

        expectTypeOf(observe).parameter(0).toBeFunction()
      })

      it("Given factory, When create with actions, Then observe() can create many subscription with a given action names", () => {
        const { observe } = observerFactory({ actions: ["action1", "action2"] })

        expectTypeOf(observe)
          .parameter(0)
          .toMatchTypeOf<Record<"action1" | "action2", Observer>>()
      })
    })

    describe("trigger()", () => {
      it.todo(
        "Given factory, When create without actions, Then trigger() can trigger one subscription without name",
        () => {
          const { trigger, observe } = observerFactory()
          const callback = vi.fn()

          observe(callback)
          trigger()

          expect(callback).toBeCalledTimes(1)
        }
      )

      it.todo(
        "Given factory, When create with actions, Then trigger() can trigger many subscription with a given action names",
        () => {
          const { trigger, observe } = observerFactory({
            actions: ["action1", "action2"],
          })
          const callback1 = vi.fn()
          const callback2 = vi.fn()

          observe({
            action1: callback1,
            action2: callback2,
          })
          trigger("action1")
          trigger("action2")

          expect(callback1).toBeCalledTimes(1)
          expect(callback2).toBeCalledTimes(1)
        }
      )
    })
  })

  describe("Implementation", () => {
    it.todo("Given callback, When trigger, Then run it synchronously", () => {
      const { trigger, observe } = observerFactory()
      const callback = vi.fn()

      observe(callback)
      trigger()

      expect(callback).toBeCalledTimes(1)
    })

    it.todo(
      "Given async callback, When trigger, Then run it as Promise",
      async () => {
        const { trigger, observe } = observerFactory()
        const callback = vi.fn().mockImplementation(() => Promise.resolve())

        observe(callback)
        trigger()

        expect(callback).toBeCalledTimes(0)

        queueMicrotask(() => {
          expect(callback).toBeCalledTimes(1)
        })
      }
    )

    it.todo(
      "Given callback with idle option, When trigger, Then run when browser is idle",
      () => {
        const { trigger, observe } = observerFactory()
        const callback = vi.fn()

        observe(callback, { idle: true })
        trigger()

        expect(callback).toBeCalledTimes(1)
      }
    )

    it.todo(
      "Given callback with idle option on non-supported browser, When trigger, Then run after 2000ms",
      () => {
        const { trigger, observe } = observerFactory()
        const callback = vi.fn()

        observe(callback, { idle: true })
        trigger()

        expect(callback).toBeCalledTimes(0)

        vi.advanceTimersByTime(2000)

        expect(callback).toBeCalledTimes(1)
      }
    )

    it.todo(
      "Given data access function, When callback triggered, Then callback has access to data",
      () => {
        const { trigger, observe } = observerFactory({
          dataAccessor: () => ({ foo: "bar" }),
        })
        const callback = vi.fn()

        observe(callback)
        trigger()

        expect(callback).toBeCalledTimes(1)
        expect(callback).toBeCalledWith({ foo: "bar" })
      }
    )
  })
})
