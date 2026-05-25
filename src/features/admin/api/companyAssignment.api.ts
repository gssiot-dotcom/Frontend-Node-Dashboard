import { request } from '@/shared/api/httpClient'
import { ApiResponse } from '@/shared/api/types'
import type {
	CompanyAssignmentsParams,
	CompanyAssignmentsResult,
	UpdateCompanyGatewaysDto,
	UpdateCompanyNodesDto,
} from '../types/companyAssignment.types'

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

export const companyAssignmentApi = {
	getCompanyAssignments: async (params?: CompanyAssignmentsParams) => {
		const response = await request.get<
			ApiResponse<CompanyAssignmentsResult> | CompanyAssignmentsResult
		>('/admin/company-assignments', {
			params,
		})

		return unwrapResponse<CompanyAssignmentsResult>(response.data)
	},

	updateCompanyGateways: async (
		companyId: string,
		data: UpdateCompanyGatewaysDto,
	) => {
		const response = await request.put<
			| ApiResponse<{ companyId: string; gatewayIds: string[] }>
			| {
					companyId: string
					gatewayIds: string[]
			  }
		>(`/admin/companies/${companyId}/gateways`, data)

		return unwrapResponse<{ companyId: string; gatewayIds: string[] }>(
			response.data,
		)
	},

	updateCompanyNodes: async (
		companyId: string,
		data: UpdateCompanyNodesDto,
	) => {
		const response = await request.put<
			| ApiResponse<{ companyId: string; nodeIds: string[] }>
			| {
					companyId: string
					nodeIds: string[]
			  }
		>(`/admin/companies/${companyId}/nodes`, data)

		return unwrapResponse<{ companyId: string; nodeIds: string[] }>(
			response.data,
		)
	},
}
