import { AnimatePresence, motion } from 'framer-motion'

import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select'
import {
	BuildingImagePreviewCard,
	ImageCarouselDialog,
} from '@/features/admin/components/BuildingImageComponents'
import { getAssetUrl } from '@/lib/getAssetUrl'
import gangformImg from '@/public/gangform.png'
import angleImg from '@/public/pikechondo.png'
import doorImg from '@/public/pikechondochuribmun.png'
import { SelectGroup } from '@radix-ui/react-select'
import { t } from 'i18next'
import { Building2, Link2 } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

import NodeTypeCard from '../../../components/NodeTypeCard'
import {
	AssignGatewayDialog,
	AssignWorkerDialog,
	BuildingImagesUploadDialog,
} from '../components/BuildingActionComponents'
import { BuildingsList } from '../components/BuildingsList'
import { WeatherWidget } from '../components/WeatherWidget'
import { useManagerBuildingsPage } from '../hooks/usemanagerCompany'

const NODE_TYPES = [
	{
		type: 'gangform_node',
		label: 'dashboard.nodeTypes.verticalNode.title',
		description: 'dashboard.nodeTypes.verticalNode.description',
		image: gangformImg,
		active: true,
		route: '/manager/buildings/:buildingId/gangform-nodes',
	},
	{
		type: 'angle_node',
		label: 'dashboard.nodeTypes.angleNode.title',
		description: 'dashboard.nodeTypes.angleNode.description',
		image: angleImg,
		active: true,
		route: '/manager/buildings/:buildingId/angle-nodes',
	},
	{
		type: 'door_node',
		label: 'dashboard.nodeTypes.scaffoldNode.title',
		description: 'dashboard.nodeTypes.scaffoldNode.description',
		image: doorImg,
		active: true,
		route: '/manager/buildings/:buildingId/scaffold-nodes',
	},
]

