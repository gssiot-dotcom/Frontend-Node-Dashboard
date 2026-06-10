import { queryKeys } from '@/shared/utils/queryKeys'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { adminBuildingsApi } from '../api/buildings.api'
import type {
	CreateBuildingForm,
	UpdateBuildingAlarmLevelPayload,
	UpdateBuildingDto,
	UpdateFaultFilterPayload,
} from '../types/building.types'
import { NodeTypes } from '../types/node.types'

export function useAdminCompanyBuildings({
	companyId,
	enabled,
}: {
	companyId: string
	enabled: boolean
}) {
	return useQuery({
		queryKey: companyId
			? queryKeys.admin.buildings.byCompany(companyId)
			: ['admin', 'buildings', 'empty'],
		queryFn: () => adminBuildingsApi.getByCompanyId(companyId),
		enabled: enabled && Boolean(companyId),
	})
}

export function useCreateAdminBuilding(companyId: string | null) {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: (data: CreateBuildingForm) => {
			return adminBuildingsApi.create(data)
		},
		onSuccess: () => {
			if (!companyId) return

			queryClient.invalidateQueries({
				queryKey: queryKeys.admin.buildings.byCompany(companyId),
			})
		},
	})
}

export const useUpdateCompanyBuildingStatuses = (companyId: string) => {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: ({ activeBuildingIds }: { activeBuildingIds: string[] }) =>
			adminBuildingsApi.updateCompanyBuildingStatuses(
				companyId,
				activeBuildingIds,
			),
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: queryKeys.admin.buildings.byCompany(companyId),
			})
		},
	})
}

export function useAdminBuilding(buildingId: string | null) {
	return useQuery({
		queryKey: buildingId
			? queryKeys.admin.buildings.detail(buildingId)
			: ['admin', 'buildings', 'detail', 'empty'],
		queryFn: () => adminBuildingsApi.getById(buildingId!),
		enabled: Boolean(buildingId),
	})
}

export function useUpdateAdminBuilding() {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: ({
			buildingId,
			data,
		}: {
			buildingId: string
			companyId?: string
			data: UpdateBuildingDto
		}) => adminBuildingsApi.update(buildingId, data),

		onSuccess: (_, variables) => {
			queryClient.invalidateQueries({
				queryKey: queryKeys.admin.buildings.detail(variables.buildingId),
			})

			if (variables.companyId) {
				queryClient.invalidateQueries({
					queryKey: queryKeys.admin.buildings.byCompany(variables.companyId),
				})
			}
		},
	})
}

export function useDeleteAdminBuilding() {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: ({ buildingId }: { buildingId: string; companyId?: string }) =>
			adminBuildingsApi.delete(buildingId),

		onSuccess: (_, variables) => {
			if (variables.companyId) {
				queryClient.invalidateQueries({
					queryKey: queryKeys.admin.buildings.byCompany(variables.companyId),
				})
			}
		},
	})
}

export function useAdminBuildingsPageQuery(companyId?: string) {
	return useQuery({
		queryKey: ['admin-buildings-page', companyId],
		queryFn: () =>
			adminBuildingsApi.getAdminCompanyBuildingsPage(companyId as string),
		enabled: Boolean(companyId),
	})
}

export function useAdminBuildingWorkers({
	buildingId,
	enabled,
}: {
	buildingId: string
	enabled: boolean
}) {
	return useQuery({
		queryKey: ['admin-building-workers', buildingId],
		queryFn: () => adminBuildingsApi.getAdminBuildingWorkers(buildingId),
		enabled: Boolean(buildingId) && enabled,
	})
}

export function useUpdateAdminBuildingWorkers(buildingId: string) {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: (workerIds: string[]) =>
			adminBuildingsApi.updateAdminBuildingWorkers({ buildingId, workerIds }),
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ['admin-building-workers', buildingId],
			})
			queryClient.invalidateQueries({
				queryKey: ['admin-buildings-page'],
			})
		},
	})
}

