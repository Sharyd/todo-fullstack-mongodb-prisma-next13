'use client'
import './globals.css'
import { Josefin_Sans } from 'next/font/google'
import { ThemeProvider } from './store/themeContextProvider'
import { TodoProvider } from './store/todoContextProvider'
import Theme from './components/themes/Themes'
import { QueryClient, QueryClientProvider } from 'react-query'
import { Toaster } from 'react-hot-toast'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import GradientImage from './components/ui/GradientImage'
import Hydrate from './components/Hydrate'

const JosefinSans = Josefin_Sans({ subsets: ['latin'] })

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
                            <Hydrate className={`${JosefinSans.className}`}>
                                <Theme>
                                    <main
                                        className={`min-h-screen  text-secondaryText bg-mainBackground `}
                                    >
                                        <GradientImage />

                                        {children}
                                    </main>
                                    <Toaster />
                                </Theme>
                            </Hydrate>
                        </TodoProvider>
                    </DndProvider>
                </ThemeProvider>
            </QueryClientProvider>
        </html>
    )
}
