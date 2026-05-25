import { queryKeys } from '@/shared/utils/queryKeys'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { managerMembersApi } from '../api/companyMembers.api'
import type {
	CreateCompanyMemberDto,
	UpdateCompanyMemberDto,
} from '../types/member.types'

export function useCompanyMembers() {
	return useQuery({
		queryKey: queryKeys.manager.members.all,
		queryFn: managerMembersApi.getAll,
	})
}

export function useCompanyMember(memberId: string | null) {
	return useQuery({
		queryKey: memberId
			? queryKeys.manager.members.detail(memberId)
			: ['manager', 'members', 'detail', 'empty'],
		queryFn: () => managerMembersApi.getById(memberId!),
		enabled: Boolean(memberId),
	})
}

export function useCreateCompanyMember() {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: (data: CreateCompanyMemberDto) =>
			managerMembersApi.create(data),

		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: queryKeys.manager.members.all,
			})
		},
	})
}

export function useUpdateCompanyMember() {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: ({
			memberId,
			data,
		}: {
			memberId: string
			data: UpdateCompanyMemberDto
		}) => managerMembersApi.update(memberId, data),

		onSuccess: (_, variables) => {
			queryClient.invalidateQueries({
				queryKey: queryKeys.manager.members.all,
			})

			queryClient.invalidateQueries({
				queryKey: queryKeys.manager.members.detail(variables.memberId),
			})
		},
	})
}

export function useDeleteCompanyMember() {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: (memberId: string) => managerMembersApi.delete(memberId),

		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: queryKeys.manager.members.all,
			})
		},
	})
}
