/**
 * T-Shaped LED Visualization
 *
 * Compact visual representation of the physical T-shaped device.
 * Shows 5 LED positions: center, left, right, up, down.
 * Active LED lights up based on tilt direction.
 */

import { motion } from 'framer-motion'

const LED_SIZE = 'w-2.5 h-2.5'
const LED_SIZE_CENTER = 'w-3 h-3'

function Led({ active, color, className = '' }) {
	return (
		<div className={`relative ${className}`}>
			<motion.div
				className={`${active ? LED_SIZE_CENTER : LED_SIZE} rounded-full transition-colors duration-300 ${
					active
						? ''
						: 'bg-muted-foreground/20 border border-1 border-secondary-foreground'
				}`}
				style={active ? { backgroundColor: color } : {}}
				animate={
					active
						? { scale: [1, 1.2, 1], opacity: [0.8, 1, 0.8] }
						: { scale: 1, opacity: 1 }
				}
				transition={
					active ? { duration: 1.5, repeat: Infinity, ease: 'easeInOut' } : {}
				}
			/>
			{active && (
				<div
					className='absolute inset-0 rounded-full blur-md opacity-60'
					style={{ backgroundColor: color }}
				/>
			)}
		</div>
	)
}

export default function TShapeLed({
	activeLedPosition = 'center',
	ledColor = '#0ea5e9',
	compact = false,
}) {
	const isActive = position => activeLedPosition === position
	const inactiveColor = undefined
	const getColor = pos => (isActive(pos) ? ledColor : inactiveColor)

	if (compact) {
		return (
			<div className='flex flex-col items-center gap-0.5'>
				{/* Top row: up */}
				<Led active={isActive('up')} color={getColor('up')} />
				{/* Middle row: left - center - right (T horizontal bar) */}
				<div className='flex items-center gap-1'>
					<Led active={isActive('left')} color={getColor('left')} />
					<Led
						active={isActive('center') || activeLedPosition === 'none'}
						color={
							activeLedPosition === 'none' ? inactiveColor : getColor('center')
						}
					/>
					<Led active={isActive('right')} color={getColor('right')} />
				</div>
				{/* Bottom: down */}
				<Led active={isActive('down')} color={getColor('down')} />
			</div>
		)
	}

	return (
		<div className='flex flex-col items-center gap-1'>
			<Led active={isActive('up')} color={getColor('up')} />
			<div className='flex items-center gap-2'>
				<Led active={isActive('left')} color={getColor('left')} />
				<Led
					active={isActive('center') || activeLedPosition === 'none'}
					color={
						activeLedPosition === 'none' ? inactiveColor : getColor('center')
					}
				/>
				<Led active={isActive('right')} color={getColor('right')} />
			</div>
			<Led active={isActive('down')} color={getColor('down')} />
		</div>
	)
}
