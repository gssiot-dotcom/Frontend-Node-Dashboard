'use client'

import AngleNodeCard from '@/components/AngleNodeCard'
import TiltNodeSkeleton from '@/components/AngleNodeSkeleton'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import AlarmLevelSettings, {
	AlarmLevels,
} from '@/features/manager/components/AlarmLevelSetting'
import { mapTiltToUiState } from '@/lib/TiltMapper'

import NodeGraphicModal from '@/components/NodegraphicModal'
import { AngleNodeNodeUi } from '@/features/manager/pages/AngleNodes'
import { useRealtimeRoom } from '@/hooks/useRealTime'
import { motion } from 'framer-motion'
import { Activity, Search } from 'lucide-react'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useLocation, useParams } from 'react-router-dom'
import {
	useBuildingNodesPageQuery,
	useUpdateBuildingAlarmLevelMutation,
} from '../hooks/useBuildings'
import { AngleNode, GatewayRef, NodeTypes } from '../types/node.types'
import { GangformPayload } from './GangformNodes'

const STATUS_FILTERS = [
	{ label: 'All', value: 'all' },
	{ label: 'Stable', value: 'safe' },
	{ label: 'Caution', value: 'caution' },
	{ label: 'Warning', value: 'warning' },
	{ label: 'Danger', value: 'danger' },
	{ label: 'Offline', value: 'offline' },
] as const

type NodePageState = {
	companyId?: string
	buildingId?: string
	buildingName?: string
	nodeType?: NodeTypes
}

function getGatewayLabel(gatewayId: GatewayRef) {
	if (!gatewayId) return '-'

	if (typeof gatewayId === 'string') {
		return gatewayId
	}

	return gatewayId.serialNumber || gatewayId._id
}

function mapApiNodeToAngleCardData(node: AngleNode): AngleNodeNodeUi {
	const x = node.angleX ?? 0
	const y = node.angleY ?? 0
	const isOnline = node.status !== 'offline'

	const ui = mapTiltToUiState(x, y, isOnline, node.status)

	return {
		...node,
		id: node._id,
		name: `Node #${node.number}`,
		x,
		y,
		isOnline,
		gatewayLabel: getGatewayLabel(node.gatewayId),
		_alertLevel: ui.alertLevel,
	}
}