export function useCreateAdminBuildingWorker(buildingId: string) {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: adminBuildingsApi.createAdminBuildingWorker,
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ['admin-building-workers', buildingId],
			})
		},
	})
}

export function useAdminBuildingGateways({
	buildingId,
	enabled,
}: {
	buildingId: string
	enabled: boolean
}) {
	return useQuery({
		queryKey: ['admin-building-gateways', buildingId],
		queryFn: () => adminBuildingsApi.getAdminBuildingGateways(buildingId),
		enabled: Boolean(buildingId) && enabled,
	})
}

export function useUpdateAdminBuildingGateways(buildingId: string) {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: (gatewayIds: string[]) =>
			adminBuildingsApi.updateAdminBuildingGateways({ buildingId, gatewayIds }),
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ['admin-building-gateways', buildingId],
			})
			queryClient.invalidateQueries({
				queryKey: ['admin-buildings-page'],
			})
		},
	})
}

export const companyBuildingDeviceQueryKeys = {
	all: ['company-building-devices'] as const,

	buildingNodesPage: (
		companyId?: string,
		buildingId?: string,
		nodeType?: string,
	) =>
		[
			...companyBuildingDeviceQueryKeys.all,
			'building-nodes-page',
			{ companyId, buildingId, nodeType },
		] as const,
	nodeGraphicData: (
		nodeNumber?: number,
		nodeType?: NodeTypes,
		mode?: 'hour' | 'day',
		value?: number | string,
	) => ['node-graphic-data', nodeNumber, nodeType, mode, value],
}

export function useBuildingNodesPageQuery(params: {
	companyId?: string
	buildingId?: string
	nodeType?: NodeTypes
}) {
	const { companyId, buildingId, nodeType } = params

	return useQuery({
		queryKey: companyBuildingDeviceQueryKeys.buildingNodesPage(
			companyId,
			buildingId,
			nodeType,
		),
		queryFn: () =>
			adminBuildingsApi.getBuildingNodesPage(buildingId!, {
				companyId: companyId!,
				nodeType: nodeType!,
			}),
		enabled: !!companyId && !!buildingId && !!nodeType,
	})
}

export function useUpdateBuildingAlarmLevelMutation() {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: (payload: UpdateBuildingAlarmLevelPayload) =>
			adminBuildingsApi.updateBuildingAlarmLevel(payload),

		onSuccess: (data, variables) => {
			showGatewayAlarmToast(data?.summary)

			queryClient.invalidateQueries({
				queryKey: companyBuildingDeviceQueryKeys.buildingNodesPage(
					variables.companyId,
					variables.buildingId,
					variables.alarmType,
				),
			})
		},
		onError: error => {
			toast.error(
				error instanceof Error
					? error.message
					: 'Failed to save alarm level',
			)
		},
	})
}

export function useManagerUpdateBuildingAlarmLevelMutation() {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: (payload: UpdateBuildingAlarmLevelPayload) =>
			adminBuildingsApi.updateManagerBuildingAlarmLevel(payload),

		onSuccess: (data, variables) => {
			showGatewayAlarmToast(data?.summary)

			queryClient.invalidateQueries({
				queryKey: companyBuildingDeviceQueryKeys.buildingNodesPage(
					variables.companyId,
					variables.buildingId,
					variables.alarmType,
				),
			})
			queryClient.invalidateQueries({
				queryKey: ['manager'],
			})
		},
		onError: error => {
			toast.error(
				error instanceof Error
					? error.message
					: 'Failed to save alarm level',
			)
		},
	})
}

