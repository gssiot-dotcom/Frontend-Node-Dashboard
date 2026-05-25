import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { getErrorMessage } from '@/features/admin/components/DevicesCreateForms'
import {
	useAdminBuildingGateways,
	useAdminBuildingWorkers,
	useCreateAdminBuildingWorker,
	useUpdateAdminBuildingGateways,
	useUpdateAdminBuildingWorkers,
} from '@/features/admin/hooks/useBuildings'
import { useUploadBuildingImages } from '@/features/admin/hooks/useCompanies'
import {
	ImagePlus,
	Loader2,
	Plus,
	Search,
	Upload,
	UserPlus,
	Wifi,
	X,
} from 'lucide-react'
import { useEffect, useRef, useState, type ChangeEvent } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { Label } from './ui/label'

interface Gateway {
	id: string
	gw_number: string
	status: 'online' | 'offline' | 'warning'
	assignedBuildingId: string | null
}

// ─── Shared helpers ───────────────────────────────────────────────────────────

function GatewayStatusDot({ status }: { status: Gateway['status'] }) {
	const color =
		status === 'online'
			? 'bg-emerald-500'
			: status === 'warning'
				? 'bg-amber-500'
				: 'bg-muted-foreground'
	const label =
		status === 'online' ? '온라인' : status === 'warning' ? '경고' : '오프라인'
	return (
		<span className='inline-flex items-center gap-1 text-xs text-muted-foreground'>
			<span className={`w-1.5 h-1.5 rounded-full ${color}`} />
			{label}
		</span>
	)
}

// ─── AssignWorkerDialog ───────────────────────────────────────────────────────

const initialCreateWorkerForm = {
	name: '',
	email: '',
	phone: '',
	password: '',
	passwordConfirm: '',
}

