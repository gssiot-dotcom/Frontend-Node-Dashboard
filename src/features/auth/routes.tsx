import PublicOnlyRoute from '@/components/PublicOnlyRoute'
import Login from './pages/Login'
import Register from './pages/Register'

export const authRoutes = [
	{
		element: <PublicOnlyRoute />,
		children: [
			{
				path: '/register',
				element: <Register />,
			},
			{
				path: '/login',
				element: <Login />,
			},
		],
	},
]
