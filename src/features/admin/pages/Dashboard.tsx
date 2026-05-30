'use client'

import {
	AddBuildingDialog,
	AssignManagerDialog,
} from '@/components/CompanyActionComponents'
import {
	BuildingCardMobile,
	BuildingRowDesktop,
} from '@/components/CompanyBuildingsTable'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select'
import { motion } from 'framer-motion'
import {
	Activity,
	AlertTriangle,
	Building2,
	ExternalLink,
	Users,
	Wifi,
} from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { CompaniesList } from '../components/CompaniesList'
import { CompanyDashboardHeader } from '../components/CompanyDashboardHeader'
import { StatCard } from '../components/StatsCard'
import { useAdminDashboardQuery } from '../hooks/userDashboard'

export default function AdminDashboard() {
	const { t } = useTranslation()
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
				<p className='text-sm text-muted-foreground'>
					{t('common.loadingDashboard')}
				</p>
			</div>
		)
	}

	if (isError) {
		return (
			<div className='flex h-full items-center justify-center'>
				<p className='text-sm text-destructive'>
					{t('common.failedDashboard')}
				</p>
			</div>
		)
	}

	if (!selectedCompanyDashboard || !selectedCompany || !companyStatistics) {
		return (
			<div className='flex h-full items-center justify-center'>
				<p className='text-sm text-muted-foreground'>
					{t('common.noCompanyData')}
				</p>
			</div>
		)
	}

	// const handleUpdateCompanyLogo = (companyId: string, logoUrl: string) => {
	// 	setCompanyLogos(prev => ({
	// 		...prev,
	// 		[companyId]: logoUrl,
	// 	}))
	// }

	return (
		<div className='flex h-full overflow-hidden'>
			{/* Companies Sidebar - Desktop */}
			<aside className='w-72 h-[90vh] border-r border-border bg-card/30 flex-col hidden md:flex'>
				<div className='p-4 border-b border-border shrink-0'>
					<h2 className='font-semibold text-foreground'>
						{t('dashboard.companiesScrollbar.title')}
					</h2>
					<p className='text-xs text-muted-foreground mt-0.5'>
						{t('dashboard.companiesScrollbar.subtitle')}
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
						{t('dashboard.companiesScrollbar.mobileAction')}
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
									<SelectItem
										key={item.company._id}
										value={item.company._id}
										className='border-card-foreground focus:bg-primary/10 focus:text-primary data-[highlighted]:primary/10 data-[state=checked]:bg-primary/10 data-[state=checked]:text-primary'
									>
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
									<div className='flex md:items-center justify-between max-sm:flex-col max-sm:gap-y-2'>
										<div>
											<h2 className='font-semibold text-foreground'>
												{t('dashboard.quickActions.title')}
											</h2>
											<p className='text-xs text-muted-foreground mt-0.5'>
												{t('dashboard.quickActions.description')}
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
									{t('dashboard.sections.companyStatistics')}
								</h2>
								<div className='grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 mb-6 sm:mb-8'>
									<StatCard
										label={t('dashboard.stats.totalBuildings')}
										value={companyStatistics.buildingsCount}
										icon={Building2}
										accent='bg-primary/10 text-primary'
									/>
									<StatCard
										label={t('dashboard.stats.managers')}
										value={companyStatistics.managersCount}
										icon={Users}
										accent='bg-blue-500/10 text-blue-500'
									/>
									<StatCard
										label={t('dashboard.stats.workers')}
										value={companyStatistics.workersCount}
										icon={Users}
										accent='bg-emerald-500/10 text-emerald-500'
									/>
									<StatCard
										label={t('dashboard.stats.gateways')}
										value={companyStatistics.gatewaysCount}
										icon={Wifi}
										accent='bg-amber-500/10 text-amber-500'
									/>
								</div>

								{/* Node Statistics */}
								<h2 className='text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4'>
									{t('dashboard.sections.nodeStatistics')}
								</h2>
								<div className='grid grid-cols-3 gap-2 sm:gap-3 mb-6 sm:mb-8'>
									<div className='bg-card/50 border border-border rounded-xl p-3 sm:p-4 text-center'>
										<div className='flex items-center justify-center gap-2 mb-1'>
											<Activity className='h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground' />
										</div>
										<p className='text-lg sm:text-xl lg:text-2xl font-bold text-foreground'>
											{companyStatistics.nodesCount}
										</p>
										<p className='text-[10px] sm:text-xs text-muted-foreground'>
											{t('dashboard.stats.totalNodes')}
										</p>
									</div>
									<div className='bg-card/50 border border-border rounded-xl p-3 sm:p-4 text-center'>
										<div className='flex items-center justify-center gap-2 mb-1'>
											<Wifi className='h-3.5 w-3.5 sm:h-4 sm:w-4 text-green-500' />
										</div>
										<p className='text-lg sm:text-xl lg:text-2xl font-bold text-green-500'>
											{companyStatistics.onlineNodesCount}
										</p>
										<p className='text-[10px] sm:text-xs text-muted-foreground'>
											{t('dashboard.stats.online')}
										</p>
									</div>
									<div className='bg-card/50 border border-border rounded-xl p-3 sm:p-4 text-center'>
										<div className='flex items-center justify-center gap-2 mb-1'>
											<AlertTriangle className='h-3.5 w-3.5 sm:h-4 sm:w-4 text-amber-500' />
										</div>
										<p className='text-lg sm:text-xl lg:text-2xl font-bold text-amber-500'>
											{companyStatistics.warningNodesCount}
										</p>
										<p className='text-[10px] sm:text-xs text-muted-foreground'>
											{t('dashboard.stats.warningNodes')}
										</p>
									</div>
								</div>

								{/* Company Buildings */}
								<div className='flex items-center justify-between mb-4'>
									<h2 className='text-sm font-semibold text-muted-foreground uppercase tracking-wider'>
										{t('dashboard.sections.companyBuildings')} ({buildings.length})
									</h2>
									<Link
										to={`/admin/companies/${selectedCompany._id}/buildings`}
										className='flex items-center gap-1 text-xs text-primary hover:text-primary/80 transition-colors'
									>
										<span>{t('dashboard.sections.viewAll')}</span>
										<ExternalLink className='h-3 w-3' />
									</Link>
								</div>

								{/* Desktop Table */}
								<div className='hidden sm:block bg-card border border-border rounded-xl overflow-hidden'>
									<table className='w-full text-sm'>
										<thead>
											<tr className='border-b border-border bg-muted/30'>
												<th className='text-left text-xs font-medium text-muted-foreground px-4 py-3'>
													{t('dashboard.table.buildingName')}
												</th>
												<th className='text-left text-xs font-medium text-muted-foreground px-4 py-3'>
													{t('dashboard.table.location')}
												</th>
												<th className='text-left text-xs font-medium text-muted-foreground px-4 py-3'>
													{t('dashboard.table.type')}
												</th>
												<th className='text-left text-xs font-medium text-muted-foreground px-4 py-3'>
													{t('dashboard.table.status')}
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
