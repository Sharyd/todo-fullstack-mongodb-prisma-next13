import React, { useState } from 'react'
import { Theme, ThemeContext, ThemeContextType } from './themeContext'
import useLocalStorage from '../hooks/useLocalStorage'

interface ThemeProviderProps {
    children: React.ReactNode
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
    const [theme, setTheme] = useLocalStorage<Theme>('theme', Theme.dark)

    const contextValue: ThemeContextType = {
        theme,
        setTheme,
    }

    return (
        <ThemeContext.Provider value={contextValue}>
            {children}
        </ThemeContext.Provider>
    )
}
