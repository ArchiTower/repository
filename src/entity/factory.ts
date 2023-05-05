import { EntityData, Entity, EntityFactory, EntityInternal, EntityPrototype } from "./interface"
import { SyncKey } from "./sync"
import { makeInternalEntity, makeEntityProxy } from "./proxyFactory"

export function makeEntityFactory<TSchema extends EntityData>(
  syncDestinations: SyncKey[]
): EntityFactory<TSchema> {
  const proto = {
    update<const TInput extends Partial<TSchema>>(
      this: EntityInternal<TSchema, TInput>,
      data: TInput
    ): Entity<TSchema, TInput> {
      return makeEntityProxy(
        makeInternalEntity<TSchema, TInput>(
          proto as EntityPrototype<TSchema, TInput>,
          { ...this._data, ...data },
          syncDestinations,
          this.id
        )
      )
    },

    toObject<TInput extends Partial<TSchema>>(
      this: EntityInternal<TSchema, TInput>
    ) {
      return Object.assign({}, this._data)
    },

    isSynced<TInput extends Partial<TSchema>>(
      this: EntityInternal<TSchema, TInput>,
      id: SyncKey
    ): boolean {
      return this._syncMap.checkStatus(id)
    },

    setSynced<TInput extends Partial<TSchema>>(
      this: EntityInternal<TSchema, TInput>,
      id: SyncKey,
      promise: Promise<unknown>
    ): void {
      this._syncMap.setStatus(id, promise)
    },
  }

  function createEntity<
    const TInput extends Partial<TSchema> = Partial<TSchema>
  >(data: TInput): Entity<TSchema, TInput> {
    return makeEntityProxy(
      makeInternalEntity<TSchema, TInput>(
        proto as EntityPrototype<TSchema, TInput>,
        data,
        syncDestinations
      )
    )
  }

  function recoverEntity<const TInput extends Partial<TSchema>>(
    data: TInput & { id: string }
  ): Entity<TSchema, TInput> {
    if (!data.id) throw new Error("Entity must have an id")

    return makeEntityProxy(
      makeInternalEntity<TSchema, TInput>(
        proto as EntityPrototype<TSchema, TInput>,
        data,
        syncDestinations,
        data.id
      )
    )
  }

  return {
    createEntity,
    recoverEntity,
  }
}
