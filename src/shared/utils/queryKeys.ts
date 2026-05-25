export const queryKeys = {
	auth: {
		me: ['auth', 'me'] as const,
	},

	admin: {
		companies: {
			all: ['admin', 'companies'] as const,
			detail: (companyId: string) => ['admin', 'companies', companyId] as const,
		},

		buildings: {
			byCompany: (companyId: string) =>
				['admin', 'companies', companyId, 'buildings'] as const,
			detail: (buildingId: string) =>
				['admin', 'buildings', buildingId] as const,
		},

		gateways: {
			byBuilding: (buildingId: string) =>
				['admin', 'buildings', buildingId, 'gateways'] as const,
			detail: (gatewayId: string) => ['admin', 'gateways', gatewayId] as const,
		},

		nodes: {
			byGateway: (gatewayId: string) =>
				['admin', 'gateways', gatewayId, 'nodes'] as const,
			detail: (nodeId: string) => ['admin', 'nodes', nodeId] as const,
		},

		users: {
			all: ['admin', 'users'] as const,
			byCompany: (companyId: string) =>
				['admin', 'companies', companyId, 'users'] as const,
			detail: (userId: string) => ['admin', 'users', userId] as const,
		},
	},

	manager: {
		company: {
			me: ['manager', 'company', 'me'] as const,
		},

		buildings: {
			all: ['manager', 'buildings'] as const,
			detail: (buildingId: string) =>
				['manager', 'buildings', buildingId] as const,
		},

		gateways: {
			byBuilding: (buildingId: string) =>
				['manager', 'buildings', buildingId, 'gateways'] as const,
			detail: (gatewayId: string) =>
				['manager', 'gateways', gatewayId] as const,
		},

		nodes: {
			byGateway: (gatewayId: string) =>
				['manager', 'gateways', gatewayId, 'nodes'] as const,
			detail: (nodeId: string) => ['manager', 'nodes', nodeId] as const,
		},

		members: {
			all: ['manager', 'members'] as const,
			detail: (memberId: string) => ['manager', 'members', memberId] as const,
		},
	},

	worker: {
		nodes: {
			all: ['worker', 'nodes'] as const,
			detail: (nodeId: string) => ['worker', 'nodes', nodeId] as const,
		},
	},
}
