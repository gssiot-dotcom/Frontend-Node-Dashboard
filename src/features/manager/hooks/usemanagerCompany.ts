// features/manager/api/manager.queries.ts
import { Building } from '@/features/admin/types/building.types'
import {
	Company,
	UpdateCompanyMemberStatusesPayload,
} from '@/features/admin/types/company.types'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { managerApi } from '../api/dashboard.api'

export const managerKeys = {
	all: ['manager'] as const,
	myCompany: () => ['manager', 'my-company'] as const,

	dashboard: () => [...managerKeys.all, 'dashboard'] as const,
	buildingsPage: () => [...managerKeys.all, 'buildings-page'] as const,

	members: (params?: object) =>
		[...managerKeys.all, 'members', params] as const,
	buildings: (params?: object) =>
		[...managerKeys.all, 'buildings', params] as const,
	buildingGateways: (buildingId: string) =>
		[...managerKeys.all, 'buildings', buildingId, 'gateways'] as const,
	buildingWorkers: (buildingId: string) =>
		[...managerKeys.all, 'buildings', buildingId, 'workers'] as const,
	buildingNodes: (buildingId: string, nodeType: string) =>
		[...managerKeys.all, 'buildings', buildingId, 'nodes', nodeType] as const,
}

// Get myCompany
export function useMyCompany() {
	return useQuery({
		queryKey: managerKeys.myCompany(),
		queryFn: managerApi.getMyCompany,
		staleTime: 5 * 60 * 1000,
	})
}

// Dashboard
export const useManagerDashboard = () =>
	useQuery({
		queryKey: managerKeys.dashboard(),
		queryFn: managerApi.getDashboard,
	})

// Members
export const useManagerMembers = (params?: {
	memberRole?: string
	search?: string
	enabled: boolean
}) =>
	useQuery({
		queryKey: managerKeys.members(),
		queryFn: () => managerApi.getMembers(params),
		enabled: params?.enabled || false,
	})

export const useCreateManagerMember = () => {
	const qc = useQueryClient()
	return useMutation({
		mutationFn: managerApi.createMember,
		onSuccess: () => qc.invalidateQueries({ queryKey: managerKeys.members() }),
	})
}

export const useUpdateManagerMemberStatuses = () => {
	const qc = useQueryClient()
	return useMutation({
		mutationFn: (payload: UpdateCompanyMemberStatusesPayload) =>
			managerApi.updateMemberStatuses(payload),
		onSuccess: () => qc.invalidateQueries({ queryKey: managerKeys.members() }),
	})
}

// Buildings
export const useManagerBuildings = (params?: { search?: string }) =>
	useQuery({
		queryKey: managerKeys.buildings(params),
		queryFn: () => managerApi.getBuildings(params),
	})

export const useCreateManagerBuilding = () => {
	const qc = useQueryClient()
	return useMutation({
		mutationFn: managerApi.createBuilding,
		onSuccess: () =>
			qc.invalidateQueries({ queryKey: managerKeys.buildings() }),
	})
}

export const useUpdateManagerBuildingStatuses = () => {
	const qc = useQueryClient()
	return useMutation({
		mutationFn: (activeBuildingIds: string[]) =>
			managerApi.updateBuildingStatuses(activeBuildingIds),
		onSuccess: () =>
			qc.invalidateQueries({ queryKey: managerKeys.buildings() }),
	})
}

export const useManagerBuildingsPage = () =>
	useQuery({
		queryKey: managerKeys.buildingsPage(),
		queryFn: () => managerApi.getBuildingsPage(),
	})

// Building gateways
export const useManagerBuildingGateways = (buildingId: string) =>
	useQuery({
		queryKey: managerKeys.buildingGateways(buildingId),
		queryFn: () => managerApi.getBuildingGateways(buildingId),
		enabled: !!buildingId,
	})

export const useUpdateManagerBuildingGateways = (buildingId: string) => {
	const qc = useQueryClient()
	return useMutation({
		mutationFn: (gatewayIds: string[]) =>
			managerApi.updateBuildingGateways(buildingId, gatewayIds),
		onSuccess: () =>
			qc.invalidateQueries({
				queryKey: managerKeys.buildingGateways(buildingId),
			}),
	})
}

// Building workers
export const useManagerBuildingWorkers = (buildingId: string) =>
	useQuery({
		queryKey: managerKeys.buildingWorkers(buildingId),
		queryFn: () => managerApi.getBuildingWorkers(buildingId),
		enabled: !!buildingId,
	})

export const useUpdateManagerBuildingWorkers = (buildingId: string) => {
	const qc = useQueryClient()
	return useMutation({
		mutationFn: (workerIds: string[]) =>
			managerApi.updateBuildingWorkers(buildingId, workerIds),
		onSuccess: () =>
			qc.invalidateQueries({
				queryKey: managerKeys.buildingWorkers(buildingId),
			}),
	})
}

