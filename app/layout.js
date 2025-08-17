
import { Outfit } from 'next/font/google'
import './globals.css'
import AuthWrapper from './_components/AuthWrapper'

const outfit = Outfit({
  subsets: ['latin']
})

export const metadata = {
  title: 'Agarwal | Home',
  description: 'Agarwal Dashboard'
}

export default function RootLayout ({ children }) {
  return (
    <html lang='en'   data-arp="">
      <body  cz-shortcut-listen="true" className={`${outfit.className} antialiased`}>
        <AuthWrapper>{children}</AuthWrapper>
      </body>
    </html>
  )
}
