/* eslint-disable @typescript-eslint/explicit-function-return-type */
import {
  EntitySchema,
  Relationship,
  UserDefinedSchema,
  SyncKey,
  ProxyTarget,
} from "./interface"
import { relationAccessorFactory } from "./relationsAccessor"
import { createInternalEntity } from "./proto"
import { proxyHandlerFactory } from "./proxyHandlerFactory"

export function entityModelFactory<TInputSchema extends UserDefinedSchema>() {
  type ModelSchema = EntitySchema<TInputSchema>

  return <
    const TDefinition extends Relationship<ModelSchema> = Relationship<ModelSchema>
  >(
    definitions: TDefinition[] = [],
    syncKeys: SyncKey[] = []
  ) => {
    const relationAccessor =
      definitions.length > 0 ? relationAccessorFactory(definitions) : {}

    const internalEntityClass = createInternalEntity<ModelSchema>(syncKeys)

    const proxyHandler = proxyHandlerFactory<ProxyTarget>()

    // TODO: Add proper input values & types
    function createEntity() {
      const internalEntity = new internalEntityClass()

      const proxyTarget = {
        proto: internalEntity,
        relationAccessor: relationAccessor,
      }

      return new Proxy(proxyTarget, proxyHandler)
    }

    return {
      createEntity,
      recoverEntity: () => {},
    }
  }
}
