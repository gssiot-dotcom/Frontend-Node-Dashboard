import { Activity } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function GssLogo({
	size = 'default',
	asLink = true,
}: {
	size?: 'sm' | 'default' | 'lg'
	asLink?: boolean
}) {
	const sizes = {
		sm: 'text-lg',
		default: 'text-xl',
		lg: 'text-3xl',
	}

	const logoContent = (
		<div className='flex items-center gap-2'>
			<div className='relative'>
				<div className='relative z-10 w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center'>
					<Activity className='w-4 h-4 text-white' />
				</div>

				<div className='absolute inset-0 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-600 opacity-40 blur-md' />
			</div>

			<span
				className={`font-bold tracking-tight text-foreground ${sizes[size]}`}
			>
				GSS<span className='text-primary'>.io</span>
			</span>
		</div>
	)

	if (!asLink) {
		return logoContent
	}

	return (
		<Link to='/' className='inline-flex items-center'>
			{logoContent}
		</Link>
	)
}
