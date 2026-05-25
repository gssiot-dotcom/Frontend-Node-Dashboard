import { AuthUser } from '@/features/auth/types/auth.types'
import { create } from 'zustand'

export type UserType = 'admin' | 'manager' | 'worker'

type AuthState = {
	user: AuthUser | null
	isAuthenticated: boolean
	isAuthInitialized: boolean

	setUser: (user: AuthUser | null) => void
	setAuthInitialized: (value: boolean) => void
	clearAuth: () => void
}

export const useAuthStore = create<AuthState>(set => ({
	user: null,
	isAuthenticated: false,
	isAuthInitialized: false,

	setUser: user => {
		set({
			user,
			isAuthenticated: Boolean(user),
		})
	},

	setAuthInitialized: value => {
		set({
			isAuthInitialized: value,
		})
	},

	clearAuth: () => {
		set({
			user: null,
			isAuthenticated: false,
		})
	},
}))
