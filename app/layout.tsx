import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { ClerkProvider } from '@clerk/nextjs'
import { ModalProvider } from '@/components/modal-provider'
import { ToastProvider } from './../components/toast-provider';
import { CrispProvider } from '@/components/crisp-provider'
import { MantineProvider } from '@mantine/core'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Genius',
  description: 'AI Platform',
}


export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
      <html lang="en">

        <CrispProvider />
        <body className={inter.className}>
          <MantineProvider>
          <ModalProvider />
          <ToastProvider />
          {children}
          </MantineProvider>
          </body>
      </html>
    </ClerkProvider>
  )
}