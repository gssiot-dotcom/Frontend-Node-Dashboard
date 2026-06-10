'use client'

import { AngleNodeNodeUi } from '@/features/manager/pages/AngleNodes'
import { formatNodeLocation } from '@/features/admin/utils/format-node-location'
import { mapTiltToUiState } from '@/lib/TiltMapper'
import { MapPinned, Wifi, WifiOff } from 'lucide-react'
import TShapeLed from './TShapeLed'

interface TiltNodeCardProps {
	node: AngleNodeNodeUi
}

export default function AngleNodeCard({ node }: TiltNodeCardProps) {
	const ui = mapTiltToUiState(
		node.angleX!,
		node.angleY!,
		node.isOnline,
		node.status,
	)

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
					{node.isOnline ? (
						<Wifi className='w-2.5 h-2.5 sm:w-3 sm:h-3 text-gss-safe' />
					) : (
						<WifiOff className='w-2.5 h-2.5 sm:w-3 sm:h-3 text-gss-offline' />
					)}
				</div>
			</div>

			{/* Center: T-Shape LED + status badge */}
			<div className='flex items-center justify-between mb-1.5 sm:mb-2'>
				<TShapeLed
					activeLedPosition={ui.activeLedPosition}
					ledColor={ui.ledColor}
					compact
				/>
				<div className='flex flex-col items-end gap-1'>
					<span
						className={`inline-flex items-center px-1 sm:px-1.5 py-0.5 rounded-md text-[8px] sm:text-[10px] font-medium border ${ui.badgeColor}`}
					>
						{ui.statusLabel}
					</span>
				</div>
			</div>

			{/* Angle X & Y values */}
			<div className='grid grid-cols-2 gap-1 mb-1 sm:mb-1.5'>
				<div className='bg-muted/30 rounded-md px-1 sm:px-1.5 py-0.5 sm:py-1 flex items-center justify-between'>
					<span className='text-[8px] sm:text-[10px] font-medium text-muted-foreground'>
						X:
					</span>
					<span className='text-[10px] sm:text-xs font-mono font-semibold text-foreground'>
						{node.isOnline
							? `${node.angleX > 0 ? '+' : ''}${node.angleY.toFixed(1)}°`
							: '—'}
					</span>
				</div>
				<div className='bg-muted/30 rounded-md px-1 sm:px-1.5 py-0.5 sm:py-1 flex items-center justify-between'>
					<span className='text-[8px] sm:text-[10px] font-medium text-muted-foreground'>
						Y:
					</span>
					<span className='text-[10px] sm:text-xs font-mono font-semibold text-foreground'>
						{node.isOnline
							? `${node.angleX > 0 ? '+' : ''}${node.angleY.toFixed(1)}°`
							: '—'}
					</span>
				</div>
			</div>

			{/* Gateway info */}
			<div className='flex items-center justify-between mb-1 sm:mb-1.5'>
				<div className='bg-muted/30 rounded-md px-1 sm:px-1.5 py-0.5 sm:py-1 flex-1'>
					<span className='text-[8px] sm:text-[10px] font-medium text-muted-foreground'>
						GW:
					</span>
					<span className='text-[10px] sm:text-xs font-mono font-semibold text-foreground ml-0.5 sm:ml-1'>
						{node.gatewayId.serialNumber}
					</span>
				</div>
			</div>

			{/* Position info */}
			<div className='flex items-center gap-0.5 sm:gap-1 text-[8px] sm:text-[10px] text-muted-foreground'>
				<MapPinned className='w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0' />
				<span className='font-medium truncate'>
					{formatNodeLocation(
						node.installedLocation,
						node.installedLocationTitle,
					)}
				</span>
			</div>
		</div>
	)
}
