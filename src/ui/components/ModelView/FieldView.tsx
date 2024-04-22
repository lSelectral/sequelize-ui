import { displayDataType, Field } from '@src/core/schema'
import {
  classnames,
  display,
  fontWeight,
  inset,
  justifyContent,
  padding,
  position,
  backgroundColor,
  space,
} from '@src/ui/styles/classnames'
import { breakWordsMinus8, list, panelHeader } from '@src/ui/styles/utils'
import { noCase } from '@src/utils/string'
import React from 'react'
import PencilIcon from '../icons/Pencil'
import TrashIcon from '../icons/Trash'
import ActionMenu from '../menus/ActionMenu'

type FieldViewProps = {
  field: Field
  onClickEdit: () => void
  onClickDelete: () => void
}
function FieldView({ field, onClickEdit, onClickDelete }: FieldViewProps) {
  return (
    <>
      <div
        className={classnames(
          panelHeader,
          display('flex'),
          justifyContent('justify-between'),
          position('relative'),
        )}
      >
        <p className={classnames(padding('px-1'), fontWeight('font-bold'), breakWordsMinus8)}>
          {noCase(field.name)}
        </p>
        <ActionMenu
          className={classnames(position('absolute'), inset('right-0', 'top-1', 'right-1'))}
          items={[
            { icon: PencilIcon, label: 'Edit', onClick: onClickEdit },
            { icon: TrashIcon, label: 'Delete', onClick: onClickDelete },
          ]}
        />
      </div>
      <ul className={classnames(list, padding('p-2', 'pl-4'), space('space-y-2'))}>
        <li>{displayDataType(field.type)}</li>
        {field.primaryKey && <li className={classnames(backgroundColor('bg-red-600'))}>Primary key</li>}
        {field.required && <li className={classnames(backgroundColor('bg-slate-400'))}>Required</li>}
        {field.unique && <li>Unique</li>}
      </ul>
    </>
  )
}

export default React.memo(FieldView)
