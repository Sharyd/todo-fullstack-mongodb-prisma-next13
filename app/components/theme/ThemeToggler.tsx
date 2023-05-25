'use client'
import React, { useContext } from 'react'
import { ThemeContext, Theme } from '../../store/themeContext'
import { motion } from 'framer-motion'

interface Props {
    className?: string
}

const ThemeToggler = ({ className }: Props) => {
    const { theme, setTheme } = useContext(ThemeContext)
    const handleToggleTheme = () => {
        setTheme(theme === Theme.light ? Theme.dark : Theme.light)
    }

    return (
        <button type="button" onClick={handleToggleTheme}>
            <motion.img
                whileHover={{ scale: 1.1 }}
                whileTap={{ rotate: 360, scale: 0.9 }}
                src={`${
                    theme === Theme.dark
                        ? ' /images/icon-sun.svg'
                        : ' /images/icon-moon.svg'
                } `}
                alt={`${theme === Theme.light ? 'icon-sun' : 'icon-moon'}`}
                className={className}
            />
        </button>
    )
}

export default ThemeToggler
