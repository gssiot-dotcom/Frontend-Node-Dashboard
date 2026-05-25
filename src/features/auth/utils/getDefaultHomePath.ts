import type { UserRole } from '../types/auth.types'

export function getDefaultRouteByRole(role: UserRole): string {
	switch (role) {
		case 'ADMIN':
			return '/admin/dashboard'
		case 'MANAGER':
			return '/client/dashboard'
		case 'WORKER':
			return '/worker/dashboard'
		default:
			return '/'
	}
}
