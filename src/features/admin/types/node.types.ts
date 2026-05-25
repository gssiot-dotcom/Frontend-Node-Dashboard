import { ApiResponse } from '@/shared/api/types'
import { GatewayStatus } from './companyAssignment.types'
import { GatewayTypes } from './gateway.types'

export const NODE_TYPES = [
	{ value: 'door_node', label: '비계 출입문 노드' },
	{ value: 'angle_node', label: '비계전도 노드' },
	{ value: 'gangform_node', label: '수직구명줄 노드' },
] as const

export type NodeStatus = 'safe' | 'caution' | 'warning' | 'danger' | 'offline'
export type NodeTypes = (typeof NODE_TYPES)[number]['value']

export type CreateNodeDto = {
	nodeNumbers: number[]
	nodeType: NodeTypes
}

export type CreateNodesResponse = ApiResponse<{
	count: number
	nodes: unknown[]
}>

export type UpdateNodeDto = Partial<CreateNodeDto> & {
	status?: NodeStatus
}

export type GatewayRef =
	| string
	| {
			_id: string
			serialNumber?: string
			gatewayType?: GatewayTypes
			gatewayStatus?: GatewayStatus
	  }

export interface BaseBuildingNode {
	_id: string
	number: number
	nodeType: NodeTypes
	status: NodeStatus
	gatewayId: GatewayRef
	installedLocation?: string
	installLocationImg?: string | null
	lastSeenAt: string | null
	saveStatusLastChange: Date
	saveStatus: boolean
	isAssigned: boolean
	createdAt: string
	updatedAt: string
}

export interface ScaffoldingNode extends BaseBuildingNode {
	nodeType: 'door_node'
	doorState: 0 | 1
	batteryLevel: number
}

export interface AngleNode extends BaseBuildingNode {
	nodeType: 'angle_node'
	doorState: 0 | 1
	angleX: number
	angleY: number
	angleZ?: number
	calibratedX: number
	calibratedY: number
}

export interface GangformNode extends BaseBuildingNode {
	nodeType: 'gangform_node'
	angleX?: number
	angleY?: number
	angleZ?: number
}
