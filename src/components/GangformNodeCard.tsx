/**
 * Vertical Node Card - Compact design for dense grid display.
 * Shows node status, tilt data, and LED visualization at a glance.
 */

import { GangformNodeUi } from '@/features/manager/pages/GangformNodes'
import { formatNodeLocation } from '@/features/admin/utils/format-node-location'
import { mapTiltToUiState } from '@/lib/TiltMapper'
import { MapPinned, Wifi, WifiOff } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import TShapeLed from './TShapeLed'

interface NodeCardProps {
	node: GangformNodeUi
}

export default function NodeCard({ node }: NodeCardProps) {
	const ui = mapTiltToUiState(node.x, node.y, node.isOnline, node.status)
	const { t } = useTranslation()

	return (
		<div
			className={`relative rounded-xl border p-3 transition-all duration-500 overflow-hidden ${ui.cardBgClass} ${ui.glowClass} hover:scale-[1.02]`}
		>
			{/* Status indicator line at top */}
			<div
				className='absolute top-0 left-0 right-0 h-1 rounded-full'
				style={{ backgroundColor: ui.ledColor }}
			/>

			{/* Header row: name + connectivity */}
			<div className='flex items-start justify-between mb-2'>
				<div className='min-w-0 flex-1'>
					<p className='text-xs font-semibold text-foreground truncate'>
						{node.name}
					</p>
					<p className='text-[10px] text-muted-foreground font-mono'>
						{node.id}
					</p>
				</div>
				<div className='flex items-center gap-1 shrink-0 ml-1'>
					{node.isOnline ? (
						<Wifi className='w-3 h-3 text-gss-safe' />
					) : (
						<WifiOff className='w-3 h-3 text-gss-offline' />
					)}
				</div>
			</div>

			{/* Center: LED + status badge */}
			<div className='flex items-center justify-between mb-2'>
				<TShapeLed
					activeLedPosition={ui.activeLedPosition}
					ledColor={ui.ledColor}
					compact
				/>
				<div className='flex flex-col items-end gap-1'>
					<span
						className={`inline-flex items-center px-1.5 py-0.5 rounded-md text-[10px] font-medium border ${ui.badgeColor}`}
					>
						{t(ui.statusLabel)}
					</span>
				</div>
			</div>

			{/* Tilt data */}
			<div className='grid grid-cols-2 gap-1 mb-1.5'>
				<div className='bg-muted/30 rounded-md px-1.5 py-1'>
					<span className='text-[12px] font-medium text-foreground mr-2'>
						X:
					</span>
					<span className='text-xs font-mono font-semibold text-foreground'>
						{node.isOnline ? `${node.x > 0 ? '+' : ''}${node.x}°` : '—'}
					</span>
				</div>
				<div className='bg-muted/30 rounded-md px-1.5 py-1'>
					<span className='text-[12px] font-medium text-foreground mr-2'>
						Y:
					</span>
					<span className='text-xs font-mono font-semibold text-foreground'>
						{node.isOnline ? `${node.y > 0 ? '+' : ''}${node.y}°` : '—'}
					</span>
				</div>
			</div>

			{/* Last seen */}
			<div className='flex items-center gap-1 text-[10px] text-muted-foreground'>
				<MapPinned className='w-3.5 h-3.5' />
				<span className='font-medium'>
					{formatNodeLocation(
						node.installedLocation,
						node.installedLocationTitle,
						t('verticalNodes.nodeCard.position'),
					)}
				</span>
			</div>
		</div>
	)
}
