import {
	Activity,
	ArrowRight,
	Lock,
	Router,
	Thermometer,
	type LucideIcon,
} from 'lucide-react'

const ICONS = {
	Activity,
	Router,
	Thermometer,
} satisfies Record<string, LucideIcon>

type NodeTypeCardProps = {
	type: string
	label: string
	description: string
	image: string
	active: boolean
	route?: string
	count: number
	onClick?: () => void
}

export default function NodeTypeCard({
	type,
	label,
	description,
	image,
	active,
	route,
	count,
	onClick,
}: NodeTypeCardProps) {
	const content = (
		<div
			className={`relative glass rounded-2xl p-4 transition-all duration-300 group overflow-hidden min-h-[260px] ${
				active
					? 'hover:bg-white/[0.07] hover:scale-[1.02] cursor-pointer'
					: 'opacity-50 cursor-not-allowed'
			}`}
		>
			{!active && (
				<div className='absolute top-3 right-3 z-20'>
					<span className='inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-muted/50 text-[10px] text-muted-foreground'>
						<Lock className='w-2.5 h-2.5' /> Coming Soon
					</span>
				</div>
			)}

			<div className='relative h-40 mb-4 rounded-xl overflow-hidden bg-primary/5'>
				{image && (
					<img
						src={image}
						alt={label}
						className='w-full h-full object-contain p-3 transition-transform duration-300 group-hover:scale-110'
					/>
				)}
			</div>

			<div>
				<h3 className='text-base font-semibold text-foreground mb-1 line-clamp-1'>
					{label}
				</h3>

				<p className='text-xs text-muted-foreground mb-4 line-clamp-2'>
					{description}
				</p>

				{active && (
					<div className='flex items-center justify-between'>
						<span className='text-xs text-primary font-medium'>
							{count} nodes
						</span>

						<ArrowRight className='w-4 h-4 text-primary opacity-0 group-hover:opacity-100 transition-opacity' />
					</div>
				)}
			</div>
		</div>
	)

	if (active) {
		return (
			<button
				type='button'
				onClick={onClick}
				disabled={!onClick && !route}
				className='block w-full text-left'
				aria-label={label}
				data-node-type={type}
			>
				{content}
			</button>
		)
	}

	return content
}
