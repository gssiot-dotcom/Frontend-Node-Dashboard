export type UserType = 'admin' | 'manager' | 'worker'

export type AuthUser = {
	_id: string
	companyId?: string
	name: string
	email: string
	phone?: string
	userType: UserType
}

export type SignupDto = {
	name: string
	email: string
	password: string
	confirmPassword?: string
	phone: string
	userType: UserType
}

export type LoginDto = {
	email: string
	password: string
}

export type SignupResponse = LoginResponse

export type LoginResponse = {
	user: AuthUser
	accessToken: string
}

export type MeResponse = AuthUser
