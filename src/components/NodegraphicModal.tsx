/* eslint-disable @typescript-eslint/no-explicit-any */
import SwitchButton from '@/components/ui/switch-button'
import {
	HoverCard,
	HoverCardContent,
	HoverCardTrigger,
} from '@/components/ui/hover-card'
import { useNodeGraphicDataQuery } from '@/features/admin/hooks/useBuildings'
import { NodeTypes } from '@/features/admin/types/node.types'
import { AlarmLevels } from '@/features/manager/components/AlarmLevelSetting'
import { AnimatePresence, motion } from 'framer-motion'
import { Calendar, Clock, TrendingDown, TrendingUp, X } from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
	CartesianGrid,
	Line,
	LineChart,
	ReferenceLine,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from 'recharts'

// ─── Types ────────────────────────────────────────────────────────────────────

export interface NodeGraphicDataPoint {
	_id: string
	nodeNumber: number
	angleX: number
	angleY: number
	gwNumber: number
	createdAt: string
	updatedAt: string
}

export type LiveGraphicPoint = {
	nodeNumber: number
	nodeId?: string
	angleX: number
	angleY: number
	createdAt?: string
	updatedAt?: string
}

interface NodeGraphicModalProps {
	isOpen: boolean
	onClose: () => void
	nodeNumber: number
	nodeType: NodeTypes
	nodeName?: string
	alarmLevels: AlarmLevels
	livePoint?: LiveGraphicPoint | null
	faultFilter?: {
		enabled: boolean
		isSaving?: boolean
		onToggle: (enabled: boolean) => void
	}
}

type TimeMode = 'hour' | 'day'
const HOUR_OPTIONS = [1, 12, 24]

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatTime24(ts: string) {
	const d = new Date(ts)

	const hh = String(d.getHours()).padStart(2, '0')
	const mm = String(d.getMinutes()).padStart(2, '0')

	return `${hh}:${mm}`
}

function toDateInputValue(ts: string | Date) {
	const d = new Date(ts)

	const yyyy = d.getFullYear()
	const month = String(d.getMonth() + 1).padStart(2, '0')
	const day = String(d.getDate()).padStart(2, '0')

	return `${yyyy}-${month}-${day}`
}

function formatTick(ts: string) {
	return formatTime24(ts)
}

function getAlertBg(maxAngle: number, levels: AlarmLevels): string {
	if (maxAngle >= levels.danger)
		return 'rgba(var(--gss-danger-rgb,239,68,68),0.08)'
	if (maxAngle >= levels.warning)
		return 'rgba(var(--gss-warning-rgb,234,179,8),0.08)'
	if (maxAngle >= levels.caution)
		return 'rgba(var(--gss-caution-rgb,34,197,94),0.08)'
	return 'transparent'
}

function getAlertBorder(maxAngle: number, levels: AlarmLevels): string {
	if (maxAngle >= levels.danger) return 'hsl(var(--gss-danger,0 84% 60%) / 0.3)'
	if (maxAngle >= levels.warning)
		return 'hsl(var(--gss-warning,47 96% 53%) / 0.3)'
	if (maxAngle >= levels.caution)
		return 'hsl(var(--gss-caution,142 71% 45%) / 0.3)'
	return 'hsl(var(--border))'
}

// ─── Calendar mini-picker ─────────────────────────────────────────────────────

