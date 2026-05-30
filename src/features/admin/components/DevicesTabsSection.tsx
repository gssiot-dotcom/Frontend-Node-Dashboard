import { AlertDialogHeader } from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { GATEWAY_TYPES } from '@/features/admin/types/gateway.types'
import { NODE_TYPES } from '@/features/admin/types/node.types'
import { Link2, Search } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
	useDeviceGatewaysQuery,
	useDeviceNodesQuery,
	useGatewayNodesQuery,
} from '../hooks/useDevice'
import { DeviceGateway } from '../types/device.types'

function getNodeTypeLabel(type: string) {
	return NODE_TYPES.find(t => t.value === type)?.label || type
}

function getGatewayTypeLabel(type: string) {
	return GATEWAY_TYPES.find(t => t.value === type)?.label || type
}

function getStatusBadge(status: string, t: any) {
	const styles: Record<string, string> = {
		active:
			'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
		inactive: 'bg-muted text-muted-foreground border-border',
		warning:
			'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
		unassigned: 'bg-slate-500/10 text-slate-500 border-slate-500/20',
	}
	return (
		<span
			className={`px-2 py-0.5 rounded-md text-xs font-medium border ${styles[status] || styles.inactive}`}
		>
			{t(`common.status.${status}`, status)}
		</span>
	)
}

function getAssignedBadge(isAssigned: boolean, t: any) {
	return (
		<span
			className={`px-2 py-0.5 rounded-md text-xs font-medium border ${
				isAssigned
					? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
					: 'bg-muted text-muted-foreground border-border'
			}`}
		>
			{isAssigned ? t('common.status.active') : t('common.status.inactive')}
		</span>
	)
}

