'use client'

import ScaffoldNodeDetailModal from '@/components/ScaffoldNodeDetailModal'
import ScaffoldingNodeCard from '@/components/ScaffoldNodeCard'
import ScaffoldingNodeSkeleton from '@/components/ScaffoldNodeSkeleton'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import GatewayAlarmControls from '@/features/manager/components/GatewayAlarmControls'

import { useRealtimeRoom } from '@/hooks/useRealTime'
import { formatNodeLocation } from '../utils/format-node-location'
import { motion } from 'framer-motion'
import { DoorOpen, Search } from 'lucide-react'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useLocation, useParams } from 'react-router-dom'
import {
	useBuildingNodesPageQuery,
	useUpdateBuildingAlarmLevelMutation,
	useUpdateFaultFilterMutation,
} from '../hooks/useBuildings'
import { GatewayAlarmSetting } from '../types/building.types'
import { GatewayRef, NodeTypes, ScaffoldingNode } from '../types/node.types'

const STATUS_FILTERS = [
	{ labelKey: 'verticalNodes.filterButtons.all', value: 'all' },
	{ labelKey: 'verticalNodes.filterButtons.secured', value: 'safe' },
	{ labelKey: 'verticalNodes.filterButtons.doorOpen', value: 'danger' },
	{ labelKey: 'verticalNodes.filterButtons.offline', value: 'offline' },
]
type DoorNodeRealtimePayload = {
	buildingId?: string
	nodeId?: string
	nodeNumber?: number | string
	_id?: string
	number?: number | string
	doorState?: 0 | 1 | number | string
	batteryLevel?: number
	status?: ScaffoldingNode['status']
	updatedAt: string
	lastSeenAt?: string | null
}

type NodePageState = {
	companyId?: string
	buildingId?: string
	buildingName?: string
	nodeType?: NodeTypes
	buildingPlanImageUrls?: string[]
}

function getGatewaySearchText(gatewayId: GatewayRef) {
	if (!gatewayId) return ''

	if (typeof gatewayId === 'string') {
		return gatewayId
	}

	return `${gatewayId._id} ${gatewayId.serialNumber || ''}`
}

function getGatewayId(gatewayId: GatewayRef) {
	if (!gatewayId) return ''
	if (typeof gatewayId === 'string') return gatewayId
	return gatewayId._id
}

function getFaultFilterNodes(
	settings: GatewayAlarmSetting[],
	gatewayId: string,
) {
	const setting = settings.find(item => String(item.gatewayId) === gatewayId)

	return setting?.door?.faultFilterNodes ?? []
}

function getAlertLevel(node: ScaffoldingNode) {
	if (node.status === 'offline') return 'offline'
	if (node.doorState === 1) return 'danger'
	return 'safe'
}