function DayPicker({
	selected,
	onChange,
}: {
	selected: string
	onChange: (d: string) => void
}) {
	const today = new Date()
	const [view, setView] = useState(
		new Date(today.getFullYear(), today.getMonth(), 1),
	)

	const year = view.getFullYear()
	const month = view.getMonth()
	const firstDay = new Date(year, month, 1).getDay()
	const daysInMonth = new Date(year, month + 1, 0).getDate()

	const cells: (number | null)[] = [
		...Array(firstDay).fill(null),
		...Array.from({ length: daysInMonth }, (_, i) => i + 1),
	]

	function toISO(day: number) {
		return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
	}

	return (
		<div className='absolute top-full mt-1 right-0 z-50 bg-popover border border-border rounded-xl shadow-xl p-3 w-64'>
			{/* Month nav */}
			<div className='flex items-center justify-between mb-2'>
				<button
					onClick={() => setView(new Date(year, month - 1, 1))}
					className='p-1 rounded hover:bg-muted text-muted-foreground hover:text-foreground text-sm'
				>
					‹
				</button>
				<span className='text-xs font-semibold text-foreground'>
					{view.toLocaleDateString('ko-KR', { year: 'numeric', month: 'long' })}
				</span>
				<button
					onClick={() => setView(new Date(year, month + 1, 1))}
					className='p-1 rounded hover:bg-muted text-muted-foreground hover:text-foreground text-sm'
				>
					›
				</button>
			</div>
			{/* Day headers */}
			<div className='grid grid-cols-7 mb-1'>
				{['일', '월', '화', '수', '목', '금', '토'].map(d => (
					<div
						key={d}
						className='text-center text-[10px] text-muted-foreground py-0.5'
					>
						{d}
					</div>
				))}
			</div>
			{/* Days */}
			<div className='grid grid-cols-7 gap-0.5'>
				{cells.map((day, i) => {
					if (!day) return <div key={`empty-${i}`} />
					const iso = toISO(day)
					const isSelected = iso === selected
					const isFuture = new Date(iso) > today
					return (
						<button
							key={iso}
							disabled={isFuture}
							onClick={() => onChange(iso)}
							className={`
								text-[11px] rounded-md py-1 transition-colors
								${isSelected ? 'bg-primary text-primary-foreground font-bold' : ''}
								${!isSelected && !isFuture ? 'hover:bg-muted text-foreground' : ''}
								${isFuture ? 'text-muted-foreground/30 cursor-not-allowed' : ''}
							`}
						>
							{day}
						</button>
					)
				})}
			</div>
		</div>
	)
}

// ─── Custom Tooltip ───────────────────────────────────────────────────────────

function CustomTooltip({ active, payload, label }: any) {
	if (!active || !payload?.length) return null
	return (
		<div className='bg-popover border border-border rounded-lg px-3 py-2 shadow-lg text-xs'>
			<p className='text-muted-foreground mb-1'>{formatTick(label)}</p>
			{payload.map((p: any) => (
				<p
					key={p.dataKey}
					style={{ color: p.color }}
					className='font-mono font-semibold'
				>
					{p.name}: {Number(p.value).toFixed(3)}°
				</p>
			))}
		</div>
	)
}

// ─── Main Modal ───────────────────────────────────────────────────────────────

