import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { companyAssignmentApi } from '../api/companyAssignment.api'
import type {
	CompanyAssignmentsParams,
	UpdateCompanyGatewaysDto,
	UpdateCompanyNodesDto,
} from '../types/companyAssignment.types'

export const companyAssignmentQueryKeys = {
	all: ['company-assignments'] as const,

	list: (params?: CompanyAssignmentsParams) =>
		[...companyAssignmentQueryKeys.all, 'list', params] as const,
}

export function useCompanyAssignmentsQuery(params?: CompanyAssignmentsParams) {
	return useQuery({
		queryKey: companyAssignmentQueryKeys.list(params),
		queryFn: () => companyAssignmentApi.getCompanyAssignments(params),
	})
}

export function useUpdateCompanyGatewaysMutation() {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: ({
			companyId,
			data,
		}: {
			companyId: string
			data: UpdateCompanyGatewaysDto
		}) => companyAssignmentApi.updateCompanyGateways(companyId, data),

		onSuccess: async () => {
			await queryClient.invalidateQueries({
				queryKey: companyAssignmentQueryKeys.all,
			})
		},
	})
}

export function useUpdateCompanyNodesMutation() {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: ({
			companyId,
			data,
		}: {
			companyId: string
			data: UpdateCompanyNodesDto
		}) => companyAssignmentApi.updateCompanyNodes(companyId, data),

		onSuccess: async () => {
			await queryClient.invalidateQueries({
				queryKey: companyAssignmentQueryKeys.all,
			})
		},
	})
}
