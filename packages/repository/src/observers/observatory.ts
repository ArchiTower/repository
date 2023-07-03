import { Observer } from "./types"

const internalSlot = Symbol("internalSlot")

type ObserverDefinition<TActions> = {
  action: TActions
  observer: Observer
} & Partial<ObserverOptions>

type ObserverOptions = {
  idle: boolean
}

export class Observatory<
  const TActions extends readonly string[] = [],
  TData = never
> {
  private _observers: Map<string | typeof internalSlot, Set<Observer>>
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
      this._observers.get(internalSlot)?.add(args[0])
      return
    }

    args.forEach((definition) => {
      this._observers.get(definition.action)?.add(definition.observer)
    })
  }

  public trigger(
    ...args: TActions["length"] extends 0 ? [] : [name: TActions[number]]
  ): void {
    const data = this._dataAccessor?.() ?? undefined

    if (args.length <= 0) {
      this._observers.get(internalSlot)?.forEach((observer) => observer(data))
      return
    }

    this._observers
      .get(args[0] as string)
      ?.forEach((observer) => observer(data))
  }
}

function isArgsAnObserver<TAccessor>(
  args: unknown[]
): args is [observer: Observer<TAccessor>] {
  return args.length === 1 && typeof args[0] === "function"
}
