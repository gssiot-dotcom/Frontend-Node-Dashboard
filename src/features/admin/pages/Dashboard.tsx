'use client'

import {
	AddBuildingDialog,
	AssignManagerDialog,
} from '@/components/CompanyActionComponents'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select'
import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'
import {
	Activity,
	AlertTriangle,
	Building2,
	ChevronRight,
	MapPin,
	Users,
	Wifi,
} from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { CompaniesList } from '../components/CompaniesList'
import { CompanyDashboardHeader } from '../components/CompanyDashboardHeader'
import { StatCard } from '../components/StatsCard'
import { useAdminDashboardQuery } from '../hooks/userDashboard'
import { Building } from '../types/building.types'

export default function AdminDashboard() {
	const [search, setSearch] = useState('')
	const [page, setPage] = useState(1)
	const limit = 20
	const [companyLogos, setCompanyLogos] = useState<Record<string, string>>({})

	const { data, isLoading, isError } = useAdminDashboardQuery({
		page,
		limit,
		search,
	})

	const companiesDashboardList = useMemo(() => data?.companies || [], [data])

	const [selectedCompanyId, setSelectedCompanyId] = useState<string>('')

	const selectedCompanyDashboard =
		companiesDashboardList.find(
			item => item.company._id === selectedCompanyId,
		) || companiesDashboardList[0]

	const selectedCompany = selectedCompanyDashboard?.company
	const companyStatistics = selectedCompanyDashboard?.companyStatistics
	const buildings = selectedCompanyDashboard?.buildingsList || []

	useEffect(() => {
		if (!selectedCompanyId && companiesDashboardList.length > 0) {
			setSelectedCompanyId(companiesDashboardList[0].company._id)
		}
	}, [companiesDashboardList, selectedCompanyId])

	if (isLoading) {
		return (
			<div className='flex h-full items-center justify-center'>
				<p className='text-sm text-muted-foreground'>Loading dashboard...</p>
			</div>
		)
	}

	if (isError) {
		return (
			<div className='flex h-full items-center justify-center'>
				<p className='text-sm text-destructive'>
					Failed to load dashboard data
				</p>
			</div>
		)
	}

	if (!selectedCompanyDashboard || !selectedCompany || !companyStatistics) {
		return (
			<div className='flex h-full items-center justify-center'>
				<p className='text-sm text-muted-foreground'>No company data found</p>
			</div>
		)
	}

	const handleUpdateCompanyLogo = (companyId: string, logoUrl: string) => {
		setCompanyLogos(prev => ({
			...prev,
			[companyId]: logoUrl,
		}))
	}

	return (
		<div className='flex h-full overflow-hidden'>
			{/* Companies Sidebar - Desktop */}
			<aside className='w-72 h-[90vh] border-r border-border bg-card/30 flex-col hidden md:flex'>
				<div className='p-4 border-b border-border shrink-0'>
					<h2 className='font-semibold text-foreground'>회사 목록</h2>
					<p className='text-xs text-muted-foreground mt-0.5'>
						관리 중인 회사를 선택하세요
					</p>
				</div>
				<ScrollArea className='flex-1 h-3/4 overflow-visible'>
					<CompaniesList
						companies={companiesDashboardList.map(item => item)}
						selectedCompanyId={selectedCompanyId}
						onSelect={setSelectedCompanyId}
					/>
				</ScrollArea>
			</aside>

			{/* Main Content */}
			<main className='flex-1 flex flex-col h-full overflow-hidden'>
				{/* Mobile Company Selector */}
				<div className='md:hidden p-4 border-b border-border shrink-0'>
					<label className='text-xs text-muted-foreground mb-1.5 block'>
						회사 선택
					</label>
					<Select
						value={selectedCompanyId}
						onValueChange={setSelectedCompanyId}
					>
						<SelectTrigger className='w-full'>
							<SelectValue>
								<div className='flex items-center gap-2'>
									<Building2 className='h-4 w-4 text-muted-foreground' />
									<span>{selectedCompany.companyName}</span>
								</div>
							</SelectValue>
						</SelectTrigger>
						<SelectContent>
							<SelectGroup>
								{companiesDashboardList.map(item => (
									<SelectItem key={item.company._id} value={item.company._id}>
										<div className='flex items-center justify-between w-full'>
											<div>
												<div className='font-medium'>
													{item.company.companyName}
												</div>
												<div className='text-xs text-muted-foreground'>
													{item.company.companyAddress}
												</div>
											</div>
											{item.companyStatistics.warningNodesCount > 0 && (
												<span className='ml-2 bg-destructive/20 text-destructive text-xs px-1.5 py-0.5 rounded'>
													{item.companyStatistics.warningNodesCount}
												</span>
											)}
										</div>
									</SelectItem>
								))}
							</SelectGroup>
						</SelectContent>
					</Select>
				</div>

				{/* Scrollable Content */}
				<ScrollArea className='flex-1'>
					<div className='p-4 lg:p-6'>
						<div className='max-w-5xl mx-auto'>
							<motion.div
								key={selectedCompanyId}
								initial={{ opacity: 0, y: 10 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ duration: 0.3 }}
							>
								{/* Header */}
								<CompanyDashboardHeader company={selectedCompany} />

								{/* Actions Section */}
								<div className='bg-card border border-border rounded-xl p-4 mb-6'>
									<div className='flex items-center justify-between'>
										<div>
											<h2 className='font-semibold text-foreground'>
												빠른 작업
											</h2>
											<p className='text-xs text-muted-foreground mt-0.5'>
												회사 관리 작업을 수행하세요
											</p>
										</div>
										<div className='flex items-center gap-2'>
											<AssignManagerDialog
												companyId={selectedCompany._id}
												companyName={selectedCompany.companyName}
											/>
											<AddBuildingDialog
												companyId={selectedCompany._id}
												companyName={selectedCompany.companyName}
											/>
										</div>
									</div>
								</div>

								{/* Company Statistics */}
								<h2 className='text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4'>
									회사 통계
								</h2>
								<div className='grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8'>
									<StatCard
										label='전체 건물'
										value={companyStatistics?.buildingsCount || 0}
										icon={Building2}
										accent='bg-primary/10 text-primary'
									/>

									<StatCard
										label='관리자'
										value={companyStatistics?.managersCount || 0}
										icon={Users}
										accent='bg-blue-500/10 text-blue-500'
									/>

									<StatCard
										label='작업자'
										value={companyStatistics?.workersCount || 0}
										icon={Users}
										accent='bg-emerald-500/10 text-emerald-500'
									/>

									<StatCard
										label='게이트웨이'
										value={companyStatistics?.gatewaysCount || 0}
										icon={Wifi}
										accent='bg-amber-500/10 text-amber-500'
									/>
								</div>

								{/* Node Statistics */}
								<div className='grid grid-cols-3 gap-3 mb-8'>
									<div className='bg-card/50 border border-border rounded-xl p-4 text-center'>
										<div className='flex items-center justify-center gap-2 mb-1'>
											<Activity className='h-4 w-4 text-muted-foreground' />
										</div>
										<p className='text-xl lg:text-2xl font-bold text-foreground'>
											{companyStatistics.nodesCount || 0}
										</p>
										<p className='text-xs text-muted-foreground'>전체 노드</p>
									</div>
									<div className='bg-card/50 border border-border rounded-xl p-4 text-center'>
										<div className='flex items-center justify-center gap-2 mb-1'>
											<Wifi className='h-4 w-4 text-green-500' />
										</div>
										<p className='text-xl lg:text-2xl font-bold text-green-500'>
											{companyStatistics.onlineNodesCount || 0}
										</p>
										<p className='text-xs text-muted-foreground'>온라인</p>
									</div>
									<div className='bg-card/50 border border-border rounded-xl p-4 text-center'>
										<div className='flex items-center justify-center gap-2 mb-1'>
											<AlertTriangle className='h-4 w-4 text-amber-500' />
										</div>
										<p className='text-xl lg:text-2xl font-bold text-amber-500'>
											{companyStatistics.warningNodesCount || 0}
										</p>

										<p className='text-xs text-muted-foreground'>
											Warning Nodes
										</p>
									</div>
								</div>

								{/* Company Buildings */}
								<h2 className='text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4'>
									회사 건물 ({buildings.length})
								</h2>
								<div className='bg-card border border-border rounded-xl overflow-hidden'>
									<table className='w-full text-sm'>
										<thead>
											<tr className='border-b border-border bg-muted/30'>
												<th className='text-left text-xs font-medium text-muted-foreground px-4 py-3'>
													건물명
												</th>
												<th className='text-left text-xs font-medium text-muted-foreground px-4 py-3'>
													위치
												</th>
												<th className='text-left text-xs font-medium text-muted-foreground px-4 py-3'>
													상태
												</th>
												<th className='text-left text-xs font-medium text-muted-foreground px-4 py-3'>
													공정
												</th>
												<th className='text-left text-xs font-medium text-muted-foreground px-4 py-3 w-40'>
													진행률
												</th>
												<th className='text-center text-xs font-medium text-muted-foreground px-4 py-3'>
													노드
												</th>
												<th className='text-center text-xs font-medium text-muted-foreground px-4 py-3'>
													알림
												</th>
												<th className='px-4 py-3' />
											</tr>
										</thead>
										<tbody>
											{buildings.map((building, idx) => (
												<BuildingRow
													key={building._id}
													building={building}
													isLast={idx === buildings.length - 1}
												/>
											))}
										</tbody>
									</table>
								</div>
							</motion.div>
						</div>
					</div>
				</ScrollArea>
			</main>
		</div>
	)
}

