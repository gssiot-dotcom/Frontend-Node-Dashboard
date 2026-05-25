'use client'

import ScaffoldingNodeCard from '@/components/ScaffoldNodeCard'
import ScaffoldingNodeSkeleton from '@/components/ScaffoldNodeSkeleton'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

import { useRealtimeRoom } from '@/hooks/useRealTime'
import { motion } from 'framer-motion'
import { DoorOpen, Search } from 'lucide-react'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useLocation, useParams } from 'react-router-dom'
import { useBuildingNodesPageQuery } from '../hooks/useBuildings'
import { GatewayRef, NodeTypes, ScaffoldingNode } from '../types/node.types'

const STATUS_FILTERS = [
	{ label: 'All', value: 'all' },
	{ label: 'Secured', value: 'safe' },
	{ label: 'Door Open', value: 'danger' },
	{ label: 'Offline', value: 'offline' },
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
}

function getGatewaySearchText(gatewayId: GatewayRef) {
	if (!gatewayId) return ''

	if (typeof gatewayId === 'string') {
		return gatewayId
	}

	return `${gatewayId._id} ${gatewayId.serialNumber || ''}`
}

function getAlertLevel(node: ScaffoldingNode) {
	if (node.status === 'offline') return 'offline'
	if (node.doorState === 1) return 'danger'
	return 'safe'
}

export default function ScaffoldingNodes() {
	const [search, setSearch] = useState('')
	const [statusFilter, setStatusFilter] = useState('all')

	const location = useLocation()
	const params = useParams()

	const state = (location.state || {}) as NodePageState

	const companyId = state.companyId
	const buildingId = state.buildingId || params.buildingId

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
			const matchesSearch =
				!keyword ||
				String(node.number).includes(keyword) ||
				node.nodeType.toLowerCase().includes(keyword) ||
				getGatewaySearchText(node.gatewayId).toLowerCase().includes(keyword) ||
				(node.installedLocation || '').toLowerCase().includes(keyword)

			const matchesStatus =
				statusFilter === 'all' || node._alertLevel === statusFilter

			return matchesSearch && matchesStatus
		})
	}, [nodesWithUi, search, statusFilter])

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
				<div className='flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4'>
					<div>
						<div className='flex items-center gap-2'>
							<h1 className='text-xl lg:text-2xl font-bold text-foreground'>
								Scaffolding Nodes
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

				<div className='flex gap-2 mb-4 overflow-x-auto pb-1'>
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
								({counts[f.value as keyof typeof counts]})
							</span>
						</Button>
					))}
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
							No nodes match your filter
						</p>
					</div>
				) : (
					<div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 lg:gap-3'>
						{filtered.map(node => (
							<ScaffoldingNodeCard key={node._id} node={node} />
						))}
					</div>
				)}
			</motion.div>
		</div>
	)
}
