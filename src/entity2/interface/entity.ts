import { SyncKey } from "../sync"
import { DeepReadonly } from "../types"
import { AllowedEntityInput, EntityData, EntitySchema } from "./data"
import { Relations, Relationship } from "./relations"

export type Entity<
  TSchema extends EntitySchema,
  TActualData extends EntityData<AllowedEntityInput<TSchema>>,
  TRelations extends Relationship<TSchema>[] = [],
  TSyncKeys extends SyncKey[] = []
> = DeepReadonly<TActualData> &
  Relations<TRelations[number]> & {
    update<const TUpdatedData extends AllowedEntityInput<TSchema>>(
      data: TUpdatedData
    ): Entity<TSchema, TActualData & TUpdatedData, TRelations, TSyncKeys>
    toObject(): EntityData<TActualData>
    toJson(): string
    isSynced(id: SyncKey): boolean
    setSynced(id: SyncKey, promise: Promise<unknown>): void
  }
