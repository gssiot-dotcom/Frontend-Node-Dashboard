'use client'

import { Button } from '@/components/ui/button'
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog'
import { getAssetUrl } from '@/lib/getAssetUrl'
import { useEffect, useMemo, useRef, useState } from 'react'
import { usePlanImageRenderSize } from '../hooks/usePlanImageRenderSize'
import { BaseBuildingNode, InstalledLocation } from '../types/node.types'

// ─── Types ────────────────────────────────────────────────────────────────────

type PlanNode = Pick<BaseBuildingNode, '_id' | 'number' | 'installedLocation'>

type BuildingPlanViewModalProps = {
	isOpen: boolean
	onClose: () => void
	/** NodeCard bosilganda berilgan node — avtomatik highlight bo'ladi */
	activeNodeId?: string | null
	nodes: PlanNode[]
	planImageUrls?: string[]
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function BuildingPlanViewModal({
	isOpen,
	onClose,
	activeNodeId,
	nodes,
	planImageUrls = [],
}: BuildingPlanViewModalProps) {
	const planImages = useMemo(() => planImageUrls.slice(0, 4), [planImageUrls])

	// activeNode qaysi plan image da bo'lsa o'sha tab avtomatik tanlanadi
	const activeNode = nodes.find(n => n._id === activeNodeId)
	const activeLocation =
		activeNode?.installedLocation &&
		typeof activeNode.installedLocation !== 'string'
			? activeNode.installedLocation
			: null
	const defaultImageIndex = activeLocation?.planImageIndex ?? 0

	const [selectedImageIndex, setSelectedImageIndex] =
		useState(defaultImageIndex)

	// Modal ochilganda active nodening plan image indexiga qaytarish
	useEffect(() => {
		if (isOpen) {
			setSelectedImageIndex(defaultImageIndex)
		}
	}, [isOpen, defaultImageIndex])

	const containerRef = useRef<HTMLDivElement>(null)

	const selectedImageUrl = planImages[selectedImageIndex]
		? getAssetUrl(planImages[selectedImageIndex])
		: undefined

	const renderSize = usePlanImageRenderSize(containerRef, selectedImageUrl, {
		allowUpscale: true, // ← bu yetishmayapti
	})

	// Joriy plan image da joylashgan barcha nodelar
	const visibleNodes = useMemo(() => {
		return nodes.filter(node => {
			const loc =
				node.installedLocation && typeof node.installedLocation !== 'string'
					? node.installedLocation
					: null

			return (
				loc != null &&
				loc.xPercent != null &&
				loc.yPercent != null &&
				loc.planImageIndex === selectedImageIndex
			)
		})
	}, [nodes, selectedImageIndex])

	return (
		<Dialog open={isOpen} onOpenChange={open => !open && onClose()}>
			<DialogContent className='max-w-[90vw] w-[90vw] h-[90vh] p-0 overflow-hidden'>
				<DialogHeader className='px-5 py-4 border-b'>
					<DialogTitle>
						{activeNode
							? `Node #${activeNode.number} — 설치 위치`
							: '설치 위치'}
					</DialogTitle>
				</DialogHeader>

				<div className='h-[calc(90vh-73px)] flex flex-col min-h-0'>
					{/* Plan image thumbnails */}
					{planImages.length > 1 && (
						<div className='border-b px-4 py-3 flex items-center gap-2 overflow-x-auto shrink-0'>
							{planImages.map((url, index) => {
								// 이 plan image에 위치가 설정된 node 개수
								const nodeCount = nodes.filter(
									n =>
										n.installedLocation &&
										typeof n.installedLocation !== 'string' &&
										n.installedLocation.planImageIndex === index,
								).length

								return (
									<button
										key={`${url}-${index}`}
										type='button'
										onClick={() => setSelectedImageIndex(index)}
										className={`relative w-20 h-14 rounded-lg overflow-hidden border shrink-0 transition ${
											selectedImageIndex === index
												? 'border-primary ring-2 ring-primary/30'
												: 'border-border hover:border-primary/50'
										}`}
									>
										<img
											src={getAssetUrl(url)}
											alt={`도면 ${index + 1}`}
											className='w-full h-full object-cover'
											draggable={false}
										/>
										<span className='absolute left-1 bottom-1 px-1.5 py-0.5 rounded bg-black/60 text-white text-[10px]'>
											{index + 1}
										</span>
										{nodeCount > 0 && (
											<span className='absolute right-1 top-1 w-4 h-4 rounded-full bg-sky-500 text-white text-[9px] flex items-center justify-center font-bold'>
												{nodeCount}
											</span>
										)}
									</button>
								)
							})}
						</div>
					)}

					{/* Main plan image + overlay */}
					<div
						ref={containerRef}
						className='flex-1 min-h-0 bg-muted/20 flex items-center justify-center overflow-hidden'
					>
						{selectedImageUrl ? (
							/**
							 * Overlay div: rasmning haqiqiy render o'lchamiga teng.
							 * Ekran katta yoki kichik bo'lsa ham xPercent/yPercent
							 * bu div ichida bir xil foizda joylashadi.
							 */
							<div
								className='relative select-none max-w-full max-h-full max-sm:w-auto max-sm:h-auto'
								style={
									renderSize
										? { width: renderSize.width, height: renderSize.height }
										: undefined
								}
							>
								<img
									src={selectedImageUrl}
									alt='Building plan'
									className={
										renderSize
											? 'w-full h-full object-contain block rounded-lg border bg-background'
											: 'max-w-full max-h-full w-auto h-auto object-contain block rounded-lg border bg-background'
									}
									draggable={false}
								/>

								{/* Node markers */}
								{visibleNodes.map(node => {
									const loc = node.installedLocation as InstalledLocation
									const isActive = node._id === activeNodeId

									return (
										<div
											key={node._id}
											className={`absolute -translate-x-1/2 -translate-y-1/2 rounded-full text-white font-bold flex items-center justify-center shadow-md pointer-events-none transition-all ${
												isActive
													? 'w-10 h-10 bg-sky-400 border-2 border-sky-700 z-10 ring-4 ring-sky-300/50'
													: 'w-7 h-7 bg-gray-400 border border-gray-600 z-0 opacity-70'
											}`}
											style={{
												left: `${loc.xPercent}%`,
												top: `${loc.yPercent}%`,
												fontSize: isActive ? '14px' : '12px',
											}}
										>
											{node.number}
										</div>
									)
								})}
							</div>
						) : (
							<div className='h-full flex items-center justify-center text-sm text-muted-foreground'>
								{selectedImageUrl ? '로딩 중...' : '도면 사진이 없습니다.'}
							</div>
						)}
					</div>

					{/* Legend + footer */}
					<div className='border-t px-4 py-3 flex items-center justify-between gap-3 shrink-0'>
						<div className='flex items-center gap-4 text-xs text-muted-foreground'>
							<span className='flex items-center gap-1.5'>
								<span className='inline-block w-4 h-4 rounded-full bg-sky-400 border-2 border-sky-700' />
								선택된 노드
							</span>
							<span className='flex items-center gap-1.5'>
								<span className='inline-block w-3.5 h-3.5 rounded-full bg-gray-400 border border-gray-600 opacity-70' />
								다른 노드
							</span>
						</div>
						<Button size='sm' variant='outline' onClick={onClose}>
							닫기
						</Button>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	)
}
