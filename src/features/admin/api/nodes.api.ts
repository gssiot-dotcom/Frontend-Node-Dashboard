import { request } from '@/shared/api/httpClient'
import {
	BaseBuildingNode,
	CreateNodesResponse,
	type CreateNodeDto,
	type InstalledLocation,
	type UpdateNodeDto,
} from '../types/node.types'

type Node = BaseBuildingNode

export type UpdateNodePlanLocationDto = {
	nodeId: string
	installedLocation: InstalledLocation
}

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
		const response = await request.patch<Node>(`/nodes/${nodeId}`, data)

		return response.data
	},

	updatePlanLocation: async ({
		nodeId,
		installedLocation,
	}: UpdateNodePlanLocationDto) => {
		const response = await request.patch<Node>(`/nodes/${nodeId}`, {
			installedLocation,
		})

		return response.data
	},

	delete: async (nodeId: string) => {
		await request.delete(`/admin/nodes/${nodeId}`)
	},
}
