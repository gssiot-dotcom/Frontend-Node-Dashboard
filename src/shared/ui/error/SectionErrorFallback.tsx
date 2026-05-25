type Props = {
	error: Error
	resetErrorBoundary: () => void
}

export function SectionErrorFallback({ error, resetErrorBoundary }: Props) {
	return (
		<div className='rounded-xl border p-4'>
			<p>{error.message}</p>
			<button onClick={resetErrorBoundary}>Try again</button>
		</div>
	)
}
