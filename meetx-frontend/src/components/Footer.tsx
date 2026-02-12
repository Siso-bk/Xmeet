import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="footer">
      <div>
        <div className="footer-brand">MEETX</div>
        <div className="muted">Personal AI driven human connection OS.</div>
      </div>
      <div className="footer-links">
        <Link href="/feed">Feed</Link>
        <Link href="/matches">Matches</Link>
        <Link href="/profile">Profile</Link>
      </div>
      <div className="footer-links">
        <Link href="/login">Login</Link>
        <Link href="/register">Register</Link>
      </div>
    </footer>
  )
}
