import React, { useContext } from 'react'

export enum Theme {
    dark = 'theme-dark',
    light = 'theme-light',
}

export interface ThemeContextType {
    theme: Theme
    setTheme: (theme: Theme) => void
}

export const ThemeContext = React.createContext<ThemeContextType>({
    theme: Theme.dark,
    setTheme: () => {},
})
