import { AlertDialogHeader } from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select'
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
	useCheckCompanyNodesMutation,
	useCompanyAvailableNodesQuery,
	useCompanyGatewayNodesQuery,
	useCompanyGatewaysQuery,
	useCompanyNodesQuery,
	useRegisterCompanyNodesToGatewayMutation,
	useUnassignCompanyNodesMutation,
} from '@/features/admin/hooks/useDevice'
import { DeviceGateway } from '@/features/admin/types/device.types'
import { GATEWAY_TYPES } from '@/features/admin/types/gateway.types'
import { NODE_TYPES } from '@/features/admin/types/node.types'
import { useMyCompany } from '@/features/manager/hooks/usemanagerCompany'
import { parseNodeNumbers } from '@/features/manager/pages/Devices'
import {
	AlertCircle,
	CheckCircle2,
	Info,
	Link2,
	Loader2,
	Search,
	Unlink,
} from 'lucide-react'
import { useState } from 'react'

function getNodeTypeLabel(type: string) {
	return NODE_TYPES.find(t => t.value === type)?.label || type
}

function getGatewayTypeLabel(type: string) {
	return GATEWAY_TYPES.find(t => t.value === type)?.label || type
}

function getStatusBadge(status: string) {
	const styles: Record<string, string> = {
		active:
			'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
		inactive: 'bg-muted text-muted-foreground border-border',
		warning:
			'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
		unassigned: 'bg-slate-500/10 text-slate-500 border-slate-500/20',
	}
	const labels: Record<string, string> = {
		active: '활성',
		inactive: '비활성',
		warning: '경고',
		unassigned: '미배정',
	}
	return (
		<span
			className={`px-2 py-0.5 rounded-md text-xs font-medium border ${styles[status] || styles.inactive}`}
		>
			{labels[status] || status}
		</span>
	)
}

function getAssignedBadge(isAssigned: boolean) {
	return (
		<span
			className={`px-2 py-0.5 rounded-md text-xs font-medium border ${
				isAssigned
					? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
					: 'bg-muted text-muted-foreground border-border'
			}`}
		>
			{isAssigned ? '활성' : '비활성'}
		</span>
	)
}
type LocationState = {
	companyId: string
}

