import { Observer } from "./types"

const internalSlot = Symbol("internalSlot")

export class Observatory<
  const TActions extends readonly string[] = [],
  TDataAccessor = never
> {
  private _observers: Map<string | typeof internalSlot, Set<Observer>>

  public constructor(
    config: {
      actions?: TActions
      dataAccessor?: TDataAccessor
    } = {}
  ) {
    this._observers = new Map()

    const { actions } = config

    if (actions) {
      actions.forEach((action) => {
        this._observers.set(action, new Set())
      })
    }

    this._observers.set(internalSlot, new Set())
  }

  public observe(
    ...args: TActions["length"] extends 0
      ? [observer: Observer]
      : [observers: Record<TActions[number], Observer>]
  ): void {
    if (args[0] instanceof Object) {
      Object.keys(args[0]).forEach((action) => {
        this._observers.get(action)?.add(args[0][action])
      })
      return
    }

    this._observers.get(internalSlot)?.add(args[0])
  }

  public trigger(
    ...args: TActions["length"] extends 0 ? [] : [name: TActions[number]]
  ): void {
    if (args.length <= 0) {
      this._observers.get(internalSlot)?.forEach((observer) => observer())
      return
    }

    this._observers.get(args[0] as string)?.forEach((observer) => observer())
  }
}
