import { useQuery } from '@tanstack/react-query'
import { adminDashboardApi } from '../api/dashboard.api'
import { AdminDashboardParams } from '../types/dashboard.types'

export const adminDashboardQueryKeys = {
	all: ['admin-dashboard'] as const,

	list: (params?: AdminDashboardParams) =>
		[...adminDashboardQueryKeys.all, 'list', params] as const,
}

export function useAdminDashboardQuery(params?: AdminDashboardParams) {
	return useQuery({
		queryKey: adminDashboardQueryKeys.list(params),
		queryFn: () => adminDashboardApi.getAdminDashboard(params),
	})
}
