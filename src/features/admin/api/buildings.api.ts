import { NodeGraphicDataPoint } from '@/components/NodegraphicModal'
import { request } from '@/shared/api/httpClient'
import { ApiResponse } from '@/shared/api/types'
import type {
	AdminBuildingGatewaysResponse,
	AdminBuildingsPageResponse,
	AdminBuildingWorkersResponse,
	AssignableWorker,
	Building,
	BuildingNodesPageParams,
	BuildingNodesPageResponse,
	CreateBuildingForm,
	CreateWorkerPayload,
	UpdateBuildingAlarmLevelPayload,
	UpdateBuildingAlarmLevelResponse,
	UpdateBuildingDto,
	UpdateFaultFilterPayload,
	UpdateFaultFilterResponse,
} from '../types/building.types'
import { NodeTypes } from '../types/node.types'
import { unwrapResponse } from './device.api'

export type NodeGraphicDataParams = {
	nodeNumber: number
	nodeType: NodeTypes
	from: string
	to: string
}

export const adminBuildingsApi = {
	getByCompanyId: async (companyId: string) => {
		const response = await request.get<ApiResponse<Building[]>>(
			`/admin/companies/${companyId}/buildings`,
		)

		return response.data.data
	},

	updateCompanyBuildingStatuses: async (
		companyId: string,
		activeBuildingIds: string[],
	) => {
		const response = await request.patch<ApiResponse<null>>(
			`/admin/companies/${companyId}/buildings/statuses`,
			{ activeBuildingIds },
		)
		return response.data.data
	},

	getById: async (buildingId: string) => {
		const response = await request.get<ApiResponse<Building>>(
			`/admin/buildings/${buildingId}`,
		)

		return response.data.data
	},

	create: async (data: CreateBuildingForm) => {
		const response = await request.post<ApiResponse<Building>>(
			`/buildings`,
			data,
		)
		return response.data.data
	},

	update: async (buildingId: string, data: UpdateBuildingDto) => {
		const response = await request.patch<ApiResponse<Building>>(
			`/admin/buildings/${buildingId}`,
			data,
		)

		return response.data.data
	},

	delete: async (buildingId: string) => {
		await request.delete(`/admin/buildings/${buildingId}`)
	},

	getAdminCompanyBuildingsPage: async (companyId: string) => {
		const res = await request.get<ApiResponse<AdminBuildingsPageResponse>>(
			'/admin/buildings-page',
			{
				params: { companyId },
			},
		)

		return res.data.data
	},

	getAdminBuildingWorkers: async (buildingId: string) => {
		const res = await request.get<ApiResponse<AdminBuildingWorkersResponse>>(
			`/admin/buildings-page/${buildingId}/workers`,
		)

		return res.data.data.workersList || []
	},

	updateAdminBuildingWorkers: async ({
		buildingId,
		workerIds,
	}: {
		buildingId: string
		workerIds: string[]
	}) => {
		const res = await request.put(
			`/admin/buildings-page/${buildingId}/workers`,
			{
				workerIds,
			},
		)

		return res.data.data
	},

	createAdminBuildingWorker: async ({
		buildingId,
		payload,
	}: {
		buildingId: string
		payload: CreateWorkerPayload
	}) => {
		const res = await request.post<ApiResponse<AssignableWorker>>(
			`/admin/buildings-page/${buildingId}/workers`,
			payload,
		)

		return res.data.data
	},

	getAdminBuildingGateways: async (buildingId: string) => {
		const res = await request.get<ApiResponse<AdminBuildingGatewaysResponse>>(
			`/admin/buildings-page/${buildingId}/gateways`,
		)

		return res.data.data.gatewaysList || []
	},

	updateAdminBuildingGateways: async ({
		buildingId,
		gatewayIds,
	}: {
		buildingId: string
		gatewayIds: string[]
	}) => {
		const res = await request.put(
			`/admin/buildings-page/${buildingId}/gateways`,
			{
				gatewayIds,
			},
		)

		return res.data.data
	},

	getBuildingNodesPage: async (
		buildingId: string,
		params: BuildingNodesPageParams,
	) => {
		const response = await request.get<
			ApiResponse<BuildingNodesPageResponse> | BuildingNodesPageResponse
		>(`/admin/company/buildings/${buildingId}/nodes-page`, {
			params,
		})

		return unwrapResponse<BuildingNodesPageResponse>(response.data)
	},

	nodeGraphicData: async (params: NodeGraphicDataParams) => {
		const response = await request.get<
			ApiResponse<NodeGraphicDataPoint[]> | NodeGraphicDataPoint[]
		>('/nodes/graphic-data', {
			params,
		})

		return unwrapResponse<NodeGraphicDataPoint[]>(response.data)
	},

	updateBuildingAlarmLevel: async ({
		buildingId,
		gatewayId,
		enabled,
		alarmType,
		levels,
	}: UpdateBuildingAlarmLevelPayload) => {
		const response = await request.patch<
			ApiResponse<UpdateBuildingAlarmLevelResponse>
		>(
			`/admin/buildings/${buildingId}/alarm-level`,
			{
				gatewayId,
				enabled,
				alarmType,
				green: levels.caution,
				yellow: levels.warning,
				red: levels.danger,
			},
		)

		return response.data.data
	},

	updateManagerBuildingAlarmLevel: async ({
		buildingId,
		gatewayId,
		enabled,
		alarmType,
		levels,
	}: UpdateBuildingAlarmLevelPayload) => {
		const response = await request.patch<
			ApiResponse<UpdateBuildingAlarmLevelResponse>
		>(
			`/manager/buildings/${buildingId}/alarm-level`,
			{
				gatewayId,
				enabled,
				alarmType,
				green: levels.caution,
				yellow: levels.warning,
				red: levels.danger,
			},
		)

		return response.data.data
	},

	updateFaultFilter: async ({
		buildingId,
		gatewayId,
		enabled,
		alarmType,
		nodeNumber,
		nodes,
	}: UpdateFaultFilterPayload) => {
		const response = await request.patch<
			ApiResponse<UpdateFaultFilterResponse>
		>(`/admin/buildings/${buildingId}/fault-filter`, {
			gatewayId,
			enabled,
			alarmType,
			nodeNumber,
			nodes,
		})

		return response.data.data
	},

	updateManagerFaultFilter: async ({
		buildingId,
		gatewayId,
		enabled,
		alarmType,
		nodeNumber,
		nodes,
	}: UpdateFaultFilterPayload) => {
		const response = await request.patch<
			ApiResponse<UpdateFaultFilterResponse>
		>(`/manager/buildings/${buildingId}/fault-filter`, {
			gatewayId,
			enabled,
			alarmType,
			nodeNumber,
			nodes,
		})

		return response.data.data
	},
}
