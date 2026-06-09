import { Button } from '@/components/ui/button'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuRadioGroup,
	DropdownMenuRadioItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
	HoverCard,
	HoverCardContent,
	HoverCardTrigger,
} from '@/components/ui/hover-card'
import {
	GatewayAlarmSetting,
	UpdateBuildingAlarmLevelPayload,
} from '@/features/admin/types/building.types'
import { Gateway } from '@/features/admin/types/gateway.types'
import { NodeTypes } from '@/features/admin/types/node.types'
import { cn } from '@/lib/utils'
import { Check, ChevronDown } from 'lucide-react'
import { AlarmLevels } from './AlarmLevelSetting'

type Props = {
	gateways: Gateway[]
	settings: GatewayAlarmSetting[]
	buildingId: string
	alarmType: NodeTypes
	alarmLevels: AlarmLevels
	selectedGatewayId: string
	isSaving?: boolean
	onSelectGateway: (gatewayId: string) => void
	onToggleGateway: (payload: UpdateBuildingAlarmLevelPayload) => void
}

function getGatewayId(gateway: Gateway & { id?: string }) {
	return gateway._id || gateway.id || ''
}

function getSettingPath(alarmType: NodeTypes) {
	return alarmType === 'angle_node' ? 'angle' : 'vertical'
}

function isGatewayAlarmEnabled(
	settings: GatewayAlarmSetting[],
	gatewayId: string,
	alarmType: NodeTypes,
) {
	const setting = settings.find(item => String(item.gatewayId) === gatewayId)
	if (!setting) return false

	return Boolean(setting[getSettingPath(alarmType)]?.alarmEnabled)
}

export default function GatewayAlarmControls({
	gateways,
	settings,
	buildingId,
	alarmType,
	alarmLevels,
	selectedGatewayId,
	isSaving,
	onSelectGateway,
	onToggleGateway,
}: Props) {
	if (!gateways.length) return null

	const selectedGateway = gateways.find(
		gateway => getGatewayId(gateway) === selectedGatewayId,
	)
	const hasSelectedGateway = Boolean(selectedGateway)
	const selectedGatewayEnabled =
		selectedGateway && selectedGatewayId !== 'all'
			? isGatewayAlarmEnabled(settings, selectedGatewayId, alarmType)
			: false
	const toggleDisabled = !hasSelectedGateway || Boolean(isSaving)
	const gatewayButtonLabel = selectedGateway
		? selectedGateway.serialNumber || selectedGatewayId
		: 'Gateways'

	const updateSelectedGateway = (enabled: boolean) => {
		if (!selectedGateway || toggleDisabled) return

		onToggleGateway({
			gatewayId: selectedGatewayId,
			enabled,
			buildingId,
			alarmType,
			levels: alarmLevels,
		})
	}

	return (
		<div className='flex shrink-0 items-center gap-1.5'>
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button
						type='button'
						variant='ghost'
						size='sm'
						className='h-7 max-w-36 border border-transparent bg-accent text-xs text-accent-foreground hover:bg-accent/90'
					>
						<span className='truncate'>{gatewayButtonLabel}</span>
						<ChevronDown className='h-3.5 w-3.5' />
					</Button>
				</DropdownMenuTrigger>

				<DropdownMenuContent align='start' className='w-52'>
					<DropdownMenuItem
						onClick={() => onSelectGateway('all')}
						className='text-xs'
					>
						<span className='flex h-4 w-4 items-center justify-center'>
							{selectedGatewayId === 'all' ? (
								<Check className='h-3.5 w-3.5' />
							) : null}
						</span>
						All gateways
					</DropdownMenuItem>

					<DropdownMenuSeparator />

					<DropdownMenuRadioGroup
						value={hasSelectedGateway ? selectedGatewayId : ''}
						onValueChange={onSelectGateway}
					>
						{gateways.map(gateway => {
							const gatewayId = getGatewayId(gateway)

							return (
								<DropdownMenuRadioItem
									key={gatewayId}
									value={gatewayId}
									className='text-xs'
								>
									<span className='truncate'>
										{gateway.serialNumber || gatewayId}
									</span>
								</DropdownMenuRadioItem>
							)
						})}
					</DropdownMenuRadioGroup>
				</DropdownMenuContent>
			</DropdownMenu>

			<div className='flex shrink-0 items-center gap-1.5'>
				<HoverCard openDelay={200} closeDelay={100}>
					<HoverCardTrigger asChild>
						<span className='inline-flex'>
							<button
								type='button'
								role='switch'
								aria-checked={selectedGatewayEnabled}
								aria-label='Toggle selected gateway alarm'
								disabled={toggleDisabled}
								onClick={() => updateSelectedGateway(!selectedGatewayEnabled)}
								className={cn(
									'relative inline-flex h-7 w-14 shrink-0 items-center rounded-full border transition-colors disabled:cursor-not-allowed',
									selectedGatewayEnabled
										? 'bg-primary'
										: 'border-border bg-muted-foreground/20',
								)}
							>
								<span
									aria-hidden='true'
									className={cn(
										'pointer-events-none h-5 w-5 rounded-full border-border bg-background shadow-sm transition-transform',
										selectedGatewayEnabled ? 'translate-x-8' : 'translate-x-1',
									)}
								/>
							</button>
						</span>
					</HoverCardTrigger>
					<HoverCardContent
						side='right'
						align='center'
						sideOffset={8}
						className='w-48 rounded-md p-2 text-xs leading-snug text-muted-foreground'
					>
						Turn alarm sending on or off for the selected gateway.
					</HoverCardContent>
				</HoverCard>

				<span className='text-sm font-medium text-muted-foreground'>
					ON/OFF Gateway alarm
				</span>
			</div>
		</div>
	)
}
