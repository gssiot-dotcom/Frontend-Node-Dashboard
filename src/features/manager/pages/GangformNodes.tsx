import NodeGraphicModal from '@/components/NodegraphicModal'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useManagerUpdateBuildingAlarmLevelMutation } from '@/features/admin/hooks/useBuildings'
import { GangformPayload } from '@/features/admin/pages/GangformNodes'
import {
	GangformNode,
	GatewayRef,
	NodeTypes,
} from '@/features/admin/types/node.types'
import AlarmLevelSettings, {
	AlarmLevels,
} from '@/features/manager/components/AlarmLevelSetting'
import { useRealtimeRoom } from '@/hooks/useRealTime'
import { mapTiltToUiState } from '@/lib/TiltMapper'
import { motion } from 'framer-motion'
import { Activity, Search } from 'lucide-react'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useLocation, useParams } from 'react-router-dom'
import NodeCard from '../../../components/GangformNodeCard'
import NodeCardSkeleton from '../../../components/NodeCardSkeleton'
import { useManagerBuildingNodesPage } from '../hooks/usemanagerCompany'

// types.ts — SensorData ga status qo'shildi

const STATUS_FILTERS = [
	{ labelKey: 'verticalNodes.filterButtons.all', value: 'all' },
	{ labelKey: 'verticalNodes.filterButtons.normal', value: 'safe' },
	{ labelKey: 'verticalNodes.filterButtons.warning', value: 'warning' },
	{ labelKey: 'verticalNodes.filterButtons.danger', value: 'danger' },
	{ labelKey: 'verticalNodes.filterButtons.offline', value: 'offline' },
] as const

type NodePageState = {
	companyId?: string
	buildingId?: string
	buildingName?: string
	nodeType?: NodeTypes
}

export type GangformNodeUi = GangformNode & {
	id: string
	name: string
	x: number
	y: number
	isOnline: boolean
	gatewayLabel: string
	_alertLevel: 'safe' | 'caution' | 'warning' | 'danger' | 'offline' | string
}

function getGatewayLabel(gatewayId: GatewayRef) {
	if (!gatewayId) return '-'

	if (typeof gatewayId === 'string') {
		return gatewayId
	}

	return gatewayId.serialNumber || gatewayId._id
}

function getGatewaySearchText(gatewayId: GatewayRef) {
	if (!gatewayId) return ''

	if (typeof gatewayId === 'string') {
		return gatewayId
	}

	return `${gatewayId._id} ${gatewayId.serialNumber || ''}`
}

function mapApiNodeToUiNode(node: GangformNode): GangformNodeUi {
	const x = node.angleX ?? 0
	const y = node.angleY ?? 0
	const normalizedStatus = node.status
	const isOnline = normalizedStatus !== 'offline'

	const ui = mapTiltToUiState(x, y, isOnline, normalizedStatus)

	return {
		...node,
		status: node.status,
		id: node._id,
		name: `Node #${node.number}`,
		x,
		y,
		isOnline,
		gatewayLabel: getGatewayLabel(node.gatewayId),
		_alertLevel: ui.alertLevel,
	}
}

