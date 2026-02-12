'use client'

import { useEffect, useState } from 'react'
import { apiFetch } from '../../lib/api'
import type { MatchSummary } from '@meetx/shared'
import Link from 'next/link'

export default function MatchesPage() {
  const [items, setItems] = useState<MatchSummary[]>([])
  const [error, setError] = useState('')

  useEffect(() => {
    async function load() {
      setError('')
      const res = await apiFetch('/matches')
      const json = await res.json()
      if (!res.ok || json?.ok === false) {
        setError(json?.error?.message || 'Failed to load matches')
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
      <h2 className="section-title">Your Matches</h2>
      <p className="section-subtitle">High-confidence connections curated for action.</p>
      {error ? <div className="card" style={{ borderColor: '#f87171', color: '#f87171' }}>{error}</div> : null}
      <div className="grid two">
        {items.map((m) => (
          <div className="card" key={m.id}>
            <div className="muted">Match</div>
            <div style={{ margin: '8px 0 14px' }}>{m.userIds.join(', ')}</div>
            <Link href={`/messages/${m.id}`} className="button secondary">Open messages</Link>
          </div>
        ))}
      </div>
    </section>
  )
}