export function useUpdateFaultFilterMutation() {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: (payload: UpdateFaultFilterPayload) =>
			adminBuildingsApi.updateFaultFilter(payload),

		onSuccess: (data, variables) => {
			showGatewayCommandToast(data?.summary, 'Fault filter')

			queryClient.invalidateQueries({
				queryKey: companyBuildingDeviceQueryKeys.buildingNodesPage(
					variables.companyId,
					variables.buildingId,
					variables.alarmType,
				),
			})
		},
		onError: error => {
			toast.error(
				error instanceof Error
					? error.message
					: 'Failed to update fault filter',
			)
		},
	})
}

export function useManagerUpdateFaultFilterMutation() {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: (payload: UpdateFaultFilterPayload) =>
			adminBuildingsApi.updateManagerFaultFilter(payload),

		onSuccess: (data, variables) => {
			showGatewayCommandToast(data?.summary, 'Fault filter')

			queryClient.invalidateQueries({
				queryKey: companyBuildingDeviceQueryKeys.buildingNodesPage(
					variables.companyId,
					variables.buildingId,
					variables.alarmType,
				),
			})
			queryClient.invalidateQueries({
				queryKey: ['manager'],
			})
		},
		onError: error => {
			toast.error(
				error instanceof Error
					? error.message
					: 'Failed to update fault filter',
			)
		},
	})
}

function showGatewayAlarmToast(summary?: {
	successCount: number
	errorCount: number
	timeoutCount: number
}) {
	const message = formatGatewayAlarmResult(summary)

	if (summary?.errorCount || summary?.timeoutCount) {
		toast.warning(message)
		return
	}

	toast.success(message)
}

function formatGatewayAlarmResult(summary?: {
	successCount: number
	errorCount: number
	timeoutCount: number
}) {
	if (!summary) return 'Alarm level saved successfully'

	const parts = [
		`${summary.successCount} success`,
		summary.errorCount ? `${summary.errorCount} error` : '',
		summary.timeoutCount ? `${summary.timeoutCount} timeout` : '',
	].filter(Boolean)

	return `Alarm setting result: ${parts.join(', ')}`
}

function showGatewayCommandToast(
	summary:
		| {
				successCount: number
				errorCount: number
				timeoutCount: number
		  }
		| undefined,
	label: string,
) {
	const message = formatGatewayCommandResult(summary, label)

	if (summary?.errorCount || summary?.timeoutCount) {
		toast.warning(message)
		return
	}

	toast.success(message)
}

function formatGatewayCommandResult(
	summary:
		| {
				successCount: number
				errorCount: number
				timeoutCount: number
		  }
		| undefined,
	label: string,
) {
	if (!summary) return `${label} updated successfully`

	const parts = [
		`${summary.successCount} success`,
		summary.errorCount ? `${summary.errorCount} error` : '',
		summary.timeoutCount ? `${summary.timeoutCount} timeout` : '',
	].filter(Boolean)

	return `${label} result: ${parts.join(', ')}`
}

export function useNodeGraphicDataQuery(params: {
	nodeNumber: number
	nodeType: NodeTypes
	mode?: 'hour' | 'day'
	value?: number | string
	enabled?: boolean
}) {
	const { nodeNumber, nodeType, mode, value, enabled } = params

	return useQuery({
		queryKey: companyBuildingDeviceQueryKeys.nodeGraphicData(
			nodeNumber,
			nodeType,
			mode,
			value,
		),

		queryFn: () => {
			const now = new Date()

			let from: Date
			let to: Date

			if (mode === 'hour') {
				from = new Date(now.getTime() - Number(value) * 60 * 60 * 1000)
				to = now
			} else {
				const selectedDate = String(value)

				from = new Date(`${selectedDate}T00:00:00`)
				to = new Date(`${selectedDate}T23:59:59.999`)
			}

			return adminBuildingsApi.nodeGraphicData({
				nodeNumber: nodeNumber!,
				nodeType: nodeType!,
				from: from.toISOString(),
				to: to.toISOString(),
			})
		},

		enabled:
			enabled &&
			nodeNumber !== undefined &&
			!!nodeType &&
			!!mode &&
			value !== undefined &&
			value !== null,
	})
}
