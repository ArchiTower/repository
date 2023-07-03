import { Observer } from "./types"

const internalSlot = Symbol("internalSlot")

type ObserverDefinition<TActions, TInjectedData = any> = {
  action: TActions
  observer: Observer<TInjectedData>
} & Partial<ObserverOptions>

type ObserverOptions = {
  idle: boolean
}

export class Observatory<
  const TActions extends readonly string[] = [],
  TData = never
> {
  private _observers: Map<
    string | typeof internalSlot,
    Set<Omit<ObserverDefinition<TActions, TData>, "action">>
  >
  private _dataAccessor?: () => TData

  public constructor(
    config: {
      actions?: TActions
      dataAccessor?: () => TData
    } = {}
  ) {
    this._observers = new Map()

    const { actions, dataAccessor } = config

    if (actions) {
      actions.forEach((action) => {
        this._observers.set(action, new Set())
      })
    }

    this._observers.set(internalSlot, new Set())

    this._dataAccessor = dataAccessor
  }

  public observe(
    ...args: TActions["length"] extends 0
      ? [observer: Observer<TData>]
      : [...observers: ObserverDefinition<TActions[number]>[]]
  ): void {
    if (isArgsAnObserver<TData>(args)) {
      this._observers.get(internalSlot)?.add({
        observer: args[0],
      })
      return
    }

    args.forEach((definition) => {
      this._observers.get(definition.action)?.add(definition)
    })
  }

  public trigger(
    ...args: TActions["length"] extends 0 ? [] : [name: TActions[number]]
  ): void {
    const actionName = args[0] ?? internalSlot

    this._callObserver(this._observers.get(actionName) ?? new Set())
  }

  private _callObserver(
    definitionSet: Set<Omit<ObserverDefinition<TActions, TData>, "action">>
  ): void {
    const data = this._dataAccessor?.() ?? undefined

    definitionSet.forEach((definition) => {
      if (!definition.idle) {
        definition.observer(data)
        return
      }

      if (typeof window !== "undefined" && window?.requestIdleCallback) {
        window.requestIdleCallback(() => definition.observer(data))
        return
      }

      setTimeout(() => {
        definition.observer(data)
      }, 2000)
    })
  }
}

function isArgsAnObserver<TAccessor>(
  args: unknown[]
): args is [observer: Observer<TAccessor>] {
  return args.length === 1 && typeof args[0] === "function"
}
