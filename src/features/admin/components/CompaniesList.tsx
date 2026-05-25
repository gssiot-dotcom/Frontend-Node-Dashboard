import { cn } from '@/lib/utils'
import { AdminCompanyDashboardItem } from '../types/dashboard.types'

function CompanyCard({
	companyData,
	isSelected,
	onSelect,
}: {
	companyData: AdminCompanyDashboardItem
	isSelected: boolean
	onSelect: () => void
}) {
	return (
		<button
			onClick={onSelect}
			className={cn(
				'w-full text-left p-3 rounded-lg border transition-all duration-200',
				isSelected
					? 'bg-primary/10 border-primary/50'
					: 'bg-card/50 border-border hover:bg-card hover:border-border/80',
			)}
		>
			<div className='flex items-start justify-between'>
				<div>
					<h3 className='font-medium text-foreground text-sm'>
						{companyData.company.companyName}
					</h3>
					<p className='text-xs text-muted-foreground mt-0.5'>
						{companyData.company.companyAddress}
					</p>
				</div>
				{companyData.companyStatistics.warningNodesCount > 0 && (
					<span className='bg-destructive/20 text-destructive text-xs px-1.5 py-0.5 rounded'>
						{companyData.companyStatistics.warningNodesCount}
					</span>
				)}
			</div>
			<div className='flex items-center gap-3 mt-2 text-xs text-muted-foreground'>
				<span>{companyData.companyStatistics.buildingsCount} 건물</span>
				<span className='text-green-500'>
					{companyData.companyStatistics.managersCount} 관리자
				</span>
			</div>
		</button>
	)
}

export function CompaniesList({
	companies,
	selectedCompanyId,
	onSelect,
}: {
	companies: AdminCompanyDashboardItem[]
	selectedCompanyId: string
	onSelect: (id: string) => void
}) {
	return (
		<div className='p-3 space-y-2'>
			{companies.map(item => (
				<CompanyCard
					key={item.company._id}
					companyData={item}
					isSelected={item.company._id === selectedCompanyId}
					onSelect={() => onSelect(item.company._id)}
				/>
			))}
		</div>
	)
}