export default function VerticalNodes() {
	const [search, setSearch] = useState('')
	const [statusFilter, setStatusFilter] =
		useState<(typeof STATUS_FILTERS)[number]['value']>('all')
	const [nodesWithUi, setNodesWithUi] = useState<GangformNodeUi[]>([])
	const [graphicNode, setGraphicNode] = useState<GangformNodeUi | null>(null)
	const [latestGraphicPoint, setLatestGraphicPoint] =
		useState<GangformPayload | null>(null)

	const [alarmLevels, setAlarmLevels] = useState<AlarmLevels>({
		safe: 0,
		caution: 0,
		warning: 0,
		danger: 0,
	})

	const { t } = useTranslation()
	const location = useLocation()
	const params = useParams()

	const state = (location.state || {}) as NodePageState
	const buildingId = state.buildingId || (params.buildingId as string)

	// Bu page doim vertical-node uchun.
	// State bo‘lmasa ham refresh/direct URL holatida ishlashi uchun fallback.
	const nodeType = state.nodeType || 'gangform_node'

	const { data, isLoading, isError } = useManagerBuildingNodesPage(
		buildingId,
		nodeType,
	)

	const nodesList = useMemo(
		() => (data?.nodesList ?? []) as GangformNode[],
		[data?.nodesList],
	)
	const gatewayList = data?.gatewayList ?? []
	const buildingAlarmLevel = data?.buildingAlarmLevel ?? null

	// nodesList o'zgarganda initialize qilamiz
	useEffect(() => {
		setNodesWithUi(nodesList.map(mapApiNodeToUiNode))
	}, [nodesList, alarmLevels])

	useEffect(() => {
		if (!buildingAlarmLevel) return

		setAlarmLevels({
			safe: 0,
			caution: buildingAlarmLevel.green ?? 0,
			warning: buildingAlarmLevel.yellow ?? 0,
			danger: buildingAlarmLevel.red ?? 0,
		})
	}, [buildingAlarmLevel])

	const filtered = useMemo(() => {
		const keyword = search.toLowerCase().trim()

		return nodesWithUi.filter(node => {
			const matchesSearch =
				!keyword ||
				node.name.toLowerCase().includes(keyword) ||
				node.id.toLowerCase().includes(keyword) ||
				String(node.number).includes(keyword) ||
				node.nodeType.toLowerCase().includes(keyword) ||
				getGatewaySearchText(node.gatewayId).toLowerCase().includes(keyword) ||
				(node.installedLocation || '').toLowerCase().includes(keyword)

			const matchesStatus =
				statusFilter === 'all' || node._alertLevel === statusFilter

			return matchesSearch && matchesStatus
		})
	}, [nodesWithUi, search, statusFilter])

	const counts = {
		all: nodesWithUi.length,
		safe: nodesWithUi.filter(n => n._alertLevel === 'safe').length,
		warning: nodesWithUi.filter(n => n._alertLevel === 'warning').length,
		danger: nodesWithUi.filter(n => n._alertLevel === 'danger').length,
		offline: nodesWithUi.filter(n => n._alertLevel === 'offline').length,
	}

	const connected = nodesWithUi.some(node => node.isOnline)

	const statusToAlertLevel = (
		status?: GangformPayload['status'],
	): GangformNodeUi['_alertLevel'] => {
		switch (status) {
			case 'safe':
				return 'safe'
			case 'caution':
				return 'Caution' // caution → warning badge
			case 'warning':
				return 'warning'
			case 'danger':
				return 'danger'
			case 'offline':
				return 'offline'
			default:
				return 'safe'
		}
	}

	const { mutate: updateAlarmLevel, isPending: isAlarmLevelSaving } =
		useManagerUpdateBuildingAlarmLevelMutation()

	// realtime handler — backenddan kelgan status ishlatiladi
	const handleVerticalRealtime = useCallback((sensorData: GangformPayload) => {
		console.log('Socket data received::', sensorData)
		// real-time graphic data updateing if graphic open
		if (sensorData.nodeNumber != null) {
			setLatestGraphicPoint(sensorData)
		}

		// realtime- node card updating
		setNodesWithUi(prev =>
			prev.map(node => {
				if (node.number !== sensorData.nodeNumber) return node

				const x = sensorData.angleX ?? node.x
				const y = sensorData.angleY ?? node.y
				const status = sensorData.status ?? node.status
				const isOnline = true
				const _alertLevel = sensorData.status
					? statusToAlertLevel(sensorData.status)
					: mapTiltToUiState(x, y, isOnline, status).alertLevel // fallback

				return {
					...node,
					x,
					y,
					angleX: x,
					angleY: y,
					status,
					isOnline,
					_alertLevel,
				}
			}),
		)
	}, [])

	useRealtimeRoom<GangformPayload>({
		buildingId,
		nodeType: 'vertical',
		enabled: !!buildingId,
		onMessage: handleVerticalRealtime,
	})

	if (!buildingId) {
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
				{/* Header */}
				<div className='flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4'>
					<div>
						<div className='flex items-center gap-2'>
							<h1 className='text-xl lg:text-2xl font-bold text-foreground'>
								{t('verticalNodes.header.title')}
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

					{/* Search */}
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

				<div className='md:hidden mb-4'>
					<AlarmLevelSettings
						value={alarmLevels}
						onChange={setAlarmLevels}
						t={t}
						isSaving={isAlarmLevelSaving}
						onSave={levels => {
							updateAlarmLevel({
								buildingId,
								alarmType: nodeType,
								levels,
							})
						}}
					/>
				</div>

				{/* Status filters */}
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
								({counts[f.value]})
							</span>
						</Button>
					))}

					<div className='ml-auto shrink-0 max-sm:hidden'>
						<AlarmLevelSettings
							value={alarmLevels}
							onChange={setAlarmLevels}
							t={t}
							isSaving={isAlarmLevelSaving}
							onSave={levels => {
								updateAlarmLevel({
									buildingId,
									alarmType: nodeType,
									levels,
								})
							}}
						/>
					</div>
				</div>

				{/* Node grid */}
				{isLoading ? (
					<div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 lg:gap-3'>
						{Array.from({ length: 12 }).map((_, i) => (
							<NodeCardSkeleton key={i} />
						))}
					</div>
				) : filtered.length === 0 ? (
					<div className='text-center py-16'>
						<Activity className='w-10 h-10 text-muted-foreground/30 mx-auto mb-3' />
						<p className='text-sm text-muted-foreground'>
							{t('common.noNodesMatch')}
						</p>
					</div>
				) : (
					<div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 lg:gap-3'>
						{filtered.map(node => (
							<div
								key={node.id}
								role='button'
								tabIndex={0}
								onClick={() => setGraphicNode(node)}
								onKeyDown={e => {
									if (e.key === 'Enter' || e.key === ' ') {
										e.preventDefault()
										setGraphicNode(node)
									}
								}}
								className='cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/40 rounded-xl'
							>
								<NodeCard node={node} />
							</div>
						))}
					</div>
				)}

				<NodeGraphicModal
					isOpen={!!graphicNode}
					onClose={() => setGraphicNode(null)}
					nodeNumber={graphicNode?.number ?? 0}
					nodeType='gangform_node'
					nodeName={graphicNode?.name}
					alarmLevels={alarmLevels}
					livePoint={
						graphicNode && latestGraphicPoint?.nodeNumber === graphicNode.number
							? latestGraphicPoint
							: null
					}
				/>
			</motion.div>
		</div>
	)
}
