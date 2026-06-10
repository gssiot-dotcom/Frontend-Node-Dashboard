import { cn } from '@/lib/utils'

type SwitchButtonProps = {
	checked: boolean
	onCheckedChange: (checked: boolean) => void
	disabled?: boolean
	ariaLabel: string
	className?: string
}

export default function SwitchButton({
	checked,
	onCheckedChange,
	disabled,
	ariaLabel,
	className,
}: SwitchButtonProps) {
	return (
		<button
			type='button'
			role='switch'
			aria-checked={checked}
			aria-label={ariaLabel}
			disabled={disabled}
			onClick={() => onCheckedChange(!checked)}
			className={cn(
				'relative inline-flex h-7 w-14 shrink-0 items-center rounded-full border transition-colors disabled:cursor-not-allowed disabled:opacity-60',
				checked ? 'bg-primary' : 'border-border bg-muted-foreground/20',
				className,
			)}
		>
			<span
				aria-hidden='true'
				className={cn(
					'pointer-events-none h-5 w-5 rounded-full border-border bg-background shadow-sm transition-transform',
					checked ? 'translate-x-8' : 'translate-x-1',
				)}
			/>
		</button>
	)
}
