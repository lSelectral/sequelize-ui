import { DbOptions } from '@src/core/database'
import { activeFilePath, FileTree } from '@src/core/files/fileTree'
import { Field, isNewSchema, Model, Schema } from '@src/core/schema'
import {
  emptyModelErrors,
  emptySchemaErrors,
  hasSchemaErrors,
  noModelErrors,
  validateModel,
  validateSchema,
} from '@src/core/validation/schema'
import { isDemoSchema } from '@src/data/schemas'
import useGeneratedCode from '@src/ui/hooks/useGeneratedCode'
import equal from 'fast-deep-equal/es6'
import React from 'react'
import { useFileTree } from '../FileTreeView'
import { SchemaFlyoutState, SchemaFlyoutStateType } from './types'

type UseSchemaFlyoutArgs = {
  schema: Schema
  schemas: Schema[]
  dbOptions: DbOptions
  code?: boolean
  onChange: (schema: Schema) => Promise<Schema>
  onDelete: () => Promise<void>
  onExit: () => void
}

type UseSchemaFlyoutResult = {
  state: SchemaFlyoutState
  isEditing: boolean
  fileTree: FileTree
  selectItem: (path: string) => void
  handleKeyDown: (evt: React.KeyboardEvent) => void
  edit: () => void
  delete_: () => void
  viewCode: () => void
  viewSchema: (model?: Model) => void
  updateSchema: (schema: Schema) => void
  updateModel: (model: Model) => void
  addModel: () => void
  addField: () => void
  editField: (field: Field) => void
  deleteField: (field: Field) => void
  addAssociation: () => void
  save: () => void
  cancel: () => void
}
export function useSchemaFlyout({
  schema,
  schemas,
  dbOptions,
  code = true,
  onChange,
  onDelete,
  onExit,
}: UseSchemaFlyoutArgs): UseSchemaFlyoutResult {
  const [state, setState] = React.useState<SchemaFlyoutState>(() =>
    isNewSchema(schema) || !code
      ? { type: SchemaFlyoutStateType.EDIT_SCHEMA, schema, errors: emptySchemaErrors }
      : { type: SchemaFlyoutStateType.CODE },
  )

  const { root, framework, defaultPath } = useGeneratedCode({ schema, dbOptions })
  const { fileTree, selectItem, handleKeyDown } = useFileTree({ root, key: schema.id, defaultPath })

  const edit = React.useCallback(() => {
    if (state.type === SchemaFlyoutStateType.CODE) {
      const path = activeFilePath(fileTree)
      const model = path && framework?.modelFromPath(path, schema)

      if (model) {
        setState({ type: SchemaFlyoutStateType.EDIT_MODEL, model, errors: emptyModelErrors })
      } else {
        setState({ type: SchemaFlyoutStateType.EDIT_SCHEMA, schema, errors: emptySchemaErrors })
      }
      return
    }

    if (state.type === SchemaFlyoutStateType.VIEW_MODEL) {
      setState({
        type: SchemaFlyoutStateType.EDIT_MODEL,
        model: state.model,
        errors: emptyModelErrors,
      })
      return
    }

    setState({ type: SchemaFlyoutStateType.EDIT_SCHEMA, schema, errors: emptySchemaErrors })
  }, [state, schema, fileTree, framework])

  const viewCode = React.useCallback(() => {
    const path =
      state.type === SchemaFlyoutStateType.VIEW_MODEL &&
      root &&
      framework?.defaultModelFile(state.model, root)

    if (path) selectItem(path)

    setState({ type: SchemaFlyoutStateType.CODE })
  }, [state, root, framework, selectItem])

  const viewSchema = React.useCallback(
    (model?: Model) => {
      if (state.type === SchemaFlyoutStateType.CODE) {
        const path = activeFilePath(fileTree)
        const currModel = path && framework?.modelFromPath(path, schema)

        const nextState: SchemaFlyoutState = currModel
          ? { type: SchemaFlyoutStateType.VIEW_MODEL, model: currModel }
          : { type: SchemaFlyoutStateType.VIEW_SCHEMA, schema }

        setState(nextState)
        return
      }

      if (model) {
        setState({ type: SchemaFlyoutStateType.VIEW_MODEL, model })
        return
      }

      setState({ type: SchemaFlyoutStateType.VIEW_SCHEMA, schema })
    },
    [state, fileTree, framework, schema],
  )

  const updateSchema = React.useCallback(
    (schema: Schema) => {
      if (state.type === SchemaFlyoutStateType.EDIT_SCHEMA) {
        setState({ ...state, schema })
      }
    },
    [state],
  )

  const updateModel = React.useCallback(
    (model: Model) => {
      if (state.type === SchemaFlyoutStateType.EDIT_MODEL) {
        setState({ ...state, model })
      }
    },
    [state],
  )

  const addModel = React.useCallback(() => {
    if (state.type === SchemaFlyoutStateType.VIEW_SCHEMA) {
      setState({
        type: SchemaFlyoutStateType.EDIT_SCHEMA,
        schema,
        errors: emptySchemaErrors,
        newModel: true,
      })
    }
  }, [schema, state])

  const addField = React.useCallback(() => {
    if (state.type === SchemaFlyoutStateType.VIEW_MODEL) {
      setState({
        type: SchemaFlyoutStateType.EDIT_MODEL,
        model: state.model,
        errors: emptyModelErrors,
        newField: true,
      })
    }
  }, [state])

  const addAssociation = React.useCallback(() => {
    if (state.type === SchemaFlyoutStateType.VIEW_MODEL) {
      setState({
        type: SchemaFlyoutStateType.EDIT_MODEL,
        model: state.model,
        errors: emptyModelErrors,
        newAssociation: true,
      })
    }
  }, [state])

  const exitEdit = React.useCallback(
    (nextSchema: Schema) => {
      const model =
        state.type === SchemaFlyoutStateType.EDIT_MODEL
          ? nextSchema.models.find((m) => m.id === state.model.id)
          : undefined

      if (model) {
        setState({ type: SchemaFlyoutStateType.VIEW_MODEL, model })
        return
      }

      setState({ type: SchemaFlyoutStateType.VIEW_SCHEMA, schema: nextSchema })
    },
    [state],
  )

  const save = React.useCallback(async () => {
    if (state.type === SchemaFlyoutStateType.EDIT_SCHEMA) {
      const errors = validateSchema(state.schema, schemas)

      if (hasSchemaErrors(errors)) {
        setState({ ...state, errors })
        return
      }

      if (isDemoSchema(state.schema) || !equal(state.schema, schema)) {
        const updatedSchema = await onChange(state.schema)
        exitEdit(updatedSchema)
        return
      }

      if (isNewSchema(state.schema)) {
        onExit()
        return
      }

      exitEdit(schema)
    }

    if (state.type === SchemaFlyoutStateType.EDIT_MODEL) {
      const errors = validateModel(state.model, schema)
      if (noModelErrors(errors)) {
        const newSchema: Schema = {
          ...schema,
          models: schema.models.map((m) => (m.id === state.model.id ? state.model : m)),
        }

        if (!equal(newSchema, schema)) {
          const updatedSchema = await await onChange({
            ...schema,
            models: schema.models.map((m) => (m.id === state.model.id ? state.model : m)),
          })
          exitEdit(updatedSchema)
          return
        }

        exitEdit(schema)
      } else {
        setState({ ...state, errors })
      }
    }
  }, [schema, schemas, state, onChange, exitEdit, onExit])

  const deleteField = React.useCallback(
    async (field: Field) => {
      if (state.type === SchemaFlyoutStateType.VIEW_MODEL) {
        const model: Model = {
          ...state.model,
          fields: state.model.fields.filter((f) => f.id !== field.id),
        }

        const updatedSchema = await onChange({
          ...schema,
          models: schema.models.map((m) => (m.id === state.model.id ? model : m)),
        })

        const updatedModel = updatedSchema.models.find((m) => m.id === model.id)

        if (updatedModel) {
          setState({
            type: SchemaFlyoutStateType.VIEW_MODEL,
            model: updatedModel,
          })
        }

        return
      }
    },
    [schema, state, onChange],
  )

  const editField = React.useCallback(async (field: Field) => {
    const model = schema.models.find((m) => m.fields.some((f) => f.id === field.id))
    if (model) {
      setState({
        type: SchemaFlyoutStateType.EDIT_MODEL,
        model,
        initialField: field,
        errors: emptyModelErrors,
      })
    }
  }, [])

  const delete_ = React.useCallback(async () => {
    if (
      state.type === SchemaFlyoutStateType.VIEW_SCHEMA ||
      state.type === SchemaFlyoutStateType.EDIT_SCHEMA
    ) {
      await onDelete()
      onExit()
      return
    }

    if (
      state.type === SchemaFlyoutStateType.VIEW_MODEL ||
      state.type === SchemaFlyoutStateType.EDIT_MODEL
    ) {
      const updatedSchema = await onChange({
        ...schema,
        models: schema.models.filter((m) => m.id !== state.model.id),
      })

      setState({ type: SchemaFlyoutStateType.VIEW_SCHEMA, schema: updatedSchema })
      return
    }
  }, [schema, state, onChange, onExit, onDelete])

  const cancel = React.useCallback(() => {
    if (isNewSchema(schema)) {
      onExit()
      return
    }

    if (isDemoSchema(schema)) {
      viewCode()
      return
    }

    exitEdit(schema)
  }, [schema, exitEdit, onExit, viewCode])

  return {
    state,
    isEditing:
      state.type === SchemaFlyoutStateType.EDIT_MODEL ||
      state.type === SchemaFlyoutStateType.EDIT_SCHEMA,
    fileTree,
    selectItem,
    handleKeyDown,
    edit,
    delete_,
    updateModel,
    updateSchema,
    addModel,
    addField,
    editField,
    deleteField,
    addAssociation,
    viewCode,
    viewSchema,
    save,
    cancel,
  }
}
