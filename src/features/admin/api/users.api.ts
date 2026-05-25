import { request } from '@/shared/api/httpClient'
import type {
	AdminUser,
	CreateAdminUserDto,
	UpdateAdminUserDto,
} from '../types/user.types'

export const adminUsersApi = {
	getAll: async () => {
		const response = await request.get<AdminUser[]>('/admin/users')
		return response.data
	},

	getByCompanyId: async (companyId: string) => {
		const response = await request.get<AdminUser[]>(
			`/admin/companies/${companyId}/users`,
		)

		return response.data
	},

	getById: async (userId: string) => {
		const response = await request.get<AdminUser>(`/admin/users/${userId}`)

		return response.data
	},

	create: async (data: CreateAdminUserDto) => {
		const response = await request.post<AdminUser>('/admin/users', data)

		return response.data
	},

	update: async (userId: string, data: UpdateAdminUserDto) => {
		const response = await request.patch<AdminUser>(
			`/admin/users/${userId}`,
			data,
		)

		return response.data
	},

	delete: async (userId: string) => {
		await request.delete(`/admin/users/${userId}`)
	},
}
