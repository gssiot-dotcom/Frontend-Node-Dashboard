import type {
	CreateBuildingDto,
	UpdateBuildingDto,
} from '@/features/admin/types/building.types'
import { queryKeys } from '@/shared/utils/queryKeys'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { managerBuildingsApi } from '../api/companyBuildings.api'

export function useCompanyBuildings() {
	return useQuery({
		queryKey: queryKeys.manager.buildings.all,
		queryFn: managerBuildingsApi.getAll,
	})
}

export function useCompanyBuilding(buildingId: string | null) {
	return useQuery({
		queryKey: buildingId
			? queryKeys.manager.buildings.detail(buildingId)
			: ['manager', 'buildings', 'detail', 'empty'],
		queryFn: () => managerBuildingsApi.getById(buildingId!),
		enabled: Boolean(buildingId),
	})
}

export function useCreateCompanyBuilding() {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: (data: CreateBuildingDto) => managerBuildingsApi.create(data),
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: queryKeys.manager.buildings.all,
			})
		},
	})
}

export function useUpdateCompanyBuilding() {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: ({
			buildingId,
			data,
		}: {
			buildingId: string
			data: UpdateBuildingDto
		}) => managerBuildingsApi.update(buildingId, data),

		onSuccess: (_, variables) => {
			queryClient.invalidateQueries({
				queryKey: queryKeys.manager.buildings.all,
			})

			queryClient.invalidateQueries({
				queryKey: queryKeys.manager.buildings.detail(variables.buildingId),
			})
		},
	})
}

export function useDeleteCompanyBuilding() {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: (buildingId: string) => managerBuildingsApi.delete(buildingId),
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: queryKeys.manager.buildings.all,
			})
		},
	})
}
