// import { api } from '@/shared/api/httpClient'
// import { createContext, useContext, useEffect, useState } from 'react'

// const AuthContext = createContext(null)

// export const AuthProvider = ({ children }) => {
// 	const [user, setUser] = useState(null)
// 	const [isAuthenticated, setIsAuthenticated] = useState(false)
// 	const [isLoadingAuth, setIsLoadingAuth] = useState(true)
// 	const [authError, setAuthError] = useState(null)

// 	useEffect(() => {
// 		checkUserAuth()
// 	}, [])

// 	const checkUserAuth = async () => {
// 		try {
// 			setIsLoadingAuth(true)
// 			setAuthError(null)

// 			const token = localStorage.getItem('access_token')

// 			if (!token) {
// 				setUser(null)
// 				setIsAuthenticated(false)
// 				setIsLoadingAuth(false)
// 				return
// 			}

// 			const res = await api.get('/auth/me')
// 			setUser(res.data)
// 			setIsAuthenticated(true)
// 		} catch (error) {
// 			console.error('User auth check failed:', error)
// 			setUser(null)
// 			setIsAuthenticated(false)
// 			localStorage.removeItem('access_token')

// 			setAuthError({
// 				type: 'auth_required',
// 				message: error?.response?.data?.message || 'Authentication required',
// 			})
// 		} finally {
// 			setIsLoadingAuth(false)
// 		}
// 	}

// 	const login = async payload => {
// 		try {
// 			setAuthError(null)

// 			const res = await api.post('/auth/login', payload)
// 			const { user, token } = res.data

// 			localStorage.setItem('access_token', token)
// 			setUser(user)
// 			setIsAuthenticated(true)

// 			return res.data
// 		} catch (error) {
// 			setAuthError({
// 				type: 'login_failed',
// 				message: error?.response?.data?.message || 'Login failed',
// 			})
// 			throw error
// 		}
// 	}

// 	const register = async payload => {
// 		try {
// 			const res = await api.post('/auth/register', payload)
// 			return res.data
// 		} catch (error) {
// 			throw error
// 		}
// 	}

// 	const logout = async () => {
// 		try {
// 			await api.post('/auth/logout')
// 		} catch (error) {
// 			console.error('Logout request failed:', error)
// 		} finally {
// 			localStorage.removeItem('access_token')
// 			setUser(null)
// 			setIsAuthenticated(false)
// 			window.location.href = '/login'
// 		}
// 	}

// 	const navigateToLogin = () => {
// 		window.location.href = '/login'
// 	}

// 	return (
// 		<AuthContext.Provider
// 			value={{
// 				user,
// 				isAuthenticated,
// 				isLoadingAuth,
// 				authError,
// 				login,
// 				register,
// 				logout,
// 				navigateToLogin,
// 				checkUserAuth,
// 			}}
// 		>
// 			{children}
// 		</AuthContext.Provider>
// 	)
// }

// export const useAuth = () => {
// 	const context = useContext(AuthContext)
// 	if (!context) {
// 		throw new Error('useAuth must be used within an AuthProvider')
// 	}
// 	return context
// }
