'use client'

import { useState } from 'react'
import { apiFetch, setAccessToken } from '../../lib/api'
import PasswordField from '../../components/PasswordField'
import Link from 'next/link'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    const res = await apiFetch('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    })
    const json = await res.json()
    if (!res.ok || !json.ok) {
      setError(json?.error?.message || 'Login failed')
      return
    }
    setAccessToken(json.data.tokens.accessToken)
  }

  return (
    <section className="section">
      <div className="card" style={{ maxWidth: 460, margin: '0 auto' }}>
        <h2 className="section-title">Welcome back</h2>
        <p className="section-subtitle">Securely sign in to continue building high-signal connections.</p>
        <form className="form-grid" onSubmit={handleSubmit}>
          <input className="input" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <PasswordField
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            autoComplete="current-password"
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Link href="/forgot-password" className="muted">Forgot password?</Link>
            <Link href="/personal-ai" className="muted">Personal AI sign in</Link>
          </div>
          {error ? <div style={{ color: '#f87171' }}>{error}</div> : null}
          <button className="button" type="submit">Sign in</button>
        </form>
      </div>
    </section>
  )
}
