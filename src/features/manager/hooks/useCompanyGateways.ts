import type {
	CreateGatewayDto,
	UpdateGatewayDto,
} from '@/features/admin/types/gateway.types'
import { queryKeys } from '@/shared/utils/queryKeys'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { managerGatewaysApi } from '../api/companyGateways.api'

export function useCompanyGateways(buildingId: string | null) {
	return useQuery({
		queryKey: buildingId
			? queryKeys.manager.gateways.byBuilding(buildingId)
			: ['manager', 'gateways', 'empty'],
		queryFn: () => managerGatewaysApi.getByBuildingId(buildingId!),
		enabled: Boolean(buildingId),
	})
}

export function useCompanyGateway(gatewayId: string | null) {
	return useQuery({
		queryKey: gatewayId
			? queryKeys.manager.gateways.detail(gatewayId)
			: ['manager', 'gateways', 'detail', 'empty'],
		queryFn: () => managerGatewaysApi.getById(gatewayId!),
		enabled: Boolean(gatewayId),
	})
}

export function useCreateCompanyGateway(buildingId: string | null) {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: (data: CreateGatewayDto) => {
			if (!buildingId) {
				throw new Error('Building ID is required')
			}

			return managerGatewaysApi.create(buildingId, data)
		},

		onSuccess: () => {
			if (!buildingId) return

			queryClient.invalidateQueries({
				queryKey: queryKeys.manager.gateways.byBuilding(buildingId),
			})
		},
	})
}

export function useUpdateCompanyGateway() {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: ({
			gatewayId,
			data,
		}: {
			gatewayId: string
			buildingId?: string
			data: UpdateGatewayDto
		}) => managerGatewaysApi.update(gatewayId, data),

		onSuccess: (_, variables) => {
			queryClient.invalidateQueries({
				queryKey: queryKeys.manager.gateways.detail(variables.gatewayId),
			})

			if (variables.buildingId) {
				queryClient.invalidateQueries({
					queryKey: queryKeys.manager.gateways.byBuilding(variables.buildingId),
				})
			}
		},
	})
}

export function useDeleteCompanyGateway() {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: ({ gatewayId }: { gatewayId: string; buildingId?: string }) =>
			managerGatewaysApi.delete(gatewayId),

		onSuccess: (_, variables) => {
			if (variables.buildingId) {
				queryClient.invalidateQueries({
					queryKey: queryKeys.manager.gateways.byBuilding(variables.buildingId),
				})
			}
		},
	})
}
