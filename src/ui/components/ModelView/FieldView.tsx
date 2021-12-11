import { displayDataType, Field } from '@src/core/schema'
import { classnames } from '@src/ui/styles/classnames'
import { list } from '@src/ui/styles/utils'
import { noCase } from '@src/utils/string'
import React from 'react'

type FieldViewProps = {
  field: Field
}
function FieldView({ field }: FieldViewProps) {
  return (
    <div className={classnames('p-4')}>
      <p className={classnames('mb-2', 'font-bold')}>{noCase(field.name)}</p>
      <ul className={classnames('col-span-12', list)}>
        <li>{displayDataType(field.type)}</li>
        {field.primaryKey && <li>Primary key</li>}
        {field.required && <li>Required</li>}
        {field.unique && <li>Unique</li>}
      </ul>
    </div>
  )
}

export default React.memo(FieldView)