function DevicesTabsSection() {
	const { t } = useTranslation()
	const [activeTab, setActiveTab] = useState('gateways')

	const [assignedNodesDialogOpen, setAssignedNodesDialogOpen] = useState(false)
	const [selectedGatewayForNodes, setSelectedGatewayForNodes] =
		useState<DeviceGateway | null>(null)

	const [nodeSearch, setNodeSearch] = useState('')
	const [gatewaySearch, setGatewaySearch] = useState('')

	const gatewaysQuery = useDeviceGatewaysQuery(gatewaySearch)
	const nodesQuery = useDeviceNodesQuery({
		search: nodeSearch,
	})

	const assignedNodesQuery = useGatewayNodesQuery(selectedGatewayForNodes?._id)

	const gateways = gatewaysQuery.data ?? []
	const nodes = nodesQuery.data ?? []

	const assignedNodesForGateway = assignedNodesQuery.data ?? []

	const openAssignedNodesDialog = (gateway: DeviceGateway) => {
		setSelectedGatewayForNodes(gateway)
		setAssignedNodesDialogOpen(true)
	}

	return (
		<>
			<Tabs value={activeTab} onValueChange={setActiveTab} className='w-full'>
				<TabsList className='grid w-full grid-cols-2 max-w-md'>
					<TabsTrigger value='gateways'>
						{t('pages.devices.table.gatewayList')}
					</TabsTrigger>
					<TabsTrigger value='nodes'>
						{t('pages.devices.table.nodeList')}
					</TabsTrigger>
				</TabsList>

				{/* Gateways Table Tab */}
				<TabsContent value='gateways' className='mt-6'>
					<div className='rounded-xl border border-border glass p-5 sm:p-6'>
						<div className='flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4'>
							<h3 className='font-semibold text-foreground'>
								{t('pages.devices.table.gatewayList')}
							</h3>
							<div className='relative w-full sm:w-64'>
								<Search className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground' />
								<Input
									placeholder={t('common.searchPlaceholder')}
									value={gatewaySearch}
									onChange={e => setGatewaySearch(e.target.value)}
									className='pl-9'
								/>
							</div>
						</div>

						{/* Mobile */}
						<div className='sm:hidden border border-border rounded-lg overflow-hidden'>
							{gateways.length === 0 ? (
								<p className='text-center text-muted-foreground py-8 text-sm'>
									{gatewaysQuery.isLoading
										? t('pages.devices.table.loading')
										: t('pages.devices.table.noResults')}
								</p>
							) : (
								gateways.map(gw => (
									<div
										key={gw._id}
										className='flex items-start gap-3 p-3 border-b border-border last:border-b-0'
									>
										<div className='flex-1 min-w-0 space-y-1.5'>
											<div className='flex items-center justify-between gap-2'>
												<span className='font-mono font-medium text-sm'>
													{gw.serialNumber}
												</span>
												{getAssignedBadge(!!gw.isAssigned, t)}
											</div>

											<div className='flex items-center gap-3 text-xs text-muted-foreground'>
												<span>{getGatewayTypeLabel(gw.gatewayType)}</span>
												<span
													className={`inline-flex items-center gap-1 ${
														gw.isOnline
															? 'text-emerald-600 dark:text-emerald-400'
															: ''
													}`}
												>
													<span
														className={`w-1.5 h-1.5 rounded-full ${gw.isOnline ? 'bg-emerald-500' : 'bg-muted-foreground'}`}
													/>
													{gw.isOnline
														? t('common.status.online')
														: t('common.status.offline')}
												</span>
											</div>

											<div className='flex flex-wrap gap-x-3 gap-y-0.5 text-xs text-muted-foreground'>
												{gw.companyName && <span>{gw.companyName}</span>}
												{gw.buildingName && <span>{gw.buildingName}</span>}
												{gw.installedLocation && (
													<span>{gw.installedLocation}</span>
												)}
											</div>
										</div>

										<Button
											variant='outline'
											size='sm'
											className='shrink-0'
											onClick={() => openAssignedNodesDialog(gw)}
										>
											<Link2 className='w-3.5 h-3.5' />
										</Button>
									</div>
								))
							)}
						</div>

						{/* Desktop */}
						<div className='hidden sm:block overflow-x-auto'>
							<Table>
								<TableHeader>
									<TableRow>
										<TableHead>{t('pages.devices.table.gatewayNumber')}</TableHead>
										<TableHead>{t('dashboard.table.type')}</TableHead>
										<TableHead>{t('pages.devices.table.assigned')}</TableHead>
										<TableHead>{t('pages.devices.table.companyName')}</TableHead>
										<TableHead>{t('pages.devices.table.buildingName')}</TableHead>
										<TableHead>{t('pages.devices.table.connection')}</TableHead>
										<TableHead>{t('pages.devices.table.zone')}</TableHead>
										<TableHead>{t('pages.devices.table.nodeAssignment')}</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{gateways.map(gw => (
										<TableRow key={gw._id}>
											<TableCell className='font-mono font-medium'>
												{gw.serialNumber}
											</TableCell>
											<TableCell className='text-sm'>
												{getGatewayTypeLabel(gw.gatewayType)}
											</TableCell>
											<TableCell>{getAssignedBadge(!!gw.isAssigned, t)}</TableCell>
											<TableCell className='text-sm'>
												{gw.companyName || '-'}
											</TableCell>
											<TableCell className='text-sm'>
												{gw.buildingName || '-'}
											</TableCell>
											<TableCell>
												<span
													className={`inline-flex items-center gap-1 text-xs ${gw.isOnline ? 'text-emerald-600 dark:text-emerald-400' : 'text-muted-foreground'}`}
												>
													<span
														className={`w-1.5 h-1.5 rounded-full ${gw.isOnline ? 'bg-emerald-500' : 'bg-muted-foreground'}`}
													/>
													{gw.isOnline
														? t('common.status.online')
														: t('common.status.offline')}
												</span>
											</TableCell>
											<TableCell className='text-sm text-muted-foreground'>
												{gw.installedLocation || '-'}
											</TableCell>
											<TableCell>
												<Button
													variant='outline'
													size='sm'
													className='gap-1.5'
													onClick={() => openAssignedNodesDialog(gw)}
												>
													<Link2 className='w-3.5 h-3.5' />
													{t('pages.devices.table.nodeAssignment')}
												</Button>
											</TableCell>
										</TableRow>
									))}
									{gateways.length === 0 && (
										<TableRow>
											<TableCell
												colSpan={8}
												className='text-center text-muted-foreground py-8'
											>
												{gatewaysQuery.isLoading
													? t('pages.devices.table.loading')
													: t('pages.devices.table.noResults')}
											</TableCell>
										</TableRow>
									)}
								</TableBody>
							</Table>
						</div>
					</div>
				</TabsContent>

				{/* Nodes Table Tab */}
				<TabsContent value='nodes' className='mt-6'>
					<div className='rounded-xl border border-border glass p-5 sm:p-6'>
						<div className='flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4'>
							<h3 className='font-semibold text-foreground'>
								{t('pages.devices.table.nodeList')}
							</h3>
							<div className='relative w-full sm:w-64'>
								<Search className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground' />
								<Input
									placeholder={t('common.searchPlaceholder')}
									value={nodeSearch}
									onChange={e => setNodeSearch(e.target.value)}
									className='pl-9'
								/>
							</div>
						</div>

						{/* Mobile */}
						<div className='sm:hidden border border-border rounded-lg overflow-hidden'>
							{nodes.length === 0 ? (
								<p className='text-center text-muted-foreground py-8 text-sm'>
									{nodesQuery.isLoading
										? t('pages.devices.table.loading')
										: t('pages.devices.table.noResults')}
								</p>
							) : (
								nodes.map(node => (
									<div
										key={node._id}
										className='flex items-start gap-3 p-3 border-b border-border last:border-b-0'
									>
										<div className='flex-1 min-w-0 space-y-1.5'>
											<div className='flex items-center justify-between gap-2'>
												<span className='font-mono font-medium text-sm'>
													{node.number}
												</span>
												{getStatusBadge(node.status, t)}
											</div>

											<div className='flex items-center gap-2 text-xs text-muted-foreground'>
												<span>{getNodeTypeLabel(node.nodeType)}</span>
												{getAssignedBadge(!!node.isAssigned, t)}
											</div>

											<div className='flex flex-wrap gap-x-3 gap-y-0.5 text-xs text-muted-foreground'>
												{node.gatewaySerialNumber && (
													<span className='font-mono'>
														{node.gatewaySerialNumber}
													</span>
												)}
												{node.companyName && <span>{node.companyName}</span>}
											</div>
										</div>
									</div>
								))
							)}
						</div>

						{/* Desktop */}
						<div className='hidden sm:block overflow-x-auto'>
							<Table>
								<TableHeader>
									<TableRow>
										<TableHead className='w-20'>
											{t('pages.devices.table.nodeNumber')}
										</TableHead>
										<TableHead>{t('pages.devices.table.nodeType')}</TableHead>
										<TableHead>{t('pages.devices.table.gateway')}</TableHead>
										<TableHead>{t('dashboard.table.status')}</TableHead>
										<TableHead>{t('pages.devices.table.assigned')}</TableHead>
										<TableHead>{t('pages.devices.table.companyName')}</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{nodes.map(node => (
										<TableRow key={node._id}>
											<TableCell className='font-mono font-medium'>
												{node.number}
											</TableCell>
											<TableCell className='text-sm'>
												{getNodeTypeLabel(node.nodeType)}
											</TableCell>
											<TableCell className='font-mono text-sm'>
												{node.gatewaySerialNumber || '-'}
											</TableCell>
											<TableCell>{getStatusBadge(node.status, t)}</TableCell>
											<TableCell>
												{getAssignedBadge(!!node.isAssigned, t)}
											</TableCell>
											<TableCell className='text-sm'>
												{node.companyName || '-'}
											</TableCell>
										</TableRow>
									))}
									{nodes.length === 0 && (
										<TableRow>
											<TableCell
												colSpan={6}
												className='text-center text-muted-foreground py-8'
											>
												{nodesQuery.isLoading
													? t('pages.devices.table.loading')
													: t('pages.devices.table.noResults')}
											</TableCell>
										</TableRow>
									)}
								</TableBody>
							</Table>
						</div>
					</div>
				</TabsContent>

				{/* Gateway-Node Registration Tab */}
			</Tabs>

			{/* Assigned Nodes Dialog */}

			<Dialog
				open={assignedNodesDialogOpen}
				onOpenChange={setAssignedNodesDialogOpen}
			>
				<DialogContent className='sm:max-w-md'>
					<AlertDialogHeader>
						<DialogTitle>
							{selectedGatewayForNodes?.serialNumber} -{' '}
							{t('pages.devices.table.assignedNodes')}
						</DialogTitle>
					</AlertDialogHeader>

					<div className='space-y-4 py-4'>
						<div className='border border-border rounded-lg max-h-72 overflow-y-auto'>
							{assignedNodesForGateway.length > 0 ? (
								assignedNodesForGateway.map(node => (
									<div
										key={node._id}
										className='flex items-center gap-3 px-3 py-3 hover:bg-muted/50 border-b border-border last:border-b-0'
									>
										<div className='w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0'>
											<Link2 className='w-4 h-4 text-primary' />
										</div>

										<div className='flex-1 min-w-0'>
											<p className='text-sm font-medium text-foreground'>
												{t('pages.devices.table.node', {
													number: node.number,
												})}
											</p>

											<p className='text-xs text-muted-foreground truncate'>
												{getNodeTypeLabel(node.nodeType)}
											</p>

											<p className='text-xs text-muted-foreground truncate'>
												{node.companyName || '-'}
											</p>
										</div>

										<div className='shrink-0'>
											{getStatusBadge(node.status, t)}
										</div>
									</div>
								))
							) : (
								<div className='p-6 text-center text-sm text-muted-foreground'>
									{assignedNodesQuery.isLoading
										? t('pages.devices.table.loading')
										: t('pages.devices.table.noAssignedNodes')}
								</div>
							)}
						</div>
					</div>
				</DialogContent>
			</Dialog>
		</>
	)
}

export default DevicesTabsSection
