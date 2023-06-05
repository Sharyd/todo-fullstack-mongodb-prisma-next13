'use client'
import React, { useContext } from 'react'
import { ThemeContext } from '../../store/themeContext'

interface Props {
    children: React.ReactNode
}

const Theme = ({ children }: Props) => {
    const { theme } = useContext(ThemeContext)
    return <div className={`${theme}`}>{children}</div>
}

export default Theme
