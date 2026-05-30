import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { AlertCircle, Briefcase, CheckCircle2, Plus } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useCreateAdminCompany } from '../hooks/useCompanies'

const BUILDING_TYPES = [
	{ value: 'office', label: '오피스' },
	{ value: 'residential', label: '주거' },
	{ value: 'commercial', label: '상업' },
	{ value: 'industrial', label: '산업' },
	{ value: 'mixed', label: '복합' },
]

function getErrorMessage(error: unknown) {
	if (error instanceof Error) return error.message
	return '요청 처리 중 오류가 발생했습니다.'
}

function OrganizationCreateCards() {
	const { t } = useTranslation()
	// const createBuildingMutation = useCreateAdminBuilding(null)
	const createCompanyMutation = useCreateAdminCompany()

	// Building form state
	// const [title, setTitle] = useState('')
	// const [address, setAddress] = useState('')
	// const [buildingType, setBuildingType] = useState('')
	// const [buildingResult, setBuildingResult] = useState<{
	// 	success: boolean
	// 	message: string
	// } | null>(null)

	// Company form state
	const [companyName, setCompanyName] = useState('')
	const [companyAddress, setCompanyAddress] = useState('')
	const [companyTel, setCompanyTel] = useState('')
	const [companyResult, setCompanyResult] = useState<{
		success: boolean
		message: string
	} | null>(null)

	// const handleCreateBuilding = async () => {
	// 	if (!title || !address || !buildingType) return

	// 	setBuildingResult(null)

	// 	try {
	// 		await createBuildingMutation.mutateAsync({
	// 			title,
	// 			address,
	// 			buildingType,
	// 		})

	// 		setBuildingResult({
	// 			success: true,
	// 			message: `건물이 생성되었습니다. (${title})`,
	// 		})

	// 		setTitle('')
	// 		setAddress('')
	// 		setBuildingType('')
	// 	} catch (error) {
	// 		setBuildingResult({
	// 			success: false,
	// 			message: getErrorMessage(error),
	// 		})
	// 	}
	// }

	const handleCreateCompany = async () => {
		if (!companyName || !companyAddress) return

		setCompanyResult(null)

		try {
			await createCompanyMutation.mutateAsync({
				companyName,
				companyAddress,
				companyTel: companyTel || undefined,
			})

			setCompanyResult({
				success: true,
				message: t('pages.organizationCreate.companyCreated', {
					name: companyName,
				}),
			})

			setCompanyName('')
			setCompanyAddress('')
			setCompanyTel('')
		} catch (error) {
			setCompanyResult({
				success: false,
				message: getErrorMessage(error),
			})
		}
	}

	// const buildingSubmitting = createBuildingMutation.isPending
	const companySubmitting = createCompanyMutation.isPending

	return (
		<div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
			{/* Building Creation Card */}
			{/* <div className='rounded-xl border border-border bg-card p-5 sm:p-6'>
				<div className='flex items-center gap-3 mb-5'>
					<div className='w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center'>
						<Building2 className='w-5 h-5 text-primary' />
					</div>
					<div>
						<h2 className='font-semibold text-foreground'>건물 생성</h2>
						<p className='text-xs text-muted-foreground'>새로운 건물 등록</p>
					</div>
				</div>

				<div className='space-y-4'>
					<div className='space-y-2'>
						<Label htmlFor='building-title' className='text-sm font-medium'>
							건물명
						</Label>
						<Input
							id='building-title'
							placeholder='예: A동'
							value={title}
							onChange={e => {
								setTitle(e.target.value)
								setBuildingResult(null)
							}}
						/>
					</div>

					<div className='space-y-2'>
						<Label htmlFor='building-address' className='text-sm font-medium'>
							주소
						</Label>
						<Input
							id='building-address'
							placeholder='예: 서울시 강남구 테헤란로 123'
							value={address}
							onChange={e => {
								setAddress(e.target.value)
								setBuildingResult(null)
							}}
						/>
					</div>

					<div className='space-y-2'>
						<Label htmlFor='building-type' className='text-sm font-medium'>
							건물 유형
						</Label>
						<Input
							id='building-type'
							placeholder='예: apartment, office'
							value={buildingType}
							onChange={e => {
								setBuildingType(e.target.value)
								setBuildingResult(null)
							}}
						/>
					</div>

					{buildingResult && (
						<div
							className={`flex items-center gap-2 p-3 rounded-lg text-sm ${
								buildingResult.success
									? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
									: 'bg-destructive/10 text-destructive'
							}`}
						>
							{buildingResult.success ? (
								<CheckCircle2 className='w-4 h-4' />
							) : (
								<AlertCircle className='w-4 h-4' />
							)}
							{buildingResult.message}
						</div>
					)}

					<Button
						onClick={handleCreateBuilding}
						disabled={!title || !address || !buildingType || buildingSubmitting}
						className='w-full gap-2'
					>
						<Plus className='w-4 h-4' />
						{buildingSubmitting ? '생성 중...' : '건물 생성'}
					</Button>
				</div>
			</div> */}

			{/* Company Creation Card */}
			<div className='rounded-xl border border-border bg-card p-5 sm:p-6'>
				<div className='flex items-center gap-3 mb-5'>
					<div className='w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center'>
						<Briefcase className='w-5 h-5 text-primary' />
					</div>
					<div>
						<h2 className='font-semibold text-foreground'>
							{t('pages.organizationCreate.companyTitle')}
						</h2>
						<p className='text-xs text-muted-foreground'>
							{t('pages.organizationCreate.companyDescription')}
						</p>
					</div>
				</div>

				<div className='space-y-4'>
					<div className='space-y-2'>
						<Label htmlFor='company-name' className='text-sm font-medium'>
							{t('pages.organizationCreate.companyName')}
						</Label>
						<Input
							id='company-name'
							placeholder={t('pages.organizationCreate.companyPlaceholder')}
							value={companyName}
							onChange={e => {
								setCompanyName(e.target.value)
								setCompanyResult(null)
							}}
						/>
					</div>

					<div className='space-y-2'>
						<Label htmlFor='company-address' className='text-sm font-medium'>
							{t('pages.organizationCreate.address')}
						</Label>
						<Input
							id='company-address'
							placeholder={t('pages.organizationCreate.addressPlaceholder')}
							value={companyAddress}
							onChange={e => {
								setCompanyAddress(e.target.value)
								setCompanyResult(null)
							}}
						/>
					</div>

					<div className='space-y-2'>
						<Label htmlFor='company-tel' className='text-sm font-medium'>
							{t('pages.organizationCreate.contact')}{' '}
							<span className='text-muted-foreground font-normal'>
								{t('pages.organizationCreate.optional')}
							</span>
						</Label>
						<Input
							id='company-tel'
							placeholder={t('pages.organizationCreate.contactPlaceholder')}
							value={companyTel}
							onChange={e => {
								setCompanyTel(e.target.value)
								setCompanyResult(null)
							}}
						/>
					</div>

					{companyResult && (
						<div
							className={`flex items-center gap-2 p-3 rounded-lg text-sm ${
								companyResult.success
									? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
									: 'bg-destructive/10 text-destructive'
							}`}
						>
							{companyResult.success ? (
								<CheckCircle2 className='w-4 h-4' />
							) : (
								<AlertCircle className='w-4 h-4' />
							)}
							{companyResult.message}
						</div>
					)}

					<Button
						onClick={handleCreateCompany}
						disabled={!companyName || !companyAddress || companySubmitting}
						className='w-full gap-2'
					>
						<Plus className='w-4 h-4' />
						{companySubmitting
							? t('pages.organizationCreate.creating')
							: t('pages.organizationCreate.createCompany')}
					</Button>
				</div>
			</div>
		</div>
	)
}

export default OrganizationCreateCards
