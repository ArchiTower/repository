/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import type { Entity, EntityInternal, EntityPrototype } from "./interface"
import { generateId } from "./adapters/generateId"
import { SyncKey, SyncMap } from "./sync"
import { readonlyClone } from "./deepReadonly"

export function makeInternalEntity<
  TSchema extends Record<string, any>,
  TData extends Partial<TSchema>,
  TDefinitions
>(
  proto: EntityPrototype<TSchema, TData, TDefinitions>,
  data: TData,
  syncDestinations: SyncKey[],
  id?: string
): EntityInternal<TSchema, TData, TDefinitions> {
  return {
    ...proto,
    id: id ?? generateId(),
    _data: readonlyClone(data),
    _syncMap: new SyncMap(syncDestinations),
    _proto: proto,
  }
}

export function makeEntityProxy<
  TSchema extends Record<string, any>,
  TData extends Partial<TSchema>,
  TDefinitions
>(
  internalEntity: EntityInternal<TSchema, TData, TDefinitions>
): Entity<TSchema, TData, TDefinitions> {
  return new Proxy(internalEntity, {
    get(target, prop, receiver) {
      if (prop === "id") {
        return target.id
      }

      if (prop === "_syncMap") {
        throw new Error("SyncMap is internal and should not be accessed")
      }

      if (prop === Symbol.iterator) {
        return function* () {
          for (const key of Object.keys(target._data)) {
            yield [key, target._data[key as keyof TData]]
          }
        }
      }

      if (prop in target._proto) {
        return function (...args: unknown[]) {
          // prettier-ignore
          // @ts-expect-error - this is a proxy
          return target._proto[prop].apply(this === receiver ? target : this, args)
        }
      }

      if (prop in target._data) {
        return target._data[prop as keyof TData]
      }
    },
    set() {
      throw new Error("Entity is readonly")
    },
    ownKeys(target) {
      return Object.keys(target._data)
    },
    has(target, prop) {
      return prop in target._data
    },
    getPrototypeOf(target) {
      return Object.getPrototypeOf(target._proto)
    },
  }) as unknown as Entity<TSchema, TData, TDefinitions>
}
