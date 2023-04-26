import {
  EntityData,
  Entity,
  EntityInternal,
  Relationship,
  EntityPrototype,
} from "./interface"
import { SyncKey } from "./sync"
import { makeInternalEntity, makeEntityProxy } from "./proxyFactory"
import { RepositoryKey } from "src/repositoryKey"

export function makeEntityFactory<TSchema extends EntityData>() {
  return <const TDefinition = Relationship<TSchema, RepositoryKey<any, any>>>(
    definitions: TDefinition[],
    syncDestinations: SyncKey[] = []
  ) => {
    type Definitions = (typeof definitions)[number]

    const proto = {
      update<const TInput extends Partial<TSchema>>(
        this: EntityInternal<TSchema, TInput, Definitions>,
        data: TInput
      ): Entity<TSchema, TInput, Definitions> {
        return makeEntityProxy(
          makeInternalEntity<TSchema, TInput, Definitions>(
            proto as EntityPrototype<TSchema, TInput, Definitions>,
            { ...this._data, ...data },
            syncDestinations,
            this.id
          )
        )
      },

      toObject<TInput extends Partial<TSchema>>(
        this: EntityInternal<TSchema, TInput, Definitions>
      ) {
        return Object.assign({}, this._data)
      },

      isSynced<TInput extends Partial<TSchema>>(
        this: EntityInternal<TSchema, TInput, Definitions>,
        id: SyncKey
      ): boolean {
        return this._syncMap.checkStatus(id)
      },

      setSynced<TInput extends Partial<TSchema>>(
        this: EntityInternal<TSchema, TInput, Definitions>,
        id: SyncKey,
        promise: Promise<unknown>
      ): void {
        this._syncMap.setStatus(id, promise)
      },
    }

    definitions.forEach((definition: (typeof definitions)[number]) => {
      proto[definition.id] = () => {
        console.log("Call to foreign repository", definition.foreignRepository)
        // TODO: Add implementation for reaching out to RepositoryManager

        return {}
      }
    })

    function createEntity<
      const TInput extends Partial<TSchema> = Partial<TSchema>
    >(data: TInput): Entity<TSchema, TInput, Definitions> {
      return makeEntityProxy(
        makeInternalEntity<TSchema, TInput, Definitions>(
          proto as EntityPrototype<TSchema, TInput, Definitions>,
          data,
          syncDestinations
        )
      )
    }

    function recoverEntity<const TInput extends Partial<TSchema>>(
      data: TInput & { id: string }
    ): Entity<TSchema, TInput, Definitions> {
      if (!data.id) throw new Error("Entity must have an id")

      return makeEntityProxy(
        makeInternalEntity<TSchema, TInput, Definitions>(
          proto as EntityPrototype<TSchema, TInput, Definitions>,
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
}
