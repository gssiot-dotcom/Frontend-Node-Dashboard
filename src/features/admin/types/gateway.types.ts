import { ApiResponse } from '@/shared/api/types'

export const GATEWAY_TYPES = [
	{ value: 'nodes_gateway', label: 'Nodes gateway' },
	{ value: 'security_office_gateway', label: 'Security room gateway' },
] as const

export type GatewayTypes = (typeof GATEWAY_TYPES)[number]['value']
export type GatewayStatus = 'online' | 'offline' | 'warning'

export type Gateway = {
	_id: string
	buildingId: string
	serialNumber: string
	name: string
	status: GatewayStatus
	gatewayType: GatewayTypes
	installedLocation?: string
	lastConnectedAt?: string
	createdAt: string
	updatedAt: string
}

export type CreateGatewayDto = {
	serialNumber: string
	gatewayType: GatewayTypes
	installedLocation?: string
}

export type GatewayResponse = {
	_id: string
	serialNumber: string
	gatewayType: GatewayTypes
	installedLocation?: string
	createdAt?: string
	updatedAt?: string
}

export type CreateGatewayResponse = ApiResponse<GatewayResponse>

export type UpdateGatewayDto = Partial<CreateGatewayDto> & {
	status?: GatewayStatus
}
