import type { Metadata } from 'next'
import '@/app/styles/globals.css'
import { Toaster } from '@/components/ui/sonner'
import Providers from './providers'

export const metadata: Metadata = {
    title: 'Gradix',
    description: '_Gradix_',
}

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <html lang="pt-BR">
            <meta
                name="viewport"
                content="width=device-width, initial-scale=1.0"
            />
            <body className="dark bg-background">
                <Providers>{children}</Providers>
                <Toaster />
            </body>
        </html>
    )
}
