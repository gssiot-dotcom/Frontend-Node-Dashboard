import { Button } from '@/components/ui/button'
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
import { GATEWAY_TYPES } from '@/features/admin/types/gateway.types'
import { NODE_TYPES } from '@/features/admin/types/node.types'
import {
	AlertCircle,
	CheckCircle2,
	Info,
	Link2,
	Loader2,
	Search,
} from 'lucide-react'
import { useState } from 'react'
import { MOCK_GATEWAYS, MOCK_NODES, parseNodeNumbers } from '../pages/Devices'

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

function DevicesTabsSection() {
	const [activeTab, setActiveTab] = useState('nodes')

	const [nodeSearch, setNodeSearch] = useState('')
	const [gatewaySearch, setGatewaySearch] = useState('')

	const [regGatewaySerial, setRegGatewaySerial] = useState('')
	const [regNodeType, setRegNodeType] = useState('')
	const [regNodeInput, setRegNodeInput] = useState('')

	const [gwCheckStatus, setGwCheckStatus] = useState<
		'idle' | 'checking' | 'found' | 'not_found'
	>('idle')

	const [nodeCheckStatus, setNodeCheckStatus] = useState<
		'idle' | 'checking' | 'found' | 'not_found'
	>('idle')

	const [regSubmitting, setRegSubmitting] = useState(false)

	const [regResult, setRegResult] = useState<{
		success: boolean
		message: string
	} | null>(null)

	const regParsedNodes = parseNodeNumbers(regNodeInput)

	const filteredNodes = MOCK_NODES.filter(
		node =>
			node.node_number.toString().includes(nodeSearch) ||
			node.node_type.toLowerCase().includes(nodeSearch.toLowerCase()) ||
			(node.gateway_number || '')
				.toLowerCase()
				.includes(nodeSearch.toLowerCase()) ||
			node.company_name.toLowerCase().includes(nodeSearch.toLowerCase()),
	)

	const filteredGateways = MOCK_GATEWAYS.filter(
		gw =>
			gw.gw_number.toLowerCase().includes(gatewaySearch.toLowerCase()) ||
			gw.gateway_type.toLowerCase().includes(gatewaySearch.toLowerCase()) ||
			gw.company_name.toLowerCase().includes(gatewaySearch.toLowerCase()) ||
			gw.building_name.toLowerCase().includes(gatewaySearch.toLowerCase()),
	)

	const resetRegForm = () => {
		setGwCheckStatus('idle')
		setNodeCheckStatus('idle')
		setRegResult(null)
	}

	const handleCheckNodes = async () => {
		if (regParsedNodes.length === 0 || !regNodeType) return

		setNodeCheckStatus('checking')

		await new Promise(resolve => setTimeout(resolve, 800))

		const allExist = regParsedNodes.every(num =>
			MOCK_NODES.some(
				n => n.node_number === num && n.node_type === regNodeType,
			),
		)

		setNodeCheckStatus(allExist ? 'found' : 'not_found')
	}

	const handleRegisterNodes = async () => {
		if (gwCheckStatus !== 'found' || nodeCheckStatus !== 'found') return

		setRegSubmitting(true)
		setRegResult(null)

		await new Promise(resolve => setTimeout(resolve, 1200))

		setRegSubmitting(false)
		setRegResult({
			success: true,
			message: `${regParsedNodes.length}개의 노드가 게이트웨이에 등록되었습니다.`,
		})

		setRegGatewaySerial('')
		setRegNodeType('')
		setRegNodeInput('')
		setGwCheckStatus('idle')
		setNodeCheckStatus('idle')
	}

	const [nodeTypeFilter, setNodeTypeFilter] = useState('전체')
	const [refSearch, setRefSearch] = useState('')

	const filteredRefNodes = MOCK_NODES.filter(node => {
		const matchType =
			nodeTypeFilter === '전체' ||
			getNodeTypeLabel(node.node_type) === nodeTypeFilter
		const matchSearch =
			node.node_number.toString().includes(refSearch) ||
			node.position.toLowerCase().includes(refSearch.toLowerCase())
		return matchType && matchSearch
	})

	return (
		<Tabs value={activeTab} onValueChange={setActiveTab} className='w-full'>
			<TabsList className='grid w-full grid-cols-3 max-w-md'>
				<TabsTrigger value='nodes'>노드 목록</TabsTrigger>
				<TabsTrigger value='gateways'>게이트웨이 목록</TabsTrigger>
				<TabsTrigger value='register'>노드 등록</TabsTrigger>
			</TabsList>

			{/* Nodes Table Tab */}
			<TabsContent value='nodes' className='mt-6'>
				<div className='glass rounded-xl p-5 sm:p-6'>
					<div className='flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4'>
						<h3 className='font-semibold text-foreground'>노드 목록</h3>
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
					<div className='overflow-x-auto'>
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead className='w-20'>노드 번호</TableHead>
									<TableHead>노드 타입</TableHead>
									<TableHead>게이트웨이</TableHead>
									<TableHead>상태</TableHead>
									<TableHead>위치</TableHead>
									<TableHead>회사명</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{filteredNodes.map(node => (
									<TableRow key={node.node_number}>
										<TableCell className='font-mono font-medium'>
											{node.node_number}
										</TableCell>
										<TableCell className='text-sm'>
											{getNodeTypeLabel(node.node_type)}
										</TableCell>
										<TableCell className='font-mono text-sm'>
											{node.gateway_number || '-'}
										</TableCell>
										<TableCell>{getStatusBadge(node.node_status)}</TableCell>
										<TableCell className='text-sm text-muted-foreground'>
											{node.position}
										</TableCell>
										<TableCell className='text-sm'>
											{node.company_name}
										</TableCell>
									</TableRow>
								))}
								{filteredNodes.length === 0 && (
									<TableRow>
										<TableCell
											colSpan={6}
											className='text-center text-muted-foreground py-8'
										>
											검색 결과가 없습니다.
										</TableCell>
									</TableRow>
								)}
							</TableBody>
						</Table>
					</div>
				</div>
			</TabsContent>

			{/* Gateways Table Tab */}
			<TabsContent value='gateways' className='mt-6'>
				<div className='glass rounded-xl p-5 sm:p-6'>
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
									<TableHead>상태</TableHead>
									<TableHead>회사명</TableHead>
									<TableHead>건물명</TableHead>
									<TableHead>연결</TableHead>
									<TableHead>구역</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{filteredGateways.map(gw => (
									<TableRow key={gw.gw_number}>
										<TableCell className='font-mono font-medium'>
											{gw.gw_number}
										</TableCell>
										<TableCell className='text-sm'>
											{getGatewayTypeLabel(gw.gateway_type)}
										</TableCell>
										<TableCell>{getStatusBadge(gw.status)}</TableCell>
										<TableCell className='text-sm'>{gw.company_name}</TableCell>
										<TableCell className='text-sm'>
											{gw.building_name}
										</TableCell>
										<TableCell>
											<span
												className={`inline-flex items-center gap-1 text-xs ${gw.gateway_alive ? 'text-emerald-600 dark:text-emerald-400' : 'text-muted-foreground'}`}
											>
												<span
													className={`w-1.5 h-1.5 rounded-full ${gw.gateway_alive ? 'bg-emerald-500' : 'bg-muted-foreground'}`}
												/>
												{gw.gateway_alive ? '온라인' : '오프라인'}
											</span>
										</TableCell>
										<TableCell className='text-sm text-muted-foreground'>
											{gw.zone_name || '-'}
										</TableCell>
									</TableRow>
								))}
								{filteredGateways.length === 0 && (
									<TableRow>
										<TableCell
											colSpan={7}
											className='text-center text-muted-foreground py-8'
										>
											검색 결과가 없습니다.
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
				{/* Layout wrapper */}
				<div className='grid grid-cols-1 lg:grid-cols-2 gap-4'>
					{/* Left panel — registration form */}
					<div className='glass rounded-xl p-5 sm:p-6 max-w-2xl'>
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
							{/* Gateway Serial Input + Check */}
							<div className='space-y-2'>
								<Label className='text-sm font-medium'>게이트웨이 선택</Label>
								<Select
									value={regGatewaySerial}
									onValueChange={v => {
										setRegGatewaySerial(v)
										setRegResult(null)
									}}
								>
									<SelectTrigger>
										<SelectValue placeholder='게이트웨이를 선택하세요' />
									</SelectTrigger>
									<SelectContent>
										{MOCK_GATEWAYS.filter(gw => gw.gateway_alive).map(gw => (
											<SelectItem key={gw.gw_number} value={gw.gw_number}>
												{gw.gw_number} — {gw.building_name}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</div>

							{/* Node Type Select */}
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

							{/* Node Numbers Input + Check */}
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

							{/* Parsed nodes preview */}
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

							{/* Result message */}
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

							{/* Submit button */}
							<Button
								onClick={handleRegisterNodes}
								disabled={
									gwCheckStatus !== 'found' ||
									nodeCheckStatus !== 'found' ||
									regSubmitting
								}
								className='w-full gap-2'
							>
								{regSubmitting ? (
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
					<div className='glass rounded-xl p-5 sm:p-6'>
						<h3 className='font-semibold text-foreground mb-4'>
							보유 노드 현황
						</h3>

						{/* Type filter chips */}
						<div className='flex gap-2 flex-wrap mb-3'>
							{['전체', ...NODE_TYPES.map(t => t.label)].map(type => (
								<button
									key={type}
									onClick={() => setNodeTypeFilter(type)}
									className={`px-3 py-1 rounded-full text-xs border transition-colors ${
										nodeTypeFilter === type
											? 'bg-foreground text-background border-transparent'
											: 'border-border text-muted-foreground hover:bg-muted'
									}`}
								>
									{type}
								</button>
							))}
						</div>

						{/* Search */}
						<div className='relative mb-3'>
							<Search className='absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground' />
							<Input
								placeholder='번호, 위치 검색...'
								className='pl-8 h-8 text-xs'
								value={refSearch}
								onChange={e => setRefSearch(e.target.value)}
							/>
						</div>

						{/* Table */}
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
									{filteredRefNodes.map(node => (
										<TableRow key={node.node_number}>
											<TableCell className='font-mono'>
												{node.node_number}
											</TableCell>
											<TableCell className='text-xs'>
												{getNodeTypeLabel(node.node_type)}
											</TableCell>
											<TableCell>{getStatusBadge(node.node_status)}</TableCell>
											<TableCell className='text-xs text-muted-foreground'>
												{node.position}
											</TableCell>
										</TableRow>
									))}
								</TableBody>
							</Table>
						</div>
					</div>
				</div>
			</TabsContent>
		</Tabs>
	)
}

export default DevicesTabsSection
