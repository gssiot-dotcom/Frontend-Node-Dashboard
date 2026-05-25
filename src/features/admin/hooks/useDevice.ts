import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { companyDeviceApi, deviceApi } from '../api/device.api'
import type {
	CheckNodesDto,
	RegisterNodesToGatewayDto,
} from '../types/device.types'

export const deviceQueryKeys = {
	all: ['devices'] as const,

	gateways: (search?: string) =>
		[...deviceQueryKeys.all, 'gateways', { search }] as const,

	nodes: (params?: { search?: string; nodeType?: string }) =>
		[...deviceQueryKeys.all, 'nodes', params] as const,

	availableNodes: (params?: { search?: string; nodeType?: string }) =>
		[...deviceQueryKeys.all, 'available-nodes', params] as const,

	gatewayNodes: (gatewayId?: string) =>
		[...deviceQueryKeys.all, 'gateway-nodes', gatewayId] as const,
}

export function useDeviceGatewaysQuery(search?: string) {
	return useQuery({
		queryKey: deviceQueryKeys.gateways(search),
		queryFn: () => deviceApi.getGateways({ search }),
	})
}

export function useDeviceNodesQuery(params?: {
	search?: string
	nodeType?: string
}) {
	return useQuery({
		queryKey: deviceQueryKeys.nodes(params),
		queryFn: () => deviceApi.getNodes(params),
	})
}

export function useAvailableNodesQuery(params?: {
	search?: string
	nodeType?: string
}) {
	return useQuery({
		queryKey: deviceQueryKeys.availableNodes(params),
		queryFn: () => deviceApi.getAvailableNodes(params),
	})
}

export function useGatewayNodesQuery(gatewayId?: string) {
	return useQuery({
		queryKey: deviceQueryKeys.gatewayNodes(gatewayId),
		queryFn: () => deviceApi.getGatewayNodes(gatewayId!),
		enabled: !!gatewayId,
	})
}

export function useCheckNodesMutation() {
	return useMutation({
		mutationFn: (data: CheckNodesDto) => deviceApi.checkNodes(data),
	})
}

export function useRegisterNodesToGatewayMutation() {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: ({
			gatewayId,
			data,
		}: {
			gatewayId: string
			data: RegisterNodesToGatewayDto
		}) => deviceApi.registerNodesToGateway(gatewayId, data),

		onSuccess: async () => {
			await Promise.all([
				queryClient.invalidateQueries({
					queryKey: deviceQueryKeys.all,
				}),
			])
		},
	})
}

// =============================== Company devices manage hooks ===========================

export const compnayDeviceQueryKeys = {
	all: ['devices'] as const,

	companyGateways: (companyId?: string, search?: string) =>
		[
			...deviceQueryKeys.all,
			'companies',
			companyId,
			'gateways',
			{ search },
		] as const,

	companyNodes: (
		companyId?: string,
		params?: { search?: string; nodeType?: string },
	) =>
		[...deviceQueryKeys.all, 'companies', companyId, 'nodes', params] as const,

	companyAvailableNodes: (
		companyId?: string,
		params?: { search?: string; nodeType?: string },
	) =>
		[
			...deviceQueryKeys.all,
			'companies',
			companyId,
			'available-nodes',
			params,
		] as const,

	companyGatewayNodes: (companyId?: string, gatewayId?: string) =>
		[
			...deviceQueryKeys.all,
			'companies',
			companyId,
			'gateway-nodes',
			gatewayId,
		] as const,
}

export function useCompanyGatewaysQuery(companyId?: string, search?: string) {
	return useQuery({
		queryKey: compnayDeviceQueryKeys.companyGateways(companyId, search),
		queryFn: () => companyDeviceApi.getCompanyGateways(companyId!, { search }),
		enabled: !!companyId,
	})
}

export function useCompanyNodesQuery(
	companyId?: string,
	params?: {
		search?: string
		nodeType?: string
	},
) {
	return useQuery({
		queryKey: compnayDeviceQueryKeys.companyNodes(companyId, params),
		queryFn: () => companyDeviceApi.getCompanyNodes(companyId!, params),
		enabled: !!companyId,
	})
}

export function useCompanyAvailableNodesQuery(
	companyId?: string,
	params?: {
		search?: string
		nodeType?: string
	},
) {
	return useQuery({
		queryKey: compnayDeviceQueryKeys.companyAvailableNodes(companyId, params),
		queryFn: () =>
			companyDeviceApi.getCompanyAvailableNodes(companyId!, params),
		enabled: !!companyId,
	})
}

export function useCompanyGatewayNodesQuery(
	companyId?: string,
	gatewayId?: string,
) {
	return useQuery({
		queryKey: compnayDeviceQueryKeys.companyGatewayNodes(companyId, gatewayId),
		queryFn: () =>
			companyDeviceApi.getCompanyGatewayNodes(companyId!, gatewayId!),
		enabled: !!companyId && !!gatewayId,
	})
}

export function useCheckCompanyNodesMutation(companyId?: string) {
	return useMutation({
		mutationFn: (data: CheckNodesDto) =>
			companyDeviceApi.checkCompanyNodes(companyId!, data),
	})
}

export function useRegisterCompanyNodesToGatewayMutation(companyId?: string) {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: ({
			gatewayId,
			data,
		}: {
			gatewayId: string
			data: RegisterNodesToGatewayDto
		}) =>
			companyDeviceApi.registerCompanyNodesToGateway(
				companyId!,
				gatewayId,
				data,
			),

		onSuccess: async () => {
			await queryClient.invalidateQueries({
				queryKey: [...compnayDeviceQueryKeys.all, 'companies', companyId],
			})
		},
	})
}

export const useUnassignCompanyNodesMutation = (companyId: string) => {
	const queryClient = useQueryClient()
	return useMutation({
		mutationFn: ({ nodeIds }: { nodeIds: string[] }) =>
			companyDeviceApi.unassignNodesFromGateway(companyId, nodeIds),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['company-nodes', companyId] })
		},
	})
}
