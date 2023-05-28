import React from 'react'

interface Props {
    children: React.ReactNode | JSX.Element
}

export const Notification = ({ children }: Props) => {
    return (
        <div className="absolute w-full flex z-50 items-center justify-center h-24 hover:animate-none bg-mainBackground ">
            {children}
        </div>
    )
}
