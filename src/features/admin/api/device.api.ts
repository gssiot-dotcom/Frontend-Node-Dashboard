import { request } from '@/shared/api/httpClient'
import { ApiResponse } from '@/shared/api/types'
import type {
	CheckNodesDto,
	CheckNodesResult,
	DeviceGateway,
	DeviceNode,
	RegisterNodesToGatewayDto,
	RegisterNodesToGatewayResult,
} from '../types/device.types'
import { Gateway } from '../types/gateway.types'

export function unwrapResponse<T>(body: ApiResponse<T> | T): T {
	if (
		body &&
		typeof body === 'object' &&
		!Array.isArray(body) &&
		'state' in body &&
		'data' in body
	) {
		const apiBody = body as ApiResponse<T>

		if (apiBody.state !== 'success') {
			throw new Error(apiBody.message || 'Request failed')
		}

		return apiBody.data
	}

	return body as T
}

export const deviceApi = {
	getGateways: async (params?: { search?: string }) => {
		const response = await request.get<
			ApiResponse<DeviceGateway[]> | DeviceGateway[]
		>('/admin/device/gateways', {
			params,
		})

		return unwrapResponse<DeviceGateway[]>(response.data)
	},

	getNodes: async (params?: { search?: string; nodeType?: string }) => {
		const response = await request.get<
			ApiResponse<DeviceNode[]> | DeviceNode[]
		>('/admin/device/nodes', {
			params,
		})

		return unwrapResponse<DeviceNode[]>(response.data)
	},

	getAvailableNodes: async (params?: {
		search?: string
		nodeType?: string
	}) => {
		const response = await request.get<
			ApiResponse<DeviceNode[]> | DeviceNode[]
		>('/admin/nodes/available', {
			params,
		})

		return unwrapResponse<DeviceNode[]>(response.data)
	},

	checkNodes: async (data: CheckNodesDto) => {
		const response = await request.post<
			ApiResponse<CheckNodesResult> | CheckNodesResult
		>('/admin/nodes/check', data)

		return unwrapResponse<CheckNodesResult>(response.data)
	},

	registerNodesToGateway: async (
		gatewayId: string,
		data: RegisterNodesToGatewayDto,
	) => {
		const response = await request.post<
			ApiResponse<RegisterNodesToGatewayResult> | RegisterNodesToGatewayResult
		>(`/admin/gateways/${gatewayId}/nodes`, data)

		return unwrapResponse<RegisterNodesToGatewayResult>(response.data)
	},

	getGatewayNodes: async (gatewayId: string) => {
		const response = await request.get<
			ApiResponse<DeviceNode[]> | DeviceNode[]
		>(`/admin/device/gateways/${gatewayId}/nodes`)

		return unwrapResponse<DeviceNode[]>(response.data)
	},

	// ===================== Building Devices apis =====================

	getBuildinggateways: async (buildingId: string) => {
		const response = await request.get<ApiResponse<Gateway[]>>(
			`/admin/company/buildings/${buildingId}/gateways`,
		)

		return unwrapResponse(response.data)
	},
}

export const companyDeviceApi = {
	getCompanyGateways: async (
		companyId: string,
		params?: {
			search?: string
		},
	) => {
		const response = await request.get<
			ApiResponse<DeviceGateway[]> | DeviceGateway[]
		>(`/admin/devices/companies/${companyId}/gateways`, {
			params,
		})

		return unwrapResponse<DeviceGateway[]>(response.data)
	},

	getCompanyNodes: async (
		companyId: string,
		params?: {
			search?: string
			nodeType?: string
		},
	) => {
		const response = await request.get<
			ApiResponse<DeviceNode[]> | DeviceNode[]
		>(`/admin/devices/companies/${companyId}/nodes`, {
			params,
		})

		return unwrapResponse<DeviceNode[]>(response.data)
	},

	getCompanyAvailableNodes: async (
		companyId: string,
		params?: {
			search?: string
			nodeType?: string
		},
	) => {
		const response = await request.get<
			ApiResponse<DeviceNode[]> | DeviceNode[]
		>(`/admin/devices/companies/${companyId}/nodes/available`, {
			params,
		})

		return unwrapResponse<DeviceNode[]>(response.data)
	},

	checkCompanyNodes: async (companyId: string, data: CheckNodesDto) => {
		const response = await request.post<
			ApiResponse<CheckNodesResult> | CheckNodesResult
		>(`/admin/devices/companies/${companyId}/nodes/check`, data)

		return unwrapResponse<CheckNodesResult>(response.data)
	},

	registerCompanyNodesToGateway: async (
		companyId: string,
		gatewayId: string,
		data: RegisterNodesToGatewayDto,
	) => {
		const response = await request.post<
			ApiResponse<RegisterNodesToGatewayResult> | RegisterNodesToGatewayResult
		>(
			`/admin/devices/companies/${companyId}/gateways/${gatewayId}/nodes/register`,
			data,
		)

		return unwrapResponse<RegisterNodesToGatewayResult>(response.data)
	},

	unassignNodesFromGateway: async (companyId: string, nodeIds: string[]) => {
		const response = await request.post(
			`/admin/devices/companies/${companyId}/nodes/unassign`,
			{ nodeIds },
		)

		return unwrapResponse<RegisterNodesToGatewayResult>(response.data)
	},

	getCompanyGatewayNodes: async (companyId: string, gatewayId: string) => {
		const response = await request.get<
			ApiResponse<DeviceNode[]> | DeviceNode[]
		>(`/admin/devices/companies/${companyId}/gateways/${gatewayId}/nodes`)

		return unwrapResponse<DeviceNode[]>(response.data)
	},
}
