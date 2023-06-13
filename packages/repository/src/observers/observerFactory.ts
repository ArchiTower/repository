import { Observatory } from "./observatory"

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export function observerFactory<
  const TActions extends readonly string[] = [],
  TDataAccessor = never
>(
  config: {
    actions?: TActions
    dataAccessor?: TDataAccessor
  } = {}
) {
  const internal = new Observatory(config)

  return {
    internal,
    trigger: internal.trigger.bind(internal),
    observe: internal.observe.bind(internal),
  }
}

const test1 = observerFactory({
  //  ^?
  actions: ["action1", "action2"],
})

test1.observe({
  //   ^?
  action1: () => {},
  action2: () => {},
})
test1.trigger("action1")
//     ^?

const test2 = observerFactory()
//     ^?
test2.observe(() => {})
//        ^?
test2.trigger()
//     ^?
