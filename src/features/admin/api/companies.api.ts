import { request } from '@/shared/api/httpClient'
import { ApiResponse } from '@/shared/api/types'
import { Building } from '../types/building.types'
import type {
	Company,
	CompanyMember,
	CreateCompanyDto,
	CreateCompanyMemberUserPayload,
	GetAssetUploadUrlParams,
	GetAssetUploadUrlResponse,
	RemoveAssetParams,
	SaveAssetParams,
	UpdateCompanyDto,
	UpdateCompanyMemberStatusesPayload,
	UpdateCompanyMemberStatusesResponse,
} from '../types/company.types'

export const companiesApi = {
	getById: async (companyId: string) => {
		const response = await request.get<Company>(`/admin/companies/${companyId}`)
		return response.data
	},

	create: async (data: CreateCompanyDto) => {
		const response = await request.post<Company>('/companies', data)
		return response.data
	},

	update: async (companyId: string, data: UpdateCompanyDto) => {
		const response = await request.patch<Company>(
			`/admin/companies/${companyId}`,
			data,
		)
		return response.data
	},

	delete: async (companyId: string) => {
		await request.delete(`/companies/${companyId}`)
	},

	getCompanyMembersApi: async (companyId: string) => {
		const response = await request.get<ApiResponse<CompanyMember[]>>(
			`/admin/companies/${companyId}/members`,
		)

		return response.data.data
	},

	createCompanyMemberUserApi: async (
		companyId: string,
		payload: CreateCompanyMemberUserPayload,
	) => {
		const response = await request.post<ApiResponse<CompanyMember>>(
			`/admin/companies/${companyId}/members`,
			payload,
		)

		return response.data.data
	},

	updateCompanyMemberStatusesApi: async (
		companyId: string,
		payload: UpdateCompanyMemberStatusesPayload,
	) => {
		const response = await request.patch<
			ApiResponse<UpdateCompanyMemberStatusesResponse>
		>(`/admin/companies/${companyId}/members/statuses`, payload)

		return response.data
	},

	// ============= Assets on AWS S3 ================== //

	getAssetUploadUrl: async ({
		kind,
		companyId,
		buildingId,
		fileName,
		contentType,
	}: GetAssetUploadUrlParams) => {
		const response = await request.post<GetAssetUploadUrlResponse>(
			'/assets/company/upload-url',
			{
				kind,
				companyId,
				buildingId,
				fileName,
				contentType,
			},
		)

		return response.data
	},

	uploadFileToS3: async ({
		uploadUrl,
		file,
	}: {
		uploadUrl: string
		file: File
	}) => {
		const response = await fetch(uploadUrl, {
			method: 'PUT',
			headers: {
				'Content-Type': file.type,
			},
			body: file,
		})

		if (!response.ok) {
			throw new Error('Failed to upload file to S3')
		}
	},

	saveAsset: async ({ kind, companyId, buildingId, key }: SaveAssetParams) => {
		const response = await request.post<Company | Building>(
			'/assets/company/save',
			{
				kind,
				companyId,
				buildingId,
				key,
			},
		)

		return response.data
	},

	removeAsset: async ({
		kind,
		companyId,
		buildingId,
		key,
		deleteFromS3 = false,
	}: RemoveAssetParams) => {
		const response = await request.post<Company | Building>(
			'/assets/company/remove',
			{
				kind,
				companyId,
				buildingId,
				key,
				deleteFromS3,
			},
		)

		return response.data
	},
}
