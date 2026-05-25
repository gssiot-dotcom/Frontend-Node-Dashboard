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
	buildingAlarmLevel: {
		buildingId: string
		alarmType: string
		green: number
		yellow: number
		red: number
	} | null
}

export type AlarmType = 'gangform_node' | 'vertical' | string

export type UpdateBuildingAlarmLevelPayload = {
	buildingId: string
	alarmType: AlarmType
	levels: AlarmLevels
}
