export default function NodeCardSkeleton() {
	return (
		<div className='rounded-xl border border-border/50 bg-card p-3 animate-pulse'>
			<div className='flex items-start justify-between mb-2'>
				<div className='space-y-1'>
					<div className='h-3 w-16 bg-muted rounded' />
					<div className='h-2 w-12 bg-muted rounded' />
				</div>
				<div className='h-3 w-3 bg-muted rounded-full' />
			</div>
			<div className='flex items-center justify-between mb-2'>
				<div className='h-8 w-10 bg-muted rounded' />
				<div className='h-4 w-12 bg-muted rounded-md' />
			</div>
			<div className='grid grid-cols-2 gap-1 mb-1.5'>
				<div className='h-8 bg-muted/30 rounded-md' />
				<div className='h-8 bg-muted/30 rounded-md' />
			</div>
			<div className='h-2 w-20 bg-muted rounded' />
		</div>
	)
}
