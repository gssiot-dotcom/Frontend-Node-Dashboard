//Login page’ga auth bo‘lgan user kirsa o‘z dashboardiga qaytsin.

import { getDefaultRouteByRole } from '@/features/auth/utils/getDefaultHomePath'
import { useAuth } from '@/shared/store/useAuthStoreValue'

import { Navigate, Outlet } from 'react-router-dom'

export default function PublicOnlyRoute() {
	const { user, isAuthInitialized } = useAuth()

	if (!isAuthInitialized) {
		return <div>Loading...</div>
	}

	if (user) {
		return <Navigate to={getDefaultRouteByRole(user.userType)} replace />
	}

	return <Outlet />
}
