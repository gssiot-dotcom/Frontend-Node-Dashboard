import { queryKeys } from '@/shared/utils/queryKeys'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { adminNodesApi } from '../api/nodes.api'
import type { CreateNodeDto, UpdateNodeDto } from '../types/node.types'

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
