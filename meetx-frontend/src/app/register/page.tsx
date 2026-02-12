'use client'

import { useState } from 'react'
import { apiFetch } from '../../lib/api'
import PasswordField from '../../components/PasswordField'

export default function RegisterPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setMessage('')
    setError('')
    const res = await apiFetch('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password })
    })
    const json = await res.json()
    if (!res.ok || !json.ok) {
      setError(json?.error?.message || 'Registration failed')
      return
    }
    setMessage('Registered. You can now log in.')
  }

  return (
    <section className="section">
      <div className="card" style={{ maxWidth: 460, margin: '0 auto' }}>
        <h2 className="section-title">Create your profile</h2>
        <p className="section-subtitle">Start building meaningful connections with a verified MEETX identity.</p>
        <form className="form-grid" onSubmit={handleSubmit}>
          <input className="input" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
          <input className="input" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <PasswordField
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            autoComplete="new-password"
          />
          {error ? <div style={{ color: '#f87171' }}>{error}</div> : null}
          {message ? <div style={{ color: '#a3e635' }}>{message}</div> : null}
          <button className="button" type="submit">Create account</button>
        </form>
      </div>
    </section>
  )
}
