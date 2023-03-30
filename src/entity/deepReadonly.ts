import { ReadonlyDeep } from "type-fest"

export function deepReadonly<TWriteableObject extends Record<string, any>>(
  obj: TWriteableObject
): ReadonlyDeep<TWriteableObject> {
  Reflect.ownKeys(obj).forEach((key) => {
    const value = obj[key as keyof TWriteableObject]
    if (value && typeof value === "object" && !(value instanceof Date)) {
      obj[key as keyof TWriteableObject] = deepReadonly(value)
    }
  })

  return Object.freeze(obj) as ReadonlyDeep<TWriteableObject>
}
