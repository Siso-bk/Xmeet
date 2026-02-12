'use client'

import { useState } from 'react'
import { apiFetch, clearAccessToken } from '../../lib/api'
import PasswordField from '../../components/PasswordField'

export default function ChangePasswordPage() {
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setMessage('')

    if (newPassword.length < 8) {
      setError('New password must be at least 8 characters')
      return
    }
    if (newPassword !== confirm) {
      setError('Passwords do not match')
      return
    }

    const res = await apiFetch('/auth/change-password', {
      method: 'POST',
      body: JSON.stringify({ currentPassword, newPassword })
    })
    const json = await res.json()
    if (!res.ok || json?.ok === false) {
      setError(json?.error?.message || 'Unable to change password')
      return
    }

    clearAccessToken()
    setCurrentPassword('')
    setNewPassword('')
    setConfirm('')
    setMessage('Password updated. Please sign in again.')
  }

  return (
    <section className="section">
      <div className="card" style={{ maxWidth: 520, margin: '0 auto' }}>
        <h2 className="section-title">Change password</h2>
        <p className="section-subtitle">Maintain account security with a new password.</p>
        <form className="form-grid" onSubmit={handleSubmit}>
          <PasswordField
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            placeholder="Current password"
            autoComplete="current-password"
          />
          <PasswordField
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
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
          <button className="button" type="submit">Update password</button>
        </form>
      </div>
    </section>
  )
}
