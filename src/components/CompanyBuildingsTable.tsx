import { Building } from '@/features/admin/types/building.types'
import { cn } from '@/lib/utils'
import { Building2, MapPin } from 'lucide-react'

const statusColors = {
	active: 'bg-green-500/20 text-green-600',
	inactive: 'bg-amber-500/20 text-amber-600',
	paused: 'bg-muted text-muted-foreground',
}
const statusLabels = {
	active: '운영중',
	inactive: '비활성화',
	paused: '일시중지',
}

export function BuildingRowDesktop({
	building,
	isLast,
}: {
	building: Building
	isLast: boolean
}) {
	return (
		<tr
			className={cn(
				'hover:bg-muted/20 transition-colors',
				!isLast && 'border-b border-border',
			)}
		>
			<td className='px-4 py-3 font-medium text-foreground'>
				{building.title}
			</td>
			<td className='px-4 py-3'>
				<div className='flex items-center gap-1 text-muted-foreground text-xs'>
					<MapPin className='h-3 w-3 shrink-0' />
					<span className='truncate'>
						{building.address || '위치 정보 없음'}
					</span>
				</div>
			</td>
			<td className='px-4 py-3'>
				<span className='text-xs text-muted-foreground'>
					{building.buildingType}
				</span>
			</td>
			<td className='px-4 py-3'>
				<span
					className={cn(
						'text-xs px-2 py-0.5 rounded-full whitespace-nowrap',
						statusColors[building.buildingStatus],
					)}
				>
					{statusLabels[building.buildingStatus]}
				</span>
			</td>
		</tr>
	)
}

// Building Card Component for Mobile
export function BuildingCardMobile({ building }: { building: Building }) {
	return (
		<div className='p-4 border-b border-border last:border-b-0'>
			<div className='flex items-start justify-between gap-3 mb-2'>
				<h3 className='font-medium text-foreground text-sm leading-tight'>
					{building.title}
				</h3>
				<span
					className={cn(
						'text-[10px] px-2 py-0.5 rounded-full whitespace-nowrap shrink-0',
						statusColors[building.buildingStatus],
					)}
				>
					{statusLabels[building.buildingStatus]}
				</span>
			</div>
			<div className='space-y-1.5'>
				<div className='flex items-center gap-1.5 text-muted-foreground text-xs'>
					<MapPin className='h-3 w-3 shrink-0' />
					<span className='truncate'>
						{building.address || '위치 정보 없음'}
					</span>
				</div>
				<div className='flex items-center gap-1.5 text-muted-foreground text-xs'>
					<Building2 className='h-3 w-3 shrink-0' />
					<span>{building.buildingType}</span>
				</div>
			</div>
		</div>
	)
}