export function AssignWorkerDialog({
	buildingId,
	buildingName,
}: {
	buildingId: string
	buildingName: string
}) {
	const [open, setOpen] = useState(false)
	const [mode, setMode] = useState<'list' | 'create'>('list')
	const [search, setSearch] = useState('')
	const [selectedIds, setSelectedIds] = useState<string[]>([])
	const [createForm, setCreateForm] = useState(initialCreateWorkerForm)
	const [createError, setCreateError] = useState('')

	const {
		data: workers = [],
		isLoading,
		isError,
	} = useAdminBuildingWorkers({
		buildingId,
		enabled: open,
	})

	const updateWorkersMutation = useUpdateAdminBuildingWorkers(buildingId)
	const createWorkerMutation = useCreateAdminBuildingWorker(buildingId)

	useEffect(() => {
		if (!open) return

		setSelectedIds(
			workers.filter(worker => worker.checked).map(worker => worker._id),
		)
	}, [workers, open])

	const filtered = workers.filter(
		worker =>
			worker.name.toLowerCase().includes(search.toLowerCase()) ||
			worker.email.toLowerCase().includes(search.toLowerCase()) ||
			worker.phone?.toLowerCase().includes(search.toLowerCase()),
	)

	const toggle = (id: string) => {
		setSelectedIds(prev =>
			prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id],
		)
	}

	const initialSelectedIds = workers
		.filter(worker => worker.checked)
		.map(worker => worker._id)

	const isDirty =
		JSON.stringify([...selectedIds].sort()) !==
		JSON.stringify([...initialSelectedIds].sort())

	const handleSave = async () => {
		await updateWorkersMutation.mutateAsync(selectedIds)
		setOpen(false)
	}

	const handleChangeCreateForm = (
		key: keyof typeof initialCreateWorkerForm,
		value: string,
	) => {
		setCreateForm(prev => ({
			...prev,
			[key]: value,
		}))
		setCreateError('')
	}

	const resetCreateForm = () => {
		setCreateForm(initialCreateWorkerForm)
		setCreateError('')
	}

	const handleCreateWorker = async () => {
		if (
			!createForm.name ||
			!createForm.email ||
			!createForm.phone ||
			!createForm.password ||
			!createForm.passwordConfirm
		) {
			setCreateError('모든 필드를 입력해주세요.')
			return
		}

		if (createForm.password !== createForm.passwordConfirm) {
			setCreateError('비밀번호가 일치하지 않습니다.')
			return
		}

		try {
			setCreateError('')

			const createdWorker = await createWorkerMutation.mutateAsync({
				buildingId,
				payload: createForm,
			})

			setSelectedIds(prev =>
				prev.includes(createdWorker._id) ? prev : [...prev, createdWorker._id],
			)

			setSearch('')
			resetCreateForm()
			setMode('list')
		} catch (error) {
			setCreateError(getErrorMessage(error))
		}
	}

	const handleOpenChange = (next: boolean) => {
		setOpen(next)

		if (!next) {
			setMode('list')
			setSearch('')
			setSelectedIds([])
			resetCreateForm()
		}
	}

	const assignedCount = selectedIds.length

	return (
		<Dialog open={open} onOpenChange={handleOpenChange}>
			<DialogTrigger asChild>
				<Button size='sm' className='gap-2'>
					<UserPlus className='h-4 w-4' />
					작업자 배정
				</Button>
			</DialogTrigger>

			<DialogContent className='sm:max-w-md'>
				<DialogHeader>
					<DialogTitle>
						{mode === 'list' ? `작업자 배정 — ${buildingName}` : '작업자 생성'}
					</DialogTitle>
				</DialogHeader>

				{mode === 'list' && (
					<div className='space-y-4 mt-2'>
						<div className='flex gap-2'>
							<div className='relative flex-1'>
								<Search className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground' />
								<Input
									placeholder='이름 또는 이메일 검색...'
									value={search}
									onChange={e => setSearch(e.target.value)}
									className='pl-9'
								/>
							</div>

							<Button
								type='button'
								variant='outline'
								size='sm'
								className='gap-2 shrink-0'
								onClick={() => setMode('create')}
							>
								<Plus className='h-4 w-4' />
								생성
							</Button>
						</div>

						<div className='space-y-1.5 max-h-72 overflow-y-auto pr-1'>
							{isLoading && (
								<p className='text-sm text-muted-foreground text-center py-8'>
									작업자를 불러오는 중...
								</p>
							)}

							{isError && (
								<p className='text-sm text-destructive text-center py-8'>
									작업자 목록을 불러오지 못했습니다.
								</p>
							)}

							{!isLoading && !isError && filtered.length === 0 ? (
								<div className='text-center py-8'>
									<p className='text-sm text-muted-foreground'>
										검색 결과가 없습니다
									</p>
									<Button
										type='button'
										variant='outline'
										size='sm'
										className='mt-3 gap-2'
										onClick={() => setMode('create')}
									>
										<Plus className='h-4 w-4' />새 작업자 생성
									</Button>
								</div>
							) : (
								filtered.map(worker => {
									const isSelected = selectedIds.includes(worker._id)

									return (
										<label
											key={worker._id}
											className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors
												${
													isSelected
														? 'bg-primary/5 border border-primary/20'
														: 'bg-muted/30 border border-transparent hover:bg-muted/50'
												}`}
										>
											<Checkbox
												checked={isSelected}
												onCheckedChange={() => toggle(worker._id)}
											/>

											<div className='flex-1 min-w-0'>
												<p className='font-medium text-sm text-foreground'>
													{worker.name}
												</p>
												<p className='text-xs text-muted-foreground truncate'>
													{worker.email}
												</p>
												{worker.phone && (
													<p className='text-xs text-muted-foreground'>
														{worker.phone}
													</p>
												)}
											</div>

											{worker.checked && (
												<span className='text-xs text-primary shrink-0'>
													현재 배정
												</span>
											)}
										</label>
									)
								})
							)}
						</div>

						<div className='flex items-center justify-between pt-3 border-t border-border'>
							<p className='text-xs text-muted-foreground'>
								{assignedCount}명 배정됨
							</p>

							<Button
								size='sm'
								onClick={handleSave}
								disabled={!isDirty || updateWorkersMutation.isPending}
								className='gap-1.5'
							>
								{updateWorkersMutation.isPending ? (
									<>
										<Loader2 className='h-3.5 w-3.5 animate-spin' />
										저장 중...
									</>
								) : (
									'변경사항 저장'
								)}
							</Button>
						</div>
					</div>
				)}

				{mode === 'create' && (
					<div className='space-y-4 mt-4'>
						<div className='space-y-2'>
							<Label htmlFor='worker-name'>이름</Label>
							<Input
								id='worker-name'
								placeholder='예: 홍길동'
								value={createForm.name}
								onChange={e => handleChangeCreateForm('name', e.target.value)}
							/>
						</div>

						<div className='space-y-2'>
							<Label htmlFor='worker-email'>이메일</Label>
							<Input
								id='worker-email'
								type='email'
								placeholder='example@email.com'
								value={createForm.email}
								onChange={e => handleChangeCreateForm('email', e.target.value)}
							/>
						</div>

						<div className='space-y-2'>
							<Label htmlFor='worker-phone'>전화번호</Label>
							<Input
								id='worker-phone'
								placeholder='010-1234-5678'
								value={createForm.phone}
								onChange={e => handleChangeCreateForm('phone', e.target.value)}
							/>
						</div>

						<div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
							<div className='space-y-2'>
								<Label htmlFor='worker-password'>비밀번호</Label>
								<Input
									id='worker-password'
									type='password'
									value={createForm.password}
									onChange={e =>
										handleChangeCreateForm('password', e.target.value)
									}
								/>
							</div>

							<div className='space-y-2'>
								<Label htmlFor='worker-password-confirm'>비밀번호 확인</Label>
								<Input
									id='worker-password-confirm'
									type='password'
									value={createForm.passwordConfirm}
									onChange={e =>
										handleChangeCreateForm('passwordConfirm', e.target.value)
									}
								/>
							</div>
						</div>

						<div className='bg-muted/40 text-muted-foreground text-xs rounded-lg p-3'>
							생성되는 사용자는 Worker 유형으로만 생성됩니다.
						</div>

						{createError && (
							<div className='bg-destructive/10 text-destructive text-sm rounded-lg p-3'>
								{createError}
							</div>
						)}

						<div className='flex items-center justify-between pt-2 border-t border-border'>
							<Button
								type='button'
								variant='outline'
								size='sm'
								onClick={() => {
									resetCreateForm()
									setMode('list')
								}}
							>
								뒤로
							</Button>

							<Button
								type='button'
								size='sm'
								onClick={handleCreateWorker}
								disabled={createWorkerMutation.isPending}
							>
								{createWorkerMutation.isPending ? '생성 중...' : '작업자 생성'}
							</Button>
						</div>
					</div>
				)}
			</DialogContent>
		</Dialog>
	)
}

// ─── AssignGatewayDialog ──────────────────────────────────────────────────────

export function AssignGatewayDialog({
	buildingId,
	buildingName,
}: {
	buildingId: string
	buildingName: string
}) {
	const [open, setOpen] = useState(false)
	const [search, setSearch] = useState('')
	const [selectedIds, setSelectedIds] = useState<string[]>([])

	const {
		data: gateways = [],
		isLoading,
		isError,
	} = useAdminBuildingGateways({
		buildingId,
		enabled: open,
	})

	const updateGatewaysMutation = useUpdateAdminBuildingGateways(buildingId)

	useEffect(() => {
		if (!open) return

		setSelectedIds(
			gateways.filter(gateway => gateway.checked).map(gateway => gateway._id),
		)
	}, [gateways, open])

	const visible = gateways.filter(gateway =>
		gateway.serialNumber.toLowerCase().includes(search.toLowerCase()),
	)

	const toggle = (id: string) => {
		setSelectedIds(prev =>
			prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id],
		)
	}

	const initialSelectedIds = gateways
		.filter(gateway => gateway.checked)
		.map(gateway => gateway._id)

	const isDirty =
		JSON.stringify([...selectedIds].sort()) !==
		JSON.stringify([...initialSelectedIds].sort())

	const handleSave = async () => {
		await updateGatewaysMutation.mutateAsync(selectedIds)
		setOpen(false)
	}

	const handleOpenChange = (next: boolean) => {
		setOpen(next)

		if (!next) {
			setSearch('')
			setSelectedIds([])
		}
	}

	const assignedCount = selectedIds.length

	return (
		<Dialog open={open} onOpenChange={handleOpenChange}>
			<DialogTrigger asChild>
				<Button size='sm' variant='outline' className='gap-2'>
					<Plus className='h-4 w-4' />
					게이트웨이 배정
				</Button>
			</DialogTrigger>

			<DialogContent className='sm:max-w-md'>
				<DialogHeader>
					<DialogTitle>게이트웨이 배정 — {buildingName}</DialogTitle>
				</DialogHeader>

				<div className='space-y-4 mt-2'>
					<div className='relative'>
						<Search className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground' />
						<Input
							placeholder='게이트웨이 번호 검색...'
							value={search}
							onChange={e => setSearch(e.target.value)}
							className='pl-9'
						/>
					</div>

					<p className='text-xs text-muted-foreground bg-muted/40 rounded-lg px-3 py-2'>
						다른 건물에 배정된 게이트웨이는 표시되지 않습니다.
					</p>

					<div className='space-y-1.5 max-h-72 overflow-y-auto pr-1'>
						{isLoading && (
							<p className='text-sm text-muted-foreground text-center py-8'>
								게이트웨이를 불러오는 중...
							</p>
						)}

						{isError && (
							<p className='text-sm text-destructive text-center py-8'>
								게이트웨이 목록을 불러오지 못했습니다.
							</p>
						)}

						{!isLoading && !isError && visible.length === 0 ? (
							<p className='text-sm text-muted-foreground text-center py-8'>
								배정 가능한 게이트웨이가 없습니다
							</p>
						) : (
							visible.map(gw => {
								const isSelected = selectedIds.includes(gw._id)

								return (
									<label
										key={gw._id}
										className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors
											${
												isSelected
													? 'bg-primary/5 border border-primary/20'
													: 'bg-muted/30 border border-transparent hover:bg-muted/50'
											}`}
									>
										<Checkbox
											checked={isSelected}
											onCheckedChange={() => toggle(gw._id)}
										/>

										<div className='w-7 h-7 rounded-md bg-muted flex items-center justify-center flex-shrink-0'>
											<Wifi className='w-3.5 h-3.5 text-muted-foreground' />
										</div>

										<div className='flex-1 min-w-0'>
											<p className='font-mono font-medium text-sm text-foreground'>
												{gw.serialNumber}
											</p>
											<GatewayStatusDot status={gw.gatewayStatus} />
										</div>

										{gw.checked && (
											<span className='text-xs text-primary shrink-0'>
												현재 배정
											</span>
										)}
									</label>
								)
							})
						)}
					</div>

					<div className='flex items-center justify-between pt-3 border-t border-border'>
						<p className='text-xs text-muted-foreground'>
							{assignedCount}개 배정됨
						</p>

						<Button
							size='sm'
							onClick={handleSave}
							disabled={!isDirty || updateGatewaysMutation.isPending}
							className='gap-1.5'
						>
							{updateGatewaysMutation.isPending ? (
								<>
									<Loader2 className='h-3.5 w-3.5 animate-spin' />
									저장 중...
								</>
							) : (
								'변경사항 저장'
							)}
						</Button>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	)
}

