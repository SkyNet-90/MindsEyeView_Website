import type { Metadata } from 'next'
import { Inter, Montserrat } from 'next/font/google'
import './globals.css'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const montserrat = Montserrat({ 
  subsets: ['latin'],
  variable: '--font-montserrat',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: "Mind's Eye View - High Energy Classic Rock Band",
    template: "%s | Mind's Eye View"
  },
  description: "Mind's Eye View is a six-piece high energy classic rock band playing music from the 60's through the 2000's. Perfect for bars, weddings, corporate events, and private parties in the tri-state area.",
  keywords: ['classic rock band', 'live music', 'wedding band', 'corporate events', 'private parties', 'tri-state area', 'Minds Eye View', 'acoustic band'],
  authors: [{ name: "Mind's Eye View" }],
  openGraph: {
    title: "Mind's Eye View - High Energy Classic Rock Band",
    description: "Six-piece high energy classic rock band playing music from the 60's through the 2000's",
    url: process.env.NEXT_PUBLIC_SITE_URL,
    siteName: "Mind's Eye View",
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Mind's Eye View - High Energy Classic Rock Band",
    description: "Six-piece high energy classic rock band playing music from the 60's through the 2000's",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: '',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} ${montserrat.variable}`}>
      <body className="font-sans antialiased">
        <Header />
        <main className="min-h-screen">
          {children}
        </main>
        <Footer />
        <ToastContainer
          position="bottom-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="dark"
        />
      </body>
    </html>
  )
}
