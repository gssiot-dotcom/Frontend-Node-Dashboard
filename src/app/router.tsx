import UnauthorizedPage from '@/components/UnAuthorized'
import { adminRoutes } from '@/features/admin/routes'
import { authRoutes } from '@/features/auth/routes'
import { managerRoutes } from '@/features/manager/routes'
import { workerRoutes } from '@/features/worker/routes'
import Home from '@/pages/Home'
import PageNotFound from '@/shared/lib/PageNotFount'
import RouteErrorBoundary from '@/shared/ui/error/RouteErrorBoundry'

import { createBrowserRouter } from 'react-router-dom'

// demo pages
function CrashTest(): JSX.Element {
	throw new Error('Test error')
}

export const router = createBrowserRouter([
	{
		path: '/',
		errorElement: <RouteErrorBoundary />,
		children: [
			{
				index: true,
				element: <Home />,
			},

			...authRoutes,
			...adminRoutes,
			...managerRoutes,
			...workerRoutes,

			{
				path: 'unauthorized',
				element: <UnauthorizedPage />,
			},
			{
				path: '*',
				element: <PageNotFound />,
			},
			{
				path: '/test-error',
				element: <CrashTest />,
			},
		],
	},
])
