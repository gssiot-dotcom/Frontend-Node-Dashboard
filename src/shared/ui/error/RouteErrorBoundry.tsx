import PageNotFound from '@/shared/lib/PageNotFount'
import { isRouteErrorResponse, Link, useRouteError } from 'react-router-dom'

export default function RouteErrorBoundary() {
	const error = useRouteError()

	if (isRouteErrorResponse(error)) {
		if (error.status === 404) {
			return <PageNotFound />
		}

		if (error.status === 401 || error.status === 403) {
			return (
				<div className='min-h-screen flex flex-col items-center justify-center text-center p-6'>
					<h1 className='text-3xl font-bold text-foreground mb-2'>
						Unauthorized
					</h1>
					<p className='text-muted-foreground mb-6'>
						You do not have permission to access this page.
					</p>
					<Link to='/' className='text-primary hover:underline'>
						Go home
					</Link>
				</div>
			)
		}

		return (
			<div className='min-h-screen flex flex-col items-center justify-center text-center p-6'>
				<h1 className='text-3xl font-bold text-foreground mb-2'>
					{error.status} {error.statusText}
				</h1>
				<p className='text-muted-foreground mb-6'>Something went wrong.</p>
				<Link to='/' className='text-primary hover:underline'>
					Go home
				</Link>
			</div>
		)
	}

	return (
		<div className='min-h-screen flex flex-col items-center justify-center text-center p-6'>
			<h1 className='text-3xl font-bold text-foreground mb-2'>
				Something went wrong
			</h1>
			<p className='text-muted-foreground mb-6'>Unexpected error happened.</p>
			<Link to='/' className='text-primary hover:underline'>
				Go home
			</Link>
		</div>
	)
}