// ─── UploadBuildingImages ──────────────────────────────────────────────────────

type BuildingImagesUploadDialogProps = {
	companyId?: string
	buildingId: string
	buildingName: string
	triggerText: string
	title: string
	imageType: 'plan' | 'ready'
	currentImageCount?: number
}

type BuildingImageItem = {
	id: string
	file: File
	previewUrl: string
}

export function BuildingImagesUploadDialog({
	companyId,
	buildingId,
	buildingName,
	triggerText,
	title,
	imageType,
	currentImageCount = 0,
}: BuildingImagesUploadDialogProps) {
	const MAX_IMAGES = 4

	const inputRef = useRef<HTMLInputElement | null>(null)

	const [open, setOpen] = useState(false)
	const [images, setImages] = useState<BuildingImageItem[]>([])

	const { mutateAsync: uploadBuildingImages, isPending: isUploading } =
		useUploadBuildingImages()

	const availableSlots = Math.max(MAX_IMAGES - currentImageCount, 0)
	const canUploadMore = images.length < availableSlots
	const selectedCount = images.length
	const totalCountAfterSelect = currentImageCount + selectedCount

	const resetImages = () => {
		setImages(prev => {
			prev.forEach(image => URL.revokeObjectURL(image.previewUrl))
			return []
		})

		if (inputRef.current) {
			inputRef.current.value = ''
		}
	}

	const handleOpenChange = (nextOpen: boolean) => {
		setOpen(nextOpen)

		if (!nextOpen) {
			resetImages()
		}
	}

	const handleUploadClick = () => {
		if (!canUploadMore || isUploading) return
		inputRef.current?.click()
	}

	const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
		const selectedFiles = Array.from(event.target.files || [])

		if (selectedFiles.length === 0) return
		if (!canUploadMore) return

		const allowedFiles = selectedFiles
			.filter(file => file.type.startsWith('image/'))
			.slice(0, availableSlots - images.length)

		if (allowedFiles.length === 0) {
			event.target.value = ''
			return
		}

		const nextImages: BuildingImageItem[] = allowedFiles.map(file => ({
			id: `${uuidv4()}-${file.name}`,
			file,
			previewUrl: URL.createObjectURL(file),
		}))

		setImages(prev => [...prev, ...nextImages])

		// 같은 파일을 다시 선택해도 onChange가 동작하도록 초기화
		event.target.value = ''
	}

	const removeImage = (id: string) => {
		setImages(prev => {
			const target = prev.find(image => image.id === id)

			if (target) {
				URL.revokeObjectURL(target.previewUrl)
			}

			return prev.filter(image => image.id !== id)
		})
	}

	const handleSave = async () => {
		if (!companyId) {
			console.error('companyId is required')
			return
		}

		if (images.length === 0) return

		try {
			await uploadBuildingImages({
				companyId,
				buildingId,
				imageType,
				files: images.map(image => image.file),
			})

			resetImages()
			setOpen(false)
		} catch (error) {
			console.error('Failed to upload building images:', error)
		}
	}

	useEffect(() => {
		return () => {
			images.forEach(image => URL.revokeObjectURL(image.previewUrl))
		}
	}, [images])

	return (
		<Dialog open={open} onOpenChange={handleOpenChange}>
			<DialogTrigger asChild>
				<Button size='sm' variant='outline' className='gap-2'>
					<ImagePlus className='h-4 w-4' />
					{triggerText}
				</Button>
			</DialogTrigger>

			<DialogContent className='sm:max-w-lg'>
				<DialogHeader>
					<DialogTitle>
						{title} — {buildingName}
					</DialogTitle>
				</DialogHeader>

				<div className='space-y-4 mt-2'>
					<p className='text-xs text-muted-foreground bg-muted/40 rounded-lg px-3 py-2'>
						최대 {MAX_IMAGES}장까지 이미지를 업로드할 수 있습니다.
						{currentImageCount > 0 && (
							<span className='ml-1'>현재 {currentImageCount}장 저장됨.</span>
						)}
					</p>

					<input
						ref={inputRef}
						type='file'
						accept='image/*'
						multiple
						className='hidden'
						onChange={handleFileChange}
					/>

					<div className='grid grid-cols-2 sm:grid-cols-4 gap-3'>
						{images.map(image => (
							<div
								key={image.id}
								className='relative aspect-square rounded-xl border border-border bg-muted/30 overflow-hidden group'
							>
								<img
									src={image.previewUrl}
									alt='Building upload preview'
									className='w-full h-full object-cover'
								/>

								<button
									type='button'
									onClick={() => removeImage(image.id)}
									disabled={isUploading}
									className='absolute top-2 right-2 w-7 h-7 rounded-full bg-background/90 border border-border flex items-center justify-center text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors disabled:opacity-60'
								>
									<X className='w-4 h-4' />
								</button>
							</div>
						))}

						{canUploadMore && (
							<button
								type='button'
								onClick={handleUploadClick}
								disabled={isUploading}
								className='aspect-square rounded-xl border border-dashed border-border bg-muted/20 hover:bg-muted/40 transition-colors flex flex-col items-center justify-center gap-2 text-muted-foreground hover:text-foreground disabled:opacity-60'
							>
								<div className='w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center'>
									<Upload className='w-5 h-5 text-primary' />
								</div>

								<span className='text-xs font-medium'>이미지 업로드</span>

								<span className='text-[11px] text-muted-foreground'>
									{totalCountAfterSelect}/{MAX_IMAGES}
								</span>
							</button>
						)}

						{availableSlots === 0 && (
							<div className='aspect-square rounded-xl border border-border bg-muted/20 flex items-center justify-center px-3 text-center'>
								<p className='text-xs text-muted-foreground'>
									이미 최대 {MAX_IMAGES}장이 저장되어 있습니다.
								</p>
							</div>
						)}
					</div>

					<div className='flex items-center justify-between pt-3 border-t border-border'>
						<p className='text-xs text-muted-foreground'>
							새 이미지 {selectedCount}장 선택됨 / 전체 {totalCountAfterSelect}/
							{MAX_IMAGES}장
						</p>

						<div className='flex items-center gap-2'>
							<Button
								type='button'
								size='sm'
								variant='outline'
								onClick={resetImages}
								disabled={selectedCount === 0 || isUploading}
							>
								초기화
							</Button>

							<Button
								type='button'
								size='sm'
								onClick={handleSave}
								disabled={
									!companyId ||
									selectedCount === 0 ||
									isUploading ||
									availableSlots === 0
								}
								className='gap-1.5'
							>
								{isUploading ? (
									<>
										<Loader2 className='h-3.5 w-3.5 animate-spin' />
										저장 중...
									</>
								) : (
									'이미지 저장'
								)}
							</Button>
						</div>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	)
}
