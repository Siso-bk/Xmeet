'use client'

import { useEffect, useState } from 'react'
import { apiFetch } from '../../../lib/api'
import type { Message } from '@meetx/shared'
import { useParams } from 'next/navigation'

export default function MessagesPage() {
  const params = useParams()
  const matchId = String(params.matchId)
  const [items, setItems] = useState<Message[]>([])
  const [content, setContent] = useState('')
  const [error, setError] = useState('')

  async function load() {
    setError('')
    const res = await apiFetch(`/messages/${matchId}`)
    const json = await res.json()
    if (!res.ok || json?.ok === false) {
      setError(json?.error?.message || 'Failed to load messages')
      return
    }
    if (json?.data?.items) {
      setItems(json.data.items)
    }
  }

  useEffect(() => {
    load()
  }, [matchId])

  async function send() {
    setError('')
    const res = await apiFetch('/messages', {
      method: 'POST',
      body: JSON.stringify({ matchId, content })
    })
    const json = await res.json()
    if (!res.ok || json?.ok === false) {
      setError(json?.error?.message || 'Failed to send message')
      return
    }
    setContent('')
    load()
  }

  return (
    <section className="section">
      <h2 className="section-title">Messages</h2>
      <p className="section-subtitle">Keep the momentum with clear, focused exchanges.</p>
      {error ? <div className="card" style={{ borderColor: '#f87171', color: '#f87171' }}>{error}</div> : null}
      <div className="card" style={{ minHeight: 240 }}>
        {items.map((m) => (
          <div key={m.id} className="message" style={{ marginBottom: 12 }}>
            <strong>{m.senderId}</strong>
            <div className="muted">{m.content}</div>
          </div>
        ))}
      </div>
      <div className="card">
        <textarea className="input" rows={3} value={content} onChange={(e) => setContent(e.target.value)} />
        <button className="button" style={{ marginTop: 12 }} onClick={send}>Send</button>
      </div>
    </section>
  )
}
