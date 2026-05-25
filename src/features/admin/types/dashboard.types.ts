import { Building } from './building.types'

export type PaginationMeta = {
	page: number
	limit: number
	totalItems: number
	totalPages: number
	hasNextPage?: boolean
	hasPrevPage?: boolean
}

export type AdminDashboardParams = {
	page?: number
	limit?: number
	search?: string
}

export type AdminCompany = {
	_id: string
	companyName: string
	companyEmail?: string
	companyPhone?: string
	companyAddress?: string
	companyLogo?: string
	companyStatus?: string
	createdAt?: string
	updatedAt?: string
}

export type AdminCompanyStatistics = {
	buildingsCount: number
	managersCount: number
	workersCount: number
	gatewaysCount: number
	nodesCount: number
	onlineNodesCount: number
	warningNodesCount: number
}

export type AdminCompanyMember = {
	_id: string
	companyId: string
	memberRole: string
	status: string
	memberId?: {
		_id: string
		name?: string
		email?: string
		phone?: string
		userType?: string
	}
	createdAt?: string
	updatedAt?: string
}

export type AdminGateway = {
	_id: string
	companyId: string
	gatewayName?: string
	gatewayMac?: string
	status?: string
	isAssigned?: boolean
	createdAt?: string
	updatedAt?: string
}

export type AdminCompanyDashboardItem = {
	company: AdminCompany
	companyStatistics: AdminCompanyStatistics
	buildingsList: Building[]
	companyMembersList: AdminCompanyMember[]
	gatewaysList: AdminGateway[]
}

export type AdminDashboardResult = {
	companies: AdminCompanyDashboardItem[]
	pagination: PaginationMeta
}
