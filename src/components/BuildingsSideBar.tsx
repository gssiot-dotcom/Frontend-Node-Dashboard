import { cn } from '@/lib/utils'
import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

// Replace with your actual API call
async function fetchBuildingData(buildingId) {
	// e.g. return api.get(`/buildings/${buildingId}/stats`)
	return new Promise(resolve =>
		setTimeout(
			() =>
				resolve({
					id: buildingId,
					// stats will come from your API
				}),
			500,
		),
	)
}

const STATUS_CONFIG = {
	active: {
		labelKey: 'buildings.status.active',
		className: 'text-gss-safe bg-gss-safe/10 border-gss-safe/20',
	},
	warning: {
		labelKey: 'buildings.status.warning',
		className: 'text-gss-warning bg-gss-warning/10 border-gss-warning/20',
	},
	paused: {
		labelKey: 'buildings.status.paused',
		className: 'text-muted-foreground bg-muted/30 border-border',
	},
}

function BuildingCard({ building, isSelected, onClick }) {
	const { t } = useTranslation()
	const status = STATUS_CONFIG[building.status] ?? STATUS_CONFIG.active

	return (
		<motion.button
			layout
			onClick={onClick}
			className={cn(
				'w-full text-left rounded-xl p-3 border transition-colors duration-150',
				'focus:outline-none focus-visible:ring-2 focus-visible:ring-ring',
				isSelected
					? 'glass border-gss-safe/30 bg-gss-safe/5'
					: 'border-transparent bg-muted/20 hover:bg-muted/40 hover:border-border',
			)}
		>
			{/* Status badge */}
			<span
				className={cn(
					'inline-flex items-center gap-1 text-[10px] font-medium px-1.5 py-0.5 rounded-full border mb-2',
					status.className,
				)}
			>
				<span className='w-1.5 h-1.5 rounded-full bg-current' />
				{t(status.labelKey, building.status)}
			</span>

			{/* Name */}
			<p
				className={cn(
					'text-sm font-semibold leading-snug mb-0.5',
					isSelected ? 'text-gss-safe' : 'text-foreground',
				)}
			>
				{building.name}
			</p>

			{/* Location */}
			<p className='text-[11px] text-muted-foreground mb-2.5'>
				{building.location}
			</p>

			{/* Progress */}
			<div className='flex items-center gap-2'>
				<div className='flex-1 h-1 bg-muted/40 rounded-full overflow-hidden'>
					<motion.div
						className={cn(
							'h-full rounded-full',
							isSelected ? 'bg-gss-safe' : 'bg-muted-foreground/40',
						)}
						initial={{ width: 0 }}
						animate={{ width: `${building.progress}%` }}
						transition={{ duration: 0.6, ease: 'easeOut' }}
					/>
				</div>
				<span
					className={cn(
						'text-[11px] font-medium tabular-nums',
						isSelected ? 'text-gss-safe' : 'text-muted-foreground',
					)}
				>
					{building.progress}%
				</span>
			</div>
		</motion.button>
	)
}

export function BuildingsSidebar({ buildings = [], onBuildingChange }) {
	const { t } = useTranslation()
	const [selectedId, setSelectedId] = useState(buildings[0]?.id ?? null)
	const [isLoading, setIsLoading] = useState(false)

	// Notify parent with first building on mount
	useEffect(() => {
		if (buildings[0]) {
			onBuildingChange?.(buildings[0], false)
		}
	}, []) // eslint-disable-line react-hooks/exhaustive-deps

	async function handleSelect(building) {
		if (building.id === selectedId || isLoading) return
		setSelectedId(building.id)
		setIsLoading(true)
		try {
			const data = await fetchBuildingData(building.id)
			onBuildingChange?.({ ...building, ...data }, false)
		} finally {
			setIsLoading(false)
		}
	}

	return (
		<aside className='flex flex-col w-56 shrink-0 border-r border-border/50 min-h-screen'>
			{/* Header */}
			<div className='px-4 py-4 border-b border-border/50'>
				<h2 className='text-xs font-semibold uppercase tracking-widest text-muted-foreground'>
					{t('buildings.sidebar.title', 'Buildings')}
				</h2>
			</div>

			{/* Scrollable list */}
			<div className='flex-1 overflow-y-auto px-2 py-2 space-y-1.5 scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent'>
				<AnimatePresence initial={false}>
					{buildings.map(building => (
						<motion.div
							key={building.id}
							initial={{ opacity: 0, x: -6 }}
							animate={{ opacity: 1, x: 0 }}
							exit={{ opacity: 0, x: -6 }}
							transition={{ duration: 0.2 }}
						>
							<BuildingCard
								building={building}
								isSelected={building.id === selectedId}
								onClick={() => handleSelect(building)}
							/>
						</motion.div>
					))}
				</AnimatePresence>
			</div>

			{/* Loading indicator */}
			<AnimatePresence>
				{isLoading && (
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						className='px-4 py-3 border-t border-border/50 flex items-center gap-2 text-xs text-muted-foreground'
					>
						<span className='w-3 h-3 rounded-full border border-muted-foreground/40 border-t-muted-foreground animate-spin' />
						{t('buildings.sidebar.loading', 'Fetching data…')}
					</motion.div>
				)}
			</AnimatePresence>
		</aside>
	)
}
