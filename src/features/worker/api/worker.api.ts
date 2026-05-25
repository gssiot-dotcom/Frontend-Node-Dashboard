import { BuildingNodesPageResponse } from '@/features/admin/types/building.types'
import { Company } from '@/features/admin/types/company.types'
import { Building } from '@/features/manager/types/company.types'
import { request } from '@/shared/api/httpClient'
import { ApiResponse } from '@/shared/api/types'

async function unwrap<T>(
	promise: Promise<{ data: ApiResponse<T> }>,
): Promise<T> {
	const res = await promise
	return res.data.data
}

type BuildingsPage = {
	buildingsList: Building[]
}

export const workerApi = {
	// My Company
	getMyCompany: () => unwrap<Company>(request.get('/worker/company')),
	// Dashboard
	getDashboard: (params?: { search?: string }) =>
		unwrap<BuildingsPage>(
			request.get('/worker/dashboard/buildings', { params }),
		),

	// Nodes page
	getBuildingNodesPage: (buildingId: string, nodeType: string) =>
		unwrap<BuildingNodesPageResponse>(
			request.get(`/worker/buildings/${buildingId}/nodes-page`, {
				params: { nodeType },
			}),
		),
}
