import { Company } from '@/features/admin/types/company.types'

export type UserType = 'Worker' | 'Manager'

export type CreateUserForm = {
	name: string
	email: string
	phone: string
	userType: UserType
	password: string
	passwordConfirm: string
}

export type Manager = {
	id: string
	name: string
	email: string
	phone?: string
	userType?: UserType
	assigned?: boolean
}

// =============================== Building types ===============================
export type CreateBuildingForm = {
	name: string
	address: string
	buildingNumber: string
	buildingType: string
}

// ============================== Company types ===============================
export type CompanyDashboardHeaderProps = {
	company: Company
	logoUrl?: string
	onLogoChange: (logoUrl: string) => void
}

export type EditCompanyForm = {
	name: string
	location: string
}
