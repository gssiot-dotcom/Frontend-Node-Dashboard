export interface DeviceGateway {
	_id: string
	id: string

	serialNumber: string
	gatewayType: string
	isAssigned: boolean

	companyId: string | null
	companyName: string | null

	buildingId: string | null
	buildingName: string | null
	buildingNumber: number | null
	buildingAddress: string | null

	installedLocation: string | null
	gatewayStatus: string
	isOnline: boolean

	lastSeenAt: string | null
	createdAt: string
	updatedAt: string
}

export interface DeviceNode {
	_id: string
	id: string

	number: number
	nodeType: string

	companyId: string | null
	companyName: string | null

	gatewayId: string | null
	gatewaySerialNumber?: string

	status: string
	installedLocation: string
	installLocationImg: string | null

	isAssigned: boolean

	doorState: number
	batteryLevel: number

	angleX: number
	angleY: number
	calibratedX: number
	calibratedY: number

	saveStatus: boolean
	saveStatusLastChange: string

	lastSeenAt: string | null
	createdAt: string
	updatedAt: string
}

export interface CheckNodesDto {
	nodeType: string
	numbers: number[]
}

export interface CheckNodesResult {
	ok: boolean
	requestedCount: number
	foundCount: number
	missingNumbers: number[]
	nodes: DeviceNode[]
}

export interface RegisterNodesToGatewayDto {
	nodeType: string
	numbers: number[]
}

export interface RegisterNodesToGatewayResult {
	ok: boolean
	message: string
	gatewayId: string
	gatewaySerialNumber: string
	nodes: DeviceNode[]
}
