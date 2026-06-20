import { queryKeys } from '@/shared/utils/queryKeys'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { adminNodesApi } from '../api/nodes.api'
import { companyBuildingDeviceQueryKeys } from './useBuildings'
import type {
	CreateNodeDto,
	InstalledLocation,
	NodeTypes,
	UpdateNodeDto,
} from '../types/node.types'

export const adminNodeKeys = {
	all: ['admin', 'devices'] as const,
	nodes: ['admin', 'devices', 'nodes'] as const,
	gateways: ['admin', 'devices', 'gateways'] as const,
}

export function useAdminNodes(gatewayId: string | null) {
	return useQuery({
		queryKey: gatewayId
			? queryKeys.admin.nodes.byGateway(gatewayId)
			: ['admin', 'nodes', 'empty'],
		queryFn: () => adminNodesApi.getByGatewayId(gatewayId!),
		enabled: Boolean(gatewayId),
	})
}

export function useAdminNode(nodeId: string | null) {
	return useQuery({
		queryKey: nodeId
			? queryKeys.admin.nodes.detail(nodeId)
			: ['admin', 'nodes', 'detail', 'empty'],
		queryFn: () => adminNodesApi.getById(nodeId!),
		enabled: Boolean(nodeId),
	})
}

export function useCreateAdminNodes() {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: (data: CreateNodeDto) => {
			return adminNodesApi.create(data)
		},
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: adminNodeKeys.all,
			})

			queryClient.invalidateQueries({
				queryKey: adminNodeKeys.nodes,
			})
		},
	})
}

export function useUpdateAdminNode() {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: ({
			nodeId,
			data,
		}: {
			nodeId: string
			gatewayId?: string
			data: UpdateNodeDto
		}) => adminNodesApi.update(nodeId, data),

		onSuccess: (_, variables) => {
			queryClient.invalidateQueries({
				queryKey: queryKeys.admin.nodes.detail(variables.nodeId),
			})

			if (variables.gatewayId) {
				queryClient.invalidateQueries({
					queryKey: queryKeys.admin.nodes.byGateway(variables.gatewayId),
				})
			}
		},
	})
}

export function useUpdateNodePlanLocations() {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: ({
			locations,
		}: {
			companyId?: string
			buildingId?: string
			nodeType?: NodeTypes
			locations: Array<InstalledLocation & { nodeId: string }>
		}) =>
			Promise.all(
				locations.map(({ nodeId, planImageIndex, xPercent, yPercent }) =>
					adminNodesApi.updatePlanLocation({
						nodeId,
						installedLocation: {
							planImageIndex,
							xPercent,
							yPercent,
						},
					}),
				),
			),

		onSuccess: (_, variables) => {
			if (variables.companyId && variables.buildingId && variables.nodeType) {
				queryClient.invalidateQueries({
					queryKey: companyBuildingDeviceQueryKeys.buildingNodesPage(
						variables.companyId,
						variables.buildingId,
						variables.nodeType,
					),
				})
			}
		},
	})
}

export function useDeleteAdminNode() {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: ({ nodeId }: { nodeId: string; gatewayId?: string }) =>
			adminNodesApi.delete(nodeId),

		onSuccess: (_, variables) => {
			if (variables.gatewayId) {
				queryClient.invalidateQueries({
					queryKey: queryKeys.admin.nodes.byGateway(variables.gatewayId),
				})
			}
		},
	})
}
