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
import SwitchButton from '@/components/ui/switch-button'
import {
	GatewayAlarmSetting,
	UpdateBuildingAlarmLevelPayload,
} from '@/features/admin/types/building.types'
import { Gateway } from '@/features/admin/types/gateway.types'
import { NodeTypes } from '@/features/admin/types/node.types'
import { Check, ChevronDown } from 'lucide-react'
import { useTranslation } from 'react-i18next'
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
	const { t } = useTranslation()

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
							<SwitchButton
								checked={selectedGatewayEnabled}
								disabled={toggleDisabled}
								ariaLabel='Toggle selected gateway alarm'
								onCheckedChange={updateSelectedGateway}
							/>
						</span>
					</HoverCardTrigger>
					<HoverCardContent
						side='right'
						align='center'
						sideOffset={8}
						className='w-48 rounded-md p-2 text-xs leading-snug text-muted-foreground'
					>
						{t('nodePages.controls.gatewayAlarmDescription')}
					</HoverCardContent>
				</HoverCard>

				<span className='text-sm font-medium text-muted-foreground'>
					ON/OFF Gateway alarm
				</span>
			</div>
		</div>
	)
}
