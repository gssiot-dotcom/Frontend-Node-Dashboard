import { request } from '@/shared/api/httpClient'
import {
	CreateNodesResponse,
	type CreateNodeDto,
	type Node,
	type UpdateNodeDto,
} from '../types/node.types'

export const adminNodesApi = {
	getByGatewayId: async (gatewayId: string) => {
		const response = await request.get<Node[]>(
			`/admin/gateways/${gatewayId}/nodes`,
		)

		return response.data
	},

	getById: async (nodeId: string) => {
		const response = await request.get<Node>(`/admin/nodes/${nodeId}`)

		return response.data
	},

	create: async (data: CreateNodeDto) => {
		const response = await request.post<CreateNodesResponse>(`/nodes`, data)

		return response.data
	},

	update: async (nodeId: string, data: UpdateNodeDto) => {
		const response = await request.patch<Node>(`/admin/nodes/${nodeId}`, data)

		return response.data
	},

	delete: async (nodeId: string) => {
		await request.delete(`/admin/nodes/${nodeId}`)
	},
}
