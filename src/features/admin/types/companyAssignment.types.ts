export type CompanyStatus = 'active' | 'inactive'

export type GatewayStatus = 'online' | 'offline' | 'warning'

export type NodeStatus =
	| 'normal'
	| 'warning'
	| 'danger'
	| 'offline'
	| 'online'
	| string

export type AssignmentCompany = {
	_id: string
	companyName: string
	companyAddress: string
	companyStatus: CompanyStatus
}

export type AssignmentGateway = {
	_id: string
	serialNumber: string
	gatewayType: string
	gatewayStatus: GatewayStatus | string
	installedLocation: string | null
	companyId: string | null
	isAssigned: boolean
}

type NodeType = 'gangform_node' | 'angle_node' | 'door_node'

export type AssignmentNodeLocation =
	| string
	| {
			planImageIndex?: number | null
			xPercent?: number | null
			yPercent?: number | null
	  }
	| null

export type AssignmentNode = {
	_id: string
	number: number
	nodeType: NodeType
	status: NodeStatus
	installedLocation: AssignmentNodeLocation
	installedLocationTitle?: string | null
	companyId: string | null
	gatewayId: string | null
	isAssigned: boolean
}

export type CompanyAssignmentsResult = {
	companies: AssignmentCompany[]
	gateways: AssignmentGateway[]
	nodes: AssignmentNode[]
}

export type CompanyAssignmentsParams = {
	search?: string
}

export type UpdateCompanyGatewaysDto = {
	gatewayIds: string[]
}

export type UpdateCompanyNodesDto = {
	nodeIds: string[]
}

// ============================================= //
