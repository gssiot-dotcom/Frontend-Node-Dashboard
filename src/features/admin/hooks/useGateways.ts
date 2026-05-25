import { useMutation, useQueryClient } from '@tanstack/react-query'
import { adminGatewaysApi } from '../api/gateways.api'
import { CreateGatewayDto } from '../types/gateway.types'

export const adminGatewayKeys = {
	all: ['admin', 'gateways'] as const,
	gateways: ['admin', 'gateways'] as const,
}

export function useCreateAdminGateway() {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: (data: CreateGatewayDto) => adminGatewaysApi.create(data),
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: adminGatewayKeys.all,
			})

			queryClient.invalidateQueries({
				queryKey: adminGatewayKeys.gateways,
			})
		},
	})
}
