import { request } from '@/shared/api/httpClient'
import type {
	CreateGatewayDto,
	CreateGatewayResponse,
	Gateway,
	UpdateGatewayDto,
} from '../types/gateway.types'

export const adminGatewaysApi = {
	getByBuildingId: async (buildingId: string) => {
		const response = await request.get<Gateway[]>(
			`/admin/buildings/${buildingId}/gateways`,
		)

		return response.data
	},

	getById: async (gatewayId: string) => {
		const response = await request.get<Gateway>(`/admin/gateways/${gatewayId}`)

		return response.data
	},

	create: async (data: CreateGatewayDto) => {
		const response = await request.post<CreateGatewayResponse>(
			`/gateways`,
			data,
		)

		return response.data
	},

	update: async (gatewayId: string, data: UpdateGatewayDto) => {
		const response = await request.patch<CreateGatewayResponse>(
			`/admin/gateways/${gatewayId}`,
			data,
		)

		return response.data
	},

	delete: async (gatewayId: string) => {
		await request.delete(`/admin/gateways/${gatewayId}`)
	},
}
