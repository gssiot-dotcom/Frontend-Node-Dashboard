import { request } from '@/shared/api/httpClient'
import { ApiResponse } from '@/shared/api/types'
import type {
	LoginDto,
	LoginResponse,
	MeResponse,
	SignupDto,
} from '../types/auth.types'

export const authApi = {
	signup: async (data: SignupDto) => {
		const response = await request.post<ApiResponse<LoginResponse>>(
			'/auth/signup',
			data,
		)
		return response.data
	},

	login: async (data: LoginDto) => {
		const response = await request.post<ApiResponse<LoginResponse>>(
			'/auth/login',
			data,
		)
		return response.data
	},

	me: async () => {
		const response = await request.get<ApiResponse<MeResponse>>('/auth/me')
		return response.data.data
	},

	logout: async () => {
		await request.post('/auth/logout')
	},
}
