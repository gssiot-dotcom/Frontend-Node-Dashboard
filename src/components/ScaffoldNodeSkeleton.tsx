'use client'

export default function ScaffoldingNodeSkeleton() {
	return (
		<div className='relative rounded-lg sm:rounded-xl border border-border/50 p-2 sm:p-3 bg-card animate-pulse'>
			{/* Status indicator line at top */}
			<div className='absolute top-0 left-0 right-0 h-0.5 rounded-full bg-muted' />

			{/* Header row */}
			<div className='flex items-start justify-between mb-1.5 sm:mb-2'>
				<div className='flex-1'>
					<div className='h-2.5 sm:h-3 bg-muted rounded w-12 sm:w-16 mb-1' />
					<div className='h-2 bg-muted rounded w-10 sm:w-12' />
				</div>
				<div className='w-2.5 h-2.5 sm:w-3 sm:h-3 bg-muted rounded' />
			</div>

			{/* Door icon area */}
			<div className='flex items-center justify-between mb-1.5 sm:mb-2'>
				<div className='w-8 h-8 sm:w-10 sm:h-10 bg-muted rounded-md sm:rounded-lg' />
				<div className='h-3.5 sm:h-4 bg-muted rounded w-12 sm:w-14' />
			</div>

			{/* Battery & Gateway */}
			<div className='grid grid-cols-2 gap-1 mb-1 sm:mb-1.5'>
				<div className='h-5 sm:h-6 bg-muted rounded-md' />
				<div className='h-5 sm:h-6 bg-muted rounded-md' />
			</div>

			{/* Position */}
			<div className='h-2.5 sm:h-3 bg-muted rounded w-16 sm:w-20' />
		</div>
	)
}
