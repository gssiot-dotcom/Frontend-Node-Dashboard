import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { motion } from 'framer-motion'
import {
	Building2,
	Check,
	Link2,
	Loader2,
	Minus,
	Plus,
	Save,
	Search,
	Wifi,
	WifiOff,
} from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import {
	useCompanyAssignmentsQuery,
	useUpdateCompanyGatewaysMutation,
	useUpdateCompanyNodesMutation,
} from '../hooks/companyAssignment.queries'
import {
	AssignmentCompany,
	AssignmentGateway,
	AssignmentNode,
} from '../types/companyAssignment.types'

// ─── Types ────────────────────────────────────────────────────────────────────

type CompanyStatus = 'active' | 'inactive'
type GatewayStatus = 'online' | 'offline' | 'warning'
export type NodeStatus =
	| 'normal'
	| 'warning'
	| 'danger'
	| 'offline'
	| 'online'
	| string
type NodeType = 'gangform_node' | 'angle_node' | 'door_node'

const NODE_TYPE_LABELS: Record<NodeType, string> = {
	gangform_node: '수직 노드',
	angle_node: '각도 노드',
	door_node: '비계문 노드',
}

// ─── Badge helpers ────────────────────────────────────────────────────────────

function StatusBadge({
	status,
}: {
	status: CompanyStatus | GatewayStatus | NodeStatus
}) {
	const map: Record<string, string> = {
		active:
			'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
		online:
			'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
		inactive: 'bg-muted text-muted-foreground border-border',
		offline: 'bg-muted text-muted-foreground border-border',
		warning:
			'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
		unassigned: 'bg-slate-500/10 text-slate-500 border-slate-500/20',
	}
	const labels: Record<string, string> = {
		active: '활성',
		online: '온라인',
		inactive: '비활성',
		offline: '오프라인',
		warning: '경고',
		unassigned: '미배정',
	}
	return (
		<span
			className={`px-2 py-0.5 rounded-md text-xs font-medium border ${map[status] ?? map.inactive}`}
		>
			{labels[status] ?? status}
		</span>
	)
}

// ─── Avatars ──────────────────────────────────────────────────────────────────

const AVATAR_COLORS = [
	'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300',
	'bg-teal-100 text-teal-700 dark:bg-teal-900/40 dark:text-teal-300',
	'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
	'bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300',
	'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',
]

function getAvatarColor(id: string) {
	const idx = id.charCodeAt(id.length - 1) % AVATAR_COLORS.length
	return AVATAR_COLORS[idx]
}

function Avatar({
	name,
	id,
	size = 'md',
}: {
	name: string
	id: string
	size?: 'sm' | 'md'
}) {
	const initials = name.slice(0, 2)
	const color = getAvatarColor(id)
	const dim = size === 'sm' ? 'w-7 h-7 text-xs' : 'w-8 h-8 text-xs'
	return (
		<div
			className={`${dim} ${color} rounded-full flex items-center justify-center font-medium flex-shrink-0`}
		>
			{initials}
		</div>
	)
}

// ─── Flow hint ────────────────────────────────────────────────────────────────

