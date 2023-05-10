import React from 'react'

interface Props {
    children: React.ReactNode
}

const Heading = ({ children }: Props) => {
    return (
        <h1 className="text-white text-4xl uppercase font-bold tracking-[0.7rem]">
            {children}
        </h1>
    )
}

export default Heading
