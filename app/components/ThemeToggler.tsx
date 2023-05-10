import React, { useContext } from 'react'
import { ThemeContext, Theme } from '../store/themeContext'
import { motion } from 'framer-motion'

const ThemeToggler = () => {
    const { theme, setTheme } = useContext(ThemeContext)
    const handleToggleTheme = () => {
        setTheme(theme === Theme.light ? Theme.dark : Theme.light)
    }

    return (
        <button onClick={handleToggleTheme}>
            <motion.img
                whileHover={{ scale: 1.1 }}
                whileTap={{ rotate: 360, scale: 0.9 }}
                src={`${
                    theme === Theme.light
                        ? ' /images/icon-sun.svg'
                        : ' /images/icon-moon.svg'
                } `}
                alt={`${theme === Theme.light ? 'icon-sun' : 'icon-moon'}`}
            />
        </button>
    )
}

export default ThemeToggler