function FlowHint({ step }: { step: number }) {
	const steps = ['회사 선택', '게이트웨이 배정', '노드 배정']

	return (
		<div className='flex items-center gap-1.5 flex-wrap bg-muted/40 rounded-lg px-3 py-2 mb-5'>
			{steps.map((s, i) => (
				<div key={i} className='flex items-center gap-1.5'>
					<div
						className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-medium border
						${
							i < step
								? 'bg-primary/10 text-primary border-primary/70'
								: i === step
									? 'bg-primary/10 text-primary border-primary/70'
									: 'bg-background text-muted-foreground border-border'
						}`}
					>
						{i < step ? <Check className='w-3.5 h-3.5' /> : i + 1}
					</div>
					<span
						className={`text-xs ${i === step ? 'font-medium text-primary' : 'text-muted-foreground'}`}
					>
						{s}
					</span>
				</div>
			))}
		</div>
	)
}

// ─── Gateway Assignment Tab ───────────────────────────────────────────────────

function GatewayTab({
	company,
	gateways,
	onAssign,
	onRevoke,
}: {
	company: AssignmentCompany
	gateways: AssignmentGateway[]
	onAssign: (gwId: string) => void
	onRevoke: (gwId: string) => void
}) {
	const [search, setSearch] = useState('')

	const assigned = gateways.filter(g => g.companyId === company._id)

	const available = gateways.filter(g => {
		const q = search.toLowerCase()

		return (
			g.companyId === null &&
			(g.serialNumber.toLowerCase().includes(q) ||
				(g.installedLocation || '').toLowerCase().includes(q))
		)
	})

	return (
		<div className='grid grid-cols-1 lg:grid-cols-2 gap-4'>
			<div className='glass rounded-xl overflow-hidden'>
				<div className='flex items-center justify-between px-4 py-3 border-b border-border'>
					<div>
						<h3 className='text-sm font-semibold text-foreground'>
							배정된 게이트웨이
						</h3>
						<p className='text-xs text-muted-foreground mt-0.5'>
							{assigned.length}개 배정됨
						</p>
					</div>
					<Wifi className='w-4 h-4 text-muted-foreground' />
				</div>

				{assigned.length === 0 ? (
					<div className='py-10 text-center text-sm text-muted-foreground'>
						배정된 게이트웨이가 없습니다
					</div>
				) : (
					<div className='divide-y divide-border'>
						{assigned.map(gw => (
							<div
								key={gw._id}
								className='flex items-center justify-between px-4 py-3 hover:bg-muted/30 transition-colors'
							>
								<div className='flex items-center gap-2.5'>
									<div className='w-7 h-7 rounded-md bg-muted flex items-center justify-center flex-shrink-0'>
										<Wifi className='w-3.5 h-3.5 text-muted-foreground' />
									</div>
									<div>
										<p className='text-sm font-mono font-medium'>
											{gw.serialNumber}
										</p>
										<p className='text-xs text-muted-foreground'>
											{gw.installedLocation || '설치 위치 없음'}
										</p>
									</div>
								</div>

								<div className='flex items-center gap-2'>
									<StatusBadge status={gw.gatewayStatus} />
									<Button
										variant='ghost'
										size='icon'
										className='w-7 h-7 text-muted-foreground hover:text-destructive hover:bg-destructive/10'
										onClick={() => onRevoke(gw._id)}
									>
										<Minus className='w-3.5 h-3.5' />
									</Button>
								</div>
							</div>
						))}
					</div>
				)}
			</div>

			<div className='glass rounded-xl overflow-hidden'>
				<div className='flex items-center justify-between px-4 py-3 border-b border-border'>
					<div>
						<h3 className='text-sm font-semibold text-foreground'>
							미배정 게이트웨이
						</h3>
						<p className='text-xs text-muted-foreground mt-0.5'>
							배정 가능한 목록
						</p>
					</div>

					<div className='relative'>
						<Search className='absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground' />
						<Input
							value={search}
							onChange={e => setSearch(e.target.value)}
							placeholder='검색...'
							className='h-7 pl-7 pr-3 text-xs w-32'
						/>
					</div>
				</div>

				{available.length === 0 ? (
					<div className='py-10 text-center text-sm text-muted-foreground'>
						배정 가능한 게이트웨이가 없습니다
					</div>
				) : (
					<div className='divide-y divide-border'>
						{available.map(gw => (
							<div
								key={gw._id}
								className='flex items-center justify-between px-4 py-3 hover:bg-muted/30 transition-colors'
							>
								<div className='flex items-center gap-2.5'>
									<div className='w-7 h-7 rounded-md bg-muted flex items-center justify-center flex-shrink-0'>
										<WifiOff className='w-3.5 h-3.5 text-muted-foreground' />
									</div>
									<div>
										<p className='text-sm font-mono font-medium'>
											{gw.serialNumber}
										</p>
										<p className='text-xs text-muted-foreground'>
											{gw.installedLocation || '설치 위치 없음'}
										</p>
									</div>
								</div>

								<div className='flex items-center gap-2'>
									<StatusBadge status={gw.gatewayStatus} />
									<Button
										variant='outline'
										size='sm'
										className='h-6 px-2 text-xs gap-1'
										onClick={() => onAssign(gw._id)}
									>
										<Plus className='w-3 h-3' />
										배정
									</Button>
								</div>
							</div>
						))}
					</div>
				)}
			</div>
		</div>
	)
}

// ─── Node Assignment Tab ──────────────────────────────────────────────────────

const NODE_TYPE_FILTERS = [
	{ value: 'all', label: '전체' },
	{ value: 'door_node', label: '비계문 노드' },
	{ value: 'angle_node', label: '각도 노드' },
	{ value: 'gangform_node', label: '갱폼 노드' },
] as const

function NodeTab({
	company,
	nodes,
	onAssign,
	onRevoke,
}: {
	company: AssignmentCompany
	nodes: AssignmentNode[]
	onAssign: (nodeId: string) => void
	onRevoke: (nodeId: string) => void
}) {
	const [assignedTypeFilter, setAssignedTypeFilter] = useState<string>('all')
	const [availableTypeFilter, setAvailableTypeFilter] = useState<string>('all')
	const [assignedSearch, setAssignedSearch] = useState('')
	const [availableSearch, setAvailableSearch] = useState('')

	const assigned = useMemo(
		() =>
			nodes.filter(n => {
				if (n.companyId !== company._id) return false
				if (assignedTypeFilter !== 'all' && n.nodeType !== assignedTypeFilter)
					return false
				const q = assignedSearch.toLowerCase()
				return (
					!q ||
					n.number.toString().includes(q) ||
					n.installedLocation.toLowerCase().includes(q)
				)
			}),
		[nodes, company._id, assignedTypeFilter, assignedSearch],
	)

	const available = useMemo(
		() =>
			nodes.filter(n => {
				if (n.companyId !== null) return false
				if (availableTypeFilter !== 'all' && n.nodeType !== availableTypeFilter)
					return false
				const q = availableSearch.toLowerCase()
				return (
					!q ||
					n.number.toString().includes(q) ||
					n.installedLocation.toLowerCase().includes(q)
				)
			}),
		[nodes, availableTypeFilter, availableSearch],
	)

	return (
		<div className='grid grid-cols-1 lg:grid-cols-2 gap-4'>
			{/* Assigned nodes */}
			<div className='glass rounded-xl overflow-hidden'>
				<div className='px-4 py-3 border-b border-border'>
					<div className='flex items-center justify-between mb-2.5'>
						<div>
							<h3 className='text-sm font-semibold text-foreground'>
								배정된 노드
							</h3>
							<p className='text-xs text-muted-foreground mt-0.5'>
								{nodes.filter(n => n.companyId === company._id).length}개 배정됨
							</p>
						</div>
						<div className='relative'>
							<Search className='absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground' />
							<Input
								value={assignedSearch}
								onChange={e => setAssignedSearch(e.target.value)}
								placeholder='검색...'
								className='h-7 pl-7 pr-3 text-xs w-28'
							/>
						</div>
					</div>
					<div className='flex gap-1.5 flex-wrap'>
						{NODE_TYPE_FILTERS.map(f => (
							<button
								key={f.value}
								onClick={() => setAssignedTypeFilter(f.value)}
								className={`px-2.5 py-1 rounded-full text-xs border transition-colors
									${
										assignedTypeFilter === f.value
											? 'bg-foreground text-background border-transparent'
											: 'border-border text-muted-foreground hover:bg-muted'
									}`}
							>
								{f.label}
							</button>
						))}
					</div>
				</div>
				<div className='overflow-y-auto max-h-72'>
					<div className='rounded-b-xl overflow-hidden'>
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead className='w-14'>번호</TableHead>
									<TableHead>타입</TableHead>
									<TableHead>상태</TableHead>
									<TableHead>위치</TableHead>
									<TableHead className='w-10' />
								</TableRow>
							</TableHeader>
							<TableBody>
								{assigned.length === 0 ? (
									<TableRow>
										<TableCell
											colSpan={5}
											className='text-center text-muted-foreground py-8 text-sm'
										>
											노드 없음
										</TableCell>
									</TableRow>
								) : (
									assigned.map(n => (
										<TableRow key={n._id}>
											<TableCell className='font-mono font-medium text-sm'>
												{n.number}
											</TableCell>
											<TableCell className='text-xs'>{n.nodeType}</TableCell>
											<TableCell>
												<StatusBadge status={n.status} />
											</TableCell>
											<TableCell className='text-xs text-muted-foreground'>
												{n.installedLocation}
											</TableCell>
											<TableCell>
												<Button
													variant='ghost'
													size='icon'
													className='w-6 h-6 text-muted-foreground hover:text-destructive hover:bg-destructive/10'
													onClick={() => onRevoke(n._id)}
												>
													<Minus className='w-3 h-3' />
												</Button>
											</TableCell>
										</TableRow>
									))
								)}
							</TableBody>
						</Table>
					</div>
				</div>
			</div>

			{/* Available nodes */}
			<div className='glass rounded-xl overflow-hidden'>
				<div className='px-4 py-3 border-b border-border'>
					<div className='flex items-center justify-between mb-2.5'>
						<div>
							<h3 className='text-sm font-semibold text-foreground'>
								미배정 노드
							</h3>
							<p className='text-xs text-muted-foreground mt-0.5'>
								배정 가능한 목록
							</p>
						</div>
						<div className='relative'>
							<Search className='absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground' />
							<Input
								value={availableSearch}
								onChange={e => setAvailableSearch(e.target.value)}
								placeholder='검색...'
								className='h-7 pl-7 pr-3 text-xs w-28'
							/>
						</div>
					</div>
					<div className='flex gap-1.5 flex-wrap'>
						{NODE_TYPE_FILTERS.map(f => (
							<button
								key={f.value}
								onClick={() => setAvailableTypeFilter(f.value)}
								className={`px-2.5 py-1 rounded-full text-xs border transition-colors
									${
										availableTypeFilter === f.value
											? 'bg-foreground text-background border-transparent'
											: 'border-border text-muted-foreground hover:bg-muted'
									}`}
							>
								{f.label}
							</button>
						))}
					</div>
				</div>
				<div className='overflow-y-auto max-h-72'>
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead className='w-14'>번호</TableHead>
								<TableHead>타입</TableHead>
								<TableHead>위치</TableHead>
								<TableHead className='w-14' />
							</TableRow>
						</TableHeader>
						<TableBody>
							{available.length === 0 ? (
								<TableRow>
									<TableCell
										colSpan={4}
										className='text-center text-muted-foreground py-8 text-sm'
									>
										배정 가능한 노드 없음
									</TableCell>
								</TableRow>
							) : (
								available.map(n => (
									<TableRow key={n._id}>
										<TableCell className='font-mono font-medium text-sm'>
											{n.number}
										</TableCell>
										<TableCell className='text-xs'>
											{NODE_TYPE_LABELS[n.nodeType]}
										</TableCell>
										<TableCell className='text-xs text-muted-foreground'>
											{n.installedLocation}
										</TableCell>
										<TableCell>
											<Button
												variant='outline'
												size='sm'
												className='h-6 px-2 text-xs gap-1'
												onClick={() => onAssign(n._id)}
											>
												<Plus className='w-3 h-3' />
												배정
											</Button>
										</TableCell>
									</TableRow>
								))
							)}
						</TableBody>
					</Table>
				</div>
			</div>
		</div>
	)
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function CompanyAssignmentPage() {
	const [selectedCompanyId, setSelectedCompanyId] = useState('')
	const [companySearch, setCompanySearch] = useState('')
	const [activeTab, setActiveTab] = useState<'gateways' | 'nodes'>('gateways')

	const [gateways, setGateways] = useState<AssignmentGateway[]>([])
	const [nodes, setNodes] = useState<AssignmentNode[]>([])
	const [dirtyTabs, setDirtyTabs] = useState<Set<string>>(new Set())

	const { data, isLoading, isError } = useCompanyAssignmentsQuery()
	const updateGatewaysMutation = useUpdateCompanyGatewaysMutation()
	const updateNodesMutation = useUpdateCompanyNodesMutation()

	useEffect(() => {
		if (data) {
			setSelectedCompanyId(data.companies[0]._id)
			setGateways(data.gateways)
			setNodes(data.nodes)
		}
	}, [data])

	if (isLoading) {
		return (
			<div className='flex min-h-screen items-center justify-center'>
				<p className='text-sm text-muted-foreground'>Loading...</p>
			</div>
		)
	}

	if (isError) {
		return (
			<div className='flex min-h-screen items-center justify-center'>
				<p className='text-sm text-destructive'>
					Failed to load company assignments
				</p>
			</div>
		)
	}

	const companies = data?.companies || []

	const selectedCompany =
		companies.find(c => c._id === selectedCompanyId) || companies[0]

	if (!selectedCompany) {
		return (
			<div className='flex min-h-screen items-center justify-center'>
				<p className='text-sm text-muted-foreground'>No company found</p>
			</div>
		)
	}

	// Stats for selected company
	const assignedGWCount = gateways.filter(
		g => g.companyId === selectedCompanyId,
	).length
	const assignedNodeCount = nodes.filter(
		n => n.companyId === selectedCompanyId,
	).length

	// Handlers

	const markDirty = (tab: string) =>
		setDirtyTabs(prev => new Set(prev).add(tab))

	const markClean = (tab: string) =>
		setDirtyTabs(prev => {
			const next = new Set(prev)
			next.delete(tab)
			return next
		})

	const assignGateway = (gatewayId: string) => {
		setGateways(prev =>
			prev.map(gateway =>
				gateway._id === gatewayId
					? {
							...gateway,
							companyId: selectedCompanyId,
							isAssigned: true,
						}
					: gateway,
			),
		)

		markDirty('gateways')
	}

	const revokeGateway = (gatewayId: string) => {
		setGateways(prev =>
			prev.map(gateway =>
				gateway._id === gatewayId
					? {
							...gateway,
							companyId: null,
							isAssigned: false,
						}
					: gateway,
			),
		)

		markDirty('gateways')
	}

	const assignNode = (nodeId: string) => {
		setNodes(prev =>
			prev.map(node =>
				node._id === nodeId
					? {
							...node,
							companyId: selectedCompanyId,
							isAssigned: true,
						}
					: node,
			),
		)

		markDirty('nodes')
	}

	const revokeNode = (nodeId: string) => {
		setNodes(prev =>
			prev.map(node =>
				node._id === nodeId
					? {
							...node,
							companyId: null,
							gatewayId: null,
							isAssigned: false,
						}
					: node,
			),
		)

		markDirty('nodes')
	}

	const saving =
		updateGatewaysMutation.isPending || updateNodesMutation.isPending

	const handleSave = async () => {
		if (!selectedCompanyId) return

		if (activeTab === 'gateways') {
			const gatewayIds = gateways
				.filter(gateway => gateway.companyId === selectedCompanyId)
				.map(gateway => gateway._id)

			await updateGatewaysMutation.mutateAsync({
				companyId: selectedCompanyId,
				data: { gatewayIds },
			})

			markClean('gateways')
			return
		}

		if (activeTab === 'nodes') {
			const nodeIds = nodes
				.filter(node => node.companyId === selectedCompanyId)
				.map(node => node._id)

			await updateNodesMutation.mutateAsync({
				companyId: selectedCompanyId,
				data: { nodeIds },
			})

			markClean('nodes')
		}
	}

	const filteredCompanies = companies.filter(company => {
		const q = companySearch.toLowerCase()

		return (
			company.companyName.toLowerCase().includes(q) ||
			company.companyAddress.toLowerCase().includes(q)
		)
	})

	return (
		<motion.div
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			className='min-h-screen bg-background'
		>
			{/* Page Header */}
			<div className='border-b border-border bg-card'>
				<div className='max-w-7xl mx-auto px-4 sm:px-6 py-6'>
					<h1 className='text-xl sm:text-2xl font-bold text-foreground'>
						회사 배정 관리
					</h1>
					<p className='text-sm text-muted-foreground mt-1'>
						회사별 게이트웨이, 노드, 매니저를 배정하고 관리합니다.
					</p>
				</div>
			</div>

			<div className='max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8'>
				<div className='grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6'>
					{/* Sidebar */}
					<aside className='rounded-xl border border-border bg-card overflow-hidden h-fit'>
						<div className='p-5 border-b border-border'>
							<div className='flex items-center gap-3'>
								<div className='w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center'>
									<Building2 className='w-5 h-5 text-primary' />
								</div>
								<div>
									<h2 className='font-semibold text-foreground'>회사 관리</h2>
									<p className='text-xs text-muted-foreground'>
										회사를 선택하세요
									</p>
								</div>
							</div>
						</div>

						<div className='p-4 border-b border-border'>
							<div className='relative'>
								<Search className='absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground' />
								<Input
									value={companySearch}
									onChange={e => setCompanySearch(e.target.value)}
									placeholder='회사 검색...'
									className='pl-9 h-10 text-sm'
								/>
							</div>
						</div>

						<div className='divide-y divide-border'>
							{filteredCompanies.map(company => {
								const gwCount = gateways.filter(
									g => g.companyId === company._id,
								).length
								const nodeCount = nodes.filter(
									n => n.companyId === company._id,
								).length
								const isActive = company._id === selectedCompanyId

								return (
									<button
										key={company._id}
										onClick={() => setSelectedCompanyId(company._id)}
										className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors border-l-2
										${
											isActive
												? 'bg-primary/5 border-l-primary'
												: 'hover:bg-muted/50 border-l-transparent'
										}`}
									>
										<Avatar
											name={company.companyName.slice(0, 2)}
											id={company._id}
											size='sm'
										/>

										<div className='flex-1 min-w-0'>
											<p className='text-sm font-medium text-foreground truncate'>
												{company.companyName}
											</p>
											<p className='text-xs text-muted-foreground'>
												GW {gwCount} · 노드 {nodeCount}
											</p>
										</div>

										{company.companyStatus === 'inactive' && (
											<span className='text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-md'>
												비활성
											</span>
										)}
									</button>
								)
							})}
						</div>
					</aside>

					{/* Main Content */}
					<section className='space-y-6'>
						<div className='rounded-xl border border-border bg-card p-5 sm:p-6'>
							<div className='flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-5'>
								<div className='flex items-center gap-3'>
									<Avatar
										name={selectedCompany.companyName.slice(0, 2)}
										id={selectedCompany._id}
									/>

									<div>
										<h2 className='text-lg sm:text-xl font-bold text-foreground'>
											{selectedCompany.companyName}
										</h2>
										<p className='text-sm text-muted-foreground mt-0.5'>
											{selectedCompany.companyAddress}
										</p>
									</div>
								</div>

								<StatusBadge status={selectedCompany.companyStatus} />
							</div>

							<div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
								{[
									{ label: '게이트웨이', value: assignedGWCount },
									{ label: '노드', value: assignedNodeCount },
								].map((s, i) => (
									<div
										key={i}
										className='rounded-xl border border-border bg-background p-4 text-center'
									>
										<p className='text-2xl font-bold text-foreground'>
											{s.value}
										</p>
										<p className='text-xs text-muted-foreground mt-1'>
											{s.label}
										</p>
									</div>
								))}
							</div>
						</div>

						<div className='rounded-xl border border-border bg-card overflow-hidden'>
							<Tabs
								value={activeTab}
								onValueChange={value =>
									setActiveTab(value as 'gateways' | 'nodes')
								}
							>
								<div className='p-5 sm:p-6 border-b border-border'>
									<TabsList className='grid grid-cols-2 w-full glass p-1 h-auto rounded-lg'>
										{[
											{ value: 'gateways', label: '게이트웨이', icon: Wifi },
											{ value: 'nodes', label: '노드', icon: Link2 },
										].map(tab => (
											<TabsTrigger
												key={tab.value}
												value={tab.value}
												className='flex items-center justify-center gap-1.5 h-10 rounded-md text-sm data-[state=active]:bg-card data-[state=active]:text-primary'
											>
												<tab.icon className='w-4 h-4' />
												{tab.label}
											</TabsTrigger>
										))}
									</TabsList>
								</div>

								<TabsContent value='gateways' className='m-0 p-5 sm:p-6'>
									<GatewayTab
										company={selectedCompany}
										gateways={gateways}
										onAssign={assignGateway}
										onRevoke={revokeGateway}
									/>

									<SaveBar
										isDirty={dirtyTabs.has('gateways')}
										saving={saving && activeTab === 'gateways'}
										onSave={handleSave}
									/>
								</TabsContent>

								<TabsContent value='nodes' className='m-0 p-5 sm:p-6'>
									<NodeTab
										company={selectedCompany}
										nodes={nodes}
										onAssign={assignNode}
										onRevoke={revokeNode}
									/>

									<SaveBar
										isDirty={dirtyTabs.has('nodes')}
										saving={saving && activeTab === 'nodes'}
										onSave={handleSave}
									/>
								</TabsContent>
							</Tabs>
						</div>
					</section>
				</div>
			</div>
		</motion.div>
	)
}

// Create a reusable component to keep it DRY
function SaveBar({
	isDirty,
	saving,
	onSave,
}: {
	isDirty: boolean
	saving: boolean
	onSave: () => void
}) {
	return (
		<div className='flex items-center justify-end gap-3 mt-6 pt-4 border-t border-border'>
			{isDirty && (
				<span className='text-xs text-amber-600 dark:text-amber-400'>
					저장되지 않은 변경사항
				</span>
			)}
			<Button
				size='sm'
				disabled={!isDirty || saving}
				onClick={onSave}
				className='gap-1.5 h-8'
			>
				{saving ? (
					<>
						<Loader2 className='w-3.5 h-3.5 animate-spin' />
						저장 중...
					</>
				) : (
					<>
						<Save className='w-3.5 h-3.5' />
						저장
					</>
				)}
			</Button>
		</div>
	)
}
