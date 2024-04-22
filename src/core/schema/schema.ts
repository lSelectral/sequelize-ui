import { now } from '@src/utils/dateTime'
import { uniqueId } from '@src/utils/string'
import { stringDataType } from '.'
import { Association, AssociationTypeType } from './association'
import { DataType } from './dataType'
import { IndexesOptions } from './constraint'

export type Schema = {
  id: string
  name: string
  models: Model[]
  forkedFrom: string | null
  createdAt: string
  updatedAt: string
}

export type Model = {
  id: string
  name: string
  fields: Field[]
  associations: Association[]
  indexes: IndexesOptions[]
  createdAt: string
  updatedAt: string
  timestamps: boolean
  paranoid: boolean
  comment?: string
}

export type Field = {
  id: string
  name: string
  type: DataType
  primaryKey: boolean
  required: boolean
  unique: boolean
  comment?: string
}

export function emptySchema(): Schema {
  const time = now()
  return {
    id: '',
    name: '',
    models: [],
    forkedFrom: null,
    createdAt: time,
    updatedAt: time,
  }
}

export function emptyModel(): Model {
  const time = now()
  return {
    id: uniqueId(),
    name: '',
    fields: [],
    associations: [],
    indexes: [],
    createdAt: time,
    updatedAt: time,
    timestamps: false,
    paranoid: false,
  }
}

export function emptyField(): Field {
  return {
    id: uniqueId(),
    name: '',
    type: stringDataType(),
    primaryKey: false,
    required: false,
    unique: false,
  }
}

export function field(props: Partial<Field> = {}): Field {
  return {
    ...emptyField(),
    ...props,
  }
}

export function emptyIndex(): IndexesOptions {
  return {
    fields: [],
    id: uniqueId(),
    name: '',
    using: 'BTREE',
  }
}

export function emptyAssociation(
  sourceModelId: Model['id'],
  targetModelId: Model['id'],
): Association {
  return {
    id: uniqueId(),
    sourceModelId,
    type: { type: AssociationTypeType.BelongsTo },
    targetModelId,
    foreignKey: null,
    alias: null,
  }
}

export function association(
  sourceModelId: Model['id'],
  targetModelId: Model['id'],
  props: Partial<Association>,
): Association {
  return { ...emptyAssociation(sourceModelId, targetModelId), ...props }
}

export function isNewSchema(schema: Schema): boolean {
  return schema.id === ''
}
