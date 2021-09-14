import React from 'react'
import { CommonFieldProps, CommonInputProps } from '../shared/types'

type TextInputProps = CommonFieldProps & CommonInputProps<string> & { placeholder?: string }

function TextInput({
  id,
  label,
  value,
  placeholder,
  error,
  onChange,
}: TextInputProps): React.ReactElement {
  const handleChange = React.useCallback(
    (evt: React.ChangeEvent<HTMLInputElement>) => onChange(evt.target.value || undefined),
    [onChange],
  )

  return (
    <>
      <label htmlFor={id} className="flex flex-col items-start">
        {label}
        <input
          id={id}
          type="text"
          value={value}
          placeholder={placeholder}
          onChange={handleChange}
          aria-invalid={!!error}
          aria-describedby={`${id}-alert`}
        />
      </label>
      <span id={`${id}-alert`} role={error ? 'alert' : undefined} aria-hidden={!error}>
        {error}
      </span>
    </>
  )
}

export default React.memo(TextInput)
