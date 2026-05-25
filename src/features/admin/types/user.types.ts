export type UserType = 'admin' | 'manager' | 'worker'

export type AdminUser = {
	_id: string
	companyId?: string
	name: string
	email: string
	phone?: string
	userType: UserType
	isActive: boolean
	createdAt: string
	updatedAt: string
}

export type CreateAdminUserDto = {
	companyId?: string
	name: string
	email: string
	password: string
	phone?: string
	userType: UserType
}

export type UpdateAdminUserDto = Partial<
	Omit<CreateAdminUserDto, 'password'>
> & {
	password?: string
	isActive?: boolean
}

export interface OrganizationUserListItem {
	_id: string
	name: string
	email: string
	phone: string
	userType: string
	userStatus: string
	isAssigned: boolean
	companyId?: string | null
	companyName?: string | null
}
