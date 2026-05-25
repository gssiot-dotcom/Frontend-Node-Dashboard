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
import { Label } from '@/components/ui/label'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select'
import { getErrorMessage } from '@/features/admin/components/DevicesCreateForms'
import {
	useAdminCompanyBuildings,
	useCreateAdminBuilding,
	useUpdateCompanyBuildingStatuses,
} from '@/features/admin/hooks/useBuildings'
import {
	useCompanyMembers,
	useCreateCompanyMemberUser,
	useUpdateCompanyMemberStatuses,
} from '@/features/admin/hooks/useCompanies'
import {
	Building,
	CreateBuildingForm,
} from '@/features/admin/types/building.types'
import { CompanyUserType } from '@/features/admin/types/company.types'
import { MapPin, Plus, Search, UserPlus } from 'lucide-react'
import { useEffect, useState } from 'react'
import { CreateUserForm } from '../features/manager/types/index'

const initialCreateUserForm: CreateUserForm = {
	name: '',
	email: '',
	phone: '',
	userType: 'Manager',
	password: '',
	passwordConfirm: '',
}

export function AssignManagerDialog({
	companyId,
	companyName,
}: {
	companyId: string
	companyName: string
}) {
	const [open, setOpen] = useState(false)
	const [mode, setMode] = useState<'list' | 'create'>('list')

	const [searchQuery, setSearchQuery] = useState('')

	const [selectedMemberIds, setSelectedMemberIds] = useState<string[]>([])

	const [createForm, setCreateForm] = useState<CreateUserForm>(
		initialCreateUserForm,
	)

	const [createError, setCreateError] = useState('')

	const {
		data: members = [],
		isLoading: membersLoading,
		isError: membersError,
	} = useCompanyMembers({
		companyId,
		enabled: open,
	})

	const createCompanyMemberUserMutation = useCreateCompanyMemberUser(companyId)
	const updateCompanyMemberStatusesMutation =
		useUpdateCompanyMemberStatuses(companyId)

	useEffect(() => {
		if (!open) {
			return
		}

		setSelectedMemberIds(
			members.filter(member => member.checked).map(member => member._id),
		)
	}, [members, open])

	const filteredMembers = members.filter(member => {
		const keyword = searchQuery.toLowerCase()

		return (
			member.name.toLowerCase().includes(keyword) ||
			member.email.toLowerCase().includes(keyword) ||
			member.phone?.toLowerCase().includes(keyword) ||
			member.userType.toLowerCase().includes(keyword)
		)
	})

	const handleToggleMember = (memberId: string) => {
		setSelectedMemberIds(prev =>
			prev.includes(memberId)
				? prev.filter(id => id !== memberId)
				: [...prev, memberId],
		)
	}

	const handleCreateUser = async () => {
		if (
			!createForm.name ||
			!createForm.email ||
			!createForm.phone ||
			!createForm.userType ||
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

		setCreateError('')

		try {
			const createdMember = await createCompanyMemberUserMutation.mutateAsync({
				name: createForm.name,
				email: createForm.email,
				phone: createForm.phone,
				userType: createForm.userType,
				password: createForm.password,
				passwordConfirm: createForm.passwordConfirm,
			})

			setSelectedMemberIds(prev =>
				prev.includes(createdMember._id) ? prev : [...prev, createdMember._id],
			)

			setSearchQuery('')
			resetCreateForm()
			setMode('list')
		} catch (error) {
			setCreateError(getErrorMessage(error))
		}
	}

	const handleChangeCreateForm = (key: keyof CreateUserForm, value: string) => {
		setCreateForm(prev => ({
			...prev,
			[key]: value,
		}))
		setCreateError('')
	}

	const resetCreateForm = () => {
		setCreateForm(initialCreateUserForm)
		setCreateError('')
	}

	const handleSubmit = async () => {
		try {
			await updateCompanyMemberStatusesMutation.mutateAsync({
				activeMemberIds: selectedMemberIds,
			})

			setOpen(false)
		} catch (error) {
			console.error(error)
		}
	}

	const handleOpenChange = (nextOpen: boolean) => {
		setOpen(nextOpen)

		if (!nextOpen) {
			setMode('list')
			resetCreateForm()
			setSearchQuery('')
			setSelectedMemberIds([])
		}
	}

	return (
		<Dialog open={open} onOpenChange={handleOpenChange}>
			<DialogTrigger asChild>
				<Button size='sm' className='gap-2'>
					<UserPlus className='h-4 w-4' />
					관리자 배정
				</Button>
			</DialogTrigger>

			<DialogContent className='sm:max-w-lg'>
				<DialogHeader>
					<DialogTitle>
						{mode === 'list' ? `관리자 배정 - ${companyName}` : '사용자 생성'}
					</DialogTitle>
				</DialogHeader>

				{mode === 'list' && (
					<div className='space-y-4 mt-4'>
						<div className='flex gap-2'>
							<div className='relative flex-1'>
								<Search className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground' />
								<Input
									placeholder='관리자 검색...'
									value={searchQuery}
									onChange={e => setSearchQuery(e.target.value)}
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

						{membersLoading && (
							<div className='py-8 text-center'>
								<p className='text-sm text-muted-foreground'>
									관리자 목록을 불러오는 중...
								</p>
							</div>
						)}

						{membersError && (
							<div className='py-8 text-center'>
								<p className='text-sm text-destructive'>
									관리자 목록을 불러오지 못했습니다.
								</p>
							</div>
						)}

						<div className='space-y-2 max-h-72 overflow-y-auto'>
							{filteredMembers.length > 0 ? (
								filteredMembers.map(member => (
									<label
										key={member.id}
										className='flex items-center gap-3 p-3 bg-muted/30 rounded-lg cursor-pointer hover:bg-muted/50 transition-colors'
									>
										<Checkbox
											checked={selectedMemberIds.includes(member.id)}
											onCheckedChange={() => handleToggleMember(member.id)}
										/>

										<div className='flex-1 min-w-0'>
											<p className='font-medium text-sm text-foreground'>
												{member.name}
											</p>
											<p className='text-xs text-muted-foreground truncate'>
												{member.email}
											</p>
											{member.phone && (
												<p className='text-xs text-muted-foreground'>
													{member.phone}
												</p>
											)}
										</div>

										{member.assigned && (
											<span className='text-xs text-primary shrink-0'>
												현재 배정됨
											</span>
										)}
									</label>
								))
							) : (
								<div className='py-8 text-center'>
									<p className='text-sm text-muted-foreground'>
										검색 결과가 없습니다.
									</p>
									<Button
										type='button'
										variant='outline'
										size='sm'
										className='mt-3 gap-2'
										onClick={() => setMode('create')}
									>
										<Plus className='h-4 w-4' />새 사용자 생성
									</Button>
								</div>
							)}
						</div>

						<div className='flex items-center justify-between pt-2 border-t border-border'>
							<p className='text-xs text-muted-foreground'>
								{selectedMemberIds.length}명 선택됨
							</p>

							<Button
								onClick={handleSubmit}
								size='sm'
								disabled={updateCompanyMemberStatusesMutation.isPending}
							>
								{updateCompanyMemberStatusesMutation.isPending
									? '저장 중...'
									: '저장'}
							</Button>
						</div>
					</div>
				)}

				{mode === 'create' && (
					<div className='space-y-4 mt-4'>
						<div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
							<div className='space-y-2'>
								<Label htmlFor='user-name'>이름</Label>
								<Input
									id='user-name'
									placeholder='예: 홍길동'
									value={createForm.name}
									onChange={e => handleChangeCreateForm('name', e.target.value)}
								/>
							</div>

							<div className='space-y-2'>
								<Label htmlFor='user-type'>유형</Label>
								<Select
									value={createForm.userType}
									onValueChange={value =>
										handleChangeCreateForm('userType', value as CompanyUserType)
									}
								>
									<SelectTrigger id='user-type'>
										<SelectValue placeholder='유형 선택' />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value='Manager'>Manager</SelectItem>
										<SelectItem value='Worker'>Worker</SelectItem>
									</SelectContent>
								</Select>
							</div>
						</div>

						<div className='space-y-2'>
							<Label htmlFor='user-email'>이메일</Label>
							<Input
								id='user-email'
								type='email'
								placeholder='example@email.com'
								value={createForm.email}
								onChange={e => handleChangeCreateForm('email', e.target.value)}
							/>
						</div>

						<div className='space-y-2'>
							<Label htmlFor='user-phone'>전화번호</Label>
							<Input
								id='user-phone'
								placeholder='010-1234-5678'
								value={createForm.phone}
								onChange={e => handleChangeCreateForm('phone', e.target.value)}
							/>
						</div>

						<div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
							<div className='space-y-2'>
								<Label htmlFor='user-password'>비밀번호</Label>
								<Input
									id='user-password'
									type='password'
									value={createForm.password}
									onChange={e =>
										handleChangeCreateForm('password', e.target.value)
									}
								/>
							</div>

							<div className='space-y-2'>
								<Label htmlFor='user-password-confirm'>비밀번호 확인</Label>
								<Input
									id='user-password-confirm'
									type='password'
									value={createForm.passwordConfirm}
									onChange={e =>
										handleChangeCreateForm('passwordConfirm', e.target.value)
									}
								/>
							</div>
						</div>

						{createError && (
							<div className='bg-destructive/10 text-destructive text-sm rounded-lg p-3'>
								{createError}
							</div>
						)}

						{createForm.userType === 'Worker' && (
							<div className='bg-amber-500/10 text-amber-600 dark:text-amber-400 text-xs rounded-lg p-3'>
								Worker로 생성하면 관리자 배정 목록에는 추가되지 않습니다.
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
								onClick={handleCreateUser}
								disabled={createCompanyMemberUserMutation.isPending}
							>
								{createCompanyMemberUserMutation.isPending
									? '생성 중...'
									: '사용자 생성'}
							</Button>
						</div>
					</div>
				)}
			</DialogContent>
		</Dialog>
	)
}

const initialCreateBuildingForm: CreateBuildingForm = {
	title: '',
	address: '',
	buildingType: '',
}

export function AddBuildingDialog({
	companyId,
	companyName,
}: {
	companyId: string
	companyName: string
}) {
	const [open, setOpen] = useState(false)
	const [mode, setMode] = useState<'list' | 'create'>('list')
	const [searchQuery, setSearchQuery] = useState('')
	const [createError, setCreateError] = useState('')

	const {
		data: buildings = [],
		isLoading: buildingsLoading,
		isError: buildingsError,
	} = useAdminCompanyBuildings({ companyId, enabled: open })

	const updateCompanyBuildingStatusesMutation =
		useUpdateCompanyBuildingStatuses(companyId)

	const createBuildingMutation = useCreateAdminBuilding(companyId)
	const creating = createBuildingMutation.isPending

	const [selectedBuildingIds, setSelectedBuildingIds] = useState<string[]>([])
	const [createForm, setCreateForm] = useState<CreateBuildingForm>(
		initialCreateBuildingForm,
	)

	useEffect(() => {
		if (!open) {
			return
		}

		setSelectedBuildingIds(
			buildings
				.filter(building => building.isAssigned)
				.map(building => building._id),
		)
	}, [buildings, open])

	const handleToggleBuilding = (buildingId: string) => {
		setSelectedBuildingIds(prev =>
			prev.includes(buildingId)
				? prev.filter(id => id !== buildingId)
				: [...prev, buildingId],
		)
	}

	const handleChangeCreateForm = (
		key: keyof CreateBuildingForm,
		value: string,
	) => {
		setCreateForm(prev => ({
			...prev,
			[key]: value,
		}))
		setCreateError('')
	}

	const resetCreateForm = () => {
		setCreateForm(initialCreateBuildingForm)
		setCreateError('')
	}

	const handleCreateBuilding = async () => {
		if (!createForm.title || !createForm.address) {
			setCreateError('건물명과 주소를 입력해주세요.')
			return
		}

		try {
			setCreateError('')

			const createdBuilding = await createBuildingMutation.mutateAsync({
				title: createForm.title,
				address: createForm.address,
				buildingType: createForm.buildingType || undefined,
				companyId,
			})

			const newBuilding: Building = {
				_id: createdBuilding._id,
				title: createdBuilding.title,
				address: createdBuilding.address,
				buildingType: createdBuilding.buildingType,
				companyId: createdBuilding.companyId || companyId,
				isAssigned: true,
				buildingPlanImage: createdBuilding.buildingPlanImage || [],
				buildingRealImage: createdBuilding.buildingRealImage || [],
				buildingStatus: createdBuilding.buildingStatus,
				startDate: createdBuilding.startDate,
				createdAt: createdBuilding.createdAt,
				updatedAt: createdBuilding.updatedAt,
			}

			setSelectedBuildingIds(prev => [...prev, newBuilding._id])
			setSearchQuery('')

			resetCreateForm()
			setMode('list')
		} catch (error) {
			setCreateError(getErrorMessage(error))
		}
	}

	const handleSubmit = async () => {
		try {
			await updateCompanyBuildingStatusesMutation.mutateAsync({
				activeBuildingIds: selectedBuildingIds,
			})

			setOpen(false)
		} catch (error) {
			console.error(error)
		}
	}

	const handleOpenChange = (nextOpen: boolean) => {
		setOpen(nextOpen)

		if (!nextOpen) {
			setMode('list')
			resetCreateForm()
			setSearchQuery('')
		}
	}

	return (
		<Dialog open={open} onOpenChange={handleOpenChange}>
			<DialogTrigger asChild>
				<Button size='sm' variant='outline' className='gap-2'>
					<Plus className='h-4 w-4' />
					건물 추가
				</Button>
			</DialogTrigger>

			<DialogContent className='sm:max-w-lg'>
				<DialogHeader>
					<DialogTitle>
						{mode === 'list' ? `건물 추가 - ${companyName}` : '건물 생성'}
					</DialogTitle>
				</DialogHeader>

				{mode === 'list' && (
					<div className='space-y-4 mt-4'>
						<div className='flex gap-2'>
							<div className='relative flex-1'>
								<Search className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground' />
								<Input
									placeholder='건물 검색...'
									value={searchQuery}
									onChange={e => setSearchQuery(e.target.value)}
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

						{buildingsLoading && (
							<div className='py-8 text-center'>
								<p className='text-sm text-muted-foreground'>
									건물을 불러오는 중...
								</p>
							</div>
						)}

						{buildingsError && (
							<div className='py-8 text-center'>
								<p className='text-sm text-destructive'>
									건물 목록을 불러오지 못했습니다.
								</p>
							</div>
						)}

						<div className='space-y-2 max-h-72 overflow-y-auto'>
							{!buildingsLoading && !buildingsError && buildings.length > 0
								? buildings.map(building => (
										<label
											key={building._id}
											className='flex items-center gap-3 p-3 bg-muted/30 rounded-lg cursor-pointer hover:bg-muted/50 transition-colors'
										>
											<Checkbox
												checked={selectedBuildingIds.includes(building._id)}
												onCheckedChange={() =>
													handleToggleBuilding(building._id)
												}
											/>

											<div className='flex-1 min-w-0'>
												<p className='font-medium text-sm text-foreground'>
													{building.title}
												</p>

												<div className='flex items-center gap-1 text-xs text-muted-foreground'>
													<MapPin className='h-3 w-3 shrink-0' />
													<span className='truncate'>
														{building.address || building.address === ''
															? '주소 없음'
															: building.address}
													</span>
												</div>

												{building.buildingType && (
													<p className='text-xs text-muted-foreground'>
														유형: {building.buildingType}
													</p>
												)}
											</div>

											{building.isAssigned && (
												<span className='text-xs text-primary shrink-0'>
													현재 배정됨
												</span>
											)}
										</label>
									))
								: !buildingsLoading &&
									!buildingsError && (
										<div className='py-8 text-center'>
											<p className='text-sm text-muted-foreground'>
												건물이 없습니다.
											</p>
											<Button
												type='button'
												variant='outline'
												size='sm'
												className='mt-3 gap-2'
												onClick={() => setMode('create')}
											>
												<Plus className='h-4 w-4' />새 건물 생성
											</Button>
										</div>
									)}
						</div>

						<div className='flex items-center justify-between pt-2 border-t border-border'>
							<p className='text-xs text-muted-foreground'>
								{selectedBuildingIds.length}개 선택됨
							</p>

							<Button
								onClick={handleSubmit}
								size='sm'
								disabled={updateCompanyBuildingStatusesMutation.isPending}
							>
								{updateCompanyBuildingStatusesMutation.isPending
									? '저장 중...'
									: '저장'}
							</Button>
						</div>
					</div>
				)}

				{mode === 'create' && (
					<div className='space-y-4 mt-4'>
						<div className='space-y-2'>
							<Label htmlFor='building-title'>건물명</Label>
							<Input
								id='building-title'
								placeholder='예: A동'
								value={createForm.title}
								onChange={e => handleChangeCreateForm('title', e.target.value)}
							/>
						</div>

						<div className='space-y-2'>
							<Label htmlFor='building-address'>주소</Label>
							<Input
								id='building-address'
								placeholder='예: 서울시 강남구 테헤란로 123'
								value={createForm.address}
								onChange={e =>
									handleChangeCreateForm('address', e.target.value)
								}
							/>
						</div>

						<div className='space-y-2'>
							<Label htmlFor='building-type'>
								건물 유형{' '}
								<span className='text-muted-foreground font-normal'>
									(선택사항)
								</span>
							</Label>
							<Input
								id='building-type'
								placeholder='예: apartment, office'
								value={createForm.buildingType}
								onChange={e =>
									handleChangeCreateForm('buildingType', e.target.value)
								}
							/>
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
								onClick={handleCreateBuilding}
								disabled={creating || !createForm.title || !createForm.address}
							>
								{creating ? '생성 중...' : '건물 생성'}
							</Button>
						</div>
					</div>
				)}
			</DialogContent>
		</Dialog>
	)
}
