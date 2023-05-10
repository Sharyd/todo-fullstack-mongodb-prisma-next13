'use client'

import { useEffect } from 'react'

interface ErrorStateProps {
    error: Error
}

const ErrorState: React.FC<ErrorStateProps> = ({ error }) => {
    useEffect(() => {
        console.error(error)
    }, [error])

    return <div>Something went wrong</div>
}

export default ErrorState
