'use client'

import { ReactNode, useEffect, useState } from 'react'
import { SessionProvider } from 'next-auth/react'

interface Props {
    children: ReactNode
    className?: string
}

export default function Hydrate({ children, className }: Props) {
    const [isHydrated, setIsHydrated] = useState(false)

    //Wait till Nextjs rehydration completes
    useEffect(() => {
        setIsHydrated(true)
    }, [])
    return (
        <SessionProvider>
            {isHydrated ? (
                <body className={className}>{children}</body>
            ) : (
                <body></body>
            )}
        </SessionProvider>
    )
}
