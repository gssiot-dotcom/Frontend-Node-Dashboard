import { queryKeys } from '@/shared/utils/queryKeys'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { adminUsersApi } from '../api/users.api'
import type {
	CreateAdminUserDto,
	UpdateAdminUserDto,
} from '../types/user.types'

export function useAdminUsers() {
	return useQuery({
		queryKey: queryKeys.admin.users.all,
		queryFn: adminUsersApi.getAll,
	})
}

export function useAdminCompanyUsers(companyId: string | null) {
	return useQuery({
		queryKey: companyId
			? queryKeys.admin.users.byCompany(companyId)
			: ['admin', 'company-users', 'empty'],
		queryFn: () => adminUsersApi.getByCompanyId(companyId!),
		enabled: Boolean(companyId),
	})
}

export function useAdminUser(userId: string | null) {
	return useQuery({
		queryKey: userId
			? queryKeys.admin.users.detail(userId)
			: ['admin', 'users', 'detail', 'empty'],
		queryFn: () => adminUsersApi.getById(userId!),
		enabled: Boolean(userId),
	})
}

export function useCreateAdminUser() {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: (data: CreateAdminUserDto) => adminUsersApi.create(data),
		onSuccess: (_, variables) => {
			queryClient.invalidateQueries({
				queryKey: queryKeys.admin.users.all,
			})

			if (variables.companyId) {
				queryClient.invalidateQueries({
					queryKey: queryKeys.admin.users.byCompany(variables.companyId),
				})
			}
		},
	})
}

export function useUpdateAdminUser() {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: ({
			userId,
			data,
		}: {
			userId: string
			companyId?: string
			data: UpdateAdminUserDto
		}) => adminUsersApi.update(userId, data),

		onSuccess: (_, variables) => {
			queryClient.invalidateQueries({
				queryKey: queryKeys.admin.users.all,
			})

			queryClient.invalidateQueries({
				queryKey: queryKeys.admin.users.detail(variables.userId),
			})

			if (variables.companyId) {
				queryClient.invalidateQueries({
					queryKey: queryKeys.admin.users.byCompany(variables.companyId),
				})
			}
		},
	})
}

export function useDeleteAdminUser() {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: ({ userId }: { userId: string; companyId?: string }) =>
			adminUsersApi.delete(userId),

		onSuccess: (_, variables) => {
			queryClient.invalidateQueries({
				queryKey: queryKeys.admin.users.all,
			})

			if (variables.companyId) {
				queryClient.invalidateQueries({
					queryKey: queryKeys.admin.users.byCompany(variables.companyId),
				})
			}
		},
	})
}
