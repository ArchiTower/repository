/* eslint-disable @typescript-eslint/no-explicit-any */

import { ReadonlyDeep } from "type-fest"
import { SyncDestination, SyncMap, SyncKey } from "./sync"

export type EntityData = Record<string, any>

export type EntityPrototype<
  TSchema extends Record<string, any>,
  TData extends Partial<TSchema>
> = {
  update(data: Partial<TSchema>): Entity<TSchema, TData>
  toObject(): TData & { id: string }
  // toJSON(): string
  isSynced(id: SyncKey): boolean
  // setSynced(id: SyncDestination["id"]): void
}

export type Entity<
  TSchema extends Record<string, any>,
  TData extends Partial<TSchema>
> = { readonly id: string } & EntityPrototype<TSchema, TData> &
  ReadonlyDeep<TData>

export type EntityInternal<
  TSchema extends Record<string, any>,
  TData extends Partial<TSchema>
> = {
  readonly id: string
  _proto: EntityPrototype<TSchema, TData>
  _data: TData
  _syncMap: SyncMap
}

export type EntityFactory<TSchema extends Record<string, any>> = {
  createEntity: <TInput extends Partial<TSchema> = Partial<TSchema>>(
    data: TInput
  ) => Entity<TSchema, TInput>
  recoverEntity: <TInput extends Partial<TSchema>>(
    data: TInput & { id: string }
  ) => Entity<TSchema, TInput>
}
