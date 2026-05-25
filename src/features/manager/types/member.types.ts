import {
	CompanyMemberStatus,
	CompanyUserType,
} from '@/features/admin/types/company.types'

export type CompanyMemberRole = 'manager' | 'worker'

export type CompanyMember = {
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

export type CreateCompanyMemberDto = {
	name: string
	email: string
	password: string
	phone?: string
	role: CompanyMemberRole
}

export type UpdateCompanyMemberDto = Partial<
	Omit<CreateCompanyMemberDto, 'password'>
> & {
	password?: string
	isActive?: boolean
}
