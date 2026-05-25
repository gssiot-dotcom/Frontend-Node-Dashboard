import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog'
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
import { Link2, Loader2, Search } from 'lucide-react'
import { useMemo, useState } from 'react'
import Pagination from './Pagination'

import {
	useBuildingGatewaysQuery,
	useCompanyBuildingsQuery,
	useOrganizationBuildingsQuery,
	useOrganizationCompaniesQuery,
	useOrganizationUsersQuery,
	useUserCompaniesQuery,
} from '../hooks/useOrganizationQueries'
import type {
	OrganizationBuilding,
	OrganizationCompany,
	OrganizationGateway,
	OrganizationUserListItem,
	PaginationMeta,
} from '../types/organization.types'

// ─── Types ───────────────────────────────────────────────────────────────────

interface Building {
	_id: string
	title: string
	address: string
	buildingType: string
	buildingStatus: string
	isAssigned: boolean
	companyName?: string | null
	gatewayCount?: number
}

interface Company {
	_id: string
	companyName: string
	companyAddress: string
	companyTel: string
	companyEmail: string | null
	companyStatus: string
	buildingCount?: number
}

interface Gateway {
	_id: string
	serialNumber: string
	gatewayType: string
	gatewayStatus: string
	isAssigned: boolean
	buildingId: string | null
	buildingName?: string | null
	installedLocation: string
}

interface ListResponse<T> {
	items: T[]
	pagination: PaginationMeta
}

// ─── Fake Data Generators ─────────────────────────────────────────────────────

const ALL_BUILDINGS: Building[] = Array.from({ length: 23 }, (_, i) => ({
	_id: `building_${i + 1}`,
	title: [
		'Samsung Goyang A-동',
		'LG 마포 타워',
		'Hyundai 판교 캠퍼스',
		'SK 종로 빌딩',
		'KT 광화문 센터',
	][i % 5],
	address: [
		'Goyang 덕양구',
		'서울 마포구 상암동',
		'성남시 분당구 판교',
		'서울 종로구',
		'서울 종로구 광화문',
	][i % 5],
	buildingType: i % 2 === 0 ? 'office' : 'commercial',
	buildingStatus: i % 7 === 0 ? 'inactive' : 'active',
	isAssigned: i % 3 !== 0,
	companyName:
		i % 3 !== 0
			? ['Samsung', 'LG Electronics', 'Hyundai', 'SK Telecom'][i % 4]
			: null,
	gatewayCount: Math.floor(Math.random() * 8),
}))

const ALL_COMPANIES: Company[] = Array.from({ length: 15 }, (_, i) => ({
	_id: `company_${i + 1}`,
	companyName: [
		'Samsung coltd',
		'LG Electronics',
		'Hyundai Motor',
		'SK Telecom',
		'KT Corp',
		'Kakao',
		'Naver',
		'Lotte',
		'Hanwha',
		'Posco',
	][i % 10],
	companyAddress: [
		'서울 강남구',
		'서울 마포구',
		'서울 서초구',
		'성남시 분당구',
		'인천광역시',
	][i % 5],
	companyTel: `02-${1000 + i * 111}-${2000 + i * 77}`,
	companyEmail: i % 4 === 0 ? null : `contact${i + 1}@company.co.kr`,
	companyStatus: i % 6 === 0 ? 'inactive' : 'active',
	buildingCount: Math.floor(Math.random() * 5),
}))

const ALL_USERS: OrganizationUserListItem[] = Array.from(
	{ length: 18 },
	(_, i) => {
		const assignedCompany =
			i % 3 !== 0 ? ALL_COMPANIES[i % ALL_COMPANIES.length] : null

		return {
			_id: `user_${i + 1}`,
			name: [
				'김민준',
				'이서준',
				'박도윤',
				'최지호',
				'정하준',
				'강서연',
				'조하린',
				'윤지우',
			][i % 8],
			email: `user${i + 1}@example.com`,
			phone: `010-${String(1000 + i * 111).padStart(4, '0')}-${String(
				2000 + i * 77,
			).padStart(4, '0')}`,
			userType: i % 2 === 0 ? 'Manager' : 'Worker',
			userStatus: i % 5 === 0 ? 'inactive' : 'active',
			isAssigned: Boolean(assignedCompany),
			companyId: assignedCompany?._id ?? null,
			companyName: assignedCompany?.companyName ?? null,
		}
	},
)

