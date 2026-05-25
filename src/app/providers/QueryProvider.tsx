import { queryClient } from '@/shared/api/queryClient'
import { QueryClientProvider } from '@tanstack/react-query'

type Props = {
	children: React.ReactNode
}

export function QueryProvider({ children }: Props) {
	return (
		<QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
	)
}
