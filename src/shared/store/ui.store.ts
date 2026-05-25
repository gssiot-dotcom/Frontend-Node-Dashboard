import { create } from 'zustand'

type ModalType =
	| 'create-company'
	| 'edit-company'
	| 'create-building'
	| 'edit-building'
	| 'create-gateway'
	| 'edit-gateway'
	| 'create-node'
	| 'edit-node'
	| null

type UiState = {
	sidebarCollapsed: boolean
	activeModal: ModalType

	setSidebarCollapsed: (value: boolean) => void
	openModal: (modal: ModalType) => void
	closeModal: () => void
}

export const useUiStore = create<UiState>(set => ({
	sidebarCollapsed: false,
	activeModal: null,

	setSidebarCollapsed: value => {
		set({ sidebarCollapsed: value })
	},

	openModal: modal => {
		set({ activeModal: modal })
	},

	closeModal: () => {
		set({ activeModal: null })
	},
}))
