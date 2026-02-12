'use client'

import { useEffect, useState } from 'react'
import { apiFetch } from '../../lib/api'
import type { Profile } from '@meetx/shared'

export default function FeedPage() {
  const [items, setItems] = useState<Profile[]>([])
  const [error, setError] = useState('')

  useEffect(() => {
    async function load() {
      setError('')
      const res = await apiFetch('/feed')
      const json = await res.json()
      if (!res.ok || json?.ok === false) {
        setError(json?.error?.message || 'Failed to load feed')
        return
      }
      if (json?.data?.items) {
        setItems(json.data.items)
      }
    }
    load()
  }, [])

  return (
    <section className="section">
      <h2 className="section-title">Discovery Feed</h2>
      <p className="section-subtitle">Curated by intent, availability, and purpose-driven signals.</p>
      {error ? <div className="card" style={{ borderColor: '#f87171', color: '#f87171' }}>{error}</div> : null}
      <div className="grid two">
        {items.map((p) => (
          <div className="card" key={p.userId}>
            <strong>{p.name}</strong>
            <div className="muted">{p.headline}</div>
            <div style={{ opacity: 0.7 }}>{p.location}</div>
          </div>
        ))}
      </div>
    </section>
  )
}
