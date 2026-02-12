'use client'

import { useState } from 'react'

type PasswordFieldProps = {
  value: string
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void
  placeholder?: string
  name?: string
  id?: string
  autoComplete?: string
}

export default function PasswordField({
  value,
  onChange,
  placeholder,
  name,
  id,
  autoComplete
}: PasswordFieldProps) {
  const [visible, setVisible] = useState(false)

  return (
    <div className="field">
      <input
        className="input field-input"
        type={visible ? 'text' : 'password'}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        name={name}
        id={id}
        autoComplete={autoComplete}
      />
      <button
        type="button"
        className="icon-button"
        aria-label={visible ? 'Hide password' : 'Show password'}
        onClick={() => setVisible((prev) => !prev)}
      >
        {visible ? (
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path
              d="M3 5.2 5.2 3l15.8 15.8-2.2 2.2-3.2-3.2A11.6 11.6 0 0 1 12 19C6.6 19 2.1 15.6 1 12c.5-1.7 1.8-3.5 3.7-5l2.2 2.2A7.2 7.2 0 0 0 4.3 12C5.3 14.5 8.4 17 12 17c.8 0 1.6-.1 2.3-.4l-2-2a3 3 0 0 1-4-4l-1.7-1.7C6 9.8 5.4 10.9 5.1 12c.7 2 3.2 4.1 6.9 4.1.4 0 .9 0 1.3-.1l-1.5-1.5a1.9 1.9 0 0 1-2.3-2.3L3 5.2Z"
              fill="currentColor"
            />
            <path
              d="M12 5c5.4 0 9.9 3.4 11 7-0.5 1.6-1.7 3.3-3.4 4.7l-2-2a7.3 7.3 0 0 0 2-2.7C18.7 9.5 15.6 7 12 7c-1.2 0-2.4.3-3.4.7l-1.7-1.7C8.3 5.4 10.1 5 12 5Z"
              fill="currentColor"
            />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path
              d="M12 5c5.4 0 9.9 3.4 11 7-1.1 3.6-5.6 7-11 7S2.1 15.6 1 12c1.1-3.6 5.6-7 11-7Zm0 2c-3.6 0-6.7 2.5-7.7 5 1 2.5 4.1 5 7.7 5s6.7-2.5 7.7-5c-1-2.5-4.1-5-7.7-5Zm0 2.5A2.5 2.5 0 1 1 9.5 12 2.5 2.5 0 0 1 12 9.5Z"
              fill="currentColor"
            />
          </svg>
        )}
      </button>
    </div>
  )
}
