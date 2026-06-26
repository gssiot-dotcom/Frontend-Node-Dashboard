import { AlarmLevels } from '@/features/manager/components/AlarmLevelSetting'
import { BuildingStatistics } from '@/features/manager/types/company.types'
import { Gateway } from './gateway.types'
import { BaseBuildingNode, NodeTypes } from './node.types'

export type Building = {
	_id: string
	title: string
	companyId?: string
	address: string
	buildingType?: string
	buildingPlanImage?: string[]
	buildingRealImage?: string[]
	buildingStatus: 'active' | 'inactive'
	startDate?: Date
	checked?: boolean
	isAssigned?: boolean
	createdAt?: string
	updatedAt?: string
}

export type CreateBuildingForm = {
	title: string
	address: string
	buildingType?: string
	companyId?: string
}

export type UpdateBuildingDto = Partial<CreateBuildingForm>

export interface AdminBuildingStatistics {
	totalNodesCount: number
	onlineNodesCount: number
	totalGatewaysCounts: number
	totalWorkersCount: number
}

export interface AdminBuilding {
	_id: string
	companyId: string
	title: string
	address?: string
	buildingStatus: 'active' | 'inactive' | 'paused'
	buildingPlanImage?: string[]
	buildingRealImage?: string[]
	statistics: BuildingStatistics
	createdAt?: string
	updatedAt?: string
}

export interface AdminBuildingsPageResponse {
	buildingsList: AdminBuilding[]
}

export type AssignableWorker = {
	_id: string
	name: string
	email: string
	phone?: string
	userType: string
	checked: boolean
	assignedBuildingId: string | null
}

export type AssignableGateway = {
	_id: string
	serialNumber: string
	gatewayType: string
	gatewayStatus: 'online' | 'offline' | 'warning'
	checked: boolean
	assignedBuildingId: string | null
}

export type CreateWorkerPayload = {
	name: string
	email: string
	phone: string
	password: string
	passwordConfirm: string
}

export type AdminBuildingWorkersResponse = {
	workersList: AssignableWorker[]
}

export type AdminBuildingGatewaysResponse = {
	gatewaysList: AssignableGateway[]
}

export type BuildingNodesPageParams = {
	companyId: string
	nodeType: NodeTypes
}

export type BuildingNodesPageResponse<TNode = BaseBuildingNode> = {
	nodesList: TNode[]
	gatewayList: Gateway[]
	gatewayAlarmSettings: GatewayAlarmSetting[]
	buildingAlarmLevel: {
		buildingId: string
		alarmType: string
		green: number
		yellow: number
		red: number
	} | null
}

export type AlarmType = 'gangform_node' | 'vertical' | string

export type GatewayAlarmNodeSetting = {
	alarmEnabled: boolean
	alarmLevel1: number | null
	alarmLevel2: number | null
	alarmLevel3: number | null
	faultFilterNodes: number[]
}

export type GatewayAlarmSetting = {
	_id: string
	gatewayId: string
	gatewaySerialNum: string | null
	door: GatewayAlarmNodeSetting
	angle: GatewayAlarmNodeSetting
	vertical: GatewayAlarmNodeSetting
	updatedBy?: string | null
	createdAt?: string
	updatedAt?: string
}

export type GatewayAlarmResult = {
	gatewayId: string | null
	gatewaySerialNum: string
	status: 'success' | 'error' | 'timeout'
	message: string
	response?: unknown
}

export type GatewayAlarmSummary = {
	total: number
	successCount: number
	errorCount: number
	timeoutCount: number
}

export type UpdateBuildingAlarmLevelResponse = {
	alarmLevel: BuildingNodesPageResponse['buildingAlarmLevel']
	gatewayResults: GatewayAlarmResult[]
	summary: GatewayAlarmSummary
}

export type UpdateBuildingAlarmLevelPayload = {
	companyId?: string
	buildingId: string
	gatewayId?: string
	enabled?: boolean
	alarmType: AlarmType
	levels: AlarmLevels
}

export type UpdateFaultFilterResponse = {
	faultFilterNodes: number[]
	gatewayResults: GatewayAlarmResult[]
	summary: GatewayAlarmSummary
}

export type UpdateFaultFilterPayload = {
	companyId?: string
	buildingId: string
	gatewayId: string
	alarmType: AlarmType
	nodeNumber?: number
	enabled?: boolean
	nodes?: number[]
}
