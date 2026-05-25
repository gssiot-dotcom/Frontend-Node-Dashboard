import { cn } from '@/lib/utils'

export function StatCard({
	label,
	value,
	icon: Icon,
	accent,
}: {
	label: string
	value: number | string
	icon: React.ElementType
	accent: string
}) {
	return (
		<div className='bg-card/50 border border-border rounded-xl p-4'>
			<div className='flex items-center gap-3'>
				<div className={cn('p-2 rounded-lg', accent)}>
					<Icon className='h-5 w-5' />
				</div>
				<div>
					<p className='text-xl lg:text-2xl font-bold text-foreground'>
						{value}
					</p>
					<p className='text-xs text-muted-foreground'>{label}</p>
				</div>
			</div>
		</div>
	)
}
