import { useQuery } from '@tanstack/react-query'
import { organizationApi } from '../api/organization.api'
import type { PaginationParams } from '../types/organization.types'

export const organizationQueryKeys = {
	all: ['organization'] as const,

	companies: (params: PaginationParams) =>
		[...organizationQueryKeys.all, 'companies', params] as const,

	buildings: (params: PaginationParams) =>
		[...organizationQueryKeys.all, 'buildings', params] as const,

	users: (params: PaginationParams) =>
		[...organizationQueryKeys.all, 'users', params] as const,

	companyBuildings: (companyId?: string) =>
		[...organizationQueryKeys.all, 'company-buildings', companyId] as const,

	buildingGateways: (buildingId?: string) =>
		[...organizationQueryKeys.all, 'building-gateways', buildingId] as const,

	userCompanies: (userId?: string) =>
		[...organizationQueryKeys.all, 'user-companies', userId] as const,
}

export function useOrganizationCompaniesQuery(params: PaginationParams) {
	return useQuery({
		queryKey: organizationQueryKeys.companies(params),
		queryFn: () => organizationApi.getCompanies(params),
	})
}

export function useOrganizationBuildingsQuery(params: PaginationParams) {
	return useQuery({
		queryKey: organizationQueryKeys.buildings(params),
		queryFn: () => organizationApi.getBuildings(params),
	})
}

export function useOrganizationUsersQuery(params: PaginationParams) {
	return useQuery({
		queryKey: organizationQueryKeys.users(params),
		queryFn: () => organizationApi.getUsers(params),
	})
}

export function useCompanyBuildingsQuery(companyId?: string) {
	return useQuery({
		queryKey: organizationQueryKeys.companyBuildings(companyId),
		queryFn: () => organizationApi.getCompanyBuildings(companyId!),
		enabled: !!companyId,
	})
}

export function useBuildingGatewaysQuery(buildingId?: string) {
	return useQuery({
		queryKey: organizationQueryKeys.buildingGateways(buildingId),
		queryFn: () => organizationApi.getBuildingGateways(buildingId!),
		enabled: !!buildingId,
	})
}

export function useUserCompaniesQuery(userId?: string) {
	return useQuery({
		queryKey: organizationQueryKeys.userCompanies(userId),
		queryFn: () => organizationApi.getUserCompanies(userId!),
		enabled: !!userId,
	})
}
