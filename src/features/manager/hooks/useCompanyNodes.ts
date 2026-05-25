import type {
	CreateNodeDto,
	UpdateNodeDto,
} from '@/features/admin/types/node.types'
import { queryKeys } from '@/shared/utils/queryKeys'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { managerNodesApi } from '../api/companyNodes.api'

export function useCompanyNodes(gatewayId: string | null) {
	return useQuery({
		queryKey: gatewayId
			? queryKeys.manager.nodes.byGateway(gatewayId)
			: ['manager', 'nodes', 'empty'],
		queryFn: () => managerNodesApi.getByGatewayId(gatewayId!),
		enabled: Boolean(gatewayId),
	})
}

export function useCompanyNode(nodeId: string | null) {
	return useQuery({
		queryKey: nodeId
			? queryKeys.manager.nodes.detail(nodeId)
			: ['manager', 'nodes', 'detail', 'empty'],
		queryFn: () => managerNodesApi.getById(nodeId!),
		enabled: Boolean(nodeId),
	})
}

export function useCreateCompanyNode(gatewayId: string | null) {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: (data: CreateNodeDto) => {
			if (!gatewayId) {
				throw new Error('Gateway ID is required')
			}

			return managerNodesApi.create(gatewayId, data)
		},

		onSuccess: () => {
			if (!gatewayId) return

			queryClient.invalidateQueries({
				queryKey: queryKeys.manager.nodes.byGateway(gatewayId),
			})
		},
	})
}

export function useUpdateCompanyNode() {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: ({
			nodeId,
			data,
		}: {
			nodeId: string
			gatewayId?: string
			data: UpdateNodeDto
		}) => managerNodesApi.update(nodeId, data),

		onSuccess: (_, variables) => {
			queryClient.invalidateQueries({
				queryKey: queryKeys.manager.nodes.detail(variables.nodeId),
			})

			if (variables.gatewayId) {
				queryClient.invalidateQueries({
					queryKey: queryKeys.manager.nodes.byGateway(variables.gatewayId),
				})
			}
		},
	})
}

export function useDeleteCompanyNode() {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: ({ nodeId }: { nodeId: string; gatewayId?: string }) =>
			managerNodesApi.delete(nodeId),

		onSuccess: (_, variables) => {
			if (variables.gatewayId) {
				queryClient.invalidateQueries({
					queryKey: queryKeys.manager.nodes.byGateway(variables.gatewayId),
				})
			}
		},
	})
}
