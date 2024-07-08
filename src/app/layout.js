import { Inter } from 'next/font/google'
import './globals.css'
import { ToastContainer } from 'react-toastify'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'A.D Toyama Digital',
  description: 'Sistem for A.D Toyama Digital',
}
export default function RootLayout({ children }) {  
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        {children}
        <ToastContainer/>
        </body>
    </html>
  )
}
