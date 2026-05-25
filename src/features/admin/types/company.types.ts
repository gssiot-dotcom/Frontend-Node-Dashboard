export type CompanyUserType = 'Manager' | 'Worker'

export type CompanyMemberStatus = 'ACTIVE' | 'INACTIVE'

export interface CompanyMember {
	_id: string
	companyMemberId: string

	name: string
	email: string
	phone: string
	userType: CompanyUserType

	memberRole: string
	status: CompanyMemberStatus

	checked: boolean
	assigned: boolean
}

export type Company = {
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

export type CreateCompanyDto = {
	companyName: string
	companyTel?: string
	companyAddress: string
}

export interface CompanyMember {
	id: string
	_id: string
	companyMemberId: string

	name: string
	email: string
	phone: string
	userType: CompanyUserType

	memberRole: string
	status: CompanyMemberStatus

	checked: boolean
	assigned: boolean
}

export interface CreateCompanyMemberUserPayload {
	name: string
	email: string
	phone: string
	userType: CompanyUserType
	password: string
	passwordConfirm: string
}

export interface UpdateCompanyMemberStatusesPayload {
	activeMemberIds: string[]
}

export interface UpdateCompanyMemberStatusesResponse {
	members: CompanyMember[]
	activeCount: number
	inactiveCount: number
	totalCount: number
}

export type UpdateCompanyDto = Partial<CreateCompanyDto>

// ===================== Company Logo api types ========================= //

export type AssetKind =
	| 'companyLogo'
	| 'buildingPlanImage'
	| 'buildingRealImage'

export type GetAssetUploadUrlParams = {
	kind: AssetKind
	companyId: string
	buildingId?: string
	fileName: string
	contentType: string
}

export type GetAssetUploadUrlResponse = {
	bucket: string
	key: string
	uploadUrl: string
	method: 'PUT'
	headers: {
		'Content-Type': string
	}
}

export type SaveAssetParams = {
	kind: AssetKind
	companyId: string
	buildingId?: string
	key: string
}

export type RemoveAssetParams = {
	kind: AssetKind
	companyId: string
	buildingId?: string
	key: string
	deleteFromS3?: boolean
}
