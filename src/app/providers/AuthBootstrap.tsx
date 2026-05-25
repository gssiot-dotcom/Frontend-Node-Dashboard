import GssLogo from '@/components/GssLogo'
import { useMe } from '@/features/auth/hooks/useAuth'
import { useAuthStore } from '@/shared/store/auth.store'
import { useEffect, type ReactNode } from 'react'

type Props = {
	children: ReactNode
}

export function AuthBootstrap({ children }: Props) {
	const setUser = useAuthStore(state => state.setUser)
	const setAuthInitialized = useAuthStore(state => state.setAuthInitialized)

	const { data, isPending, isError, isSuccess } = useMe()

	useEffect(() => {
		if (isSuccess) {
			setUser(data ?? null)
			setAuthInitialized(true)
		}

		if (isError) {
			setUser(null)
			setAuthInitialized(true)
		}
	}, [data, isSuccess, isError, setUser, setAuthInitialized])

	if (isPending) {
		return <PageLoader />
	}

	return children
}

export function PageLoader() {
	return (
		<div className='fixed inset-0 z-50 flex items-center justify-center bg-background'>
			<div className='flex flex-col items-center gap-6'>
				{/* Logo */}
				<div className='animate-in fade-in zoom-in duration-500'>
					<GssLogo size='lg' asLink={false} />
				</div>

				{/* Spinner + Loading text */}
				<div className='flex items-center gap-3 text-muted-foreground'>
					<div className='relative h-7 w-7'>
						{/* outer glow */}
						<span className='absolute inset-0 rounded-full bg-primary/30 blur-md animate-pulse' />

						{/* gradient spinner */}
						<span className='absolute inset-0 rounded-full animate-spin bg-[conic-gradient(from_0deg,transparent_0deg,hsl(var(--primary))_90deg,transparent_260deg)]' />

						{/* inner cutout */}
						<span className='absolute inset-[4px] rounded-full bg-background' />
					</div>

					<span className='text-sm font-medium tracking-wide text-muted-foreground'>
						Loading
						<span className='inline-flex w-5'>
							<span className='animate-pulse'>...</span>
						</span>
					</span>
				</div>
			</div>
		</div>
	)
}
