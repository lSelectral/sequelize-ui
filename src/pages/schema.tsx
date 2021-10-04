import { goTo } from '@src/routing/navigation'
import { indexRoute } from '@src/routing/routes'
import Layout from '@src/ui/components/Layout'
import ModelModule from '@src/ui/components/ModelModule'
import SchemaModule from '@src/ui/components/SchemaModule'
import useSchemaState, { SchemaEditStateType } from '@src/ui/hooks/useEditSchema'
import React, { useCallback } from 'react'

function SchemaPage(): React.ReactElement {
  return (
    <Layout title="Schema | Sequelize UI">
      <SchemaPageContent />
    </Layout>
  )
}

function SchemaPageContent(): React.ReactElement {
  const {
    schema,
    schemas,
    editState,
    error,
    edit,
    update,
    destroy,
    addModel,
    editModel,
    updateModel,
    deleteModel,
    cancel,
  } = useSchemaState()

  const handleClickViewCode = useCallback(() => goTo(indexRoute()), [])

  if (error) return <p>{error}</p>
  if (schema === undefined) return <p>Loading Schemas</p>

  return (
    <>
      <button onClick={handleClickViewCode}>{'View Code'}</button>
      <SchemaModule
        schema={schema}
        schemas={schemas || []}
        editing={editState.type === SchemaEditStateType.EditingSchema}
        onEdit={edit}
        onUpdate={update}
        onCancel={cancel}
      />
      <button onClick={destroy}>Delete</button>

      <h3>Models</h3>
      <button type="button" onClick={addModel}>
        Add model
      </button>
      {schema.models.length ? (
        <ul>
          {schema.models.map((model) => (
            <ModelModule
              key={`model-module-${model.id}`}
              model={model}
              schema={schema}
              editing={
                editState.type === SchemaEditStateType.EditingModel && editState.id === model.id
              }
              disabled={
                editState.type === SchemaEditStateType.EditingSchema ||
                (editState.type === SchemaEditStateType.EditingModel && editState.id !== model.id)
              }
              onRequestEdit={editModel}
              onRequestDelete={deleteModel}
              onRequestCancel={cancel}
              onChange={updateModel}
            />
          ))}
        </ul>
      ) : null}
    </>
  )
}

export default SchemaPage
