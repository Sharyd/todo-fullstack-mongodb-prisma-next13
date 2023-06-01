import React from 'react'

interface Props {
    children: React.ReactNode | JSX.Element
}

export const NotificationCard = ({ children }: Props) => {
    return (
        <div className="w-full flex-col flex z-50 items-center justify-center h-max hover:animate-none bg-mainBackground ">
            {children}
        </div>
    )
}
