// features/manager/api/manager.api.ts

import {
	AdminBuildingsPageResponse,
	Building,
	BuildingNodesPageResponse,
} from '@/features/admin/types/building.types'
import {
	Company,
	UpdateCompanyMemberStatusesPayload,
} from '@/features/admin/types/company.types'
import { Gateway } from '@/features/admin/types/gateway.types'
import { request } from '@/shared/api/httpClient'
import { ApiResponse } from '@/shared/api/types'
import {
	BuildingWorker,
	ManagerDashboardData,
	MemberStatusesResult,
	PresignedUrlData,
} from '../types/company.types'
import { CompanyMember } from '../types/member.types'

async function unwrap<T>(
	promise: Promise<{ data: ApiResponse<T> }>,
): Promise<T> {
	const res = await promise
	return res.data.data
}

type AssetKind = 'companyLogo' | 'buildingPlanImage' | 'buildingRealImage'

type SaveCompanyAssetPayload = {
	kind: 'companyLogo'
	companyId: string
	key: string
}

type SaveBuildingAssetPayload = {
	kind: 'buildingPlanImage' | 'buildingRealImage'
	companyId: string
	buildingId: string
	key: string
}

export const managerApi = {
	// My Company
	getMyCompany: () => unwrap<Company>(request.get('/manager/company/me')),
	// Dashboard
	getDashboard: () =>
		unwrap<ManagerDashboardData>(request.get('/manager/dashboard')),

	// Members
	getMembers: (params?: { memberRole?: string; search?: string }) =>
		unwrap<CompanyMember[]>(request.get('/manager/members', { params })),

	createMember: (payload: {
		name: string
		email: string
		phone?: string
		userType: string
		password: string
		passwordConfirm: string
	}) => unwrap<CompanyMember>(request.post('/manager/members', payload)),

	updateMemberStatuses: (payload: UpdateCompanyMemberStatusesPayload) =>
		unwrap<MemberStatusesResult>(
			request.patch('/manager/members/statuses', payload),
		),

	// Buildings (dashboard dialog)
	getBuildings: (params?: { search?: string }) =>
		unwrap<Building[]>(request.get('/manager/buildings', { params })),

	createBuilding: (payload: {
		title: string
		address: string
		buildingType: string
	}) => unwrap<Building>(request.post('/manager/buildings', payload)),

	updateBuildingStatuses: (activeBuildingIds: string[]) =>
		unwrap<Building[]>(
			request.patch('/manager/buildings/statuses', { activeBuildingIds }),
		),

	// Buildings page
	getBuildingsPage: () =>
		unwrap<AdminBuildingsPageResponse>(request.get('/manager/buildings-page')),

	// Building gateways
	getBuildingGateways: (buildingId: string) =>
		unwrap<{ gatewaysList: Gateway[] }>(
			request.get(`/manager/buildings/${buildingId}/gateways`),
		),

	updateBuildingGateways: (buildingId: string, gatewayIds: string[]) =>
		unwrap<{ message: string }>(
			request.put(`/manager/buildings/${buildingId}/gateways`, { gatewayIds }),
		),

	// Building workers
	getBuildingWorkers: (buildingId: string) =>
		unwrap<{ workersList: BuildingWorker[] }>(
			request.get(`/manager/buildings/${buildingId}/workers`),
		),

	updateBuildingWorkers: (buildingId: string, workerIds: string[]) =>
		unwrap<{ message: string }>(
			request.put(`/manager/buildings/${buildingId}/workers`, { workerIds }),
		),

	createBuildingWorker: (
		buildingId: string,
		payload: {
			name: string
			email: string
			phone: string
			password: string
			passwordConfirm: string
		},
	) =>
		unwrap<BuildingWorker>(
			request.post(`/manager/buildings/${buildingId}/workers`, payload),
		),

	// Nodes page
	getBuildingNodesPage: (buildingId: string, nodeType: string) =>
		unwrap<BuildingNodesPageResponse>(
			request.get(`/manager/buildings/${buildingId}/nodes-page`, {
				params: { nodeType },
			}),
		),

	// Assets
	getPresignedUrl: (payload: {
		kind: string
		buildingId?: string
		companyId: string
		fileName: string
		contentType: string
	}) =>
		unwrap<PresignedUrlData>(
			request.post('/manager/assets/presigned-url', payload),
		),

	saveBuildingAsset: (payload: SaveBuildingAssetPayload) =>
		unwrap<Building>(request.post('/manager/assets/save', payload)),

	saveCompanyAsset: (payload: SaveCompanyAssetPayload) =>
		unwrap<Company>(request.post('/manager/assets/save', payload)),

	removeAsset: (payload: {
		kind: string
		buildingId?: string
		key: string
		companyId: string
	}) =>
		unwrap<{ deleted: boolean }>(
			request.post('/manager/assets/remove', payload),
		),
}
