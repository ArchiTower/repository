import { UnionToIntersection } from "type-fest"
import { RepositoryKey, makeRepositoryKey } from "../repositoryKey"

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

const frk = makeRepositoryKey<
  {
    id: string
    name: string
    authorId: string
  },
  "posts"
>("posts")

const afrk = makeRepositoryKey<
  {
    id: string
    title: string
    postId: string
  },
  "authors"
>("authors")

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
function defineContext<TLocalSchema>() {
  return <
    const TDefinition = Relationship<TLocalSchema, RepositoryKey<any, any>>
  >(
    ...definitions: TDefinition[]
  ) => {
    type Defs<TDefinitions, TID> = TDefinitions extends {
      id: TID
      foreignRepository: infer TForeignRepository
    }
      ? TForeignRepository extends RepositoryKey<infer TForeignSchema, any>
        ? TForeignSchema
        : never
      : never

    type ForeignType<
      TDefinitions extends { id: string },
      TRelationName extends TDefinitions["id"]
    > = Defs<TDefinitions, TRelationName>

    type Relations<TDefinitions> = TDefinitions extends {
      id: string
    }
      ? { [Key in TDefinitions["id"]]: () => ForeignType<TDefinitions, Key> }
      : never

    const obj = {}
    definitions.forEach((definition: (typeof definitions)[number]) => {
      obj[definition.id] = () => {
        console.log("Call to foreign repository", definition.foreignRepository)

        return {}
      }
    })

    return obj as UnionToIntersection<Relations<(typeof definitions)[number]>>
  }
}

type LocalSchema = { id: string; name: string }

const obj = defineContext<LocalSchema>()(
  {
    id: "posts",
    type: "has-many",
    foreignRepository: frk,
    foreignKey: "authorId",
    localKey: "id",
  },
  {
    id: "authors",
    type: "has-many",
    foreignRepository: afrk,
    foreignKey: "postId",
    localKey: "id",
  }
)

type TestObj = typeof obj
//    ^?

obj.posts()