function NodesConnectionTabsSection() {
	const [activeTab, setActiveTab] = useState('gateways')
	const { data: company } = useMyCompany()
	const companyId = company?._id as string

	const [assignedNodesDialogOpen, setAssignedNodesDialogOpen] = useState(false)
	const [selectedGatewayForNodes, setSelectedGatewayForNodes] =
		useState<DeviceGateway | null>(null)

	const [nodeSearch, setNodeSearch] = useState('')
	const [gatewaySearch, setGatewaySearch] = useState('')

	const [regGatewayId, setRegGatewayId] = useState('')
	const [regNodeType, setRegNodeType] = useState('')
	const [regNodeInput, setRegNodeInput] = useState('')

	const [nodeCheckStatus, setNodeCheckStatus] = useState<
		'idle' | 'checking' | 'found' | 'not_found'
	>('idle')

	const [regResult, setRegResult] = useState<{
		success: boolean
		message: string
	} | null>(null)

	const [nodeTypeFilter, setNodeTypeFilter] = useState('전체')
	const [refSearch, setRefSearch] = useState('')
	const [selectedNodeIds, setSelectedNodeIds] = useState<Set<string>>(new Set())
	const [unassignResult, setUnassignResult] = useState<{
		success: boolean
		message: string
	} | null>(null)

	const unassignNodesMutation = useUnassignCompanyNodesMutation(companyId)

	const toggleNodeSelection = (nodeId: string) => {
		setSelectedNodeIds(prev => {
			const next = new Set(prev)
			if (next.has(nodeId)) {
				next.delete(nodeId)
			} else {
				next.add(nodeId)
			}
			return next
		})
	}

	const handleUnassignNodes = async () => {
		if (!companyId || selectedNodeIds.size === 0) return
		try {
			await unassignNodesMutation.mutateAsync({ nodeIds: [...selectedNodeIds] })
			setSelectedNodeIds(new Set())
			setUnassignResult({
				success: true,
				message: `${selectedNodeIds.size}개 노드 연결이 해제되었습니다.`,
			})
			nodesQuery.refetch()
		} catch {
			setUnassignResult({
				success: false,
				message: '노드 해제 중 오류가 발생했습니다.',
			})
		}
	}

	const regParsedNodes = parseNodeNumbers(regNodeInput)

	const gatewaysQuery = useCompanyGatewaysQuery(companyId, gatewaySearch)
	const nodesQuery = useCompanyNodesQuery(companyId, {
		search: nodeSearch,
	})

	const availableNodesQuery = useCompanyAvailableNodesQuery(companyId, {
		search: refSearch,
		nodeType: nodeTypeFilter === '전체' ? undefined : nodeTypeFilter,
	})

	const assignedNodesQuery = useCompanyGatewayNodesQuery(
		companyId,
		selectedGatewayForNodes?._id,
	)

	const checkNodesMutation = useCheckCompanyNodesMutation(companyId)
	const registerNodesMutation =
		useRegisterCompanyNodesToGatewayMutation(companyId)

	const gateways = gatewaysQuery.data ?? []
	const nodes = nodesQuery.data ?? []
	const availableNodes = availableNodesQuery.data ?? []
	const assignedNodesForGateway = assignedNodesQuery.data ?? []

	// const selectedGateway = gateways.find(gw => gw._id === regGatewayId) ?? null

	const resetRegForm = () => {
		setNodeCheckStatus('idle')
		setRegResult(null)
	}

	const openAssignedNodesDialog = (gateway: DeviceGateway) => {
		setSelectedGatewayForNodes(gateway)
		setAssignedNodesDialogOpen(true)
	}

	const handleCheckNodes = async () => {
		if (!companyId || regParsedNodes.length === 0 || !regNodeType) return

		setNodeCheckStatus('checking')
		setRegResult(null)

		try {
			const result = await checkNodesMutation.mutateAsync({
				nodeType: regNodeType,
				numbers: regParsedNodes,
			})

			setNodeCheckStatus(result.ok ? 'found' : 'not_found')

			if (!result.ok) {
				setRegResult({
					success: false,
					message: `사용할 수 없는 노드: ${result.missingNumbers.join(', ')}`,
				})
			}
		} catch {
			setNodeCheckStatus('not_found')
			setRegResult({
				success: false,
				message: '노드 확인 중 오류가 발생했습니다.',
			})
		}
	}

	const handleRegisterNodes = async () => {
		if (!companyId || !regGatewayId || nodeCheckStatus !== 'found') return

		setRegResult(null)

		try {
			const result = await registerNodesMutation.mutateAsync({
				gatewayId: regGatewayId,
				data: {
					nodeType: regNodeType,
					numbers: regParsedNodes,
				},
			})

			setRegResult({
				success: true,
				message:
					result.message ||
					`${regParsedNodes.length}개의 노드가 게이트웨이에 등록되었습니다.`,
			})

			setRegGatewayId('')
			setRegNodeType('')
			setRegNodeInput('')
			setNodeCheckStatus('idle')
		} catch {
			setRegResult({
				success: false,
				message: '노드 등록 중 오류가 발생했습니다.',
			})
		}
	}

	if (!companyId) {
		return (
			<div className='rounded-xl border border-border p-6 text-sm text-muted-foreground'>
				회사 정보가 없습니다. 회사 목록에서 다시 진입해주세요.
			</div>
		)
	}

	return (
		<>
			<Tabs value={activeTab} onValueChange={setActiveTab} className='w-full'>
				<TabsList className='grid w-full grid-cols-3 max-w-md'>
					<TabsTrigger value='gateways'>게이트웨이 목록</TabsTrigger>
					<TabsTrigger value='nodes'>노드 목록</TabsTrigger>
					<TabsTrigger value='register'>노드 등록</TabsTrigger>
				</TabsList>

				{/* Gateways Table Tab */}
				<TabsContent value='gateways' className='mt-6'>
					<div className='rounded-xl border border-border glass p-5 sm:p-6'>
						<div className='flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4'>
							<h3 className='font-semibold text-foreground'>게이트웨이 목록</h3>

							<div className='relative w-full sm:w-64'>
								<Search className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground' />
								<Input
									placeholder='검색...'
									value={gatewaySearch}
									onChange={e => setGatewaySearch(e.target.value)}
									className='pl-9'
								/>
							</div>
						</div>

						<div className='overflow-x-auto'>
							<Table>
								<TableHeader>
									<TableRow>
										<TableHead>게이트웨이 번호</TableHead>
										<TableHead>타입</TableHead>
										<TableHead>배정 여부</TableHead>
										<TableHead>회사명</TableHead>
										<TableHead>건물명</TableHead>
										<TableHead>연결</TableHead>
										<TableHead>구역</TableHead>
										<TableHead>노드 할당</TableHead>
									</TableRow>
								</TableHeader>

								<TableBody>
									{gateways.map(gw => (
										<TableRow key={gw._id}>
											<TableCell className='font-mono font-medium'>
												{gw.serialNumber}
											</TableCell>

											<TableCell className='text-sm'>
												{getGatewayTypeLabel(gw.gatewayType)}
											</TableCell>

											<TableCell>{getAssignedBadge(!!gw.isAssigned)}</TableCell>

											<TableCell className='text-sm'>
												{gw.companyName || '-'}
											</TableCell>

											<TableCell className='text-sm'>
												{gw.buildingName || '-'}
											</TableCell>

											<TableCell>
												<span
													className={`inline-flex items-center gap-1 text-xs ${
														gw.isOnline
															? 'text-emerald-600 dark:text-emerald-400'
															: 'text-muted-foreground'
													}`}
												>
													<span
														className={`w-1.5 h-1.5 rounded-full ${
															gw.isOnline
																? 'bg-emerald-500'
																: 'bg-muted-foreground'
														}`}
													/>
													{gw.isOnline ? '온라인' : '오프라인'}
												</span>
											</TableCell>

											<TableCell className='text-sm text-muted-foreground'>
												{gw.installedLocation || '-'}
											</TableCell>

											<TableCell>
												<Button
													variant='outline'
													size='sm'
													className='gap-1.5'
													onClick={() => openAssignedNodesDialog(gw)}
												>
													<Link2 className='w-3.5 h-3.5' />
													노드 할당
												</Button>
											</TableCell>
										</TableRow>
									))}

									{gateways.length === 0 && (
										<TableRow>
											<TableCell
												colSpan={8}
												className='text-center text-muted-foreground py-8'
											>
												{gatewaysQuery.isLoading
													? '불러오는 중...'
													: '검색 결과가 없습니다.'}
											</TableCell>
										</TableRow>
									)}
								</TableBody>
							</Table>
						</div>
					</div>
				</TabsContent>

				{/* Nodes Table Tab */}
				<TabsContent value='nodes' className='mt-6'>
					<div className='rounded-xl border border-border glass p-5 sm:p-6'>
						<div className='flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4'>
							<h3 className='font-semibold text-foreground'>노드 목록</h3>

							<div className='flex items-center gap-2 w-full sm:w-auto'>
								{selectedNodeIds.size > 0 && (
									<Button
										variant='destructive'
										size='sm'
										className='gap-1.5 shrink-0'
										onClick={handleUnassignNodes}
										disabled={unassignNodesMutation.isPending}
									>
										{unassignNodesMutation.isPending ? (
											<Loader2 className='w-3.5 h-3.5 animate-spin' />
										) : (
											<Unlink className='w-3.5 h-3.5' />
										)}
										연결 해제 ({selectedNodeIds.size})
									</Button>
								)}
								<div className='relative w-full sm:w-64'>
									<Search className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground' />
									<Input
										placeholder='검색...'
										value={nodeSearch}
										onChange={e => setNodeSearch(e.target.value)}
										className='pl-9'
									/>
								</div>
							</div>
						</div>

						{unassignResult && (
							<div
								className={`flex items-center gap-2 p-3 mb-3 rounded-lg text-sm ${
									unassignResult.success
										? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
										: 'bg-destructive/10 text-destructive'
								}`}
							>
								{unassignResult.success ? (
									<CheckCircle2 className='w-4 h-4' />
								) : (
									<AlertCircle className='w-4 h-4' />
								)}
								{unassignResult.message}
							</div>
						)}

						<div className='overflow-x-auto'>
							<Table>
								<TableHeader>
									<TableRow>
										<TableHead className='w-10' /> {/* checkbox column */}
										<TableHead className='w-20'>노드 번호</TableHead>
										<TableHead>노드 타입</TableHead>
										<TableHead>게이트웨이</TableHead>
										<TableHead>상태</TableHead>
										<TableHead>배정 여부</TableHead>
										<TableHead>회사명</TableHead>
									</TableRow>
								</TableHeader>

								<TableBody>
									{nodes.map(node => {
										const isAssignable =
											!!node.gatewayId && !!node.gatewaySerialNumber
										const isChecked = selectedNodeIds.has(node._id)

										return (
											<TableRow
												key={node._id}
												className={isChecked ? 'bg-muted/40' : undefined}
											>
												<TableCell>
													{isAssignable && (
														<Checkbox
															checked={isChecked}
															onCheckedChange={() =>
																toggleNodeSelection(node._id)
															}
														/>
													)}
												</TableCell>
												<TableCell className='font-mono font-medium'>
													{node.number}
												</TableCell>
												<TableCell className='text-sm'>
													{getNodeTypeLabel(node.nodeType)}
												</TableCell>
												<TableCell className='font-mono text-sm'>
													{node.gatewaySerialNumber || '-'}
												</TableCell>
												<TableCell>{getStatusBadge(node.status)}</TableCell>
												<TableCell>
													{getAssignedBadge(!!node.isAssigned)}
												</TableCell>
												<TableCell className='text-sm'>
													{node.companyName || '-'}
												</TableCell>
											</TableRow>
										)
									})}

									{nodes.length === 0 && (
										<TableRow>
											<TableCell
												colSpan={7}
												className='text-center text-muted-foreground py-8'
											>
												{nodesQuery.isLoading
													? '불러오는 중...'
													: '검색 결과가 없습니다.'}
											</TableCell>
										</TableRow>
									)}
								</TableBody>
							</Table>
						</div>
					</div>
				</TabsContent>

				{/* Gateway-Node Registration Tab */}
				<TabsContent value='register' className='mt-6'>
					<div className='grid grid-cols-1 lg:grid-cols-2 gap-4'>
						{/* Left panel — registration form */}
						<div className='rounded-xl border border-border glass p-5 sm:p-6 max-w-2xl'>
							<div className='flex items-center gap-3 mb-5'>
								<div className='w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center'>
									<Link2 className='w-5 h-5 text-primary' />
								</div>
								<div>
									<h2 className='font-semibold text-foreground'>
										게이트웨이에 노드 등록
									</h2>
									<p className='text-xs text-muted-foreground'>
										기존 노드를 게이트웨이에 연결합니다.
									</p>
								</div>
							</div>

							<div className='space-y-5'>
								<div className='space-y-2'>
									<Label className='text-sm font-medium'>게이트웨이 선택</Label>
									<Select
										value={regGatewayId}
										onValueChange={v => {
											setRegGatewayId(v)
											setRegResult(null)
										}}
									>
										<SelectTrigger>
											<SelectValue placeholder='게이트웨이를 선택하세요' />
										</SelectTrigger>
										<SelectContent>
											{gateways.map(gw => (
												<SelectItem key={gw._id} value={gw._id}>
													{gw.serialNumber} — {gw.buildingName || '-'}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
								</div>

								<div className='space-y-2'>
									<Label className='text-sm font-medium'>노드 타입</Label>
									<Select
										value={regNodeType}
										onValueChange={v => {
											setRegNodeType(v)
											resetRegForm()
										}}
									>
										<SelectTrigger>
											<SelectValue placeholder='노드 타입 선택' />
										</SelectTrigger>
										<SelectContent>
											{NODE_TYPES.map(type => (
												<SelectItem key={type.value} value={type.value}>
													{type.label}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
								</div>

								<div className='space-y-2'>
									<Label className='text-sm font-medium'>노드 번호</Label>
									<div className='flex gap-2'>
										<Input
											placeholder='예: 1 또는 1-10 또는 1,13,43'
											value={regNodeInput}
											onChange={e => {
												setRegNodeInput(e.target.value)
												setNodeCheckStatus('idle')
												setRegResult(null)
											}}
											className='flex-1'
										/>
										<Button
											variant='outline'
											onClick={handleCheckNodes}
											disabled={
												regParsedNodes.length === 0 ||
												!regNodeType ||
												nodeCheckStatus === 'checking'
											}
											className='gap-2 shrink-0'
										>
											{nodeCheckStatus === 'checking' ? (
												<Loader2 className='w-4 h-4 animate-spin' />
											) : nodeCheckStatus === 'found' ? (
												<CheckCircle2 className='w-4 h-4 text-emerald-500' />
											) : nodeCheckStatus === 'not_found' ? (
												<AlertCircle className='w-4 h-4 text-destructive' />
											) : (
												<Search className='w-4 h-4' />
											)}
											확인
										</Button>
									</div>
									<div className='flex items-start gap-1.5 text-xs text-muted-foreground'>
										<Info className='w-3.5 h-3.5 mt-0.5 shrink-0' />
										<span>단일: 1 | 범위: 1-10 | 여러개: 1,13,43,23</span>
									</div>
									{nodeCheckStatus === 'found' && (
										<p className='text-xs text-emerald-600 dark:text-emerald-400'>
											{regParsedNodes.length}개의 노드가 확인되었습니다.
										</p>
									)}
									{nodeCheckStatus === 'not_found' && (
										<p className='text-xs text-destructive'>
											일부 노드를 찾을 수 없거나 타입이 일치하지 않습니다.
										</p>
									)}
								</div>

								{regParsedNodes.length > 0 && (
									<div className='bg-muted/30 rounded-lg p-3'>
										<p className='text-xs font-medium text-muted-foreground mb-2'>
											등록할 노드 ({regParsedNodes.length}개)
										</p>
										<div className='flex flex-wrap gap-1.5'>
											{regParsedNodes.slice(0, 20).map(num => (
												<span
													key={num}
													className='px-2 py-0.5 bg-primary/10 text-primary text-xs font-mono rounded'
												>
													{num}
												</span>
											))}
											{regParsedNodes.length > 20 && (
												<span className='px-2 py-0.5 bg-muted text-muted-foreground text-xs rounded'>
													+{regParsedNodes.length - 20}개 더
												</span>
											)}
										</div>
									</div>
								)}

								{regResult && (
									<div
										className={`flex items-center gap-2 p-3 rounded-lg text-sm ${regResult.success ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' : 'bg-destructive/10 text-destructive'}`}
									>
										{regResult.success ? (
											<CheckCircle2 className='w-4 h-4' />
										) : (
											<AlertCircle className='w-4 h-4' />
										)}
										{regResult.message}
									</div>
								)}

								<Button
									onClick={handleRegisterNodes}
									disabled={
										!regGatewayId ||
										nodeCheckStatus !== 'found' ||
										registerNodesMutation.isPending
									}
									className='w-full gap-2'
								>
									{registerNodesMutation.isPending ? (
										<>
											<Loader2 className='w-4 h-4 animate-spin' />
											등록 중...
										</>
									) : (
										<>
											<Link2 className='w-4 h-4' />
											노드 등록
										</>
									)}
								</Button>
							</div>
						</div>

						{/* Right panel — node reference table */}
						<div className='rounded-xl border border-border glass p-5 sm:p-6'>
							<h3 className='font-semibold text-foreground mb-4'>
								보유 노드 현황
							</h3>

							<div className='flex gap-2 flex-wrap w-full mb-3'>
								{[{ label: '전체', value: '전체' }, ...NODE_TYPES].map(type => (
									<button
										key={type.value}
										onClick={() => setNodeTypeFilter(type.value)}
										className={`px-3 py-1 rounded-full text-xs border transition-colors ${
											nodeTypeFilter === type.value
												? 'bg-foreground text-background border-transparent'
												: 'border-border text-muted-foreground hover:bg-muted'
										}`}
									>
										{type.label}
									</button>
								))}
							</div>

							<div className='relative mb-3'>
								<Search className='absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground' />
								<Input
									placeholder='번호, 위치 검색...'
									className='pl-8 h-8 text-xs'
									value={refSearch}
									onChange={e => setRefSearch(e.target.value)}
								/>
							</div>

							<div className='max-h-80 overflow-y-auto rounded-lg border border-border'>
								<Table>
									<TableHeader>
										<TableRow>
											<TableHead className='w-14'>번호</TableHead>
											<TableHead>타입</TableHead>
											<TableHead>상태</TableHead>
											<TableHead>위치</TableHead>
										</TableRow>
									</TableHeader>
									<TableBody>
										{availableNodes.map(node => (
											<TableRow key={node._id}>
												<TableCell className='font-mono'>
													{node.number}
												</TableCell>

												<TableCell className='text-xs'>
													{getNodeTypeLabel(node.nodeType)}
												</TableCell>

												<TableCell>{getStatusBadge(node.status)}</TableCell>

												<TableCell className='text-xs text-muted-foreground'>
													{node.installedLocation || '-'}
												</TableCell>
											</TableRow>
										))}

										{availableNodes.length === 0 && (
											<TableRow>
												<TableCell
													colSpan={4}
													className='text-center text-muted-foreground py-8'
												>
													{availableNodesQuery.isLoading
														? '불러오는 중...'
														: '등록 가능한 노드가 없습니다.'}
												</TableCell>
											</TableRow>
										)}
									</TableBody>
								</Table>
							</div>
						</div>
					</div>
				</TabsContent>
			</Tabs>

			{/* Assigned Nodes Dialog */}

			<Dialog
				open={assignedNodesDialogOpen}
				onOpenChange={setAssignedNodesDialogOpen}
			>
				<DialogContent className='sm:max-w-md'>
					<AlertDialogHeader>
						<DialogTitle>
							{selectedGatewayForNodes?.serialNumber} - 할당된 노드
						</DialogTitle>
					</AlertDialogHeader>

					<div className='space-y-4 py-4'>
						<div className='border border-border rounded-lg max-h-72 overflow-y-auto'>
							{assignedNodesForGateway.length > 0 ? (
								assignedNodesForGateway.map(node => (
									<div
										key={node._id}
										className='flex items-center gap-3 px-3 py-3 hover:bg-muted/50 border-b border-border last:border-b-0'
									>
										<div className='w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0'>
											<Link2 className='w-4 h-4 text-primary' />
										</div>

										<div className='flex-1 min-w-0'>
											<p className='text-sm font-medium text-foreground'>
												노드 {node.number}
											</p>

											<p className='text-xs text-muted-foreground truncate'>
												{getNodeTypeLabel(node.nodeType)}
											</p>

											<p className='text-xs text-muted-foreground truncate'>
												{node.companyName || '-'}
											</p>
										</div>

										<div className='shrink-0'>
											{getStatusBadge(node.status)}
										</div>
									</div>
								))
							) : (
								<div className='p-6 text-center text-sm text-muted-foreground'>
									{assignedNodesQuery.isLoading
										? '불러오는 중...'
										: '할당된 노드가 없습니다.'}
								</div>
							)}
						</div>
					</div>
				</DialogContent>
			</Dialog>
		</>
	)
}

export default NodesConnectionTabsSection
