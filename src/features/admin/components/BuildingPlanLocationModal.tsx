'use client'

import { Button } from '@/components/ui/button'
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog'
import { getAssetUrl } from '@/lib/getAssetUrl'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { AngleNode } from '../types/node.types'

// ─── Types ────────────────────────────────────────────────────────────────────

export type InstalledLocation = {
	planImageIndex?: number
	xPercent?: number
	yPercent?: number
}

type PlanAngleNode = AngleNode & {
	installedLocation?: InstalledLocation
}

// Pending: hali saqlanmagan, local state da turuvchi o'zgarishlar
type PendingLocation = {
	nodeId: string
	planImageIndex: number
	xPercent: number
	yPercent: number
}

type BuildingPlanLocationModalProps = {
	isOpen: boolean
	onClose: () => void
	buildingId: string
	nodeType: string
	nodes: AngleNode[]
	planImageUrls?: string[]
	/** Save bosilganda barcha pending o'zgarishlar array sifatida keladi */
	onSave: (locations: PendingLocation[]) => Promise<void> | void
}

// ─── useImageRenderSize hook ──────────────────────────────────────────────────
/**
 * useImageRenderSize
 *
 * Containerga object-contain qoidasi bilan sig'adigan
 * rasmning haqiqiy render o'lchamini qaytaradi.
 *
 * O'zgarish: containerRef o'rniga faqat containerga padding
 * hisoblab, to'g'ri width/height olamiz.
 */