export default function ScaffoldingNodes() {
	const { t } = useTranslation()
	const [search, setSearch] = useState('')
	const [statusFilter, setStatusFilter] = useState('all')
	const [gatewayFilter, setGatewayFilter] = useState('all')
	const [selectedNode, setSelectedNode] = useState<ScaffoldingNode | null>(null)

	const location = useLocation()
	const params = useParams()

	const state = (location.state || {}) as NodePageState

	const companyId = state.companyId
	const buildingId = state.buildingId || params.buildingId
	const buildingPlanImageUrls = state.buildingPlanImageUrls || []

	// Bu page doim scaffold-node uchun.
	// State bo‘lmasa ham ishlashi uchun fallback berdik.
	const nodeType = state.nodeType || 'door_node'

	const { data, isLoading, isError } = useBuildingNodesPageQuery({
		companyId,
		buildingId,
		nodeType,
	})

	const nodesList = useMemo(
		() => (data?.nodesList ?? []) as ScaffoldingNode[],
		[data?.nodesList],
	)

	const [scaffoldNodes, setScaffoldNodes] = useState<ScaffoldingNode[]>([])

	useEffect(() => {
		setScaffoldNodes(nodesList)
	}, [nodesList])

	const gatewayList = data?.gatewayList ?? []
	const gatewayAlarmSettings = data?.gatewayAlarmSettings ?? []
	const alarmLevels = useMemo(
		() => ({ safe: 0, caution: 0, warning: 0, danger: 0 }),
		[],
	)

	const nodesWithUi = useMemo(
		() =>
			scaffoldNodes.map(node => ({
				...node,
				_alertLevel: getAlertLevel(node),
			})),
		[scaffoldNodes],
	)

	const filtered = useMemo(() => {
		const keyword = search.toLowerCase().trim()

		return nodesWithUi.filter(node => {
			const locationText = formatNodeLocation(
				node.installedLocation,
				node.installedLocationTitle,
				'',
			).toLowerCase()

			const matchesSearch =
				!keyword ||
				String(node.number).includes(keyword) ||
				node.nodeType.toLowerCase().includes(keyword) ||
				getGatewaySearchText(node.gatewayId).toLowerCase().includes(keyword) ||
				locationText.includes(keyword)

			const matchesStatus =
				statusFilter === 'all' || node._alertLevel === statusFilter
			const matchesGateway =
				gatewayFilter === 'all' || getGatewayId(node.gatewayId) === gatewayFilter

			return matchesSearch && matchesStatus && matchesGateway
		})
	}, [nodesWithUi, search, statusFilter, gatewayFilter])

	const counts = useMemo(
		() => ({
			all: nodesWithUi.length,
			safe: nodesWithUi.filter(n => n._alertLevel === 'safe').length,
			danger: nodesWithUi.filter(n => n._alertLevel === 'danger').length,
			offline: nodesWithUi.filter(n => n._alertLevel === 'offline').length,
		}),
		[nodesWithUi],
	)

	const connected = useMemo(
		() => nodesWithUi.some(node => node.status !== 'offline'),
		[nodesWithUi],
	)
	const { mutate: updateAlarmLevel, isPending: isAlarmLevelSaving } =
		useUpdateBuildingAlarmLevelMutation()
	const { mutate: updateFaultFilter, isPending: isFaultFilterSaving } =
		useUpdateFaultFilterMutation()

	const handleDoorRealtime = useCallback(
		(sensorData: DoorNodeRealtimePayload) => {
			console.log('Door socket data received::', sensorData)

			setScaffoldNodes(prev =>
				prev.map((node): ScaffoldingNode => {
					const incomingNodeId = sensorData.nodeId ?? sensorData._id
					const incomingNodeNumber = sensorData.nodeNumber ?? sensorData.number

					const isSameNode =
						node._id === incomingNodeId ||
						String(node.number) === String(incomingNodeNumber)

					if (!isSameNode) return node

					const nextDoorState =
						sensorData.doorState != null
							? (Number(sensorData.doorState) as 0 | 1)
							: node.doorState

					const nextStatus =
						sensorData.status ?? (nextDoorState === 1 ? 'danger' : 'normal')

					return {
						...node,
						doorState: nextDoorState,
						status: nextStatus,
						batteryLevel: sensorData.batteryLevel ?? node.batteryLevel,
						lastSeenAt:
							sensorData.lastSeenAt ??
							(sensorData.updatedAt
								? new Date(sensorData.updatedAt).toISOString()
								: new Date().toISOString()),
						updatedAt: sensorData.updatedAt,
					}
				}),
			)
		},
		[],
	)

	useRealtimeRoom<DoorNodeRealtimePayload>({
		buildingId,
		nodeType: 'node',
		enabled: !!buildingId,
		onMessage: handleDoorRealtime,
	})

	if (!companyId || !buildingId) {
		return (
			<div className='p-6 text-sm text-muted-foreground'>
				{t('common.missingNodePageInfo')}
			</div>
		)
	}

	if (isError) {
		return (
			<div className='p-6 text-sm text-destructive'>
				{t('common.failedNodeData')}
			</div>
		)
	}

	return (
		<div>
			<motion.div
				initial={{ opacity: 0, y: 10 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.4 }}
			>
				<div className='flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4'>
					<div>
						<div className='flex items-center gap-2'>
							<h1 className='text-xl lg:text-2xl font-bold text-foreground'>
								{t('nodePages.scaffoldTitle')}
							</h1>

							<div className='flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-muted/50 text-xs text-muted-foreground'>
								{connected ? (
									<>
										<span className='w-1.5 h-1.5 rounded-full bg-gss-safe animate-pulse' />
										{t('nodePages.live')}
									</>
								) : (
									<>
										<span className='w-1.5 h-1.5 rounded-full bg-gss-offline' />
										{t('nodePages.disconnected')}
									</>
								)}
							</div>
						</div>

						<p className='text-sm text-muted-foreground mt-0.5'>
							{t('nodePages.countSummary', {
								shown: filtered.length,
								total: nodesWithUi.length,
							})}
						</p>

						<p className='text-xs text-muted-foreground mt-0.5'>
							{t('nodePages.gatewaysSummary', { count: gatewayList.length })}
						</p>
					</div>

					<div className='relative w-full sm:w-64'>
						<Search className='absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground' />
						<Input
							placeholder={t('verticalNodes.header.searchPlaceholder')}
							value={search}
							onChange={e => setSearch(e.target.value)}
							className='pl-9 bg-muted/30 border-border/50 focus:border-primary/50 h-9 text-sm'
						/>
					</div>
				</div>

				<div className='flex items-center gap-2 mb-4 overflow-x-auto pb-1'>
					{STATUS_FILTERS.map(f => (
						<Button
							key={f.value}
							variant={statusFilter === f.value ? 'default' : 'ghost'}
							size='sm'
							onClick={() => setStatusFilter(f.value)}
							className={`shrink-0 h-7 text-xs gap-1 ${
								statusFilter === f.value
									? 'bg-primary/15 text-primary hover:bg-primary/20 border border-primary/30'
									: 'text-muted-foreground hover:text-foreground'
							}`}
						>
							{t(f.labelKey)}
							<span className='text-[10px] opacity-70'>
								({counts[f.value as keyof typeof counts]})
							</span>
						</Button>
					))}

					<GatewayAlarmControls
						gateways={gatewayList}
						settings={gatewayAlarmSettings}
						buildingId={buildingId}
						alarmType={nodeType}
						alarmLevels={alarmLevels}
						selectedGatewayId={gatewayFilter}
						isSaving={isAlarmLevelSaving}
						onSelectGateway={setGatewayFilter}
						onToggleGateway={payload =>
							updateAlarmLevel({
								...payload,
								companyId,
							})
						}
					/>
				</div>

				{isLoading ? (
					<div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 lg:gap-3'>
						{Array.from({ length: 12 }).map((_, i) => (
							<ScaffoldingNodeSkeleton key={i} />
						))}
					</div>
				) : filtered.length === 0 ? (
					<div className='text-center py-16'>
						<DoorOpen className='w-10 h-10 text-muted-foreground/30 mx-auto mb-3' />
						<p className='text-sm text-muted-foreground'>
							{t('common.noNodesMatch')}
						</p>
					</div>
				) : (
					<div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 lg:gap-3'>
						{filtered.map(node => (
							<div
								key={node._id}
								role='button'
								tabIndex={0}
								onClick={() => setSelectedNode(node)}
								onKeyDown={e => {
									if (e.key === 'Enter' || e.key === ' ') {
										e.preventDefault()
										setSelectedNode(node)
									}
								}}
								className='cursor-pointer rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/40'
							>
								<ScaffoldingNodeCard node={node} />
							</div>
						))}
					</div>
				)}

				<ScaffoldNodeDetailModal
					isOpen={!!selectedNode}
					onClose={() => setSelectedNode(null)}
					node={selectedNode}
					planImageUrls={buildingPlanImageUrls}
					faultFilter={
						selectedNode && getGatewayId(selectedNode.gatewayId)
							? {
									enabled: getFaultFilterNodes(
										gatewayAlarmSettings,
										getGatewayId(selectedNode.gatewayId),
									).includes(selectedNode.number),
									isSaving: isFaultFilterSaving,
									onToggle: enabled =>
										updateFaultFilter({
											companyId,
											buildingId,
											gatewayId: getGatewayId(selectedNode.gatewayId),
											alarmType: nodeType,
											nodeNumber: selectedNode.number,
											enabled,
										}),
								}
							: undefined
					}
				/>
			</motion.div>
		</div>
	)
}
