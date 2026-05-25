import { useTheme } from '@/hooks/useTheme'
import { createContext, useContext } from 'react'

// type ThemeContextType = {
//   theme: 'light' | 'dark'
//   toggle: () => void
//   setTheme: (theme: 'light' | 'dark') => void
// }

const ThemeContext = createContext()

export function ThemeProvider({ children }) {
	const themeValue = useTheme()
	return (
		<ThemeContext.Provider value={themeValue}>{children}</ThemeContext.Provider>
	)
}

export function useThemeContext() {
	const ctx = useContext(ThemeContext)
	if (!ctx) throw new Error('useThemeContext must be used inside ThemeProvider')
	return ctx
}
