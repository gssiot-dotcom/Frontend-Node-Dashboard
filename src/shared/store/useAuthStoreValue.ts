import { useAuthStore } from '@/shared/store/auth.store'

export function useAuth() {
	const user = useAuthStore(state => state.user)
	const isAuthenticated = useAuthStore(state => state.isAuthenticated)
	const isAuthInitialized = useAuthStore(state => state.isAuthInitialized)

	return {
		user,
		isAuthenticated,
		isAuthInitialized,
	}
}