const ALL_GATEWAYS: Gateway[] = Array.from({ length: 31 }, (_, i) => ({
	_id: `gateway_${i + 1}`,
	serialNumber: String(i + 1).padStart(4, '0'),
	gatewayType: i % 2 === 0 ? 'nodes_gateway' : 'security_office_gateway',
	gatewayStatus: i % 5 === 0 ? 'online' : 'offline',
	isAssigned: i % 3 !== 0,
	buildingId: i % 3 !== 0 ? `building_${(i % 5) + 1}` : null,
	buildingName:
		i % 3 !== 0
			? ['Samsung Goyang A-동', 'LG 마포 타워', 'Hyundai 판교 캠퍼스'][i % 3]
			: null,
	installedLocation: i % 4 === 0 ? '' : `B${(i % 3) + 1}F 복도`,
}))

// ─── Fake API (simulate network delay + pagination) ───────────────────────────

function fakeFetch<T>(
	allItems: T[],
	page: number,
	limit: number,
	search: string,
	filterFn: (item: T, q: string) => boolean,
): Promise<ListResponse<T>> {
	return new Promise(resolve => {
		setTimeout(() => {
			const filtered = search
				? allItems.filter(item => filterFn(item, search.toLowerCase()))
				: allItems
			const total = filtered.length
			const totalPages = Math.max(1, Math.ceil(total / limit))
			const safePage = Math.min(page, totalPages)
			const start = (safePage - 1) * limit
			const items = filtered.slice(start, start + limit)
			resolve({
				items,
				pagination: {
					total,
					page: safePage,
					limit,
					totalPages,
					hasNextPage: safePage < totalPages,
					hasPrevPage: safePage > 1,
				},
			})
		}, 400)
	})
}

// ─── Pagination Component ─────────────────────────────────────────────────────

// ─── Status Badge ─────────────────────────────────────────────────────────────

