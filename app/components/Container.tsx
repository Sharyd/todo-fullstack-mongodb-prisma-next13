'use client'
import React from 'react'

type Props = {
    children: React.ReactNode
}
const Container = ({ children }: Props) => {
    return (
        <div className="flex flex-col min-h-screen  items-center justify-center">
            {children}
        </div>
    )
}

export default Container
