'use client'

import { useState } from 'react'
import { apiFetch } from '../../lib/api'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setMessage('')
    const res = await apiFetch('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email })
    })
    const json = await res.json()
    if (!res.ok || json?.ok === false) {
      setError(json?.error?.message || 'Unable to request reset')
      return
    }
    if (json?.data?.resetToken) {
      setMessage(`Reset token (dev): ${json.data.resetToken}`)
    } else {
      setMessage('If this email exists, a reset link will be sent.')
    }
  }

  return (
    <section className="section">
      <div className="card" style={{ maxWidth: 480, margin: '0 auto' }}>
        <h2 className="section-title">Forgot password</h2>
        <p className="section-subtitle">We will send a reset link if the email is on file.</p>
        <form className="form-grid" onSubmit={handleSubmit}>
          <input
            className="input"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          {error ? <div style={{ color: '#f87171' }}>{error}</div> : null}
          {message ? <div style={{ color: '#a3e635' }}>{message}</div> : null}
          <button className="button" type="submit">Request reset</button>
        </form>
      </div>
    </section>
  )
}
