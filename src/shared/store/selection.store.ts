import { create } from 'zustand'

type SelectionState = {
	selectedCompanyId: number | null
	selectedBuildingId: number | null
	selectedGatewayId: number | null

	setSelectedCompanyId: (companyId: number | null) => void
	setSelectedBuildingId: (buildingId: number | null) => void
	setSelectedGatewayId: (gatewayId: number | null) => void

	resetSelection: () => void
}

export const useSelectionStore = create<SelectionState>(set => ({
	selectedCompanyId: null,
	selectedBuildingId: null,
	selectedGatewayId: null,

	setSelectedCompanyId: companyId => {
		set({
			selectedCompanyId: companyId,
			selectedBuildingId: null,
			selectedGatewayId: null,
		})
	},

	setSelectedBuildingId: buildingId => {
		set({
			selectedBuildingId: buildingId,
			selectedGatewayId: null,
		})
	},

	setSelectedGatewayId: gatewayId => {
		set({
			selectedGatewayId: gatewayId,
		})
	},

	resetSelection: () => {
		set({
			selectedCompanyId: null,
			selectedBuildingId: null,
			selectedGatewayId: null,
		})
	},
}))
