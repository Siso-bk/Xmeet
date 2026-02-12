'use client'

import { useEffect, useState } from 'react'
import { apiFetch, getPaiToken } from '../../lib/api'
import type { UpsertProfileRequest } from '@meetx/shared'
import Link from 'next/link'

const emptyProfile: UpsertProfileRequest = {
  name: '',
  headline: '',
  bio: '',
  skills: [],
  interests: [],
  goals: [],
  location: '',
  availability: '',
  visibility: 'public'
}

function toList(value: string) {
  return value
    .split(',')
    .map((v) => v.trim())
    .filter(Boolean)
}

export default function ProfilePage() {
  const [form, setForm] = useState<UpsertProfileRequest>(emptyProfile)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [skillsText, setSkillsText] = useState('')
  const [interestsText, setInterestsText] = useState('')
  const [goalsText, setGoalsText] = useState('')

  useEffect(() => {
    async function load() {
      setError('')
      const res = await apiFetch('/profiles/me')
      const json = await res.json()
      if (!res.ok || json?.ok === false) {
        setError(json?.error?.message || 'Failed to load profile')
        return
      }
      if (json?.data?.profile) {
        const p = json.data.profile
        setForm({
          name: p.name || '',
          headline: p.headline || '',
          bio: p.bio || '',
          skills: p.skills || [],
          interests: p.interests || [],
          goals: p.goals || [],
          location: p.location || '',
          availability: p.availability || '',
          visibility: p.visibility || 'public'
        })
        setSkillsText((p.skills || []).join(', '))
        setInterestsText((p.interests || []).join(', '))
        setGoalsText((p.goals || []).join(', '))
      }
    }
    load()
  }, [])

  async function save() {
    setError('')
    setMessage('')
    const payload: UpsertProfileRequest = {
      ...form,
      skills: toList(skillsText),
      interests: toList(interestsText),
      goals: toList(goalsText)
    }
    const paiToken = getPaiToken()
    const res = await apiFetch('/profiles/me', {
      method: 'PUT',
      body: JSON.stringify(payload),
      headers: paiToken ? { 'x-pai-token': paiToken } : undefined
    })
    const json = await res.json()
    if (!res.ok || json?.ok === false) {
      setError(json?.error?.message || 'Failed to save profile')
      return
    }
    if (json?.data?.profile) {
      setMessage('Saved')
    }
  }

  return (
    <section className="section">
      <h2 className="section-title">Profile</h2>
      <p className="section-subtitle">Define your intent, expertise, and availability.</p>
      <div className="card" style={{ maxWidth: 720 }}>
        {error ? <div style={{ color: '#f87171', marginBottom: 12 }}>{error}</div> : null}
        {message ? <div style={{ color: '#a3e635', marginBottom: 12 }}>{message}</div> : null}
        <div className="form-grid">
          <input className="input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Name" />
          <input className="input" value={form.headline || ''} onChange={(e) => setForm({ ...form, headline: e.target.value })} placeholder="Headline" />
          <textarea className="input" rows={4} value={form.bio || ''} onChange={(e) => setForm({ ...form, bio: e.target.value })} placeholder="Bio" />
          <input className="input" value={skillsText} onChange={(e) => setSkillsText(e.target.value)} placeholder="Skills (example: Product, Growth, Fundraising — separate by commas)" />
          <input className="input" value={interestsText} onChange={(e) => setInterestsText(e.target.value)} placeholder="Interests (example: AI safety, fintech, climate — separate by commas)" />
          <input className="input" value={goalsText} onChange={(e) => setGoalsText(e.target.value)} placeholder="Goals (example: Raise seed, Find advisor, Hire team — separate by commas)" />
          <input className="input" value={form.location || ''} onChange={(e) => setForm({ ...form, location: e.target.value })} placeholder="Location" />
          <button className="button" onClick={save}>Save</button>
          <Link href="/change-password" className="button secondary">Change password</Link>
        </div>
      </div>
    </section>
  )
}
