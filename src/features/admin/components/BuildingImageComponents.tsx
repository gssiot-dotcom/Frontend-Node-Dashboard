import { Dialog, DialogContent } from '@/components/ui/dialog'
import { cn } from '@/lib/utils'
import { ChevronLeft, ChevronRight, Images, ZoomIn } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'

// ─── Types ────────────────────────────────────────────────────────────────────

interface ImageCarouselDialogProps {
	isOpen: boolean
	onClose: () => void
	images: string[]
	title: string
	initialIndex?: number
}

interface BuildingImagePreviewCardProps {
	images: string[]
	fallbackImage: string
	title: string
	subtitle: string
	onImageClick: (index: number) => void
	badge?: string
}

// ─── Image Carousel Dialog ────────────────────────────────────────────────────

export function ImageCarouselDialog({
	isOpen,
	onClose,
	images,
	title,
	initialIndex = 0,
}: ImageCarouselDialogProps) {
	const [currentIndex, setCurrentIndex] = useState(initialIndex)
	const [isAnimating, setIsAnimating] = useState(false)
	const [direction, setDirection] = useState<'left' | 'right'>('right')

	const validImages = images.length > 0 ? images : []

	useEffect(() => {
		setCurrentIndex(initialIndex)
	}, [initialIndex, isOpen])

	const goTo = useCallback(
		(index: number, dir: 'left' | 'right') => {
			if (isAnimating || index === currentIndex) return
			setDirection(dir)
			setIsAnimating(true)
			setTimeout(() => {
				setCurrentIndex(index)
				setIsAnimating(false)
			}, 220)
		},
		[isAnimating, currentIndex],
	)

	const prev = useCallback(() => {
		const newIndex =
			(currentIndex - 1 + validImages.length) % validImages.length
		goTo(newIndex, 'left')
	}, [currentIndex, validImages.length, goTo])

	const next = useCallback(() => {
		const newIndex = (currentIndex + 1) % validImages.length
		goTo(newIndex, 'right')
	}, [currentIndex, validImages.length, goTo])

	useEffect(() => {
		if (!isOpen) return
		const handler = (e: KeyboardEvent) => {
			if (e.key === 'ArrowLeft') prev()
			if (e.key === 'ArrowRight') next()
			if (e.key === 'Escape') onClose()
		}
		window.addEventListener('keydown', handler)
		return () => window.removeEventListener('keydown', handler)
	}, [isOpen, prev, next, onClose])

	if (validImages.length === 0) return null

	return (
		<Dialog open={isOpen} onOpenChange={open => !open && onClose()}>
			<DialogContent className='max-w-5xl p-0 overflow-hidden bg-background border-border gap-0'>
				{/* Header */}
				<div className='flex items-center justify-between px-5 py-3 border-b border-border shrink-0'>
					<div className='flex items-center gap-3'>
						<div className='flex items-center gap-1.5'>
							<Images className='h-4 w-4 text-muted-foreground' />
							<h2 className='text-sm font-semibold text-foreground'>{title}</h2>
						</div>
						<span className='text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full'>
							{currentIndex + 1} / {validImages.length}
						</span>
					</div>
					{/* <Button
						onClick={onClose}
						variant={'outline'}
						className='rounded-full w-8 h-8'
					>
						<X className='h-4 w-4' />
					</Button> */}
				</div>

				{/* Main Image Area */}
				<div
					className='relative bg-black/5 dark:bg-black/40 overflow-hidden'
					style={{ height: '60vh' }}
				>
					{/* Image */}
					<div
						className={cn(
							'absolute inset-0 transition-all duration-220',
							isAnimating &&
								direction === 'right' &&
								'translate-x-[-6%] opacity-0',
							isAnimating &&
								direction === 'left' &&
								'translate-x-[6%] opacity-0',
							!isAnimating && 'translate-x-0 opacity-100',
						)}
						style={{ transitionDuration: '220ms' }}
					>
						<img
							src={validImages[currentIndex]}
							alt={`${title} ${currentIndex + 1}`}
							className='w-full h-full object-contain'
						/>
					</div>

					{/* Prev / Next buttons — only show if >1 image */}
					{validImages.length > 1 && (
						<>
							<button
								onClick={prev}
								className='absolute left-3 top-1/2 -translate-y-1/2 h-9 w-9 rounded-full bg-background/80 border border-border backdrop-blur-sm flex items-center justify-center text-foreground hover:bg-background transition-colors shadow-sm z-10'
							>
								<ChevronLeft className='h-4 w-4' />
							</button>
							<button
								onClick={next}
								className='absolute right-3 top-1/2 -translate-y-1/2 h-9 w-9 rounded-full bg-background/80 border border-border backdrop-blur-sm flex items-center justify-center text-foreground hover:bg-background transition-colors shadow-sm z-10'
							>
								<ChevronRight className='h-4 w-4' />
							</button>
						</>
					)}

					{/* Dot indicators for small sets */}
					{validImages.length > 1 && validImages.length <= 8 && (
						<div className='absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-10'>
							{validImages.map((_, i) => (
								<button
									key={i}
									onClick={() => goTo(i, i > currentIndex ? 'right' : 'left')}
									className={cn(
										'rounded-full transition-all duration-200',
										i === currentIndex
											? 'w-4 h-1.5 bg-foreground'
											: 'w-1.5 h-1.5 bg-foreground/30 hover:bg-foreground/60',
									)}
								/>
							))}
						</div>
					)}
				</div>

				{/* Thumbnail strip — show if >1 image */}
				{validImages.length > 1 && (
					<div className='border-t border-border bg-card/40 px-4 py-3 shrink-0'>
						<div className='flex gap-2 overflow-x-auto pb-0.5 scrollbar-thin'>
							{validImages.map((src, i) => (
								<button
									key={i}
									onClick={() => goTo(i, i > currentIndex ? 'right' : 'left')}
									className={cn(
										'relative shrink-0 h-14 w-20 rounded-md overflow-hidden border-2 transition-all duration-150',
										i === currentIndex
											? 'border-primary opacity-100 scale-100'
											: 'border-transparent opacity-50 hover:opacity-80 hover:scale-[1.03]',
									)}
								>
									<img
										src={src}
										alt={`Thumbnail ${i + 1}`}
										className='w-full h-full object-cover'
									/>
								</button>
							))}
						</div>
					</div>
				)}
			</DialogContent>
		</Dialog>
	)
}