export default function BuildingsPage() {
	const location = useLocation()
	const navigate = useNavigate()

	const initialBuildingId = location.state?.initialBuildingId as
		| string
		| undefined

	const { data, isLoading, isError } = useManagerBuildingsPage()

	const buildings = useMemo(() => data?.buildingsList || [], [data])

	const [selectedBuildingId, setSelectedBuildingId] = useState('')

	const [carouselModal, setCarouselModal] = useState<{
		isOpen: boolean
		images: string[]
		title: string
		initialIndex: number
	}>({ isOpen: false, images: [], title: '', initialIndex: 0 })

	const openCarousel = (images: string[], title: string, index = 0) => {
		setCarouselModal({ isOpen: true, images, title, initialIndex: index })
	}

	const closeCarousel = () => {
		setCarouselModal(prev => ({ ...prev, isOpen: false }))
	}

	useEffect(() => {
		if (selectedBuildingId) return

		if (initialBuildingId) {
			setSelectedBuildingId(initialBuildingId)
			return
		}

		if (buildings.length > 0) {
			setSelectedBuildingId(buildings[0]._id)
		}
	}, [buildings, initialBuildingId, selectedBuildingId])

	const selectedBuilding =
		buildings.find(building => building._id === selectedBuildingId) ||
		buildings[0]

	const planImageKeys = selectedBuilding?.buildingPlanImage || []
	const readyImageKeys = selectedBuilding?.buildingRealImage || []

	const planImageUrls = planImageKeys.map(getAssetUrl)
	const readyImageUrls = readyImageKeys.map(getAssetUrl)

	const getNodeTypeCount = (nodeType: string) => {
		const stats = selectedBuilding?.statistics

		if (!stats) return 0

		switch (nodeType) {
			case 'door_node':
				return stats.doorNodeCount || 0

			case 'angle_node':
				return stats.angleNodeCount || 0

			case 'gangform_node':
				return stats.gangformNodeCount || 0

			default:
				return 0
		}
	}

	const nodeTypesWithCount = NODE_TYPES.map(nt => {
		const count = getNodeTypeCount(nt.type)

		return {
			...nt,
			count,
			active: nt.active && count > 0,
		}
	})

	const handleNodeTypeClick = (
		nodeType: (typeof nodeTypesWithCount)[number],
	) => {
		if (!selectedBuilding?._id || !nodeType.active) return

		const path = nodeType.route.replace(':buildingId', selectedBuilding._id)

		navigate(path, {
			state: {
				buildingId: selectedBuilding._id,
				buildingName: selectedBuilding.title,
				nodeType: nodeType.type,
			},
		})
	}

	if (isLoading) {
		return (
			<div className='flex h-full items-center justify-center'>
				<p className='text-sm text-muted-foreground'>Loading buildings...</p>
			</div>
		)
	}

	if (isError) {
		return (
			<div className='flex h-full items-center justify-center'>
				<p className='text-sm text-destructive'>
					Failed to load buildings data
				</p>
			</div>
		)
	}

	if (!selectedBuilding) {
		return (
			<div className='flex h-full items-center justify-center'>
				<p className='text-sm text-muted-foreground'>No building data found</p>
			</div>
		)
	}

	return (
		<div className='flex h-full overflow-hidden'>
			{/* Buildings Sidebar - Desktop */}
			<aside className='w-72 h-[90vh] border-r border-border bg-card/30 flex-col hidden md:flex '>
				<div className='p-4 border-b border-border shrink-0'>
					<h2 className='font-semibold text-foreground'>
						{t('dashboard.buildingsScrollbar.title')}
					</h2>
					<p className='text-xs text-muted-foreground mt-0.5'>
						{t('dashboard.buildingsScrollbar.subtitle')}
					</p>
				</div>
				<ScrollArea className='flex-1 h-3/4 overflow-visible'>
					<BuildingsList
						buildings={buildings.map(building => ({
							id: building._id,
							name: building.title,
							location: building.address || '위치 정보 없음',
							alerts: 0,
							...building,
						}))}
						selectedBuildingId={selectedBuildingId}
						onSelect={setSelectedBuildingId}
					/>
				</ScrollArea>
			</aside>
			{/* Main Content */}
			<main className='flex-1 flex flex-col h-full overflow-hidden'>
				{/* Mobile Building Selector */}
				<div className='md:hidden p-4 border-b border-border shrink-0'>
					<label className='text-xs text-muted-foreground mb-1.5 block'>
						{t('dashboard.buildingsScrollbar.mobileAction')}
					</label>
					<Select
						value={selectedBuildingId}
						onValueChange={setSelectedBuildingId}
					>
						<SelectTrigger className='w-full'>
							<SelectValue>
								<div className='flex items-center gap-2'>
									<Building2 className='h-4 w-4 text-muted-foreground' />
									<span>{selectedBuilding.title}</span>
								</div>
							</SelectValue>
						</SelectTrigger>
						<SelectContent>
							<SelectGroup>
								{buildings.map(building => (
									<SelectItem
										key={building._id}
										value={building._id}
										className='border-card-foreground focus:bg-primary/10 focus:text-primary data-[highlighted]:primary/10 data-[state=checked]:bg-primary/10 data-[state=checked]:text-primary'
									>
										<div className='flex items-center justify-between w-full '>
											<div>
												<div className='font-medium'>{building.title}</div>
												<div className='text-xs text-muted-foreground'>
													{building.address}
												</div>
											</div>

											<span className='ml-2 bg-destructive/20 text-destructive text-xs px-1.5 py-0.5 rounded'>
												{building.statistics.totalNodesCount}
											</span>
										</div>
									</SelectItem>
								))}
							</SelectGroup>
						</SelectContent>
					</Select>
				</div>

				{/* Scrollable Content */}
				<ScrollArea className='flex-1'>
					<div className='p-4 lg:p-6'>
						<div className='max-w-4xl mx-auto'>
							<AnimatePresence mode='wait'>
								<motion.div
									key={selectedBuildingId}
									initial={{ opacity: 0, y: 10 }}
									animate={{ opacity: 1, y: 0 }}
									exit={{ opacity: 0, y: -10 }}
									transition={{ duration: 0.3 }}
								>
									{/* Header - Hidden on mobile since we have the top bar */}
									<div className='mb-8 hidden md:flex md:items-start md:justify-between md:gap-6'>
										{/* Left: Logo + Building info */}
										<div className='flex items-start gap-4'>
											{/* Company Logo */}
											<div
												onClick={() =>
													openCarousel(
														readyImageUrls.length ? readyImageUrls : [''],
														`${selectedBuilding.title} — Ready View`,
													)
												}
												className='w-40 h-20 rounded-xl border border-border bg-card flex items-center justify-center overflow-hidden shrink-0'
											>
												<img
													src={readyImageUrls[0] || ''}
													alt={`${selectedBuilding.title} ready image`}
													className='w-full h-full object-cover'
													onError={e => {
														e.currentTarget.style.display = 'none'
													}}
												/>

												{!readyImageUrls[0] && (
													<Building2 className='h-10 w-10 text-muted-foreground' />
												)}
											</div>

											{/* Building name + location */}
											<div>
												<div className='flex items-center gap-2 text-muted-foreground text-sm mb-1'>
													<Building2 className='h-4 w-4' />
													<span>
														{selectedBuilding.address || '위치 정보 없음'}
													</span>
												</div>
												<h1 className='text-2xl lg:text-3xl font-bold text-foreground'>
													{selectedBuilding.title}
												</h1>
												<p className='text-sm text-muted-foreground mt-1'>
													{t('dashboard.header.subtitle')}
												</p>
											</div>
										</div>

										{/* Right: Weather grid */}
										<WeatherWidget />
									</div>

									{/* Actions Section */}
									<div className='bg-card border border-border rounded-xl p-4 mb-6'>
										<div className='flex md:items-center justify-between max-sm:flex-col'>
											<div>
												<h2 className='font-semibold text-foreground'>
													빠른 작업
												</h2>
												<p className='text-xs text-muted-foreground mt-0.5'>
													회사 관리 작업을 수행하세요
												</p>
											</div>
											<div className='grid grid-cols-5 max-sm:grid-cols-2 gap-2'>
												<BuildingImagesUploadDialog
													buildingId={selectedBuilding._id}
													buildingName={selectedBuilding.title}
													triggerText='Plan images'
													title='Building plan images'
													imageType='plan'
													currentImageCount={planImageKeys.length}
												/>
												<BuildingImagesUploadDialog
													buildingId={selectedBuilding._id}
													buildingName={selectedBuilding.title}
													triggerText='Ready images'
													title='Building Ready images'
													imageType='ready'
													currentImageCount={readyImageKeys.length}
												/>

												<AssignGatewayDialog
													buildingId={selectedBuilding._id}
													buildingName={selectedBuilding.title}
												/>
												<AssignWorkerDialog
													buildingId={selectedBuilding._id}
													buildingName={selectedBuilding.title}
												/>

												<Button
													type='button'
													variant='default'
													size='sm'
													className='gap-2 shrink-0 max-sm:col-span-2'
													onClick={() => navigate(`/manager/devices`)}
												>
													<Link2 className='h-4 w-4' />
													노드 등록
												</Button>
											</div>
										</div>
									</div>

									{/* Stats bar */}
									<div className='grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8'>
										{[
											{
												label: 'Total Nodes',
												value:
													selectedBuilding.statistics?.totalNodesCount || 0,
												accent: 'text-foreground',
											},
											{
												label: 'Online',
												value:
													selectedBuilding.statistics?.onlineNodesCount || 0,
												accent: 'text-green-500',
											},
											{
												label: 'Gateways',
												value:
													selectedBuilding.statistics?.totalGatewaysCounts || 0,
												accent: 'text-blue-500',
											},
											{
												label: 'Workers',
												value:
													selectedBuilding.statistics?.totalWorkersCount || 0,
												accent: 'text-amber-500',
											},
										].map((stat, i) => (
											<div
												key={i}
												className='bg-card/50 border border-border rounded-xl p-4 text-center'
											>
												<p
													className={`text-xl lg:text-2xl font-bold ${stat.accent}`}
												>
													{stat.value}
												</p>
												<p className='text-xs text-muted-foreground mt-0.5'>
													{stat.label}
												</p>
											</div>
										))}
									</div>

									{/* Node type cards */}
									<h2 className='text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4'>
										{t('dashboard.nodeTypes.title')}
									</h2>
									<div className='grid grid-cols-1 sm:grid-cols-3 gap-4'>
										{nodeTypesWithCount.map(nt => (
											<NodeTypeCard
												key={nt.type}
												type={nt.type}
												label={t(nt.label)}
												description={t(nt.description)}
												image={nt.image}
												active={nt.active}
												route={nt.route.replace(
													':buildingId',
													selectedBuilding._id,
												)}
												count={nt.count}
												onClick={() => handleNodeTypeClick(nt)}
											/>
										))}
									</div>

									{/* Building Images */}
									<h2 className='text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4 mt-8'>
										{t('dashboard.buildingImages.title')}
									</h2>
									<div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
										<BuildingImagePreviewCard
											images={planImageUrls}
											fallbackImage={''}
											title={t('dashboard.buildingImages.planImage.title')}
											subtitle={t(
												'dashboard.buildingImages.planImage.subtitle',
											)}
											badge='Plan'
											onImageClick={i =>
												openCarousel(
													planImageUrls.length ? planImageUrls : [],
													`${selectedBuilding.title} — Plan View`,
													i,
												)
											}
										/>
										<BuildingImagePreviewCard
											images={readyImageUrls}
											fallbackImage={''}
											title={t('dashboard.buildingImages.readyImage.title')}
											subtitle={t(
												'dashboard.buildingImages.readyImage.subtitle',
											)}
											badge='Ready'
											onImageClick={i =>
												openCarousel(
													readyImageUrls.length ? readyImageUrls : [],
													`${selectedBuilding.title} — Ready View`,
													i,
												)
											}
										/>
									</div>
								</motion.div>
							</AnimatePresence>
						</div>
					</div>
				</ScrollArea>
			</main>
			{/* Image Modal */}
			<ImageCarouselDialog
				isOpen={carouselModal.isOpen}
				onClose={closeCarousel}
				images={carouselModal.images}
				title={carouselModal.title}
				initialIndex={carouselModal.initialIndex}
			/>
		</div>
	)
}
