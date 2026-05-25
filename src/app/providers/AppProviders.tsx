import { LanguageProvider } from '@/context/LanguageContext'
import { ThemeProvider } from '@/context/ThemeContext'

import type { ReactNode } from 'react'
import { AuthBootstrap } from './AuthBootstrap'
import { QueryProvider } from './QueryProvider'

type Props = {
	children: ReactNode
}

export function AppProviders({ children }: Props) {
	return (
		<ThemeProvider>
			<LanguageProvider>
				<QueryProvider>
					<AuthBootstrap>{children}</AuthBootstrap>
				</QueryProvider>
			</LanguageProvider>
		</ThemeProvider>
	)
}
