/* eslint-disable @typescript-eslint/no-explicit-any */

import type { RepositoryKey } from "src/repositoryKey"
import { SyncMap, SyncKey } from "./sync"
import type { DeepReadonly } from "./types"
import type { UnionToIntersection } from "type-fest"

export type EntityData = Record<string, any>

export type EntityPrototype<
  TSchema extends Record<string, any>,
  TData extends Partial<TSchema>,
  TDefinitions
> = {
  update(data: Partial<TSchema>): Entity<TSchema, TData, TDefinitions>
  toObject(): TData & { id: string }
  isSynced(id: SyncKey): boolean
  setSynced(id: SyncKey, promise: Promise<unknown>): void
} & UnionToIntersection<Relations<TDefinitions>>

export type Entity<
  TSchema extends Record<string, any>,
  TData extends Partial<TSchema>,
  TDefinitions
> = { readonly id: string } & EntityPrototype<TSchema, TData, TDefinitions> &
  DeepReadonly<TData>

export type EntityInternal<
  TSchema extends Record<string, any>,
  TData extends Partial<TSchema>,
  TDefinitions
> = {
  readonly id: string
  _proto: EntityPrototype<TSchema, TData, TDefinitions>
  _data: DeepReadonly<TData>
  _syncMap: SyncMap
}

export type EntityFactory<TSchema extends Record<string, any>, TDefinitions> = {
  createEntity: <TInput extends Partial<TSchema> = Partial<TSchema>>(
    data: TInput
  ) => Entity<TSchema, TInput, TDefinitions>
  recoverEntity: <TInput extends Partial<TSchema>>(
    data: TInput & { id: string }
  ) => Entity<TSchema, TInput, TDefinitions>
}

export interface Relationship<
  TLocalSchema,
  TForeignRepository extends RepositoryKey<any, any> = RepositoryKey<any, any>
> {
  readonly id: string
  type: "has-many" | "belongs-to"
  foreignRepository: TForeignRepository
  foreignKey: keyof TForeignRepository["__schema"]
  localKey: keyof TLocalSchema
}

type FindForeignSchemaInDefinitions<TDefinitions, TID> = TDefinitions extends {
  id: TID
  foreignRepository: infer TForeignRepository
}
  ? TForeignRepository extends RepositoryKey<infer TForeignSchema, any>
    ? TForeignSchema
    : never
  : never

export type ForeignType<
  TDefinitions extends { id: string },
  TRelationName extends TDefinitions["id"]
> = FindForeignSchemaInDefinitions<TDefinitions, TRelationName>

export type Relations<TDefinitions> = TDefinitions extends {
  id: string
}
  ? { [Key in TDefinitions["id"]]: () => ForeignType<TDefinitions, Key> }
  : never