const statusColors = {
	active: 'bg-green-500/20 text-green-600',
	inactive: 'bg-amber-500/20 text-amber-600',
	paused: 'bg-muted text-muted-foreground',
}
const statusLabels = {
	active: '운영중',
	inactive: '비활성화',
	paused: '일시중지',
}

export function BuildingRow({
	building,
	isLast,
}: {
	building: Building
	isLast: boolean
}) {
	const navigate = useNavigate()

	return (
		<tr
			className={cn(
				'hover:bg-muted/20 transition-colors',
				!isLast && 'border-b border-border',
			)}
		>
			{/* 건물명 */}
			<td className='px-4 py-3 font-medium text-foreground'>
				{building.title}
			</td>

			{/* 위치 */}
			<td className='px-4 py-3'>
				<div className='flex items-center gap-1 text-muted-foreground text-xs'>
					<MapPin className='h-3 w-3' />
					{building.address || '위치 정보 없음'}
				</div>
			</td>

			{/* 상태 */}
			<td className='px-4 py-3'>
				<span
					className={cn(
						'text-xs px-2 py-0.5 rounded-full',
						statusColors[building.buildingStatus],
					)}
				>
					{statusLabels[building.buildingStatus]}
				</span>
			</td>

			{/* 액션 */}
			<td className='px-4 py-3'>
				<Button
					onClick={() =>
						navigate(`/admin/companies/${building.companyId}/buildings`)
					}
					variant='ghost'
					size='sm'
					className='text-xs h-7'
				>
					관리
					<ChevronRight className='h-3 w-3 ml-1' />
				</Button>
			</td>
		</tr>
	)
}
