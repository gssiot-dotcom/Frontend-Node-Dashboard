import { UserType } from '@/features/auth/types/auth.types'
import { useAuth } from '@/shared/store/useAuthStoreValue'
import { Navigate, Outlet } from 'react-router-dom'

type Props = {
	allowedRoles?: UserType[]
}

export default function ProtectedRoute({ allowedRoles }: Props) {
	const { user, isAuthInitialized } = useAuth()

	if (!isAuthInitialized) {
		return (
			<div className='fixed inset-0 flex items-center justify-center bg-background'>
				<div className='flex flex-col items-center gap-3'>
					<div className='w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin' />
					<span className='text-sm text-muted-foreground'>Loading...</span>
				</div>
			</div>
		)
	}

	if (!user) {
		return <Navigate to='/unauthorized' replace />
	}

	if (allowedRoles && !allowedRoles.includes(user.userType)) {
		return <Navigate to='/unauthorized' replace />
	}

	return <Outlet />
}
