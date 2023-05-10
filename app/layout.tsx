'use client'
import './globals.css'
import { Josefin_Sans } from 'next/font/google'
import { ThemeProvider } from './store/themeContextProvider'
import { TodoProvider } from './store/todoContextProvider'
import Theme from './components/Theme'
import { QueryClient, QueryClientProvider } from 'react-query'
import { Toaster } from 'react-hot-toast'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
const JosefinSans = Josefin_Sans({ subsets: ['latin'] })

export const metadata = {
    title: 'Create Next App',
    description: 'Generated by create next app',
}

const queryClient = new QueryClient()

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en">
            <QueryClientProvider client={queryClient}>
                <ThemeProvider>
                    <DndProvider backend={HTML5Backend}>
                        <TodoProvider>
                            <body className={`${JosefinSans.className}`}>
                                <Theme>
                                    {children}
                                    <Toaster />
                                </Theme>
                            </body>
                        </TodoProvider>
                    </DndProvider>
                </ThemeProvider>
            </QueryClientProvider>
        </html>
    )
}
