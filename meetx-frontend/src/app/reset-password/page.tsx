import { Suspense } from 'react'
import ResetPasswordClient from './ResetPasswordClient'

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="section"><div className="card" style={{ maxWidth: 520, margin: '0 auto' }}>Loading reset form...</div></div>}>
      <ResetPasswordClient />
    </Suspense>
  )
}