// ─── Building Image Preview Card ──────────────────────────────────────────────

export function BuildingImagePreviewCard({
	images,
	fallbackImage,
	title,
	subtitle,
	onImageClick,
	badge,
}: BuildingImagePreviewCardProps) {
	const [isHovered, setIsHovered] = useState(false)
	const allImages = images?.length ? images : [fallbackImage]
	const primaryImage = allImages[0]
	const extraCount = allImages.length - 1

	return (
		<div className='bg-card border border-border rounded-xl overflow-hidden group'>
			{/* Card Header */}
			<div className='px-4 py-3 border-b border-border flex items-start justify-between'>
				<div>
					<h3 className='font-medium text-foreground text-sm'>{title}</h3>
					<p className='text-xs text-muted-foreground mt-0.5'>{subtitle}</p>
				</div>
				{badge && (
					<span className='text-[10px] font-medium uppercase tracking-wider text-muted-foreground bg-muted px-2 py-1 rounded-md'>
						{badge}
					</span>
				)}
			</div>

			{/* Image Area */}
			<button
				type='button'
				onClick={() => onImageClick(0)}
				onMouseEnter={() => setIsHovered(true)}
				onMouseLeave={() => setIsHovered(false)}
				className='relative w-full overflow-hidden cursor-pointer block'
				style={{ aspectRatio: '16/9' }}
			>
				<img
					src={primaryImage}
					alt={title}
					className={cn(
						'w-full h-full object-cover transition-transform duration-500',
						isHovered && 'scale-105',
					)}
				/>

				{/* Dark overlay on hover */}
				<div
					className={cn(
						'absolute inset-0 bg-black/0 transition-colors duration-300',
						isHovered && 'bg-black/30',
					)}
				/>

				{/* Zoom hint */}
				<div
					className={cn(
						'absolute inset-0 flex items-center justify-center transition-opacity duration-200',
						isHovered ? 'opacity-100' : 'opacity-0',
					)}
				>
					<div className='bg-background/90 backdrop-blur-sm border border-border rounded-full h-10 w-10 flex items-center justify-center shadow-md'>
						<ZoomIn className='h-4 w-4 text-foreground' />
					</div>
				</div>

				{/* Extra images badge */}
				{extraCount > 0 && (
					<div className='absolute bottom-2.5 right-2.5 flex items-center gap-1 bg-background/85 backdrop-blur-sm border border-border rounded-md px-2 py-1'>
						<Images className='h-3 w-3 text-muted-foreground' />
						<span className='text-[11px] font-medium text-foreground'>
							+{extraCount} more
						</span>
					</div>
				)}

				{/* Stacked thumbnails preview — bottom left */}
				{allImages.length > 1 && (
					<div className='absolute bottom-2.5 left-2.5 flex items-center'>
						{allImages.slice(1, 4).map((src, i) => (
							<div
								key={i}
								className='h-7 w-7 rounded border-2 border-background overflow-hidden'
								style={{
									marginLeft: i === 0 ? 0 : '-8px',
									zIndex: 3 - i,
									position: 'relative',
								}}
							>
								<img src={src} alt='' className='w-full h-full object-cover' />
							</div>
						))}
					</div>
				)}
			</button>
		</div>
	)
}
