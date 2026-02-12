'use client'

import { useState } from 'react'
import { apiFetch } from '../../lib/api'
import { useSearchParams } from 'next/navigation'
import PasswordField from '../../components/PasswordField'

export default function ResetPasswordPage() {
  const search = useSearchParams()
  const token = search.get('token') || ''
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setMessage('')

    if (!token) {
      setError('Missing reset token')
      return
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters')
      return
    }
    if (password !== confirm) {
      setError('Passwords do not match')
      return
    }

    const res = await apiFetch('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ token, password })
    })
    const json = await res.json()
    if (!res.ok || json?.ok === false) {
      setError(json?.error?.message || 'Unable to reset password')
      return
    }

    setMessage('Password updated. You can now sign in.')
    setPassword('')
    setConfirm('')
  }

  return (
    <section className="section">
      <div className="card" style={{ maxWidth: 520, margin: '0 auto' }}>
        <h2 className="section-title">Reset password</h2>
        <p className="section-subtitle">Set a new password to regain access.</p>
        <form className="form-grid" onSubmit={handleSubmit}>
          <PasswordField
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="New password"
            autoComplete="new-password"
          />
          <PasswordField
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            placeholder="Confirm new password"
            autoComplete="new-password"
          />
          {error ? <div style={{ color: '#f87171' }}>{error}</div> : null}
          {message ? <div style={{ color: '#a3e635' }}>{message}</div> : null}
          <button className="button" type="submit">Reset password</button>
        </form>
      </div>
    </section>
  )
}
