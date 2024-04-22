import { Model, Schema } from '@src/core/schema'
import { IndexesOptions } from '@src/core/schema/constraint'
import {
  backgroundColor,
  borderStyle,
  classnames,
  gridColumn,
  height,
  inset,
  padding,
  position,
  toClassname,
} from '@src/ui/styles/classnames'
import { fieldsetGrid } from '@src/ui/styles/utils'
import React from 'react'
import IconButton from '../form/IconButton'
import TrashIcon from '../icons/Trash'
import Select from '@src/ui/components/form/Select'
import TextInput from '@src/ui/components/form/TextInput'
import Checkbox from '@src/ui/components/form/Checkbox/Checkbox'

type IndexFieldsetProps = {
  index: IndexesOptions
  schema: Schema
  model: Model
  onChange: (id: IndexesOptions['id'], changes: Partial<IndexesOptions>) => void
  onDelete: (id: IndexesOptions['id']) => void
}

const getPlaceholderForIndexName = (index: IndexesOptions): string => {
  const fields = index.fields.map((f) => f.name)
  return fields.length > 0 ? fields.join('_') : `${index.name || 'index'}_index_${index.id}`
}

function IndexFieldset({
  index,
  model,
  onChange,
  onDelete,
  schema,
}: IndexFieldsetProps): React.ReactElement {
  const fieldOptions = React.useMemo(
    () => {
      const fields = model.fields.map((f) => f.name)

      return fields.reduce((acc, f) => {
        acc[f] = f

        return acc
      }, {})
    },

    // () => model.fields.map<[string, Model]>((m) => [m.id, m]),
    [model.fields],
  )

  const handleChange = React.useCallback(
    (changes: Partial<IndexesOptions>): void => {
      onChange(index.id, changes)
    },
    [index.id, onChange],
  )

  const handleChangeName = React.useCallback(
    (name: string | undefined): void => {
      handleChange({ name })
    },
    [handleChange],
  )

  const handleChangeUnique = React.useCallback(
    (unique: boolean): void => {
      handleChange({ unique })
    },
    [handleChange],
  )

  const handleChangeMethod = React.useCallback(
    (using: IndexesOptions['using']): void => {
      handleChange({ using })
    },
    [handleChange],
  )

  const handleDelete = React.useCallback(() => {
    onDelete(index.id)
  }, [index.id, onDelete])

  const handleAddField = React.useCallback(() => {
    handleChange({
      fields: [
        ...index.fields,
        {
          name: `${model.name}_index`,
        },
      ],
    })
  }, [index.fields, handleChange])

  const handleDeleteField = React.useCallback(
    (i: number) => () => {
      handleChange({
        fields: [...index.fields.slice(0, i), ...index.fields.slice(i + 1)],
      })
    },
    [index.fields, handleChange],
  )

  return (
    <fieldset className={classnames(fieldsetGrid, padding('pb-0'))}>
      <IconButton
        className={classnames(position('absolute'), inset('top-0', 'right-0'), padding('p-1'))}
        label="delete"
        icon={TrashIcon}
        iconProps={{ size: 6 }}
        onClick={handleDelete}
      />

      <TextInput
        id={`index-name-${index.id}`}
        className={classnames(gridColumn('col-span-6'))}
        label="as"
        value={index.name}
        placeholder={getPlaceholderForIndexName(index)}
        onChange={handleChangeName}
      />

      <Checkbox
        id={`field-unique-${index.id}`}
        label="Unique"
        checked={!!index.unique}
        onChange={handleChangeUnique}
      />

      <Select<'BTREE' | 'HASH'>
        id={`index-method-${index.id}`}
        className={classnames(gridColumn('col-span-6'))}
        label="Index Method"
        options={{
          BTREE: 'BTREE',
          HASH: 'HASH',
        }}
        display={(value) => value}
        value={index.using}
        onChange={handleChangeMethod}
      />

      {index.fields.map((field, i) => {
        return (
          <div
            key={`index-fields-${index.id}-${i}`}
            className={classnames(position('relative'), height('h-18'), gridColumn('col-span-6'))}
          >
            <IconButton
              className={classnames(
                position('absolute'),
                inset('-top-2', 'right-0'),
                padding('p-1'),
              )}
              label="delete field"
              icon={TrashIcon}
              iconProps={{ size: 6 }}
              onClick={handleDeleteField(i)}
            />

            <Select<string>
              id={`index-fields-${index.id}-${i}`}
              label="Fields"
              options={fieldOptions}
              display={(value) => value}
              value={field.name}
              onChange={(value) => {
                const newFields = [
                  ...index.fields.slice(0, i),
                  {
                    name: value,
                  },
                  ...index.fields.slice(i + 1),
                ]

                handleChange({
                  fields: newFields,
                  // Update name with new field name
                  name: `${model.name}_${newFields.map((x) => x.name).join('_')}`,
                })
              }}
            />
          </div>
        )
      })}

      <button
        onClick={handleAddField}
        className={classnames(
          backgroundColor('hover:bg-green-50', toClassname('dark:hover:bg-green-900')),
          borderStyle('border', 'border-dashed', 'border-gray-300', 'dark:border-gray-700'),
          gridColumn('col-span-6'),
        )}
      >
        Add field
      </button>
    </fieldset>
  )
}

export default React.memo(IndexFieldset)
