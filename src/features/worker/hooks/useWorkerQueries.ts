import { useQuery } from '@tanstack/react-query'
import { workerApi } from '../api/worker.api'

type WorkerDashboardParams = {
	search?: string
}

export const workerQueryKeys = {
	all: ['worker'] as const,

	myCompany: () => [...workerQueryKeys.all, 'my-company'] as const,

	dashboard: (params?: WorkerDashboardParams) =>
		[...workerQueryKeys.all, 'dashboard', params] as const,

	buildingNodesPage: (buildingId?: string, nodeType?: string) =>
		[
			...workerQueryKeys.all,
			'building-nodes-page',
			buildingId,
			nodeType,
		] as const,
}

export function useWorkerMyCompany() {
	return useQuery({
		queryKey: workerQueryKeys.myCompany(),
		queryFn: () => workerApi.getMyCompany(),
	})
}

export function useWorkerDashboard(params?: WorkerDashboardParams) {
	return useQuery({
		queryKey: workerQueryKeys.dashboard(params),
		queryFn: () => workerApi.getDashboard(params),
	})
}

export function useWorkerBuildingNodesPage(
	buildingId?: string,
	nodeType?: string,
) {
	return useQuery({
		queryKey: workerQueryKeys.buildingNodesPage(buildingId, nodeType),
		queryFn: () => workerApi.getBuildingNodesPage(buildingId!, nodeType!),
		enabled: !!buildingId && !!nodeType,
	})
}
