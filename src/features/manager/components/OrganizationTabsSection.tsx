import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog'
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
	AlertCircle,
	Check,
	CheckCircle2,
	Info,
	Link2,
	Search,
	X,
} from 'lucide-react'
import { useState } from 'react'
import {
	MOCK_BUILDINGS,
	MOCK_GATEWAYS,
	MOCK_MEMBERS,
	MOCK_NODES,
} from '../pages/Organizations'

const getStatusBadge = (status: string) => {
	switch (status) {
		case 'active':
			return (
				<Badge
					variant='outline'
					className='bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
				>
					활성
				</Badge>
			)
		case 'inactive':
			return (
				<Badge variant='outline' className='bg-muted text-muted-foreground'>
					비활성
				</Badge>
			)
		default:
			return (
				<Badge variant='outline' className='bg-muted text-muted-foreground'>
					{status}
				</Badge>
			)
	}
}

const getUserTypeBadge = (userType: string) => {
	switch (userType) {
		case 'admin':
			return (
				<Badge
					variant='outline'
					className='bg-violet-500/10 text-violet-600 dark:text-violet-400 border-violet-500/20'
				>
					관리자
				</Badge>
			)
		case 'manager':
			return (
				<Badge
					variant='outline'
					className='bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20'
				>
					매니저
				</Badge>
			)
		case 'worker':
			return (
				<Badge
					variant='outline'
					className='bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20'
				>
					작업자
				</Badge>
			)
		default:
			return (
				<Badge variant='outline' className='bg-muted text-muted-foreground'>
					{userType}
				</Badge>
			)
	}
}

