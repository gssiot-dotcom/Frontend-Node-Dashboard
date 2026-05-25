import { Company } from '@/features/admin/types/company.types'

// features/manager/api/manager.types.ts

export interface ManagerCompanyStatistics {
	buildingsCount: number
	managersCount: number
	workersCount: number
	gatewaysCount: number
	nodesCount: number
	onlineNodesCount: number
	warningNodesCount: number
}

export interface ManagerDashboardData {
	company: Company
	companyStatistics: ManagerCompanyStatistics
	buildingsList: Building[]
	companyMembersList: CompanyMember[]
	gatewaysList: Gateway[]
}

export interface Building {
	_id: string
	title: string
	address: string
	buildingType: string
	companyId: string
	buildingPlanImage?: string[]
	buildingRealImage?: string[]
	buildingStatus: string
	startDate: string
	createdAt: string
	updatedAt: string
	checked: boolean
	assigned: boolean
	isAssigned: boolean
	statistics?: BuildingStatistics
}

export interface BuildingStatistics {
	totalNodesCount: number
	onlineNodesCount: number
	totalGatewaysCounts: number
	totalWorkersCount: number
	doorNodeCount: number
	angleNodeCount: number
	gangformNodeCount: number
}

export interface CompanyMember {
	_id: string
	id: string
	companyMemberId: string
	name: string
	email: string
	phone: string
	type: string
	memberRole: string
	status: string
	checked: boolean
	assigned: boolean
}

export interface Gateway {
	_id: string
	serialNumber: string
	gatewayType: string
	isAssigned: boolean
	isOnline: boolean
	buildingId: string | null
	companyId: string
	installedLocation: string
}

export interface Node {
	_id: string
	number: number
	nodeType: string
	status: string
	isAssigned: boolean
	gatewayId: string | null
	companyId: string
	installedLocation: string
}

export interface BuildingAlarmLevel {
	buildingId: string
	alarmType: string
	blue: number
	green: number
	yellow: number
	red: number
}

export interface BuildingWorker {
	_id: string
	name: string
	email: string
	phone: string
	userType: string
	checked: boolean
	assignedBuildingId: string | null
	buildingMemberId?: string
	companyMemberId?: string
}

export interface PresignedUrlData {
	bucket: string
	key: string
	uploadUrl: string
	method: string
	headers: { 'Content-Type': string }
}

export interface MemberStatusesResult {
	members: CompanyMember[]
	activeCount: number
	inactiveCount: number
	totalCount: number
}
