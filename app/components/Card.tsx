'use client'
import React from 'react'

type Props = {
    children: React.ReactNode
}
const Card = ({ children }: Props) => {
    return (
        <div className="rounded-md overflow-y-auto shadow-customBoxShadow py-0.5 bg-secondaryBackground w-full h-full">
            {children}
        </div>
    )
}

export default Card
