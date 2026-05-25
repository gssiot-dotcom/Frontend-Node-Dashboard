import { useAuthStore } from '@/shared/store/auth.store'
import { queryKeys } from '@/shared/utils/queryKeys'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { authApi } from '../api/auth.api'
import type { AuthUser, LoginDto, SignupDto } from '../types/auth.types'

export function useMe() {
	return useQuery<AuthUser, Error>({
		queryKey: queryKeys.auth.me,
		queryFn: authApi.me,
		retry: false,
		refetchOnWindowFocus: false,
	})
}

export function useSignup() {
	const queryClient = useQueryClient()
	const setUser = useAuthStore(state => state.setUser)

	return useMutation({
		mutationFn: (payload: SignupDto) => authApi.signup(payload),

		onSuccess: response => {
			setUser(response.data.user)

			queryClient.setQueryData(queryKeys.auth.me, response.data.user)
		},
	})
}

export function useLogin() {
	const queryClient = useQueryClient()
	const setUser = useAuthStore(state => state.setUser)

	return useMutation({
		mutationFn: (payload: LoginDto) => authApi.login(payload),

		onSuccess: response => {
			setUser(response.data.user)

			queryClient.setQueryData(queryKeys.auth.me, response.data.user)
		},
	})
}

export function useLogout() {
	const queryClient = useQueryClient()
	const clearAuth = useAuthStore(state => state.clearAuth)

	return useMutation({
		mutationFn: authApi.logout,

		onSettled: () => {
			clearAuth()
			queryClient.clear()
		},
	})
}
