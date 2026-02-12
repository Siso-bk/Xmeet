import Link from 'next/link'
import LogoMark from './LogoMark'

export default function Nav() {
  return (
    <nav className="nav">
      <Link href="/" className="brand">
        <LogoMark />
        <div>
          <div className="brand-name">MEETX</div>
          <div className="brand-tag">Personal AI OS</div>
        </div>
      </Link>
      <div className="nav-links">
        <Link className="nav-link" href="/feed">Feed</Link>
        <Link className="nav-link" href="/matches">Matches</Link>
        <Link className="nav-link" href="/profile">Profile</Link>
      </div>
      <div className="nav-actions">
        <Link href="/login" className="button ghost">Login</Link>
        <Link href="/register" className="button">Get Started</Link>
      </div>
    </nav>
  )
}
