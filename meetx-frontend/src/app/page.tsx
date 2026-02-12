import Link from 'next/link'
import Icon from '../components/Icon'
import LogoMark from '../components/LogoMark'

export default function HomePage() {
  return (
    <div>
      <section className="hero reveal">
        <div>
          <span className="pill">Intent. Trust. Momentum.</span>
          <h1 className="hero-title">MEETX powers decisive, explainable connections.</h1>
          <p className="hero-subtitle">
            A premium, AI-native meeting and matching platform that prioritizes intent and outcomes over vanity metrics.
          </p>
          <div className="hero-actions">
            <Link href="/register" className="button">Build your profile</Link>
            <Link href="/feed" className="button secondary">Explore the feed</Link>
          </div>
          <div className="stat-grid">
            <div className="stat">
              <div className="stat-label">Intent-First</div>
              <div className="stat-value">Match by purpose, not noise</div>
            </div>
            <div className="stat">
              <div className="stat-label">Explainable</div>
              <div className="stat-value">Clear reasoning behind every match</div>
            </div>
            <div className="stat">
              <div className="stat-label">Enterprise-Grade</div>
              <div className="stat-value">Privacy and control by design</div>
            </div>
          </div>
        </div>
        <div className="card glow hero-panel">
          <div className="hero-panel-header">
            <LogoMark size={56} />
            <div>
              <div className="muted">Match Intelligence</div>
              <div style={{ fontSize: 18, fontWeight: 600 }}>Signal Brief</div>
            </div>
          </div>
          <p className="muted">A focused summary of why this connection matters now.</p>
          <div className="grid">
            <div className="card" style={{ background: 'rgba(13, 16, 21, 0.7)' }}>
              <strong>Founder ? Investor</strong>
              <div className="muted">Aligned on fintech regulation and go-to-market timing.</div>
            </div>
            <div className="card" style={{ background: 'rgba(13, 16, 21, 0.7)' }}>
              <strong>Operator ? Advisor</strong>
              <div className="muted">Shared expansion targets across APAC in Q2.</div>
            </div>
          </div>
        </div>
      </section>

      <section className="section reveal">
        <h2 className="section-title">Built for high-signal collaboration</h2>
        <p className="section-subtitle">
          MEETX orchestrates discovery, matching, and meeting workflows with precision and trust.
        </p>
        <div className="grid two">
          <div className="card feature-card">
            <Icon name="spark" className="feature-icon" />
            <h3>Personal AI Stewardship</h3>
            <p className="muted">Your private AI refines profiles, prepares outreach, and protects preferences.</p>
          </div>
          <div className="card feature-card">
            <Icon name="pulse" className="feature-icon" />
            <h3>Decision-Grade Matching</h3>
            <p className="muted">Balanced scoring across intent, capability, timing, and availability.</p>
          </div>
          <div className="card feature-card">
            <Icon name="compass" className="feature-icon" />
            <h3>Meeting Intelligence</h3>
            <p className="muted">Agendas, summaries, and follow-through ? every meeting accounted for.</p>
          </div>
          <div className="card feature-card">
            <Icon name="shield" className="feature-icon" />
            <h3>Enterprise Controls</h3>
            <p className="muted">Role-based visibility, auditability, and compliance-friendly defaults.</p>
          </div>
        </div>
      </section>

      <section className="section reveal">
        <div className="section-header">
          <h2 className="section-title">Proof that precision compounds</h2>
          <p className="section-subtitle">Every connection is intentional, measurable, and optimized over time.</p>
        </div>
        <div className="grid two">
          <div className="card">
            <div className="metric">92%</div>
            <div className="muted">Matches that progress to a meeting within 7 days.</div>
          </div>
          <div className="card">
            <div className="metric">3.4x</div>
            <div className="muted">Faster decision cycles compared to standard networking tools.</div>
          </div>
          <div className="card">
            <div className="metric">85%</div>
            <div className="muted">Users reporting ?highly relevant? introductions.</div>
          </div>
          <div className="card">
            <div className="metric">24</div>
            <div className="muted">Global hubs orchestrated with time-zone intelligence.</div>
          </div>
        </div>
      </section>

      <section className="section reveal">
        <h2 className="section-title">How MEETX works</h2>
        <p className="section-subtitle">A refined system of intent, identity, and action.</p>
        <div className="grid two">
          <div className="card timeline">
            <span className="pill">Step 01</span>
            <h3>Define intent</h3>
            <p className="muted">Set your goals, availability, and signals that matter.</p>
          </div>
          <div className="card timeline">
            <span className="pill">Step 02</span>
            <h3>AI curation</h3>
            <p className="muted">Personal AI aligns you with exact-fit opportunities.</p>
          </div>
          <div className="card timeline">
            <span className="pill">Step 03</span>
            <h3>Act fast</h3>
            <p className="muted">Schedule meetings, review briefs, and move with clarity.</p>
          </div>
          <div className="card timeline">
            <span className="pill">Step 04</span>
            <h3>Compound value</h3>
            <p className="muted">MEETX improves every future match based on outcomes.</p>
          </div>
        </div>
      </section>

      <section className="section reveal">
        <h2 className="section-title">Trusted by operators and investors</h2>
        <p className="section-subtitle">Premium networks that demand clarity and results.</p>
        <div className="logo-grid">
          {['AURORA CAPITAL', 'VERTEX LABS', 'IONIC VENTURES', 'NOVA STUDIO', 'SUMMIT PARTNERS', 'LUMINA GROUP'].map((name) => (
            <div className="logo-tile" key={name}>{name}</div>
          ))}
        </div>
      </section>

      <section className="section reveal">
        <h2 className="section-title">Testimonials</h2>
        <p className="section-subtitle">How leaders describe MEETX in the field.</p>
        <div className="grid two">
          <div className="card">
            <p>?MEETX replaced a dozen outreach tools. The clarity of why a match exists is unmatched.?</p>
            <div className="muted">? Chief of Staff, Fintech Series B</div>
          </div>
          <div className="card">
            <p>?The AI briefing layer turns introductions into decisive meetings.?</p>
            <div className="muted">? Partner, Global Venture Fund</div>
          </div>
          <div className="card">
            <p>?Every introduction feels intentional. It?s the network effect we were missing.?</p>
            <div className="muted">? Founder, Climate SaaS</div>
          </div>
          <div className="card">
            <p>?MEETX keeps our team aligned on relationship priorities.?</p>
            <div className="muted">? Head of Partnerships, Enterprise AI</div>
          </div>
        </div>
      </section>

      <section className="section reveal">
        <div className="card glow cta">
          <h2 className="section-title">Move faster with MEETX</h2>
          <p className="section-subtitle">Launch your premium profile and start matching today.</p>
          <div className="hero-actions">
            <Link href="/register" className="button">Request access</Link>
            <Link href="/feed" className="button secondary">View live feed</Link>
          </div>
        </div>
      </section>
    </div>
  )
}
