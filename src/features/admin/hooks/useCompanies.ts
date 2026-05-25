import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { companiesApi } from '../api/companies.api'
import { Building } from '../types/building.types'
import type {
	AssetKind,
	Company,
	CreateCompanyDto,
	CreateCompanyMemberUserPayload,
	UpdateCompanyDto,
	UpdateCompanyMemberStatusesPayload,
} from '../types/company.types'

export const adminCompanyKeys = {
	all: ['admin', 'companies'] as const,
	detail: (companyId: string) => ['admin', 'companies', companyId] as const,
}

export function useAdminCompany(companyId: string) {
	return useQuery({
		queryKey: adminCompanyKeys.detail(companyId),
		queryFn: () => companiesApi.getById(companyId),
		enabled: Boolean(companyId),
	})
}

export function useCreateAdminCompany() {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: (data: CreateCompanyDto) => companiesApi.create(data),
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: adminCompanyKeys.all,
			})
		},
	})
}

export function useUpdateAdminCompany() {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: ({
			companyId,
			data,
		}: {
			companyId: string
			data: UpdateCompanyDto
		}) => companiesApi.update(companyId, data),
		onSuccess: (_, variables) => {
			queryClient.invalidateQueries({
				queryKey: adminCompanyKeys.all,
			})

			queryClient.invalidateQueries({
				queryKey: adminCompanyKeys.detail(variables.companyId),
			})
		},
	})
}

export function useDeleteAdminCompany() {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: (companyId: string) => companiesApi.delete(companyId),
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: adminCompanyKeys.all,
			})
		},
	})
}

// ================================ Company Members ================================
export const companyMembersQueryKeys = {
	all: ['company-members'] as const,
	list: (companyId: string, search = '') =>
		[...companyMembersQueryKeys.all, companyId, search] as const,
}

export function useCompanyMembers({
	companyId,
	enabled = true,
}: {
	companyId: string
	enabled?: boolean
}) {
	return useQuery({
		queryKey: companyMembersQueryKeys.list(companyId),
		queryFn: () => companiesApi.getCompanyMembersApi(companyId),
		enabled: enabled && Boolean(companyId),
	})
}

export function useCreateCompanyMemberUser(companyId: string) {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: (payload: CreateCompanyMemberUserPayload) =>
			companiesApi.createCompanyMemberUserApi(companyId, payload),

		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: companyMembersQueryKeys.all,
			})
		},
	})
}

export function useUpdateCompanyMemberStatuses(companyId: string) {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: (payload: UpdateCompanyMemberStatusesPayload) =>
			companiesApi.updateCompanyMemberStatusesApi(companyId, payload),

		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: companyMembersQueryKeys.all,
			})
		},
	})
}

export function useUploadCompanyLogo() {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: async ({
			companyId,
			file,
		}: {
			companyId: string
			file: File
		}) => {
			const { uploadUrl, key } = await companiesApi.getAssetUploadUrl({
				kind: 'companyLogo',
				companyId,
				fileName: file.name,
				contentType: file.type,
			})

			await companiesApi.uploadFileToS3({
				uploadUrl,
				file,
			})

			const updatedCompany = await companiesApi.saveAsset({
				kind: 'companyLogo',
				companyId,
				key,
			})

			return updatedCompany as Company
		},

		onSuccess: (_, variables) => {
			queryClient.invalidateQueries({
				queryKey: ['admin-dashboard'],
			})

			queryClient.invalidateQueries({
				queryKey: ['company', variables.companyId],
			})
		},
	})
}

type UploadBuildingImagesParams = {
	companyId: string
	buildingId: string
	imageType: 'plan' | 'ready'
	files: File[]
}

export function useUploadBuildingImages() {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: async ({
			companyId,
			buildingId,
			imageType,
			files,
		}: UploadBuildingImagesParams) => {
			const kind: AssetKind =
				imageType === 'plan' ? 'buildingPlanImage' : 'buildingRealImage'

			let updatedBuilding: Building | null = null

			for (const file of files) {
				const { uploadUrl, key } = await companiesApi.getAssetUploadUrl({
					kind,
					companyId,
					buildingId,
					fileName: file.name,
					contentType: file.type,
				})

				await companiesApi.uploadFileToS3({
					uploadUrl,
					file,
				})

				const result = await companiesApi.saveAsset({
					kind,
					companyId,
					buildingId,
					key,
				})

				updatedBuilding = result as Building
			}

			return updatedBuilding
		},

		onSuccess: (_, variables) => {
			queryClient.invalidateQueries({
				queryKey: ['admin-buildings-page', variables.companyId],
			})
		},
	})
}
