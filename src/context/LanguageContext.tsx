import i18n from '@/i18n'
import { createContext, useContext, useState } from 'react'

// type Language = 'en' | 'ko'

// type LanguageContextType = {
//   language: Language
//   setLanguage: (lang: Language) => void
//   toggle: () => void
// }

const LanguageContext = createContext(null)

export function LanguageProvider({ children }) {
	const [language, setLang] = useState(() => localStorage.getItem('language'))

	const setLanguage = lang => {
		setLang(lang)
		i18n.changeLanguage(lang)
		localStorage.setItem('language', lang)
	}

	const toggle = () => setLanguage(language === 'en' ? 'ko' : 'en')

	return (
		<LanguageContext.Provider value={{ language, setLanguage, toggle }}>
			{children}
		</LanguageContext.Provider>
	)
}

export function useLanguage() {
	const ctx = useContext(LanguageContext)
	if (!ctx) throw new Error('useLanguage must be used inside LanguageProvider')
	return ctx
}
