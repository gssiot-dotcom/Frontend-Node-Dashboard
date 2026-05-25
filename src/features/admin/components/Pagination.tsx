import { Button } from '@/components/ui/button'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select'
import {
	ChevronLeft,
	ChevronRight,
	ChevronsLeft,
	ChevronsRight,
} from 'lucide-react'

interface PaginationProps {
	pagination: {
		total: number
		page: number
		limit: number
		totalPages: number
		hasNextPage: boolean
		hasPrevPage: boolean
	}
	onPageChange: (page: number) => void
	onLimitChange: (limit: number) => void
}

export default function Pagination({
	pagination,
	onPageChange,
	onLimitChange,
}: PaginationProps) {
	const { total, page, totalPages, hasNextPage, hasPrevPage } = pagination

	const pageNumbers = (() => {
		const pages: number[] = []
		const start = Math.max(1, page - 2)
		const end = Math.min(totalPages, page + 2)
		for (let i = start; i <= end; i++) pages.push(i)
		return pages
	})()

	return (
		<div className='flex items-center justify-between gap-3 flex-wrap pt-4 mt-4 border-t border-border'>
			<div className='flex items-center gap-4'>
				<span className='text-sm text-muted-foreground'>
					<span className='font-medium text-foreground'>{page}</span>
					{' / '}
					<span className='font-medium text-foreground'>{totalPages}</span>
					{' 페이지 · 총 '}
					<span className='font-medium text-foreground'>{total}</span>건
				</span>
				<div className='flex items-center gap-2'>
					<span className='text-sm text-muted-foreground'>페이지당</span>
					<Select
						value={pagination.limit.toString()}
						onValueChange={v => {
							onLimitChange(Number(v))
							onPageChange(1)
						}}
					>
						<SelectTrigger className='h-8 w-16 text-xs'>
							<SelectValue />
						</SelectTrigger>
						<SelectContent>
							{[10, 20, 50].map(n => (
								<SelectItem key={n} value={n.toString()}>
									{n}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>
			</div>

			<div className='flex items-center gap-1'>
				<Button
					variant='outline'
					size='icon'
					className='h-8 w-8'
					onClick={() => onPageChange(1)}
					disabled={!hasPrevPage}
				>
					<ChevronsLeft className='h-3.5 w-3.5' />
				</Button>
				<Button
					variant='outline'
					size='icon'
					className='h-8 w-8'
					onClick={() => onPageChange(page - 1)}
					disabled={!hasPrevPage}
				>
					<ChevronLeft className='h-3.5 w-3.5' />
				</Button>

				{pageNumbers.map(p => (
					<Button
						key={p}
						variant={p === page ? 'default' : 'outline'}
						size='icon'
						className='h-8 w-8 text-xs'
						onClick={() => onPageChange(p)}
					>
						{p}
					</Button>
				))}

				<Button
					variant='outline'
					size='icon'
					className='h-8 w-8'
					onClick={() => onPageChange(page + 1)}
					disabled={!hasNextPage}
				>
					<ChevronRight className='h-3.5 w-3.5' />
				</Button>
				<Button
					variant='outline'
					size='icon'
					className='h-8 w-8'
					onClick={() => onPageChange(totalPages)}
					disabled={!hasNextPage}
				>
					<ChevronsRight className='h-3.5 w-3.5' />
				</Button>
			</div>
		</div>
	)
}
