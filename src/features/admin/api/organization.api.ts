import { request } from '@/shared/api/httpClient'
import type {
	ApiResponse,
	OrganizationBuilding,
	OrganizationCompany,
	OrganizationGateway,
	OrganizationUserListItem,
	PaginatedData,
	PaginationParams,
} from '../types/organization.types'

function unwrapResponse<T>(body: ApiResponse<T>): T {
	if (!body || typeof body !== 'object') {
		throw new Error('Invalid server response')
	}

	if (body.state !== 'success') {
		throw new Error(body.message || 'Request failed')
	}

	return body.data
}

export const organizationApi = {
	getCompanies: async (params?: PaginationParams) => {
		const response = await request.get<
			ApiResponse<PaginatedData<OrganizationCompany>>
		>('/admin/organization-page/companies', {
			params,
		})

		return unwrapResponse(response.data)
	},

	getBuildings: async (params?: PaginationParams) => {
		const response = await request.get<
			ApiResponse<PaginatedData<OrganizationBuilding>>
		>('/admin/organization-page/buildings', {
			params,
		})

		return unwrapResponse(response.data)
	},

	getUsers: async (params?: PaginationParams) => {
		const response = await request.get<
			ApiResponse<PaginatedData<OrganizationUserListItem>>
		>('/admin/organization-page/users', {
			params,
		})

		return unwrapResponse(response.data)
	},

	getCompanyBuildings: async (companyId: string) => {
		const response = await request.get<ApiResponse<OrganizationBuilding[]>>(
			`/admin/organization-page/companies/${companyId}/buildings`,
		)

		return unwrapResponse(response.data)
	},

	getBuildingGateways: async (buildingId: string) => {
		const response = await request.get<ApiResponse<OrganizationGateway[]>>(
			`/admin/organization-page/buildings/${buildingId}/gateways`,
		)

		return unwrapResponse(response.data)
	},

	getUserCompanies: async (userId: string) => {
		const response = await request.get<ApiResponse<OrganizationCompany[]>>(
			`/admin/organization-page/users/${userId}/companies`,
		)

		return unwrapResponse(response.data)
	},
}
