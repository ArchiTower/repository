export type DeepReadonly<TData extends Record<string, any>> = {
  readonly [Key in keyof TData]: TData[Key] extends Record<string, any>
    ? TData[Key] extends Set<any> | Map<any, any> | Date | RegExp
      ? TData[Key]
      : DeepReadonly<TData[Key]>
    : TData[Key]
}
