'use client'
import React from 'react'

type Props = {
    children: React.ReactNode
}
const Container = ({ children }: Props) => {
    return (
        <div className="flex flex-col items-center justify-center">
            {children}
        </div>
    )
}

export default Container
