/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-return */

type ProxiedObj = {
  proto: any
  relationAccessor: any
}

export function proxyHandlerFactory<
  TProxied extends ProxiedObj
>(): ProxyHandler<TProxied> {
  return {
    get(target, prop, receiver) {
      if (prop === "data") {
        return {}
      }
      if (
        typeof prop === "string" &&
        ["update", "toJson", "toObject", "isSynced", "setSynced"].includes(prop)
      ) {
        return function (...args: any[]) {
          return target.proto[prop].apply(
            // @ts-expect-error -- proxy handler
            this === receiver ? target : this,
            args
          )
        }
      }
      if (prop in target.relationAccessor) {
        return target.relationAccessor[prop]
      }
      return Reflect.get(target.proto.data, prop, receiver)
    },
    set() {
      throw new Error(
        "You can't overwrite entity properties, use update() instead."
      )
    },
    has(target, prop) {
      return Reflect.has(target.proto.data, prop)
    },
    ownKeys(target) {
      return Reflect.ownKeys(target.proto.data)
    },
    getOwnPropertyDescriptor(target, prop) {
      if (prop in target.proto.data) {
        return {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          value: target.proto.data[prop],
          writable: false,
          enumerable: true,
          configurable: true,
        }
      }
    },
    deleteProperty() {
      throw new Error(
        "You can't delete entity properties, use update() instead."
      )
    },
    defineProperty() {
      throw new Error(
        "You can't define entity properties, create new Entity context and use createEntity() instead."
      )
    },
    getPrototypeOf(target) {
      return Reflect.getPrototypeOf(target.proto.data)
    },
    setPrototypeOf() {
      throw new Error("You can't change entity prototype.")
    },
  }
}
