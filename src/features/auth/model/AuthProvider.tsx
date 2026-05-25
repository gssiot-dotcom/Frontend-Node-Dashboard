// import { AUTH_EXPIRED_EVENT } from '@/shared/api/httpClient'
// import {
// 	createContext,
// 	useCallback,
// 	useEffect,
// 	useMemo,
// 	useState,
// 	type ReactNode,
// } from 'react'
// import { loginApi, logoutApi, meApi } from '../api/auth.api'
// import type {
// 	AuthContextValue,
// 	AuthUser,
// 	LoginPayload,
// } from '../types/auth.types'

// export const AuthContext = createContext<AuthContextValue | undefined>(
// 	undefined,
// )

// type Props = {
// 	children: ReactNode
// }

// export function AuthProvider({ children }: Props) {
// 	const [user, setUser] = useState<AuthUser | null>(null)
// 	const [loading, setLoading] = useState(true)

// 	const refetchMe = useCallback(async (): Promise<AuthUser | null> => {
// 		try {
// 			const currentUser = await meApi()
// 			setUser(currentUser)
// 			return currentUser
// 		} catch {
// 			setUser(null)
// 			return null
// 		}
// 	}, [])

// 	const checkSession = useCallback(async () => {
// 		setLoading(true)
// 		try {
// 			await refetchMe()
// 		} finally {
// 			setLoading(false)
// 		}
// 	}, [refetchMe])

// 	useEffect(() => {
// 		void checkSession()
// 	}, [checkSession])

// 	useEffect(() => {
// 		const handleAuthExpired = () => {
// 			setUser(null)
// 		}

// 		window.addEventListener(AUTH_EXPIRED_EVENT, handleAuthExpired)

// 		return () => {
// 			window.removeEventListener(AUTH_EXPIRED_EVENT, handleAuthExpired)
// 		}
// 	}, [])

// 	const login = useCallback(async (payload: LoginPayload) => {
// 		const currentUser = await loginApi(payload)
// 		setUser(currentUser)
// 		return currentUser
// 	}, [])

// 	const logout = useCallback(async () => {
// 		try {
// 			await logoutApi()
// 		} finally {
// 			setUser(null)
// 		}
// 	}, [])

// 	const value = useMemo<AuthContextValue>(
// 		() => ({
// 			user,
// 			loading,
// 			isAuthenticated: Boolean(user),
// 			login,
// 			logout,
// 			refetchMe,
// 		}),
// 		[user, loading, login, logout, refetchMe],
// 	)

// 	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
// }
