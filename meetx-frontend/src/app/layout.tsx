import './globals.css'
import { Bodoni_Moda, Sora } from 'next/font/google'
import Nav from '../components/Nav'
import Footer from '../components/Footer'
import PageTransition from '../components/PageTransition'

const sora = Sora({ subsets: ['latin'], variable: '--font-body', display: 'swap' })
const bodoni = Bodoni_Moda({ subsets: ['latin'], variable: '--font-display', display: 'swap' })

export const metadata = {
  title: 'MEETX',
  description: 'Personal AI driven human connection operating system',
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/favicon.svg', type: 'image/svg+xml' }
    ],
    apple: '/apple-touch-icon.png'
  },
  manifest: '/site.webmanifest'
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${sora.variable} ${bodoni.variable}`}>
      <body>
        <div className="page">
          <Nav />
          <main>
            <PageTransition>{children}</PageTransition>
          </main>
          <Footer />
        </div>
      </body>
    </html>
  )
}
