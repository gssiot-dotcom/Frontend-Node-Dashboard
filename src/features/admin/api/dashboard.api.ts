import { request } from '@/shared/api/httpClient'
import { ApiResponse } from '@/shared/api/types'
import type {
	AdminDashboardParams,
	AdminDashboardResult,
} from '../types/dashboard.types'

function unwrapResponse<T>(body: ApiResponse<T> | T): T {
	if (
		body &&
		typeof body === 'object' &&
		!Array.isArray(body) &&
		'state' in body &&
		'data' in body
	) {
		const apiBody = body as ApiResponse<T>

		if (apiBody.state !== 'success') {
			throw new Error(apiBody.message || 'Request failed')
		}

		return apiBody.data
	}

	return body as T
}

export const adminDashboardApi = {
	getAdminDashboard: async (params?: AdminDashboardParams) => {
		const response = await request.get<
			ApiResponse<AdminDashboardResult> | AdminDashboardResult
		>('/admin/dashboard', {
			params,
		})

		return unwrapResponse<AdminDashboardResult>(response.data)
	},
}
