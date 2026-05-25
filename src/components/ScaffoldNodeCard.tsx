'use client'

import { GatewayRef, ScaffoldingNode } from '@/features/admin/types/node.types'
import {
	Battery,
	BatteryLow,
	BatteryMedium,
	BatteryWarning,
	Lock,
	LockKeyholeOpen,
	MapPinned,
	Wifi,
	WifiOff,
} from 'lucide-react'

interface ScaffoldingNodeCardProps {
	node: ScaffoldingNode
}

function getGatewayLabel(gatewayId: GatewayRef) {
	if (!gatewayId) return '-'

	if (typeof gatewayId === 'string') {
		return gatewayId
	}

	return gatewayId.serialNumber || gatewayId._id
}

function mapDoorStateToUi(doorState: 0 | 1, isAlive: boolean) {
	if (!isAlive) {
		return {
			alertLevel: 'offline',
			statusLabel: 'Offline',
			ledColor: 'hsl(var(--gss-offline))',
			cardBgClass: 'bg-card border-gss-offline/30',
			iconColor: 'text-gss-offline',
			glowClass: '',
			badgeColor: 'bg-gss-offline/10 text-gss-offline border-gss-offline/30',
		}
	}

	if (doorState === 1) {
		// Door is OPEN - this is a danger/alert state
		return {
			alertLevel: 'danger',
			statusLabel: 'Door Open',
			ledColor: 'hsl(var(--gss-danger))',
			cardBgClass: 'bg-card border-gss-danger/30',
			iconColor: 'text-gss-danger animate-pulse',
			glowClass: 'glow-danger',
			badgeColor: 'bg-gss-danger/10 text-gss-danger border-gss-danger/30',
		}
	}

	// Door is CLOSED - safe state
	return {
		alertLevel: 'safe',
		statusLabel: 'Secured',
		ledColor: 'hsl(var(--gss-safe))',
		cardBgClass: 'bg-card border-gss-safe/30',
		iconColor: 'text-gss-safe',
		glowClass: 'glow-primary',
		badgeColor: 'bg-gss-safe/10 text-gss-safe border-gss-safe/30',
	}
}

function getBatteryIcon(level: number) {
	if (level <= 10)
		return (
			<BatteryWarning className='w-3 h-3 sm:w-3.5 sm:h-3.5 text-gss-danger' />
		)
	if (level <= 30)
		return <BatteryLow className='w-3 h-3 sm:w-3.5 sm:h-3.5 text-gss-warning' />
	if (level <= 60)
		return <BatteryMedium className='w-3 h-3 sm:w-3.5 sm:h-3.5 text-gss-safe' />
	return <Battery className='w-3 h-3 sm:w-3.5 sm:h-3.5 text-gss-safe' />
}

export default function ScaffoldingNodeCard({
	node,
}: ScaffoldingNodeCardProps) {
	const ui = mapDoorStateToUi(node.doorState, node.status !== 'offline')

	return (
		<div
			className={`relative rounded-lg sm:rounded-xl border p-2 sm:p-3 transition-all duration-500 overflow-hidden ${ui.cardBgClass} ${ui.glowClass} hover:scale-[1.02]`}
		>
			{/* Status indicator line at top */}
			<div
				className='absolute top-0 left-0 right-0 h-1 rounded-full'
				style={{ backgroundColor: ui.ledColor }}
			/>

			{/* Header row: name + connectivity */}
			<div className='flex items-start justify-between mb-1.5 sm:mb-2'>
				<div className='min-w-0 flex-1'>
					<p className='text-[10px] sm:text-xs font-semibold text-foreground truncate'>
						Node #{node.number}
					</p>
					<p className='text-[8px] sm:text-[10px] text-muted-foreground font-mono'>
						{node.nodeType}
					</p>
				</div>
				<div className='flex items-center gap-1 shrink-0 ml-1'>
					{node.status !== 'offline' ? (
						<Wifi className='w-2.5 h-2.5 sm:w-3 sm:h-3 text-gss-safe' />
					) : (
						<WifiOff className='w-2.5 h-2.5 sm:w-3 sm:h-3 text-gss-offline' />
					)}
				</div>
			</div>

			{/* Center: Door Icon + status badge */}
			<div className='flex items-center justify-between mb-1.5 sm:mb-2'>
				{/* Door Icon */}
				<div className='flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-md sm:rounded-lg bg-muted/30'>
					{node.doorState === 1 ? (
						<LockKeyholeOpen
							className={`w-5 h-5 sm:w-8 sm:h-8 ${ui.iconColor} animate-pulse`}
							strokeWidth={1.5}
						/>
					) : (
						<Lock
							className={`w-5 h-5 sm:w-8 sm:h-8 ${ui.iconColor}`}
							strokeWidth={1.5}
						/>
					)}
				</div>
				<div className='flex flex-col items-end gap-1'>
					<span
						className={`inline-flex items-center px-1 sm:px-1.5 py-0.5 rounded-md text-[8px] sm:text-[10px] font-medium border ${ui.badgeColor}`}
					>
						{ui.statusLabel}
					</span>
				</div>
			</div>

			{/* Battery & Gateway info */}
			<div className='grid grid-cols-2 gap-1 mb-1 sm:mb-1.5'>
				<div className='bg-muted/30 rounded-md px-1 sm:px-1.5 py-0.5 sm:py-1 flex items-center gap-0.5 sm:gap-1'>
					{getBatteryIcon(node.batteryLevel)}
					<span className='text-[10px] sm:text-xs font-mono font-semibold text-foreground'>
						{node.status !== 'offline' ? `${node.batteryLevel}%` : '—'}
					</span>
				</div>
				<div className='bg-muted/30 rounded-md px-1 sm:px-1.5 py-0.5 sm:py-1'>
					<span className='text-[8px] sm:text-[10px] font-medium text-muted-foreground'>
						GW:
					</span>
					<span className='text-[10px] sm:text-xs font-mono font-semibold text-foreground ml-0.5 sm:ml-1'>
						{getGatewayLabel(node.gatewayId)}
					</span>
				</div>
			</div>

			{/* Position info */}
			<div className='flex items-center gap-0.5 sm:gap-1 text-[8px] sm:text-[10px] text-muted-foreground'>
				<MapPinned className='w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0' />
				<span className='font-medium truncate'>
					{node.installedLocation || 'Position N/A'}
				</span>
			</div>
		</div>
	)
}
