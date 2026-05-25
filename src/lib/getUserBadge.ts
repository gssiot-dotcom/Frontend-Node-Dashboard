import { UserType } from '@/shared/store/auth.store'

export const getUserTypeLabel = (userType?: UserType) => {
	switch (userType) {
		case 'admin':
			return 'Admin'

		case 'manager':
			return 'Manager'

		case 'worker':
			return 'Worker'

		default:
			return 'User'
	}
}

export const getUserTypeClassName = (userType?: UserType) => {
	switch (userType) {
		case 'admin':
			return 'bg-primary/10 text-primary border-primary/20'

		case 'manager':
			return 'bg-gss-safe/10 text-gss-safe border-gss-safe/20'

		case 'worker':
			return 'bg-muted text-muted-foreground border-border'

		default:
			return 'bg-muted text-muted-foreground border-border'
	}
}
