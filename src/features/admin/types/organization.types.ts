export interface PaginationMeta {
	total: number
	page: number
	limit: number
	totalPages: number
	hasNextPage: boolean
	hasPrevPage: boolean
}

export interface PaginatedData<T> {
	items: T[]
	pagination: PaginationMeta
}

export interface ApiResponse<T> {
	state: 'success' | 'error' | 'fail'
	message: string
	data: T
}

export interface PaginationParams {
	page?: number
	limit?: number
	search?: string
}

export interface OrganizationCompany {
	_id: string
	id?: string
	companyName: string
	companyCode?: string | null
	companyAddress: string
	companyTel: string | null
	companyEmail: string | null
	companyLogo?: string | null
	companyStatus: string
	buildingCount?: number
	createdAt?: string
	updatedAt?: string
}

export interface OrganizationBuilding {
	_id: string
	id?: string
	title: string
	number?: number | null
	address: string
	buildingType: string
	buildingPlanImage?: string[]
	buildingRealImage?: string[]
	buildingStatus: string
	startDate?: string | null
	isAssigned: boolean
	companyId: string
	companyName?: string | null
	gatewayCount?: number
	createdAt?: string
	updatedAt?: string
}

export interface OrganizationGateway {
	_id: string
	id?: string
	serialNumber: string
	gatewayType: string
	gatewayStatus: string
	isAssigned: boolean
	companyId?: string | null
	buildingId: string | null
	buildingName?: string | null
	installedLocation: string | null
	lastSeenAt?: string | null
	createdAt?: string
	updatedAt?: string
}

export interface OrganizationUserListItem {
	_id: string
	id?: string
	name: string
	email: string
	phone: string
	userType: string
	userStatus: string
	isAssigned: boolean
	companyId: string | null
	companyName: string | null
}
