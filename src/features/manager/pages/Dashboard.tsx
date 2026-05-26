'use client'

import {
	BuildingCardMobile,
	BuildingRowDesktop,
} from '@/components/CompanyBuildingsTable'
import { ScrollArea } from '@/components/ui/scroll-area'
import { motion } from 'framer-motion'
import {
	Activity,
	AlertTriangle,
	Building2,
	ExternalLink,
	Users,
	Wifi,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import {
	AddBuildingDialog,
	AssignManagerDialog,
} from '../components/CompanyActionComponents'
import { CompanyDashboardHeader } from '../components/CompanyDashboardHeader'
import { StatCard } from '../components/StatsCard'
import { useManagerDashboard } from '../hooks/usemanagerCompany'

export default function ManagerDashboard() {
	const { data, isLoading, isError } = useManagerDashboard()

	const company = data?.company
	const companyStatistics = data?.companyStatistics
	const buildings = data?.buildingsList || []

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

	if (!company || !companyStatistics) {
		return (
			<div className='flex h-full items-center justify-center'>
				<p className='text-sm text-muted-foreground'>No company data found</p>
			</div>
		)
	}

	return (
		<div className='flex h-full overflow-hidden'>
			<main className='flex-1 flex flex-col h-full overflow-hidden'>
				<ScrollArea className='flex-1'>
					<div className='p-4 lg:p-6'>
						<div className='max-w-5xl mx-auto'>
							<motion.div
								initial={{ opacity: 0, y: 10 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ duration: 0.3 }}
							>
								{/* Header */}
								<CompanyDashboardHeader company={company} />

								{/* Actions Section */}
								<div className='bg-card border border-border rounded-xl p-4 mb-6'>
									<div className='flex md:items-center justify-between max-sm:flex-col max-sm:gap-y-2'>
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
												companyId={company._id}
												companyName={company.companyName}
											/>
											<AddBuildingDialog
												companyId={company._id}
												companyName={company.companyName}
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
										value={companyStatistics.buildingsCount}
										icon={Building2}
										accent='bg-primary/10 text-primary'
									/>
									<StatCard
										label='관리자'
										value={companyStatistics.managersCount}
										icon={Users}
										accent='bg-blue-500/10 text-blue-500'
									/>
									<StatCard
										label='작업자'
										value={companyStatistics.workersCount}
										icon={Users}
										accent='bg-emerald-500/10 text-emerald-500'
									/>
									<StatCard
										label='게이트웨이'
										value={companyStatistics.gatewaysCount}
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
											{companyStatistics.nodesCount}
										</p>
										<p className='text-xs text-muted-foreground'>전체 노드</p>
									</div>

									<div className='bg-card/50 border border-border rounded-xl p-4 text-center'>
										<div className='flex items-center justify-center gap-2 mb-1'>
											<Wifi className='h-4 w-4 text-green-500' />
										</div>
										<p className='text-xl lg:text-2xl font-bold text-green-500'>
											{companyStatistics.onlineNodesCount}
										</p>
										<p className='text-xs text-muted-foreground'>온라인</p>
									</div>

									<div className='bg-card/50 border border-border rounded-xl p-4 text-center'>
										<div className='flex items-center justify-center gap-2 mb-1'>
											<AlertTriangle className='h-4 w-4 text-amber-500' />
										</div>
										<p className='text-xl lg:text-2xl font-bold text-amber-500'>
											{companyStatistics.warningNodesCount}
										</p>
										<p className='text-xs text-muted-foreground'>경고 노드</p>
									</div>
								</div>

								{/* Company Buildings */}
								<div className='flex items-center justify-between mb-4'>
									<h2 className='text-sm font-semibold text-muted-foreground uppercase tracking-wider'>
										회사 건물 ({buildings.length})
									</h2>
									<Link
										to={`/manager/buildings`}
										className='flex items-center gap-1 text-xs text-primary hover:text-primary/80 transition-colors'
									>
										<span>전체 보기</span>
										<ExternalLink className='h-3 w-3' />
									</Link>
								</div>

								{/* Desktop Table */}
								<div className='hidden sm:block bg-card border border-border rounded-xl overflow-hidden'>
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
													유형
												</th>
												<th className='text-left text-xs font-medium text-muted-foreground px-4 py-3'>
													상태
												</th>
											</tr>
										</thead>
										<tbody>
											{buildings.map((building, idx) => (
												<BuildingRowDesktop
													key={building._id}
													building={building}
													isLast={idx === buildings.length - 1}
												/>
											))}
										</tbody>
									</table>
								</div>

								{/* Mobile Cards */}
								<div className='sm:hidden bg-card border border-border rounded-xl overflow-hidden'>
									{buildings.map(building => (
										<BuildingCardMobile
											key={building._id}
											building={building}
										/>
									))}
								</div>
							</motion.div>
						</div>
					</div>
				</ScrollArea>
			</main>
		</div>
	)
}
