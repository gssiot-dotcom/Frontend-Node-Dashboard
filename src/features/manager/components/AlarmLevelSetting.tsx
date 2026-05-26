import { Button } from '@/components/ui/button'

const ALARM_MAX_DEGREE = 12

const _ALARM_LEVEL_VALUES = ['safe', 'caution', 'warning', 'danger'] as const
const EDITABLE_ALARM_LEVEL_VALUES = ['caution', 'warning', 'danger'] as const

export type AlarmLevelValue = (typeof _ALARM_LEVEL_VALUES)[number]
type EditableAlarmLevelValue = (typeof EDITABLE_ALARM_LEVEL_VALUES)[number]

export type AlarmLevels = Record<AlarmLevelValue, number>

const STATUS_FILTERS = [
	{
		labelKey: 'verticalNodes.filterButtons.normal',
		value: 'safe',
		colorClass: 'bg-gss-safe',
	},
	{
		labelKey: '주의',
		value: 'caution',
		colorClass: 'bg-green-500',
	},
	{
		labelKey: '경고',
		value: 'warning',
		colorClass: 'bg-gss-warning',
	},
	{
		labelKey: 'verticalNodes.filterButtons.danger',
		value: 'danger',
		colorClass: 'bg-gss-danger',
	},
]

export default function AlarmLevelSettings({
	value,
	onChange,
	onSave,
	t,
	isSaving,
}: {
	value: AlarmLevels
	onChange: (next: AlarmLevels) => void
	onSave?: (value: AlarmLevels) => void
	t: (key: string) => string
	isSaving?: boolean
}) {
	const editableFilters = STATUS_FILTERS.filter(f =>
		EDITABLE_ALARM_LEVEL_VALUES.includes(f.value as EditableAlarmLevelValue),
	)

	const safeFilter = STATUS_FILTERS.find(f => f.value === 'safe')

	const getMinValue = (level: EditableAlarmLevelValue) => {
		if (level === 'caution') return 1
		if (level === 'warning') return value.caution || 1
		return value.warning || value.caution || 1
	}

	const getOptions = (level: EditableAlarmLevelValue) => {
		const min = getMinValue(level)

		return Array.from({ length: ALARM_MAX_DEGREE - min + 1 }, (_, i) => min + i)
	}

	const handleChange = (level: EditableAlarmLevelValue, nextValue: number) => {
		const next = { ...value, [level]: nextValue }

		if (level === 'caution') {
			if (next.warning !== 0 && next.warning < nextValue) {
				next.warning = nextValue
			}

			if (next.danger !== 0 && next.danger < next.warning) {
				next.danger = next.warning
			}
		}

		if (level === 'warning') {
			if (next.danger !== 0 && next.danger < nextValue) {
				next.danger = nextValue
			}
		}

		onChange(next)
	}

	return (
		<div className='flex flex-wrap items-end gap-3 sm:gap-5 rounded-xl border border-border/90 bg-muted/50 px-2 py-1.5'>
			{safeFilter && (
				<label className='flex min-w-[60px] sm:min-w-[76px] flex-col gap-0.5 sm:gap-1'>
					<div className='flex items-center justify-center gap-1'>
						<span
							className={`h-2 w-2 sm:h-2.5 sm:w-2.5 rounded-[2px] sm:rounded-[3px] ${safeFilter.colorClass}`}
						/>
						<span className='text-[9px] sm:text-[10px] leading-none text-muted-foreground'>
							{t(safeFilter.labelKey)}
						</span>
					</div>
					<div className='flex h-6 sm:h-7 items-center justify-center rounded-md border border-border bg-background/50 px-1.5 sm:px-2 text-[11px] sm:text-xs font-medium text-muted-foreground'>
						{value.caution || 0}° 이하
					</div>
				</label>
			)}

			{editableFilters.map(f => {
				const level = f.value as EditableAlarmLevelValue
				const options = getOptions(level)

				return (
					<label
						key={f.value}
						className='flex min-w-[54px] sm:min-w-[66px] cursor-pointer flex-col gap-0.5 sm:gap-1'
					>
						<div className='flex items-center justify-center gap-1'>
							<span
								className={`h-2 w-2 sm:h-2.5 sm:w-2.5 rounded-[2px] sm:rounded-[3px] ${f.colorClass}`}
							/>
							<span className='text-[9px] sm:text-[10px] leading-none text-muted-foreground'>
								{t(f.labelKey)}
							</span>
						</div>

						<select
							value={value[level]}
							onChange={e => handleChange(level, Number(e.target.value))}
							className='h-6 sm:h-7 rounded-md border border-border bg-background/50 px-1.5 sm:px-2 text-[11px] sm:text-xs font-medium text-foreground outline-none hover:bg-muted/40'
						>
							<option value={0}>0°</option>
							{options.map(option => (
								<option key={option} value={option}>
									{option}°
								</option>
							))}
						</select>
					</label>
				)
			})}

			<Button
				type='button'
				size='sm'
				disabled={isSaving}
				onClick={() => onSave?.(value)}
				className='h-6 sm:h-7 px-2 sm:px-3 text-[11px] sm:text-xs flex-1 sm:flex-none'
			>
				{isSaving ? 'Saving...' : 'Save'}
			</Button>
		</div>
	)
}