export default function NodeGraphicModal({
	isOpen,
	onClose,
	nodeNumber,
	nodeType,
	nodeName,
	alarmLevels,
	livePoint,
	faultFilter,
}: NodeGraphicModalProps) {
	const [mode, setMode] = useState<TimeMode>('hour')
	const [hourValue, setHourValue] = useState(12)
	const [dayValue, setDayValue] = useState(
		new Date().toISOString().split('T')[0],
	)
	const [showDayPicker, setShowDayPicker] = useState(false)
	const pickerRef = useRef<HTMLDivElement>(null)
	const { t } = useTranslation()

	// Close day-picker on outside click
	useEffect(() => {
		function handler(e: MouseEvent) {
			if (pickerRef.current && !pickerRef.current.contains(e.target as Node)) {
				setShowDayPicker(false)
			}
		}
		document.addEventListener('mousedown', handler)
		return () => document.removeEventListener('mousedown', handler)
	}, [])

	// Fetch whenever params change
	const {
		data = [],
		isLoading: loading,
		isError,
	} = useNodeGraphicDataQuery({
		nodeNumber,
		nodeType,
		mode,
		value: mode === 'hour' ? hourValue : dayValue,
		enabled: isOpen,
	})

	const mergedData = useMemo(() => {
		const result = [...data]

		if (!livePoint || livePoint.nodeNumber !== nodeNumber) {
			return result
		}

		const createdAt = livePoint.createdAt ?? livePoint.updatedAt

		if (!createdAt || (livePoint.angleX == null && livePoint.angleY == null)) {
			return result
		}

		const pointTime = new Date(createdAt).getTime()
		const now = Date.now()

		const isInCurrentRange =
			mode === 'hour'
				? pointTime >= now - hourValue * 60 * 60 * 1000 &&
					pointTime <= now + 60 * 1000
				: toDateInputValue(createdAt) === dayValue

		if (!isInCurrentRange) {
			return result
		}

		const normalized: NodeGraphicDataPoint = {
			_id: livePoint.nodeId ?? `${nodeNumber}-${createdAt}`,
			nodeNumber,
			angleX: livePoint.angleX ?? 0,
			angleY: livePoint.angleY ?? 0,
			gwNumber: 0,
			createdAt,
			updatedAt: livePoint.updatedAt ?? createdAt,
		}

		const existingIndex = result.findIndex(
			item =>
				item._id === normalized._id || item.createdAt === normalized.createdAt,
		)

		if (existingIndex >= 0) {
			result[existingIndex] = {
				...result[existingIndex],
				...normalized,
			}
		} else {
			result.push(normalized)
		}

		return result.sort(
			(a, b) =>
				new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
		)
	}, [data, livePoint, nodeNumber, mode, hourValue, dayValue])

	const chartData = useMemo(
		() =>
			mergedData
				.filter(d => d.angleX != null || d.angleY != null)
				.map(d => ({
					ts: d.createdAt,
					x: d.angleX ?? 0,
					y: d.angleY ?? 0,
				})),
		[mergedData],
	)

	const maxAngle = useMemo(
		() =>
			Math.max(
				0,
				...chartData.map(d => Math.max(Math.abs(d.x), Math.abs(d.y))),
			),
		[chartData],
	)

	const bgColor = getAlertBg(maxAngle, alarmLevels)
	const borderColor = getAlertBorder(maxAngle, alarmLevels)

	const lastPoint = chartData[chartData.length - 1]
	const prevPoint = chartData[chartData.length - 2]
	const trend =
		lastPoint && prevPoint
			? lastPoint.x + lastPoint.y > prevPoint.x + prevPoint.y
				? 'up'
				: 'down'
			: null

	return (
		<AnimatePresence>
			{isOpen && (
				<>
					{/* Backdrop */}
					<motion.div
						key='backdrop'
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						transition={{ duration: 0.2 }}
						className='fixed inset-0 z-40 bg-black/50 backdrop-blur-sm'
						onClick={onClose}
					/>

					{/* Modal */}
					<motion.div
						key='modal'
						initial={{ opacity: 0, scale: 0.95, y: 16 }}
						animate={{ opacity: 1, scale: 1, y: 0 }}
						exit={{ opacity: 0, scale: 0.95, y: 16 }}
						transition={{ type: 'spring', stiffness: 300, damping: 28 }}
						className='fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none'
					>
						<div
							className='pointer-events-auto w-full max-w-4xl h-fit rounded-xl border shadow-2xl overflow-hidden'
							style={{
								background: `color-mix(in srgb, hsl(var(--background)) 96%, transparent)`,
								borderColor,
								backdropFilter: 'blur(12px)',
							}}
						>
							{/* Header */}
							<div className='relative flex items-start justify-between px-5 pt-5 pb-3'>
								<div>
									<p className='text-xs font-medium text-muted-foreground uppercase tracking-widest mb-0.5'>
										Tilt Graph
									</p>
									<h2 className='text-lg font-bold text-foreground flex items-center gap-2'>
										{nodeName ?? `Node #${nodeNumber}`}
										{trend === 'up' && (
											<TrendingUp className='w-4 h-4 text-destructive' />
										)}
										{trend === 'down' && (
											<TrendingDown className='w-4 h-4 text-gss-safe' />
										)}
									</h2>
									{lastPoint && (
										<p className='text-xs text-muted-foreground mt-0.5 font-mono'>
											X: {lastPoint.x.toFixed(3)}° · Y: {lastPoint.y.toFixed(3)}
											°
										</p>
									)}
								</div>

								{/* ── Controls ── */}
								<div className='flex items-center gap-2 flex-wrap justify-end'>
									{/* Mode toggle */}
									<div className='flex items-center rounded-lg border border-border/60 bg-muted/30 p-0.5 gap-0.5'>
										<button
											onClick={() => setMode('hour')}
											className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
												mode === 'hour'
													? 'bg-background text-foreground shadow-sm'
													: 'text-muted-foreground hover:text-foreground'
											}`}
										>
											<Clock className='w-3 h-3' />
											시간
										</button>
										<button
											onClick={() => setMode('day')}
											className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
												mode === 'day'
													? 'bg-background text-foreground shadow-sm'
													: 'text-muted-foreground hover:text-foreground'
											}`}
										>
											<Calendar className='w-3 h-3' />
											날짜
										</button>
									</div>

									{/* Value selector */}
									{mode === 'hour' ? (
										<div className='flex items-center rounded-lg border border-border/60 bg-muted/30 p-0.5 gap-0.5'>
											{HOUR_OPTIONS.map(h => (
												<button
													key={h}
													onClick={() => setHourValue(h)}
													className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
														hourValue === h
															? 'bg-background text-foreground shadow-sm'
															: 'text-muted-foreground hover:text-foreground'
													}`}
												>
													{h}h
												</button>
											))}
										</div>
									) : (
										<div className='relative' ref={pickerRef}>
											<button
												onClick={() => setShowDayPicker(v => !v)}
												className='flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border/60 bg-muted/30 text-xs font-medium text-foreground hover:bg-muted transition-colors'
											>
												<Calendar className='w-3 h-3 text-muted-foreground' />
												{dayValue}
											</button>
											{showDayPicker && (
												<DayPicker
													selected={dayValue}
													onChange={d => {
														setDayValue(d)
														setShowDayPicker(false)
													}}
												/>
											)}
										</div>
									)}

									{/* Close */}
									<button
										onClick={onClose}
										className='p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors'
									>
										<X className='w-4 h-4' />
									</button>
								</div>
							</div>

							{/* Alarm level legend */}
							<div className='relative flex items-center justify-between gap-4 px-5 pb-2'>
								<div className='flex min-w-0 flex-wrap items-center gap-4'>
									{alarmLevels.caution > 0 && (
										<span className='flex items-center gap-1 text-[10px] text-muted-foreground'>
											<span className='inline-block w-3 h-0.5 bg-gss-caution rounded' />
											주의 {alarmLevels.caution}°
										</span>
									)}
									{alarmLevels.warning > 0 && (
										<span className='flex items-center gap-1 text-[10px] text-muted-foreground'>
											<span className='inline-block w-3 h-0.5 bg-gss-warning rounded' />
											경고 {alarmLevels.warning}°
										</span>
									)}
									{alarmLevels.danger > 0 && (
										<span className='flex items-center gap-1 text-[10px] text-muted-foreground'>
											<span className='inline-block w-3 h-0.5 bg-destructive rounded' />
											위험 {alarmLevels.danger}°
										</span>
									)}
								</div>

								{faultFilter && (
									<div className='flex shrink-0 items-center gap-2'>
										<HoverCard openDelay={200} closeDelay={100}>
											<HoverCardTrigger asChild>
												<span className='inline-flex'>
													<SwitchButton
														checked={faultFilter.enabled}
														disabled={faultFilter.isSaving}
														ariaLabel='Toggle node fault filter'
														onCheckedChange={faultFilter.onToggle}
													/>
												</span>
											</HoverCardTrigger>
											<HoverCardContent
												side='left'
												align='center'
												sideOffset={8}
												className='w-56 rounded-md p-2 text-xs leading-snug text-muted-foreground'
											>
												{t('nodePages.controls.faultFilterDescription')}
											</HoverCardContent>
										</HoverCard>
										<span className='text-xs font-medium text-muted-foreground'>
											{t('nodePages.controls.faultFilterLabel')}
										</span>
									</div>
								)}
							</div>

							{/* Chart */}
							{/* Chart */}
							<div className='relative px-4 pb-5'>
								<div
									className='rounded-xl border border-border/50 overflow-hidden transition-colors duration-500'
									style={{ background: bgColor }}
								>
									{loading ? (
										<div className='h-[300px] flex items-center justify-center'>
											<div className='flex gap-1.5'>
												{[0, 1, 2].map(i => (
													<motion.div
														key={i}
														className='w-1.5 h-1.5 rounded-full bg-primary/50'
														animate={{
															scale: [1, 1.5, 1],
															opacity: [0.5, 1, 0.5],
														}}
														transition={{
															duration: 0.9,
															repeat: Infinity,
															delay: i * 0.2,
														}}
													/>
												))}
											</div>
										</div>
									) : isError ? (
										<div className='h-[300px] flex flex-col items-center justify-center gap-2'>
											<p className='text-sm text-destructive'>
												그래프 데이터를 불러오지 못했습니다
											</p>
										</div>
									) : chartData.length === 0 ? (
										<div className='h-[300px] flex flex-col items-center justify-center gap-2'>
											<p className='text-sm text-muted-foreground'>
												데이터가 없습니다
											</p>
										</div>
									) : (
										<ResponsiveContainer width='100%' height={300}>
											<LineChart
												data={chartData}
												margin={{ top: 16, right: 16, left: -8, bottom: 8 }}
											>
												<CartesianGrid
													strokeDasharray='3 3'
													stroke='hsl(var(--border))'
													opacity={0.5}
												/>

												<XAxis
													dataKey='ts'
													tick={{
														fontSize: 10,
														fill: 'hsl(var(--muted-foreground))',
													}}
													tickFormatter={v => formatTick(v)}
													interval='preserveStartEnd'
													axisLine={false}
													tickLine={false}
												/>

												<YAxis
													tick={{
														fontSize: 10,
														fill: 'hsl(var(--muted-foreground))',
													}}
													tickFormatter={v => `${v}°`}
													axisLine={false}
													tickLine={false}
													domain={['auto', 'auto']}
												/>

												<Tooltip content={<CustomTooltip mode={mode} />} />

												{alarmLevels.caution > 0 && (
													<ReferenceLine
														y={alarmLevels.caution}
														stroke='hsl(142 71% 45%)'
														strokeDasharray='4 3'
														strokeWidth={1.5}
													/>
												)}

												{alarmLevels.warning > 0 && (
													<ReferenceLine
														y={alarmLevels.warning}
														stroke='hsl(47 96% 53%)'
														strokeDasharray='4 3'
														strokeWidth={1.5}
													/>
												)}

												{alarmLevels.danger > 0 && (
													<ReferenceLine
														y={alarmLevels.danger}
														stroke='hsl(0 84% 60%)'
														strokeDasharray='4 3'
														strokeWidth={1.5}
													/>
												)}

												<Line
													type='monotone'
													dataKey='x'
													name='X'
													stroke='hsl(217 91% 60%)'
													strokeWidth={2}
													dot={false}
													activeDot={{ r: 4 }}
												/>

												<Line
													type='monotone'
													dataKey='y'
													name='Y'
													stroke='hsl(142 71% 45%)'
													strokeWidth={2}
													dot={false}
													activeDot={{ r: 4 }}
												/>
											</LineChart>
										</ResponsiveContainer>
									)}
								</div>
							</div>
						</div>
					</motion.div>
				</>
			)}
		</AnimatePresence>
	)
}