function OrganizationTabsSection() {
	const [activeTab, setActiveTab] = useState('buildings')

	const [buildingSearch, setBuildingSearch] = useState('')
	const [gatewaySearch, setGatewaySearch] = useState('')
	const [nodeSearch, setNodeSearch] = useState('')
	const [memberSearch, setMemberSearch] = useState('')

	// Worker → Building assignment
	const [assignWorkerDialogOpen, setAssignWorkerDialogOpen] = useState(false)
	const [selectedBuildingForWorker, setSelectedBuildingForWorker] = useState<
		number | null
	>(null)
	const [selectedWorkers, setSelectedWorkers] = useState<number[]>([])
	const [workerAssignSubmitting, setWorkerAssignSubmitting] = useState(false)
	const [workerAssignResult, setWorkerAssignResult] = useState<{
		success: boolean
		message: string
	} | null>(null)

	// Gateway → Building assignment dialog (from buildings tab)
	const [assignGatewayDialogOpen, setAssignGatewayDialogOpen] = useState(false)
	const [selectedBuildingForGateway, setSelectedBuildingForGateway] = useState<
		number | null
	>(null)
	const [selectedGateways, setSelectedGateways] = useState<number[]>([])
	const [gatewayAssignSubmitting, setGatewayAssignSubmitting] = useState(false)
	const [gatewayAssignResult, setGatewayAssignResult] = useState<{
		success: boolean
		message: string
	} | null>(null)

	const unassignedGateways = MOCK_GATEWAYS.filter(gw => gw.building_id === null)
	const workerMembers = MOCK_MEMBERS.filter(m => m.user_type === 'worker')

	const filteredBuildings = MOCK_BUILDINGS.filter(
		building =>
			building.name.toLowerCase().includes(buildingSearch.toLowerCase()) ||
			building.address.toLowerCase().includes(buildingSearch.toLowerCase()),
	)

	const filteredGateways = MOCK_GATEWAYS.filter(
		gw =>
			gw.gw_number.toLowerCase().includes(gatewaySearch.toLowerCase()) ||
			gw.building_name.toLowerCase().includes(gatewaySearch.toLowerCase()),
	)

	const filteredNodes = MOCK_NODES.filter(
		node =>
			node.node_number.toLowerCase().includes(nodeSearch.toLowerCase()) ||
			node.building_name.toLowerCase().includes(nodeSearch.toLowerCase()) ||
			node.node_type.toLowerCase().includes(nodeSearch.toLowerCase()),
	)

	const filteredMembers = MOCK_MEMBERS.filter(
		member =>
			member.name.toLowerCase().includes(memberSearch.toLowerCase()) ||
			member.email.toLowerCase().includes(memberSearch.toLowerCase()) ||
			member.phone.includes(memberSearch),
	)

	const toggleGatewaySelection = (gwId: number) => {
		setSelectedGateways(prev =>
			prev.includes(gwId) ? prev.filter(id => id !== gwId) : [...prev, gwId],
		)
	}

	const toggleWorkerSelection = (memberId: number) => {
		setSelectedWorkers(prev =>
			prev.includes(memberId)
				? prev.filter(id => id !== memberId)
				: [...prev, memberId],
		)
	}

	const openGatewayAssignDialog = (buildingId: number) => {
		setSelectedBuildingForGateway(buildingId)
		setSelectedGateways([])
		setGatewayAssignResult(null)
		setAssignGatewayDialogOpen(true)
	}

	const handleAssignGatewaysToBuilding = async () => {
		if (!selectedBuildingForGateway || selectedGateways.length === 0) return
		setGatewayAssignSubmitting(true)
		setGatewayAssignResult(null)
		await new Promise(resolve => setTimeout(resolve, 1000))
		setGatewayAssignSubmitting(false)
		setGatewayAssignResult({
			success: true,
			message: `${selectedGateways.length}개의 게이트웨이가 건물에 할당되었습니다.`,
		})
		setSelectedGateways([])
	}

	const handleAssignWorkersToBuilding = async () => {
		if (!selectedBuildingForWorker || selectedWorkers.length === 0) return
		setWorkerAssignSubmitting(true)
		setWorkerAssignResult(null)
		await new Promise(resolve => setTimeout(resolve, 1000))
		setWorkerAssignSubmitting(false)
		setWorkerAssignResult({
			success: true,
			message: `${selectedWorkers.length}명의 작업자가 건물에 할당되었습니다.`,
		})
		setSelectedWorkers([])
	}

	return (
		<>
			<Tabs value={activeTab} onValueChange={setActiveTab} className='w-full'>
				<TabsList className='grid w-full grid-cols-5 max-w-2xl'>
					<TabsTrigger value='buildings'>건물 목록</TabsTrigger>
					<TabsTrigger value='gateways'>게이트웨이</TabsTrigger>
					<TabsTrigger value='nodes'>노드</TabsTrigger>
					<TabsTrigger value='members'>멤버</TabsTrigger>
					<TabsTrigger value='assign'>할당 관리</TabsTrigger>
				</TabsList>

				{/* Buildings Tab */}
				<TabsContent value='buildings' className='mt-6'>
					<div className='rounded-xl border border-border bg-card p-5 sm:p-6'>
						<div className='flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4'>
							<h3 className='font-semibold text-foreground'>건물 목록</h3>
							<div className='relative w-full sm:w-64'>
								<Search className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground' />
								<Input
									placeholder='검색...'
									value={buildingSearch}
									onChange={e => setBuildingSearch(e.target.value)}
									className='pl-9'
								/>
							</div>
						</div>
						<div className='overflow-x-auto'>
							<Table>
								<TableHeader>
									<TableRow>
										<TableHead>건물명</TableHead>
										<TableHead>주소</TableHead>
										<TableHead>게이트웨이 수</TableHead>
										<TableHead>작업자 수</TableHead>
										<TableHead>작업</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{filteredBuildings.map(building => (
										<TableRow key={building.id}>
											<TableCell className='font-medium'>
												{building.name}
											</TableCell>
											<TableCell className='text-sm text-muted-foreground'>
												{building.address}
											</TableCell>
											<TableCell className='text-sm'>
												{building.gateway_count}개
											</TableCell>
											<TableCell className='text-sm'>
												{building.worker_count ?? 0}명
											</TableCell>
											<TableCell>
												<Button
													variant='outline'
													size='sm'
													onClick={() => openGatewayAssignDialog(building.id)}
													className='gap-1.5'
												>
													<Link2 className='w-3.5 h-3.5' />
													게이트웨이 할당
												</Button>
											</TableCell>
										</TableRow>
									))}
									{filteredBuildings.length === 0 && (
										<TableRow>
											<TableCell
												colSpan={5}
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

				{/* Gateways Tab */}
				<TabsContent value='gateways' className='mt-6'>
					<div className='rounded-xl border border-border bg-card p-5 sm:p-6'>
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
										<TableHead>건물명</TableHead>
										<TableHead>구역</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{filteredGateways.map(gw => (
										<TableRow key={gw.id}>
											<TableCell className='font-mono font-medium'>
												{gw.gw_number}
											</TableCell>
											<TableCell className='text-sm uppercase'>
												{gw.gateway_type}
											</TableCell>
											<TableCell>{getStatusBadge(gw.status)}</TableCell>
											<TableCell className='text-sm'>
												{gw.building_name || (
													<span className='text-muted-foreground'>미할당</span>
												)}
											</TableCell>
											<TableCell className='text-sm text-muted-foreground'>
												{gw.zone_name || '-'}
											</TableCell>
										</TableRow>
									))}
									{filteredGateways.length === 0 && (
										<TableRow>
											<TableCell
												colSpan={5}
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

				{/* Nodes Tab */}
				<TabsContent value='nodes' className='mt-6'>
					<div className='rounded-xl border border-border bg-card p-5 sm:p-6'>
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
										<TableHead>노드 번호</TableHead>
										<TableHead>타입</TableHead>
										<TableHead>상태</TableHead>
										<TableHead>건물명</TableHead>
										<TableHead>게이트웨이</TableHead>
										<TableHead>구역</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{filteredNodes.map(node => (
										<TableRow key={node.id}>
											<TableCell className='font-mono font-medium'>
												{node.node_number}
											</TableCell>
											<TableCell className='text-sm uppercase'>
												{node.node_type}
											</TableCell>
											<TableCell>{getStatusBadge(node.status)}</TableCell>
											<TableCell className='text-sm'>
												{node.building_name || (
													<span className='text-muted-foreground'>미할당</span>
												)}
											</TableCell>
											<TableCell className='text-sm font-mono text-muted-foreground'>
												{node.gateway_number || '-'}
											</TableCell>
											<TableCell className='text-sm text-muted-foreground'>
												{node.zone_name || '-'}
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

				{/* Members Tab */}
				<TabsContent value='members' className='mt-6'>
					<div className='rounded-xl border border-border bg-card p-5 sm:p-6'>
						<div className='flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4'>
							<h3 className='font-semibold text-foreground'>멤버 목록</h3>
							<div className='relative w-full sm:w-64'>
								<Search className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground' />
								<Input
									placeholder='검색...'
									value={memberSearch}
									onChange={e => setMemberSearch(e.target.value)}
									className='pl-9'
								/>
							</div>
						</div>
						<div className='overflow-x-auto'>
							<Table>
								<TableHeader>
									<TableRow>
										<TableHead>이름</TableHead>
										<TableHead>유형</TableHead>
										<TableHead>이메일</TableHead>
										<TableHead>연락처</TableHead>
										<TableHead>할당 건물</TableHead>
										<TableHead>상태</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{filteredMembers.map(member => (
										<TableRow key={member.id}>
											<TableCell className='font-medium'>
												{member.name}
											</TableCell>
											<TableCell>
												{getUserTypeBadge(member.user_type)}
											</TableCell>
											<TableCell className='text-sm text-muted-foreground'>
												{member.email}
											</TableCell>
											<TableCell className='text-sm text-muted-foreground'>
												{member.phone || '-'}
											</TableCell>
											<TableCell className='text-sm'>
												{member.building_name || (
													<span className='text-muted-foreground'>미할당</span>
												)}
											</TableCell>
											<TableCell>{getStatusBadge(member.status)}</TableCell>
										</TableRow>
									))}
									{filteredMembers.length === 0 && (
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

				{/* Assignment Management Tab */}
				<TabsContent value='assign' className='mt-6'>
					<div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
						{/* Gateway → Building Assignment */}
						<div className='rounded-xl border border-border bg-card p-5 sm:p-6'>
							<div className='flex items-center gap-3 mb-5'>
								<div className='w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center'>
									<Link2 className='w-5 h-5 text-primary' />
								</div>
								<div>
									<h2 className='font-semibold text-foreground'>
										게이트웨이 → 건물 할당
									</h2>
									<p className='text-xs text-muted-foreground'>
										미할당 게이트웨이를 건물에 연결
									</p>
								</div>
							</div>

							<div className='space-y-4'>
								<div className='space-y-2'>
									<Label className='text-sm font-medium'>건물 선택</Label>
									<Select
										value={selectedBuildingForGateway?.toString() || ''}
										onValueChange={v => {
											setSelectedBuildingForGateway(Number(v))
											setSelectedGateways([])
											setGatewayAssignResult(null)
										}}
									>
										<SelectTrigger>
											<SelectValue placeholder='건물을 선택하세요' />
										</SelectTrigger>
										<SelectContent>
											{MOCK_BUILDINGS.map(building => (
												<SelectItem
													key={building.id}
													value={building.id.toString()}
												>
													{building.name} - {building.address}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
								</div>

								{selectedBuildingForGateway && (
									<div className='space-y-2'>
										<Label className='text-sm font-medium'>
											미할당 게이트웨이 선택
										</Label>
										<div className='flex items-start gap-1.5 text-xs text-muted-foreground mb-2'>
											<Info className='w-3.5 h-3.5 mt-0.5 shrink-0' />
											<span>여러 게이트웨이를 선택할 수 있습니다.</span>
										</div>
										<div className='border border-border rounded-lg max-h-48 overflow-y-auto'>
											{unassignedGateways.length > 0 ? (
												unassignedGateways.map(gw => (
													<div
														key={gw.id}
														className='flex items-center gap-3 px-3 py-2 hover:bg-muted/50 cursor-pointer border-b border-border last:border-b-0'
														onClick={() => toggleGatewaySelection(gw.id)}
													>
														<Checkbox
															checked={selectedGateways.includes(gw.id)}
															onCheckedChange={() =>
																toggleGatewaySelection(gw.id)
															}
														/>
														<div className='flex-1'>
															<span className='font-mono text-sm font-medium'>
																{gw.gw_number}
															</span>
															<span className='text-xs text-muted-foreground ml-2 uppercase'>
																{gw.gateway_type}
															</span>
														</div>
														{getStatusBadge(gw.status)}
													</div>
												))
											) : (
												<div className='p-4 text-center text-sm text-muted-foreground'>
													미할당 게이트웨이가 없습니다.
												</div>
											)}
										</div>
									</div>
								)}

								{selectedGateways.length > 0 && (
									<div className='bg-muted/30 rounded-lg p-3'>
										<p className='text-xs font-medium text-muted-foreground mb-2'>
											선택된 게이트웨이 ({selectedGateways.length}개)
										</p>
										<div className='flex flex-wrap gap-1.5'>
											{selectedGateways.map(gwId => {
												const gw = MOCK_GATEWAYS.find(g => g.id === gwId)
												return (
													<span
														key={gwId}
														className='inline-flex items-center gap-1 px-2 py-0.5 bg-primary/10 text-primary text-xs font-mono rounded'
													>
														{gw?.gw_number}
														<button
															onClick={() => toggleGatewaySelection(gwId)}
															className='hover:text-destructive'
														>
															<X className='w-3 h-3' />
														</button>
													</span>
												)
											})}
										</div>
									</div>
								)}

								{gatewayAssignResult && (
									<div
										className={`flex items-center gap-2 p-3 rounded-lg text-sm ${gatewayAssignResult.success ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' : 'bg-destructive/10 text-destructive'}`}
									>
										{gatewayAssignResult.success ? (
											<CheckCircle2 className='w-4 h-4' />
										) : (
											<AlertCircle className='w-4 h-4' />
										)}
										{gatewayAssignResult.message}
									</div>
								)}

								<Button
									onClick={handleAssignGatewaysToBuilding}
									disabled={
										!selectedBuildingForGateway ||
										selectedGateways.length === 0 ||
										gatewayAssignSubmitting
									}
									className='w-full gap-2'
								>
									<Check className='w-4 h-4' />
									{gatewayAssignSubmitting
										? '할당 중...'
										: `게이트웨이 할당 ${selectedGateways.length > 0 ? `(${selectedGateways.length}개)` : ''}`}
								</Button>
							</div>
						</div>

						{/* Worker → Building Assignment */}
						<div className='rounded-xl border border-border bg-card p-5 sm:p-6'>
							<div className='flex items-center gap-3 mb-5'>
								<div className='w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center'>
									<Link2 className='w-5 h-5 text-primary' />
								</div>
								<div>
									<h2 className='font-semibold text-foreground'>
										작업자 → 건물 할당
									</h2>
									<p className='text-xs text-muted-foreground'>
										작업자 멤버를 건물에 배정
									</p>
								</div>
							</div>

							<div className='space-y-4'>
								<div className='space-y-2'>
									<Label className='text-sm font-medium'>건물 선택</Label>
									<Select
										value={selectedBuildingForWorker?.toString() || ''}
										onValueChange={v => {
											setSelectedBuildingForWorker(Number(v))
											setSelectedWorkers([])
											setWorkerAssignResult(null)
										}}
									>
										<SelectTrigger>
											<SelectValue placeholder='건물을 선택하세요' />
										</SelectTrigger>
										<SelectContent>
											{MOCK_BUILDINGS.map(building => (
												<SelectItem
													key={building.id}
													value={building.id.toString()}
												>
													{building.name} - {building.address}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
								</div>

								{selectedBuildingForWorker && (
									<div className='space-y-2'>
										<Label className='text-sm font-medium'>작업자 선택</Label>
										<div className='flex items-start gap-1.5 text-xs text-muted-foreground mb-2'>
											<Info className='w-3.5 h-3.5 mt-0.5 shrink-0' />
											<span>여러 작업자를 선택할 수 있습니다.</span>
										</div>
										<div className='border border-border rounded-lg max-h-48 overflow-y-auto'>
											{workerMembers.length > 0 ? (
												workerMembers.map(member => (
													<div
														key={member.id}
														className='flex items-center gap-3 px-3 py-2 hover:bg-muted/50 cursor-pointer border-b border-border last:border-b-0'
														onClick={() => toggleWorkerSelection(member.id)}
													>
														<Checkbox
															checked={selectedWorkers.includes(member.id)}
															onCheckedChange={() =>
																toggleWorkerSelection(member.id)
															}
														/>
														<div className='flex-1'>
															<span className='text-sm font-medium'>
																{member.name}
															</span>
															<p className='text-xs text-muted-foreground truncate'>
																{member.email}
															</p>
														</div>
														{getStatusBadge(member.status)}
													</div>
												))
											) : (
												<div className='p-4 text-center text-sm text-muted-foreground'>
													작업자 멤버가 없습니다.
												</div>
											)}
										</div>
									</div>
								)}

								{selectedWorkers.length > 0 && (
									<div className='bg-muted/30 rounded-lg p-3'>
										<p className='text-xs font-medium text-muted-foreground mb-2'>
											선택된 작업자 ({selectedWorkers.length}명)
										</p>
										<div className='flex flex-wrap gap-1.5'>
											{selectedWorkers.map(memberId => {
												const member = MOCK_MEMBERS.find(m => m.id === memberId)
												return (
													<span
														key={memberId}
														className='inline-flex items-center gap-1 px-2 py-0.5 bg-primary/10 text-primary text-xs rounded'
													>
														{member?.name}
														<button
															onClick={() => toggleWorkerSelection(memberId)}
															className='hover:text-destructive'
														>
															<X className='w-3 h-3' />
														</button>
													</span>
												)
											})}
										</div>
									</div>
								)}

								{workerAssignResult && (
									<div
										className={`flex items-center gap-2 p-3 rounded-lg text-sm ${workerAssignResult.success ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' : 'bg-destructive/10 text-destructive'}`}
									>
										{workerAssignResult.success ? (
											<CheckCircle2 className='w-4 h-4' />
										) : (
											<AlertCircle className='w-4 h-4' />
										)}
										{workerAssignResult.message}
									</div>
								)}

								<Button
									onClick={handleAssignWorkersToBuilding}
									disabled={
										!selectedBuildingForWorker ||
										selectedWorkers.length === 0 ||
										workerAssignSubmitting
									}
									className='w-full gap-2'
								>
									<Check className='w-4 h-4' />
									{workerAssignSubmitting
										? '할당 중...'
										: `작업자 할당 ${selectedWorkers.length > 0 ? `(${selectedWorkers.length}명)` : ''}`}
								</Button>
							</div>
						</div>
					</div>
				</TabsContent>
			</Tabs>

			{/* Gateway Assignment Dialog */}
			<Dialog
				open={assignGatewayDialogOpen}
				onOpenChange={setAssignGatewayDialogOpen}
			>
				<DialogContent className='sm:max-w-md'>
					<DialogHeader>
						<DialogTitle>게이트웨이 할당</DialogTitle>
						<DialogDescription>
							{
								MOCK_BUILDINGS.find(b => b.id === selectedBuildingForGateway)
									?.name
							}
							에 할당할 게이트웨이를 선택하세요.
						</DialogDescription>
					</DialogHeader>
					<div className='space-y-4 py-4'>
						<div className='border border-border rounded-lg max-h-64 overflow-y-auto'>
							{unassignedGateways.length > 0 ? (
								unassignedGateways.map(gw => (
									<div
										key={gw.id}
										className='flex items-center gap-3 px-3 py-2 hover:bg-muted/50 cursor-pointer border-b border-border last:border-b-0'
										onClick={() => toggleGatewaySelection(gw.id)}
									>
										<Checkbox
											checked={selectedGateways.includes(gw.id)}
											onCheckedChange={() => toggleGatewaySelection(gw.id)}
										/>
										<div className='flex-1'>
											<span className='font-mono text-sm font-medium'>
												{gw.gw_number}
											</span>
											<span className='text-xs text-muted-foreground ml-2 uppercase'>
												{gw.gateway_type}
											</span>
										</div>
										{getStatusBadge(gw.status)}
									</div>
								))
							) : (
								<div className='p-4 text-center text-sm text-muted-foreground'>
									미할당 게이트웨이가 없습니다.
								</div>
							)}
						</div>
						{selectedGateways.length > 0 && (
							<p className='text-sm text-muted-foreground'>
								{selectedGateways.length}개 선택됨
							</p>
						)}
					</div>
					<DialogFooter>
						<Button
							variant='outline'
							onClick={() => setAssignGatewayDialogOpen(false)}
						>
							취소
						</Button>
						<Button
							onClick={async () => {
								await handleAssignGatewaysToBuilding()
								if (gatewayAssignResult?.success) {
									setAssignGatewayDialogOpen(false)
								}
							}}
							disabled={
								selectedGateways.length === 0 || gatewayAssignSubmitting
							}
						>
							{gatewayAssignSubmitting ? '할당 중...' : '할당'}
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</>
	)
}

export default OrganizationTabsSection
