
import './globals.css'
import Navbar from './_components/Navbar'
import AppToastProvider from './_components/AppToastProvider'

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`antialiased`}>
        <Navbar />
        <AppToastProvider />
        {children}
      </body>
    </html>
  )
}