function useImageRenderSize(
	containerRef: React.RefObject<HTMLDivElement>,
	imageSrc: string | undefined,
) {
	const [renderSize, setRenderSize] = useState<{
		width: number
		height: number
	} | null>(null)

	const naturalSize = useRef<{ width: number; height: number } | null>(null)

	const recalculate = useCallback(() => {
		if (!containerRef.current || !naturalSize.current) return

		const rect = containerRef.current.getBoundingClientRect()
		// p-4 = 16px har tomonda
		const cw = rect.width - 32
		const ch = rect.height - 32

		if (cw <= 0 || ch <= 0) return

		const { width: nw, height: nh } = naturalSize.current
		// scale ni container ga qarab hisoblash
		const scale = Math.min(cw / nw, ch / nh, 1) // ← 1 dan oshmasin (zoom in bo'lmasin)

		setRenderSize({
			width: Math.floor(nw * scale),
			height: Math.floor(nh * scale),
		})
	}, [containerRef])

	useEffect(() => {
		if (!imageSrc) {
			setRenderSize(null)
			naturalSize.current = null
			return
		}
		const img = new Image()
		img.onload = () => {
			naturalSize.current = {
				width: img.naturalWidth,
				height: img.naturalHeight,
			}
			recalculate()
		}
		img.src = imageSrc
	}, [imageSrc, recalculate])

	useEffect(() => {
		if (!containerRef.current) return
		const ro = new ResizeObserver(recalculate)
		ro.observe(containerRef.current)
		return () => ro.disconnect()
	}, [containerRef, recalculate])

	return renderSize
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function BuildingPlanLocationModal({
	isOpen,
	onClose,
	nodes,
	planImageUrls = [],
	onSave,
}: BuildingPlanLocationModalProps) {
	const [selectedImageIndex, setSelectedImageIndex] = useState(0)
	const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null)
	const [saving, setSaving] = useState(false)

	/**
	 * pendingLocations: foydalanuvchi belgilagan lekin hali saqlanmagan joylashuvlar.
	 * Map<nodeId, PendingLocation> — bir node bir necha marta bosilsa oxirgisi saqlanadi.
	 */
	const [pendingLocations, setPendingLocations] = useState<
		Map<string, PendingLocation>
	>(new Map())

	const containerRef = useRef<HTMLDivElement>(null)

	const planImages = useMemo(() => planImageUrls.slice(0, 4), [planImageUrls])
	const selectedImageUrl = planImages[selectedImageIndex]
		? getAssetUrl(planImages[selectedImageIndex])
		: undefined

	const renderSize = useImageRenderSize(containerRef, selectedImageUrl)

	const selectedNode = nodes.find(n => n._id === selectedNodeId) as
		| PlanAngleNode
		| undefined

	// Modal yopilganda state tozalash
	useEffect(() => {
		if (!isOpen) {
			setSelectedNodeId(null)
			setPendingLocations(new Map())
			setSelectedImageIndex(0)
		}
	}, [isOpen])

	/**
	 * Nodeni ko'rsatish uchun joylashuvini olish:
	 * 1. Pending (yangi belgilangan) bo'lsa — uni ishlatamiz (darhol ko'rinadi)
	 * 2. Yo'q bo'lsa — serverdan kelgan installedLocation
	 */
	const getNodeLocation = useCallback(
		(node: PlanAngleNode): InstalledLocation | null => {
			const pending = pendingLocations.get(node._id)
			if (pending) {
				return {
					planImageIndex: pending.planImageIndex,
					xPercent: pending.xPercent,
					yPercent: pending.yPercent,
				}
			}
			return node.installedLocation ?? null
		},
		[pendingLocations],
	)

	// Joriy plan image da ko'rinadigan nodelar (pending + server data birlashtirilib)
	const visibleNodes = useMemo(() => {
		return (nodes as PlanAngleNode[]).filter(node => {
			const loc = getNodeLocation(node)
			return (
				loc != null &&
				loc.xPercent != null &&
				loc.yPercent != null &&
				loc.planImageIndex === selectedImageIndex
			)
		})
	}, [nodes, selectedImageIndex, getNodeLocation])

	// Plan ustiga bosilganda — pending state ga qo'shish (hali saqlanmaydi)
	const handlePlanClick = useCallback(
		(event: React.MouseEvent<HTMLDivElement>) => {
			if (!selectedNode || !renderSize) return

			const rect = event.currentTarget.getBoundingClientRect()
			const xPercent = ((event.clientX - rect.left) / renderSize.width) * 100
			const yPercent = ((event.clientY - rect.top) / renderSize.height) * 100

			if (xPercent < 0 || xPercent > 100 || yPercent < 0 || yPercent > 100)
				return

			setPendingLocations(prev => {
				const next = new Map(prev)
				next.set(selectedNode._id, {
					nodeId: selectedNode._id,
					planImageIndex: selectedImageIndex,
					xPercent,
					yPercent,
				})
				return next
			})
		},
		[selectedNode, renderSize, selectedImageIndex],
	)

	// Save bosilganda barcha pending o'zgarishlarni array sifatida yuborish
	const handleSave = useCallback(async () => {
		if (pendingLocations.size === 0) {
			onClose()
			return
		}
		setSaving(true)
		try {
			await onSave(Array.from(pendingLocations.values()))
			setPendingLocations(new Map())
			onClose()
		} finally {
			setSaving(false)
		}
	}, [pendingLocations, onSave, onClose])

	const hasPending = pendingLocations.size > 0

	// const imgUrl = img

	return (
		<Dialog open={isOpen} onOpenChange={open => !open && onClose()}>
			<DialogContent className='max-w-[90vw] w-[90vw] h-[90vh] p-0 overflow-hidden'>
				<DialogHeader className='px-5 py-4 border-b'>
					<DialogTitle>도면 위치 설정</DialogTitle>
				</DialogHeader>

				<div className='h-[calc(90vh-73px)] grid grid-cols-[200px_1fr] min-h-0'>
					{/* ── Left sidebar: node list ── */}
					<aside className='border-r p-4 overflow-y-auto'>
						<p className='text-sm font-medium mb-3'>노드 목록</p>
						<div className='space-y-2'>
							{nodes.map(node => {
								const pNode = node as PlanAngleNode
								const pending = pendingLocations.get(node._id)
								const serverLoc = pNode.installedLocation
								const hasLocation =
									pending != null ||
									(serverLoc?.xPercent != null && serverLoc?.yPercent != null)
								const isSelected = node._id === selectedNodeId

								return (
									<button
										key={node._id}
										type='button'
										onClick={() => setSelectedNodeId(node._id)}
										className={`w-full text-left px-3 py-2 rounded-lg border text-sm transition flex items-center justify-between gap-2 ${
											isSelected
												? 'border-primary bg-primary/10 text-primary'
												: 'hover:bg-muted'
										}`}
									>
										<span>Node #{node.number}</span>
										{pending ? (
											// Pending: hali saqlanmagan — sariq badge
											<span className='text-[10px] px-1.5 py-0.5 rounded bg-amber-100 text-amber-700'>
												미저장
											</span>
										) : hasLocation ? (
											// Server da saqlangan — yashil badge
											<span className='text-[10px] px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-700'>
												설정됨
											</span>
										) : null}
									</button>
								)
							})}
						</div>
					</aside>

					{/* ── Right main area ── */}
					<main className='flex flex-col min-h-0'>
						{/* Main plan image + overlay */}
						<div
							ref={containerRef}
							className='flex-1 min-h-0 bg-muted/20 flex items-center justify-center overflow-hidden'
						>
							{selectedImageUrl && renderSize ? (
								<div
									onClick={handlePlanClick}
									className={`relative select-none ${
										selectedNode ? 'cursor-crosshair' : 'cursor-default'
									}`}
									style={{
										width: renderSize.width,
										height: renderSize.height,
										maxWidth: '100%',
										maxHeight: '100%',
									}}
								>
									<img
										src={selectedImageUrl}
										alt='Building plan'
										className='w-full h-full block rounded-lg border bg-background'
										draggable={false}
									/>

									{/* Node markers */}
									{visibleNodes.map(node => {
										const pNode = node as PlanAngleNode
										const loc = getNodeLocation(pNode)!
										const isSelected = node._id === selectedNodeId
										const isPending = pendingLocations.has(node._id)

										return (
											<button
												key={node._id}
												type='button'
												onClick={e => {
													e.stopPropagation()
													setSelectedNodeId(node._id)
												}}
												className={`absolute -translate-x-1/2 -translate-y-1/2 rounded-full text-white font-bold flex items-center justify-center shadow-md transition-all ${
													isSelected
														? 'w-9 h-9 bg-sky-400 border-2 border-sky-700 z-10'
														: isPending
															? 'w-7 h-7 bg-amber-400 border border-amber-600 z-0'
															: 'w-7 h-7 bg-gray-400 border border-gray-600 z-0'
												}`}
												style={{
													left: `${loc.xPercent}%`,
													top: `${loc.yPercent}%`,
													fontSize: isSelected ? '13px' : '11px',
												}}
											>
												{node.number}
											</button>
										)
									})}
								</div>
							) : (
								<div className='h-full flex items-center justify-center text-sm text-muted-foreground'>
									{!selectedImageUrl ? '로딩 중...' : '도면 사진이 없습니다.'}
								</div>
							)}
						</div>

						{/* Footer: thumbnails + status text + buttons — bir qatorda */}
						<div className='border-t px-4 py-3 flex items-center gap-3 shrink-0'>
							{/* Thumbnails */}
							<div className='flex items-center gap-2 overflow-x-auto shrink-0'>
								{planImages.map((url, index) => (
									<button
										key={`${url}-${index}`}
										type='button'
										onClick={() => setSelectedImageIndex(index)}
										className={`relative w-16 h-11 rounded-md overflow-hidden border shrink-0 transition ${
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
										<span className='absolute left-1 bottom-1 px-1 py-0.5 rounded bg-black/60 text-white text-[9px]'>
											{index + 1}
										</span>
									</button>
								))}
							</div>

							{/* Divider */}
							<div className='w-px h-10 bg-border shrink-0' />

							{/* Status text — flex-1 so'nggi elementlarni o'ngga itaradi */}
							<p className='text-xs text-muted-foreground flex-1 min-w-0'>
								{selectedNode
									? `Node #${selectedNode.number} 선택됨 — 도면 위를 클릭하면 위치가 설정됩니다.`
									: '노드를 선택한 후 도면 위를 클릭하면 위치가 설정됩니다.'}
								{hasPending && (
									<span className='ml-2 text-amber-600 font-medium'>
										· {pendingLocations.size}개 미저장
									</span>
								)}
							</p>

							{/* Buttons */}
							<div className='flex items-center gap-2 shrink-0'>
								{saving && (
									<span className='text-xs text-muted-foreground animate-pulse'>
										저장 중...
									</span>
								)}
								<Button
									size='sm'
									variant='outline'
									onClick={onClose}
									disabled={saving}
								>
									취소
								</Button>
								<Button size='sm' onClick={handleSave} disabled={saving}>
									{hasPending ? `저장 (${pendingLocations.size})` : '저장'}
								</Button>
							</div>
						</div>
					</main>
				</div>
			</DialogContent>
		</Dialog>
	)
}
