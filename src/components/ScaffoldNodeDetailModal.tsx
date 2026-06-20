'use client'

import SwitchButton from '@/components/ui/switch-button'
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog'
import {
	HoverCard,
	HoverCardContent,
	HoverCardTrigger,
} from '@/components/ui/hover-card'
import { GatewayRef, ScaffoldingNode } from '@/features/admin/types/node.types'
import { formatNodeLocation } from '@/features/admin/utils/format-node-location'
import { getAssetUrl } from '@/lib/getAssetUrl'
import { Battery, DoorClosed, DoorOpen, MapPinned, Wifi, WifiOff } from 'lucide-react'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'

type Props = {
	isOpen: boolean
	onClose: () => void
	node: ScaffoldingNode | null
	planImageUrls?: string[]
	faultFilter?: {
		enabled: boolean
		isSaving?: boolean
		onToggle: (enabled: boolean) => void
	}
}

function getGatewayLabel(gatewayId: GatewayRef) {
	if (!gatewayId) return '-'
	if (typeof gatewayId === 'string') return gatewayId
	return gatewayId.serialNumber || gatewayId._id
}

function formatDate(value?: string | null) {
	if (!value) return '-'
	return new Date(value).toLocaleString()
}

export default function ScaffoldNodeDetailModal({
	isOpen,
	onClose,
	node,
	planImageUrls = [],
	faultFilter,
}: Props) {
	const { t } = useTranslation()

	const nodeLocation =
		node?.installedLocation && typeof node.installedLocation !== 'string'
			? node.installedLocation
			: null

	const selectedPlanImage = useMemo(() => {
		if (!planImageUrls.length) return ''
		const index = nodeLocation?.planImageIndex ?? 0
		return getAssetUrl(planImageUrls[index] || planImageUrls[0])
	}, [nodeLocation?.planImageIndex, planImageUrls])

	const isOpenDoor = node?.doorState === 1
	const isOnline = node?.status !== 'offline'

	return (
		<Dialog open={isOpen} onOpenChange={open => !open && onClose()}>
			<DialogContent className='max-w-[92vw] w-[92vw] h-[86vh] p-0 overflow-hidden'>
				<DialogHeader className='px-5 py-4 border-b'>
					<DialogTitle>{node ? `Node #${node.number}` : 'Node'}</DialogTitle>
				</DialogHeader>

				{node && (
					<div className='grid h-[calc(86vh-73px)] grid-cols-1 md:grid-cols-[30%_70%] min-h-0'>
						<aside className='border-r p-5 overflow-y-auto bg-muted/10'>
							<div className='flex items-center gap-3 mb-5'>
								<div
									className={`flex h-12 w-12 items-center justify-center rounded-lg ${
										isOpenDoor
											? 'bg-gss-danger/10 text-gss-danger'
											: 'bg-gss-safe/10 text-gss-safe'
									}`}
								>
									{isOpenDoor ? (
										<DoorOpen className='h-6 w-6' />
									) : (
										<DoorClosed className='h-6 w-6' />
									)}
								</div>
								<div>
									<p className='text-sm font-semibold text-foreground'>
										{isOpenDoor ? 'Door Open' : 'Door Closed'}
									</p>
									<p className='text-xs text-muted-foreground'>
										{node.nodeType}
									</p>
								</div>
							</div>

							<div className='space-y-3 text-sm'>
								<div className='rounded-lg border bg-background/70 p-3'>
									<p className='text-xs text-muted-foreground'>Gateway</p>
									<p className='font-medium text-foreground'>
										{getGatewayLabel(node.gatewayId)}
									</p>
								</div>
								<div className='grid grid-cols-2 gap-2'>
									<div className='rounded-lg border bg-background/70 p-3'>
										<p className='text-xs text-muted-foreground'>Battery</p>
										<p className='mt-1 flex items-center gap-1.5 font-medium'>
											<Battery className='h-4 w-4 text-gss-safe' />
											{isOnline ? `${node.batteryLevel}%` : '-'}
										</p>
									</div>
									<div className='rounded-lg border bg-background/70 p-3'>
										<p className='text-xs text-muted-foreground'>Status</p>
										<p className='mt-1 flex items-center gap-1.5 font-medium'>
											{isOnline ? (
												<Wifi className='h-4 w-4 text-gss-safe' />
											) : (
												<WifiOff className='h-4 w-4 text-gss-offline' />
											)}
											{node.status}
										</p>
									</div>
								</div>
								<div className='rounded-lg border bg-background/70 p-3'>
									<p className='text-xs text-muted-foreground'>Installed location</p>
									<p className='mt-1 flex items-start gap-1.5 font-medium'>
										<MapPinned className='mt-0.5 h-4 w-4 shrink-0 text-muted-foreground' />
										<span>
											{formatNodeLocation(
												node.installedLocation,
												node.installedLocationTitle,
											)}
										</span>
									</p>
								</div>
								<div className='rounded-lg border bg-background/70 p-3'>
									<p className='text-xs text-muted-foreground'>Last seen</p>
									<p className='font-medium text-foreground'>
										{formatDate(node.lastSeenAt || node.updatedAt)}
									</p>
								</div>
							</div>

							{faultFilter && (
								<div className='mt-5 flex items-center justify-between rounded-lg border bg-background/70 p-3'>
									<div>
										<p className='text-sm font-medium text-foreground'>
											{t('nodePages.controls.faultFilterLabel')}
										</p>
										<p className='text-xs text-muted-foreground'>
											{t('nodePages.controls.faultFilterDescription')}
										</p>
									</div>
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
											side='top'
											align='center'
											className='w-56 rounded-md p-2 text-xs leading-snug text-muted-foreground'
										>
											{t('nodePages.controls.faultFilterDescription')}
										</HoverCardContent>
									</HoverCard>
								</div>
							)}
						</aside>

						<main className='min-h-0 bg-muted/20 p-4'>
							<div className='flex h-full items-center justify-center overflow-hidden rounded-lg border bg-background'>
								{selectedPlanImage ? (
									<div className='relative max-h-full max-w-full'>
										<img
											src={selectedPlanImage}
											alt='Node installed location'
											className='max-h-[calc(86vh-105px)] max-w-full object-contain'
											draggable={false}
										/>
										{nodeLocation?.xPercent != null &&
											nodeLocation?.yPercent != null && (
												<div
													className='absolute flex h-10 w-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 border-sky-700 bg-sky-400 text-sm font-bold text-white shadow-md ring-4 ring-sky-300/50'
													style={{
														left: `${nodeLocation.xPercent}%`,
														top: `${nodeLocation.yPercent}%`,
													}}
												>
													{node.number}
												</div>
											)}
									</div>
								) : (
									<div className='text-sm text-muted-foreground'>
										도면 사진이 없습니다.
									</div>
								)}
							</div>
						</main>
					</div>
				)}
			</DialogContent>
		</Dialog>
	)
}
