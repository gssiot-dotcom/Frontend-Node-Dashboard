import { cn } from '@/lib/utils'

export function BuildingCard({ building, isSelected, onSelect }) {
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
						{building.name}
					</h3>
					<p className='text-xs text-muted-foreground mt-0.5'>
						{building.location}
					</p>
				</div>
				{building.alerts > 0 && (
					<span className='bg-destructive/20 text-destructive text-xs px-1.5 py-0.5 rounded'>
						{building.alerts}
					</span>
				)}
			</div>
			<div className='flex items-center gap-3 mt-2 text-xs text-muted-foreground'>
				<span>{building.totalNodes} nodes</span>
				<span className='text-green-500'>{building.onlineNodes} online</span>
			</div>
		</button>
	)
}
