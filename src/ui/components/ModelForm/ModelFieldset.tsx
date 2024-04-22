import { Model } from '@src/core/schema'
import { ModelErrors } from '@src/core/validation/schema'
import TextInput from '@src/ui/components/form/TextInput'
import { classnames, width } from '@src/ui/styles/classnames'
import React from 'react'
import Checkbox from '../form/Checkbox/Checkbox'

type ModelFieldsetProps = {
  model: Model
  errors: ModelErrors
  onChange: (changes: Partial<Model>) => void
}

function ModelFieldset({ model, errors, onChange }: ModelFieldsetProps): React.ReactElement {
  const handleChangeName = React.useCallback(
    (name?: string) => onChange({ name: name || '' }),
    [onChange],
  )

  const handleChangeComment = React.useCallback(
    (comment?: string) => onChange({ comment: comment}),
    [onChange],
  )

  return (
    <fieldset className={classnames(width('w-full'))}>
      <div className={classnames(width('sm:w-1/2'))}>
        <TextInput
          id={modelNameId()}
          label="Name"
          value={model.name}
          error={errors.name}
          onChange={handleChangeName}
        />
      </div>

      <div className={classnames(width('sm:w-1/2'))}>
        <TextInput
          id="model-comment"
          label="Comment"
          value={model.comment}
          onChange={handleChangeComment}
        />
      </div>

      
      <Checkbox 
        id='timestamps'
        label='Timestamps'
        checked={model.timestamps}
        onChange={checked => onChange({ 
          timestamps: checked,
          paranoid: checked ? model.paranoid : false,
        })}
      />

      <Checkbox 
        id='paranoid'
        label='Paranoid'
        disabled={model?.timestamps === false}
        checked={model.paranoid}
        onChange={checked => onChange({ paranoid: checked })}
      />
    </fieldset>
  )
}

export function modelNameId(): string {
  return 'model-name'
}

export default React.memo(ModelFieldset)