export const useCreateManagerBuildingWorker = (buildingId: string) => {
	const qc = useQueryClient()
	return useMutation({
		mutationFn: (
			payload: Parameters<typeof managerApi.createBuildingWorker>[1],
		) => managerApi.createBuildingWorker(buildingId, payload),
		onSuccess: () =>
			qc.invalidateQueries({
				queryKey: managerKeys.buildingWorkers(buildingId),
			}),
	})
}

// Nodes page
export const useManagerBuildingNodesPage = (
	buildingId: string,
	nodeType: string,
) =>
	useQuery({
		queryKey: managerKeys.buildingNodes(buildingId, nodeType),
		queryFn: () => managerApi.getBuildingNodesPage(buildingId, nodeType),
		enabled: !!buildingId && !!nodeType,
	})

// Assets
// features/manager/api/manager.queries.ts ga qo'shiladi

type ManagerBuildingImageType = 'plan' | 'ready'

const getManagerBuildingImageKind = (imageType: ManagerBuildingImageType) =>
	imageType === 'plan' ? 'buildingPlanImage' : 'buildingRealImage'

export function useUploadManagerCompanyLogo() {
	const qc = useQueryClient()

	return useMutation({
		mutationFn: async ({
			companyId,
			file,
		}: {
			companyId: string
			file: File
		}) => {
			// 1. Presigned URL ol
			const { uploadUrl, key } = await managerApi.getPresignedUrl({
				kind: 'companyLogo',
				companyId,
				fileName: file.name,
				contentType: file.type,
			})

			// 2. S3 ga upload qil
			await fetch(uploadUrl, {
				method: 'PUT',
				body: file,
				headers: { 'Content-Type': file.type },
			})

			// 3. DB ga save qil
			const updatedCompany = await managerApi.saveCompanyAsset({
				kind: 'companyLogo',
				companyId,
				key,
			})

			return updatedCompany as Company
		},

		onSuccess: () => {
			qc.invalidateQueries({ queryKey: managerKeys.dashboard() })
		},
	})
}

export function useUploadManagerBuildingImages() {
	const qc = useQueryClient()

	return useMutation({
		mutationFn: async ({
			companyId,
			buildingId,
			imageType,
			files,
		}: {
			companyId: string
			buildingId: string
			imageType: 'plan' | 'ready'
			files: File[]
		}) => {
			const kind =
				imageType === 'plan' ? 'buildingPlanImage' : 'buildingRealImage'
			let updatedBuilding: Building | null = null

			for (const file of files) {
				const { uploadUrl, key } = await managerApi.getPresignedUrl({
					kind,
					companyId,
					buildingId,
					fileName: file.name,
					contentType: file.type,
				})

				await fetch(uploadUrl, {
					method: 'PUT',
					body: file,
					headers: { 'Content-Type': file.type },
				})

				updatedBuilding = await managerApi.saveBuildingAsset({
					kind,
					companyId,
					buildingId,
					key,
				})
			}

			return updatedBuilding as Building
		},

		onSuccess: () => {
			qc.invalidateQueries({ queryKey: managerKeys.buildings() })
			qc.invalidateQueries({ queryKey: managerKeys.buildingsPage() })
			qc.invalidateQueries({ queryKey: managerKeys.dashboard() })
		},
	})
}

export function useRemoveManagerBuildingImage() {
	const qc = useQueryClient()

	return useMutation({
		mutationFn: ({
			companyId,
			buildingId,
			imageType,
			key,
		}: {
			companyId: string
			buildingId: string
			imageType: ManagerBuildingImageType
			key: string
		}) =>
			managerApi.removeAsset({
				kind: getManagerBuildingImageKind(imageType),
				companyId,
				buildingId,
				key,
			}),

		onSuccess: () => {
			qc.invalidateQueries({ queryKey: managerKeys.buildings() })
			qc.invalidateQueries({ queryKey: managerKeys.buildingsPage() })
			qc.invalidateQueries({ queryKey: managerKeys.dashboard() })
		},
	})
}

export function useReorderManagerBuildingImages() {
	const qc = useQueryClient()

	return useMutation({
		mutationFn: ({
			companyId,
			buildingId,
			imageType,
			keys,
		}: {
			companyId: string
			buildingId: string
			imageType: ManagerBuildingImageType
			keys: string[]
		}) =>
			managerApi.reorderBuildingImages({
				kind: getManagerBuildingImageKind(imageType),
				companyId,
				buildingId,
				keys,
			}),

		onSuccess: () => {
			qc.invalidateQueries({ queryKey: managerKeys.buildings() })
			qc.invalidateQueries({ queryKey: managerKeys.buildingsPage() })
			qc.invalidateQueries({ queryKey: managerKeys.dashboard() })
		},
	})
}
