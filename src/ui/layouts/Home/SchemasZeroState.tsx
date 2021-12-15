import { classnames } from '@src/ui/styles/classnames'
import { inlineButton } from '@src/ui/styles/utils'
import React from 'react'

type SchemasZeroStateProps = {
  onClickCreate: () => void
  onMouseOver: () => void
}

export default function SchemasZeroState({
  onClickCreate,
  onMouseOver,
}: SchemasZeroStateProps): React.ReactElement | null {
  return (
    <p className={classnames('text-lg', 'text-center', 'leading-loose')}>
      To get started,{' '}
      <button
        type="button"
        className={classnames(inlineButton, 'text-sm', 'font-bold', 'hover:bg-green-100')}
        onClick={onClickCreate}
        onMouseOver={onMouseOver}
        onTouchStartCapture={onMouseOver}
      >
        create a new schema
      </button>{' '}
      or select one of the demo schemas below.
    </p>
  )
}