const getStatusBadge = (status: string) => {
	switch (status) {
		case 'active':
		case 'online':
			return (
				<Badge
					variant='outline'
					className='bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
				>
					{status === 'online' ? '온라인' : '활성'}
				</Badge>
			)
		case 'inactive':
		case 'offline':
			return (
				<Badge variant='outline' className='bg-muted text-muted-foreground'>
					{status === 'offline' ? '오프라인' : '비활성'}
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

// ─── Default Pagination Meta ──────────────────────────────────────────────────

const defaultPagination: PaginationMeta = {
	total: 0,
	page: 1,
	limit: 20,
	totalPages: 1,
	hasNextPage: false,
	hasPrevPage: false,
}

// ─── Main Component ───────────────────────────────────────────────────────────

type AssignedDialogType =
	| 'company-buildings'
	| 'building-gateways'
	| 'user-companies'

function OrganizationTabsSection() {
	const [activeTab, setActiveTab] = useState('companies')

	const [companyPage, setCompanyPage] = useState(1)
	const [companyLimit, setCompanyLimit] = useState(20)
	const [companySearch, setCompanySearch] = useState('')

	const [buildingPage, setBuildingPage] = useState(1)
	const [buildingLimit, setBuildingLimit] = useState(20)
	const [buildingSearch, setBuildingSearch] = useState('')

	const [userPage, setUserPage] = useState(1)
	const [userLimit, setUserLimit] = useState(20)
	const [userSearch, setUserSearch] = useState('')

	const [assignedDialogOpen, setAssignedDialogOpen] = useState(false)
	const [assignedDialogTitle, setAssignedDialogTitle] = useState('')
	const [assignedDialogType, setAssignedDialogType] =
		useState<AssignedDialogType | null>(null)
	const [selectedCompanyId, setSelectedCompanyId] = useState<string>()
	const [selectedBuildingId, setSelectedBuildingId] = useState<string>()
	const [selectedUserId, setSelectedUserId] = useState<string>()

	const companiesQuery = useOrganizationCompaniesQuery({
		page: companyPage,
		limit: companyLimit,
		search: companySearch,
	})

	const buildingsQuery = useOrganizationBuildingsQuery({
		page: buildingPage,
		limit: buildingLimit,
		search: buildingSearch,
	})

	const usersQuery = useOrganizationUsersQuery({
		page: userPage,
		limit: userLimit,
		search: userSearch,
	})

	const companyBuildingsQuery = useCompanyBuildingsQuery(selectedCompanyId)
	const buildingGatewaysQuery = useBuildingGatewaysQuery(selectedBuildingId)
	const userCompaniesQuery = useUserCompaniesQuery(selectedUserId)

	const companies = companiesQuery.data?.items ?? []
	const companyPagination = companiesQuery.data?.pagination ?? defaultPagination

	const buildings = buildingsQuery.data?.items ?? []
	const buildingPagination =
		buildingsQuery.data?.pagination ?? defaultPagination

	const users = usersQuery.data?.items ?? []
	const userPagination = usersQuery.data?.pagination ?? defaultPagination

	const companyLoading = companiesQuery.isLoading || companiesQuery.isFetching
	const buildingLoading = buildingsQuery.isLoading || buildingsQuery.isFetching
	const userLoading = usersQuery.isLoading || usersQuery.isFetching

	//  ======= Handlers =============================
	const handleCompanySearch = (v: string) => {
		setCompanySearch(v)
		setCompanyPage(1)
	}

	const handleBuildingSearch = (v: string) => {
		setBuildingSearch(v)
		setBuildingPage(1)
	}

	const handleUserSearch = (v: string) => {
		setUserSearch(v)
		setUserPage(1)
	}

	const openAssignedBuildingsDialog = (company: OrganizationCompany) => {
		setAssignedDialogTitle(`${company.companyName} - 할당된 건물`)
		setAssignedDialogType('company-buildings')
		setSelectedCompanyId(company._id)
		setSelectedBuildingId(undefined)
		setSelectedUserId(undefined)
		setAssignedDialogOpen(true)
	}

	const openAssignedGatewaysDialog = (building: OrganizationBuilding) => {
		setAssignedDialogTitle(`${building.title} - 할당된 게이트웨이`)
		setAssignedDialogType('building-gateways')
		setSelectedBuildingId(building._id)
		setSelectedCompanyId(undefined)
		setSelectedUserId(undefined)
		setAssignedDialogOpen(true)
	}

	const openAssignedCompaniesDialog = (user: OrganizationUserListItem) => {
		setAssignedDialogTitle(`${user.name} - 할당된 회사`)
		setAssignedDialogType('user-companies')
		setSelectedUserId(user._id)
		setSelectedCompanyId(undefined)
		setSelectedBuildingId(undefined)
		setAssignedDialogOpen(true)
	}

	//  ======= Memoized Assigned Items for Dialog =============================
	const assignedDialogItems = useMemo(() => {
		if (assignedDialogType === 'company-buildings') {
			const items = companyBuildingsQuery.data ?? []

			return items.map((building: OrganizationBuilding) => ({
				id: building._id,
				title: building.title,
				subtitle: building.address,
				meta: building.buildingType,
				status: building.buildingStatus,
			}))
		}

		if (assignedDialogType === 'building-gateways') {
			const items = buildingGatewaysQuery.data ?? []

			return items.map((gateway: OrganizationGateway) => ({
				id: gateway._id,
				title: gateway.serialNumber,
				subtitle:
					gateway.gatewayType === 'nodes_gateway' ? 'Nodes' : 'Security Office',
				meta: gateway.installedLocation || '설치 위치 없음',
				status: gateway.gatewayStatus,
			}))
		}

		if (assignedDialogType === 'user-companies') {
			const items = userCompaniesQuery.data ?? []

			return items.map((company: OrganizationCompany) => ({
				id: company._id,
				title: company.companyName,
				subtitle: company.companyAddress,
				meta: company.companyTel || '-',
				status: company.companyStatus,
			}))
		}

		return []
	}, [
		assignedDialogType,
		companyBuildingsQuery.data,
		buildingGatewaysQuery.data,
		userCompaniesQuery.data,
	])

	const assignedDialogLoading =
		companyBuildingsQuery.isFetching ||
		buildingGatewaysQuery.isFetching ||
		userCompaniesQuery.isFetching

	const LoadingOverlay = ({ colSpan }: { colSpan: number }) => (
		<TableRow>
			<TableCell colSpan={colSpan} className='text-center py-12'>
				<Loader2 className='w-5 h-5 animate-spin mx-auto text-muted-foreground' />
			</TableCell>
		</TableRow>
	)

	const EmptyRow = ({ colSpan }: { colSpan: number }) => (
		<TableRow>
			<TableCell
				colSpan={colSpan}
				className='text-center text-muted-foreground py-8'
			>
				검색 결과가 없습니다.
			</TableCell>
		</TableRow>
	)

	const AssignedListDialog = useMemo(
		() => (
			<Dialog open={assignedDialogOpen} onOpenChange={setAssignedDialogOpen}>
				<DialogContent className='sm:max-w-md'>
					<DialogHeader>
						<DialogTitle>{assignedDialogTitle}</DialogTitle>
					</DialogHeader>

					<div className='space-y-4 py-4'>
						<div className='border border-border rounded-lg max-h-72 overflow-y-auto'>
							{assignedDialogLoading ? (
								<div className='p-6 text-center text-sm text-muted-foreground'>
									<Loader2 className='w-5 h-5 animate-spin mx-auto text-muted-foreground' />
								</div>
							) : assignedDialogItems.length > 0 ? (
								assignedDialogItems.map(item => (
									<div
										key={item.id}
										className='flex items-center gap-3 px-3 py-3 hover:bg-muted/50 border-b border-border last:border-b-0'
									>
										<div className='w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0'>
											<Link2 className='w-4 h-4 text-primary' />
										</div>

										<div className='flex-1 min-w-0'>
											<p className='text-sm font-medium text-foreground truncate'>
												{item.title}
											</p>

											{item.subtitle && (
												<p className='text-xs text-muted-foreground truncate'>
													{item.subtitle}
												</p>
											)}

											{item.meta && (
												<p className='text-xs text-muted-foreground truncate'>
													{item.meta}
												</p>
											)}
										</div>

										{item.status && (
											<div className='shrink-0'>
												{getStatusBadge(item.status)}
											</div>
										)}
									</div>
								))
							) : (
								<div className='p-6 text-center text-sm text-muted-foreground'>
									할당된 항목이 없습니다.
								</div>
							)}
						</div>
					</div>
				</DialogContent>
			</Dialog>
		),
		[assignedDialogOpen, assignedDialogTitle, assignedDialogItems],
	)

	return (
		<>
			<Tabs value={activeTab} onValueChange={setActiveTab} className='w-full'>
				<TabsList className='grid w-full grid-cols-3 max-w-lg'>
					<TabsTrigger value='companies'>회사 목록</TabsTrigger>
					<TabsTrigger value='buildings'>건물 목록</TabsTrigger>
					<TabsTrigger value='users'>사용자 목록</TabsTrigger>
				</TabsList>

				{/* Companies List */}
				<TabsContent value='companies' className='mt-6'>
					<div className='rounded-xl border border-border bg-card p-5 sm:p-6'>
						<div className='flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4'>
							<h3 className='font-semibold text-foreground'>회사 목록</h3>

							<div className='relative w-full sm:w-64'>
								<Search className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground' />
								<Input
									placeholder='검색...'
									value={companySearch}
									onChange={e => handleCompanySearch(e.target.value)}
									className='pl-9'
								/>
							</div>
						</div>

						<div className='overflow-x-auto'>
							<Table>
								<TableHeader>
									<TableRow>
										<TableHead>회사명</TableHead>
										<TableHead>연락처</TableHead>
										<TableHead>이메일</TableHead>
										<TableHead>건물 수</TableHead>
										<TableHead>상태</TableHead>
										<TableHead>작업</TableHead>
									</TableRow>
								</TableHeader>

								<TableBody>
									{companyLoading ? (
										<LoadingOverlay colSpan={6} />
									) : companies.length === 0 ? (
										<EmptyRow colSpan={6} />
									) : (
										companies.map(company => (
											<TableRow key={company._id}>
												<TableCell className='font-medium'>
													{company.companyName}
												</TableCell>

												<TableCell className='text-sm font-mono'>
													{company.companyTel || '-'}
												</TableCell>

												<TableCell className='text-sm text-muted-foreground'>
													{company.companyEmail || '-'}
												</TableCell>

												<TableCell className='text-sm'>
													{company.buildingCount ?? 0}개
												</TableCell>

												<TableCell>
													{getStatusBadge(company.companyStatus)}
												</TableCell>

												<TableCell>
													<Button
														variant='outline'
														size='sm'
														className='gap-1.5'
														onClick={() => openAssignedBuildingsDialog(company)}
													>
														<Link2 className='w-3.5 h-3.5' />
														건물 할당
													</Button>
												</TableCell>
											</TableRow>
										))
									)}
								</TableBody>
							</Table>
						</div>

						<Pagination
							pagination={companyPagination}
							onPageChange={p => setCompanyPage(p)}
							onLimitChange={l => {
								setCompanyLimit(l)
								setCompanyPage(1)
							}}
						/>
					</div>
				</TabsContent>

				{/* Buildings List */}
				<TabsContent value='buildings' className='mt-6'>
					<div className='rounded-xl border border-border bg-card p-5 sm:p-6'>
						<div className='flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4'>
							<h3 className='font-semibold text-foreground'>건물 목록</h3>

							<div className='relative w-full sm:w-64'>
								<Search className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground' />
								<Input
									placeholder='검색...'
									value={buildingSearch}
									onChange={e => handleBuildingSearch(e.target.value)}
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
										<TableHead>소속 회사</TableHead>
										<TableHead>게이트웨이 수</TableHead>
										<TableHead>상태</TableHead>
										<TableHead>작업</TableHead>
									</TableRow>
								</TableHeader>

								<TableBody>
									{buildingLoading ? (
										<LoadingOverlay colSpan={6} />
									) : buildings.length === 0 ? (
										<EmptyRow colSpan={6} />
									) : (
										buildings.map(building => (
											<TableRow key={building._id}>
												<TableCell className='font-medium'>
													{building.title}
												</TableCell>

												<TableCell className='text-sm text-muted-foreground'>
													{building.address}
												</TableCell>

												<TableCell className='text-sm'>
													{building.companyName || (
														<span className='text-muted-foreground'>
															미할당
														</span>
													)}
												</TableCell>

												<TableCell className='text-sm'>
													{building.gatewayCount ?? 0}개
												</TableCell>

												<TableCell>
													{getStatusBadge(building.buildingStatus)}
												</TableCell>

												<TableCell>
													<Button
														variant='outline'
														size='sm'
														className='gap-1.5'
														onClick={() => openAssignedGatewaysDialog(building)}
													>
														<Link2 className='w-3.5 h-3.5' />
														게이트웨이 할당
													</Button>
												</TableCell>
											</TableRow>
										))
									)}
								</TableBody>
							</Table>
						</div>

						<Pagination
							pagination={buildingPagination}
							onPageChange={p => setBuildingPage(p)}
							onLimitChange={l => {
								setBuildingLimit(l)
								setBuildingPage(1)
							}}
						/>
					</div>
				</TabsContent>

				{/* Users List */}
				<TabsContent value='users' className='mt-6'>
					<div className='rounded-xl border border-border bg-card p-5 sm:p-6'>
						<div className='flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4'>
							<h3 className='font-semibold text-foreground'>사용자 목록</h3>

							<div className='relative w-full sm:w-64'>
								<Search className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground' />
								<Input
									placeholder='검색...'
									value={userSearch}
									onChange={e => handleUserSearch(e.target.value)}
									className='pl-9'
								/>
							</div>
						</div>

						<div className='overflow-x-auto'>
							<Table>
								<TableHeader>
									<TableRow>
										<TableHead>이름</TableHead>
										<TableHead>이메일</TableHead>
										<TableHead>연락처</TableHead>
										<TableHead>유형</TableHead>
										<TableHead>소속 회사</TableHead>
										<TableHead>상태</TableHead>
										<TableHead>작업</TableHead>
									</TableRow>
								</TableHeader>

								<TableBody>
									{userLoading ? (
										<LoadingOverlay colSpan={7} />
									) : users.length === 0 ? (
										<EmptyRow colSpan={7} />
									) : (
										users.map(user => (
											<TableRow key={user._id}>
												<TableCell className='font-medium'>
													{user.name}
												</TableCell>

												<TableCell className='text-sm text-muted-foreground'>
													{user.email}
												</TableCell>

												<TableCell className='text-sm font-mono'>
													{user.phone}
												</TableCell>

												<TableCell className='text-sm'>
													{user.userType}
												</TableCell>

												<TableCell className='text-sm'>
													{user.companyName || (
														<span className='text-muted-foreground'>
															미할당
														</span>
													)}
												</TableCell>

												<TableCell>{getStatusBadge(user.userStatus)}</TableCell>

												<TableCell>
													<Button
														variant='outline'
														size='sm'
														className='gap-1.5'
														onClick={() => openAssignedCompaniesDialog(user)}
													>
														<Link2 className='w-3.5 h-3.5' />
														회사 할당
													</Button>
												</TableCell>
											</TableRow>
										))
									)}
								</TableBody>
							</Table>
						</div>

						<Pagination
							pagination={userPagination}
							onPageChange={p => setUserPage(p)}
							onLimitChange={l => {
								setUserLimit(l)
								setUserPage(1)
							}}
						/>
					</div>
				</TabsContent>
			</Tabs>

			{AssignedListDialog}
		</>
	)
}

export default OrganizationTabsSection