export default function AdminAngleNodesPage() {
	const [search, setSearch] = useState('')
	const [statusFilter, setStatusFilter] =
		useState<(typeof STATUS_FILTERS)[number]['value']>('all')
	const [graphicNode, setGraphicNode] = useState<AngleNodeNodeUi | null>(null)
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

	const companyId = state.companyId
	const buildingId = state.buildingId || params.buildingId

	// Bu page doim angle-node uchun.
	// State bo‘lmasa ham direct refresh holatida fallback ishlaydi.
	const nodeType = state.nodeType || 'angle_node'

	const { data, isLoading, isError } = useBuildingNodesPageQuery({
		companyId,
		buildingId,
		nodeType,
	})

	const nodesList = useMemo(
		() => (data?.nodesList ?? []) as AngleNode[],
		[data?.nodesList],
	)
	const gatewayList = data?.gatewayList ?? []
	const buildingAlarmLevel = data?.buildingAlarmLevel ?? null

	const [angleNodes, setAngleNodes] = useState<AngleNode[]>([])

	useEffect(() => {
		setAngleNodes(nodesList)
	}, [nodesList])

	useEffect(() => {
		if (!buildingAlarmLevel) return

		setAlarmLevels({
			safe: 0,
			caution: buildingAlarmLevel.green ?? 0,
			warning: buildingAlarmLevel.yellow ?? 0,
			danger: buildingAlarmLevel.red ?? 0,
		})
	}, [buildingAlarmLevel])

	const nodesWithUi = useMemo(
		() => angleNodes.map(mapApiNodeToAngleCardData),
		[angleNodes],
	)

	const filtered = useMemo(() => {
		const keyword = search.toLowerCase().trim()

		return nodesWithUi.filter(node => {
			const matchesSearch =
				!keyword ||
				node.number.toLocaleString().toLowerCase().includes(keyword) ||
				node.nodeType.toLowerCase().includes(keyword)

			const matchesStatus =
				statusFilter === 'all' || node._alertLevel === statusFilter

			return matchesSearch && matchesStatus
		})
	}, [nodesWithUi, search, statusFilter])

	const counts = {
		all: nodesWithUi.length,
		safe: nodesWithUi.filter(n => n._alertLevel === 'safe').length,
		caution: nodesWithUi.filter(n => n._alertLevel === 'caution').length,
		warning: nodesWithUi.filter(n => n._alertLevel === 'warning').length,
		danger: nodesWithUi.filter(n => n._alertLevel === 'danger').length,
		offline: nodesWithUi.filter(n => n._alertLevel === 'offline').length,
	}

	const connected = nodesWithUi.some(node => node.isOnline)

	const { mutate: updateAlarmLevel, isPending: isAlarmLevelSaving } =
		useUpdateBuildingAlarmLevelMutation()

	// realtime handler
	const handleAngleRealtime = useCallback((sensorData: GangformPayload) => {
		console.log('Angle socket data received::', sensorData)

		// real-time graphic data updateing if graphic open
		if (sensorData.nodeNumber != null) {
			setLatestGraphicPoint(sensorData)
		}

		setAngleNodes(prev =>
			prev.map((node): AngleNode => {
				const isSameNode =
					node._id === sensorData.nodeId ||
					String(node.number) === String(sensorData.nodeNumber)

				if (!isSameNode) return node

				return {
					...node,
					angleX: sensorData.angleX ?? node.angleX ?? 0,
					angleY: sensorData.angleY ?? node.angleY ?? 0,
					status: sensorData.status ?? node.status,
					lastSeenAt: sensorData.updatedAt ?? new Date().toISOString(),
					updatedAt: sensorData.updatedAt,
				}
			}),
		)
	}, [])

	useRealtimeRoom<GangformPayload>({
		buildingId,
		nodeType: 'angle',
		enabled: !!buildingId,
		onMessage: handleAngleRealtime,
	})

	if (!companyId || !buildingId) {
		return (
			<div className='p-6 text-sm text-muted-foreground'>
				필수 정보가 없습니다. 건물 페이지에서 다시 진입해주세요.
			</div>
		)
	}

	if (isError) {
		return (
			<div className='p-6 text-sm text-destructive'>
				노드 데이터를 불러오지 못했습니다.
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
								비계전도 노드
							</h1>

							<div className='flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-muted/50 text-xs text-muted-foreground'>
								{connected ? (
									<>
										<span className='w-1.5 h-1.5 rounded-full bg-gss-safe animate-pulse' />
										Live
									</>
								) : (
									<>
										<span className='w-1.5 h-1.5 rounded-full bg-gss-offline' />
										Disconnected
									</>
								)}
							</div>
						</div>

						<p className='text-sm text-muted-foreground mt-0.5'>
							{filtered.length} of {nodesWithUi.length} nodes
						</p>

						<p className='text-xs text-muted-foreground mt-0.5'>
							Gateways: {gatewayList.length}
						</p>
					</div>

					{/* Search */}
					<div className='relative w-full sm:w-64'>
						<Search className='absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground' />

						<Input
							placeholder='Search nodes...'
							value={search}
							onChange={e => setSearch(e.target.value)}
							className='pl-9 bg-muted/30 border-border/50 focus:border-primary/50 h-9 text-sm'
						/>
					</div>
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
							{f.label}
							<span className='text-[10px] opacity-70'>
								({counts[f.value]})
							</span>
						</Button>
					))}

					<div className='ml-auto shrink-0'>
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
							<TiltNodeSkeleton key={i} />
						))}
					</div>
				) : filtered.length === 0 ? (
					<div className='text-center py-16'>
						<Activity className='w-10 h-10 text-muted-foreground/30 mx-auto mb-3' />
						<p className='text-sm text-muted-foreground'>
							No nodes match your filter
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
								<AngleNodeCard key={node._id} node={node} />
							</div>
						))}
					</div>
				)}

				<NodeGraphicModal
					isOpen={!!graphicNode}
					onClose={() => setGraphicNode(null)}
					nodeNumber={graphicNode?.number ?? 0}
					nodeType='angle_node'
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
