export const getDashboardPath = (userType?: string) => {
	switch (userType) {
		case 'admin':
			return '/admin/dashboard'

		case 'manager':
			return '/manager/dashboard'

		case 'worker':
			return '/worker/dashboard/buildings'

		case 'user':
			return '/dashboard'

		default:
			return '/'
	}
}
