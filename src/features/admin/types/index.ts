export type UserType = 'Worker' | 'Manager'

export type CreateUserForm = {
	userName: string
	email: string
	phone: string
	type: UserType
	password: string
	passwordConfirm: string
}

export type Manager = {
	id: string
	name: string
	email: string
	phone?: string
	type?: UserType
	assigned?: boolean
}

// =============================== Building types ===============================
export type CreateBuildingForm = {
	name: string
	address: string
	buildingNumber: string
	buildingType: string
}

export type AvailableBuilding = {
	id: string
	name: string
	location: string
	address?: string
	buildingNumber?: string
	buildingType?: string
	assigned?: boolean
}

// ============================== Company types ===============================

export type EditCompanyForm = {
	name: string
	location: string
}
