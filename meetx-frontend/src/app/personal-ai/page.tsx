'use client'

import { useState } from 'react'
import { apiFetch, setAccessToken, setPaiToken } from '../../lib/api'
import PasswordField from '../../components/PasswordField'

export default function PersonalAiPage() {
  const [mode, setMode] = useState<'login' | 'signup'>('login')
  const [email, setEmail] = useState('')
  const [identifier, setIdentifier] = useState('')
  const [name, setName] = useState('')
  const [handle, setHandle] = useState('')
  const [password, setPassword] = useState('')
  const [code, setCode] = useState('')
  const [preToken, setPreToken] = useState('')
  const [step, setStep] = useState<'request' | 'verify' | 'complete'>('request')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  function resetMessages() {
    setError('')
    setMessage('')
  }

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    resetMessages()
    const input = identifier.trim()
    if (!input || !password) {
      setError('Enter your email/handle and password')
      return
    }
    const payload = input.includes('@') ? { email: input, password } : { identifier: input, password }
    const res = await apiFetch('/auth/pai/login', {
      method: 'POST',
      body: JSON.stringify(payload)
    })
    const json = await res.json()
    if (!res.ok || json?.ok === false) {
      setError(json?.error?.message || 'Login failed')
      return
    }
    if (json?.data?.tokens?.accessToken) {
      setAccessToken(json.data.tokens.accessToken)
    }
    if (json?.data?.paiToken) {
      setPaiToken(json.data.paiToken)
    }
    setMessage('Signed in with Personal AI.')
  }

  async function requestCode(e: React.FormEvent) {
    e.preventDefault()
    resetMessages()
    if (!email) {
      setError('Enter your email')
      return
    }
    const res = await apiFetch('/auth/pai/request-code', {
      method: 'POST',
      body: JSON.stringify({ email })
    })
    const json = await res.json()
    if (!res.ok || json?.ok === false) {
      setError(json?.error?.message || 'Unable to request code')
      return
    }
    if (json?.data?.devVerificationCode) {
      setMessage(`Verification code (dev): ${json.data.devVerificationCode}`)
    } else {
      setMessage(json?.data?.message || 'Verification code sent to your email.')
    }
    setStep('verify')
  }

  async function verifyCode(e: React.FormEvent) {
    e.preventDefault()
    resetMessages()
    if (!/^\d{6}$/.test(code)) {
      setError('Enter a valid 6-digit code')
      return
    }
    const res = await apiFetch('/auth/pai/verify-code', {
      method: 'POST',
      body: JSON.stringify({ email, code })
    })
    const json = await res.json()
    if (!res.ok || json?.ok === false) {
      setError(json?.error?.message || 'Unable to verify code')
      return
    }
    if (!json?.data?.preToken) {
      setError('Missing preToken from Personal AI')
      return
    }
    setPreToken(json.data.preToken)
    setStep('complete')
  }

  async function completeSignup(e: React.FormEvent) {
    e.preventDefault()
    resetMessages()
    if (!name || !handle || !password) {
      setError('Fill name, handle, and password')
      return
    }
    const res = await apiFetch('/auth/pai/complete', {
      method: 'POST',
      body: JSON.stringify({ preToken, name, handle, password })
    })
    const json = await res.json()
    if (!res.ok || json?.ok === false) {
      setError(json?.error?.message || 'Unable to complete signup')
      return
    }
    if (json?.data?.tokens?.accessToken) {
      setAccessToken(json.data.tokens.accessToken)
    }
    if (json?.data?.paiToken) {
      setPaiToken(json.data.paiToken)
    }
    setMessage('Personal AI account created.')
  }

  return (
    <section className="section">
      <div className="card" style={{ maxWidth: 540, margin: '0 auto' }}>
        <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
          <button
            className={mode === 'login' ? 'button' : 'button secondary'}
            type="button"
            onClick={() => {
              setMode('login')
              setStep('request')
              setMessage('')
              setError('')
            }}
          >
            Sign in
          </button>
          <button
            className={mode === 'signup' ? 'button' : 'button secondary'}
            type="button"
            onClick={() => {
              setMode('signup')
              setStep('request')
              setMessage('')
              setError('')
            }}
          >
            Create account
          </button>
        </div>

        {mode === 'login' ? (
          <>
            <h2 className="section-title">Personal AI sign in</h2>
            <p className="section-subtitle">Use your Personal AI credentials to access MEETX.</p>
            <form className="form-grid" onSubmit={handleLogin}>
              <input
                className="input"
                placeholder="Email or handle"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
              />
              <PasswordField
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                autoComplete="current-password"
              />
              {error ? <div style={{ color: '#f87171' }}>{error}</div> : null}
              {message ? <div style={{ color: '#a3e635' }}>{message}</div> : null}
              <button className="button" type="submit">Sign in</button>
            </form>
          </>
        ) : (
          <>
            <h2 className="section-title">Create a Personal AI identity</h2>
            <p className="section-subtitle">Verify your email with a 6-digit code, then set your handle.</p>
            {step === 'request' ? (
              <form className="form-grid" onSubmit={requestCode}>
                <input
                  className="input"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                {error ? <div style={{ color: '#f87171' }}>{error}</div> : null}
                {message ? <div style={{ color: '#a3e635' }}>{message}</div> : null}
                <button className="button" type="submit">Send code</button>
              </form>
            ) : null}
            {step === 'verify' ? (
              <form className="form-grid" onSubmit={verifyCode}>
                <input
                  className="input"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <input
                  className="input"
                  placeholder="6-digit code"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                />
                {error ? <div style={{ color: '#f87171' }}>{error}</div> : null}
                {message ? <div style={{ color: '#a3e635' }}>{message}</div> : null}
                <div style={{ display: 'flex', gap: 12 }}>
                  <button className="button" type="submit">Verify code</button>
                  <button
                    className="button secondary"
                    type="button"
                    onClick={() => {
                      setStep('request')
                      setCode('')
                    }}
                  >
                    Resend
                  </button>
                </div>
              </form>
            ) : null}
            {step === 'complete' ? (
              <form className="form-grid" onSubmit={completeSignup}>
                <input
                  className="input"
                  placeholder="Full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
                <input
                  className="input"
                  placeholder="Handle"
                  value={handle}
                  onChange={(e) => setHandle(e.target.value)}
                />
                <PasswordField
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password (uppercase + number)"
                  autoComplete="new-password"
                />
                {error ? <div style={{ color: '#f87171' }}>{error}</div> : null}
                {message ? <div style={{ color: '#a3e635' }}>{message}</div> : null}
                <button className="button" type="submit">Create account</button>
              </form>
            ) : null}
          </>
        )}
      </div>
    </section>
  )
}
