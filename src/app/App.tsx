import { RouterProvider } from 'react-router-dom'
import { Toaster } from '@/components/ui/sonner'
import { AppProviders } from './providers/AppProviders'
import { router } from './router'

export default function App() {
	return (
		<AppProviders>
			<RouterProvider router={router} />
			<Toaster />
		</AppProviders>
	)
}
