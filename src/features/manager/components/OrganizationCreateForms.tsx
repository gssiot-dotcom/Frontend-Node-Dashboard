import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select'
import {
	AlertCircle,
	Building2,
	CheckCircle2,
	Eye,
	EyeOff,
	Plus,
	UserPlus,
} from 'lucide-react'
import { useState } from 'react'

const BUILDING_TYPES = [
	{ value: 'office', label: '오피스' },
	{ value: 'residential', label: '주거' },
	{ value: 'commercial', label: '상업' },
	{ value: 'industrial', label: '산업' },
	{ value: 'mixed', label: '복합' },
]

const USER_TYPES = [
	{ value: 'admin', label: '관리자' },
	{ value: 'manager', label: '매니저' },
	{ value: 'worker', label: '작업자' },
]

function OrganizationCreateCards() {
	// Building form
	const [buildingName, setBuildingName] = useState('')
	const [buildingAddress, setBuildingAddress] = useState('')
	const [buildingType, setBuildingType] = useState('')
	const [buildingSubmitting, setBuildingSubmitting] = useState(false)
	const [buildingResult, setBuildingResult] = useState<{
		success: boolean
		message: string
	} | null>(null)

	// Member form
	const [memberName, setMemberName] = useState('')
	const [userType, setUserType] = useState('')
	const [email, setEmail] = useState('')
	const [phone, setPhone] = useState('')
	const [password, setPassword] = useState('')
	const [confirmPassword, setConfirmPassword] = useState('')
	const [showPassword, setShowPassword] = useState(false)
	const [showConfirmPassword, setShowConfirmPassword] = useState(false)
	const [memberSubmitting, setMemberSubmitting] = useState(false)
	const [memberResult, setMemberResult] = useState<{
		success: boolean
		message: string
	} | null>(null)

	const passwordMismatch =
		confirmPassword.length > 0 && password !== confirmPassword

	const handleCreateBuilding = async () => {
		if (!buildingName || !buildingAddress || !buildingType) return

		setBuildingSubmitting(true)
		setBuildingResult(null)

		await new Promise(resolve => setTimeout(resolve, 1000))

		setBuildingSubmitting(false)
		setBuildingResult({
			success: true,
			message: `건물이 생성되었습니다. (${buildingName})`,
		})

		setBuildingName('')
		setBuildingAddress('')
		setBuildingType('')
	}

	const handleCreateMember = async () => {
		if (!memberName || !userType || !email || !password || !confirmPassword)
			return
		if (password !== confirmPassword) return

		setMemberSubmitting(true)
		setMemberResult(null)

		await new Promise(resolve => setTimeout(resolve, 1000))

		setMemberSubmitting(false)
		setMemberResult({
			success: true,
			message: `멤버가 생성되었습니다. (${memberName})`,
		})

		setMemberName('')
		setUserType('')
		setEmail('')
		setPhone('')
		setPassword('')
		setConfirmPassword('')
	}

	const memberFormValid =
		memberName &&
		userType &&
		email &&
		password &&
		confirmPassword &&
		password === confirmPassword

	return (
		<div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
			{/* Building Creation Card */}
			<div className='rounded-xl border border-border bg-card p-5 sm:p-6'>
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
						<Label htmlFor='building-name' className='text-sm font-medium'>
							건물명
						</Label>
						<Input
							id='building-name'
							placeholder='예: A동'
							value={buildingName}
							onChange={e => {
								setBuildingName(e.target.value)
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
							value={buildingAddress}
							onChange={e => {
								setBuildingAddress(e.target.value)
								setBuildingResult(null)
							}}
						/>
					</div>

					<div className='space-y-2'>
						<Label htmlFor='building-type' className='text-sm font-medium'>
							건물 유형
						</Label>
						<Select value={buildingType} onValueChange={setBuildingType}>
							<SelectTrigger id='building-type'>
								<SelectValue placeholder='건물 유형 선택' />
							</SelectTrigger>
							<SelectContent>
								{BUILDING_TYPES.map(type => (
									<SelectItem key={type.value} value={type.value}>
										{type.label}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>

					{buildingResult && (
						<div
							className={`flex items-center gap-2 p-3 rounded-lg text-sm ${buildingResult.success ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' : 'bg-destructive/10 text-destructive'}`}
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
						disabled={
							!buildingName ||
							!buildingAddress ||
							!buildingType ||
							buildingSubmitting
						}
						className='w-full gap-2'
					>
						<Plus className='w-4 h-4' />
						{buildingSubmitting ? '생성 중...' : '건물 생성'}
					</Button>
				</div>
			</div>

			{/* Member Creation Card */}
			<div className='rounded-xl border border-border bg-card p-5 sm:p-6'>
				<div className='flex items-center gap-3 mb-5'>
					<div className='w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center'>
						<UserPlus className='w-5 h-5 text-primary' />
					</div>
					<div>
						<h2 className='font-semibold text-foreground'>멤버 생성</h2>
						<p className='text-xs text-muted-foreground'>새로운 멤버 등록</p>
					</div>
				</div>

				<div className='space-y-4'>
					<div className='grid grid-cols-2 gap-3'>
						<div className='space-y-2'>
							<Label htmlFor='member-name' className='text-sm font-medium'>
								이름
							</Label>
							<Input
								id='member-name'
								placeholder='예: 홍길동'
								value={memberName}
								onChange={e => {
									setMemberName(e.target.value)
									setMemberResult(null)
								}}
							/>
						</div>

						<div className='space-y-2'>
							<Label htmlFor='user-type' className='text-sm font-medium'>
								유형
							</Label>
							<Select value={userType} onValueChange={setUserType}>
								<SelectTrigger id='user-type'>
									<SelectValue placeholder='유형 선택' />
								</SelectTrigger>
								<SelectContent>
									{USER_TYPES.map(type => (
										<SelectItem key={type.value} value={type.value}>
											{type.label}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>
					</div>

					<div className='space-y-2'>
						<Label htmlFor='member-email' className='text-sm font-medium'>
							이메일
						</Label>
						<Input
							id='member-email'
							type='email'
							placeholder='예: hong@example.com'
							value={email}
							onChange={e => {
								setEmail(e.target.value)
								setMemberResult(null)
							}}
						/>
					</div>

					<div className='space-y-2'>
						<Label htmlFor='member-phone' className='text-sm font-medium'>
							연락처{' '}
							<span className='text-muted-foreground font-normal'>
								(선택사항)
							</span>
						</Label>
						<Input
							id='member-phone'
							placeholder='예: 010-1234-5678'
							value={phone}
							onChange={e => {
								setPhone(e.target.value)
								setMemberResult(null)
							}}
						/>
					</div>

					<div className='grid grid-cols-2 gap-3'>
						<div className='space-y-2'>
							<Label htmlFor='member-password' className='text-sm font-medium'>
								비밀번호
							</Label>
							<div className='relative'>
								<Input
									id='member-password'
									type={showPassword ? 'text' : 'password'}
									placeholder='비밀번호'
									value={password}
									onChange={e => {
										setPassword(e.target.value)
										setMemberResult(null)
									}}
									className='pr-9'
								/>
								<button
									type='button'
									onClick={() => setShowPassword(v => !v)}
									className='absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground'
								>
									{showPassword ? (
										<EyeOff className='w-4 h-4' />
									) : (
										<Eye className='w-4 h-4' />
									)}
								</button>
							</div>
						</div>

						<div className='space-y-2'>
							<Label
								htmlFor='member-confirm-password'
								className='text-sm font-medium'
							>
								비밀번호 확인
							</Label>
							<div className='relative'>
								<Input
									id='member-confirm-password'
									type={showConfirmPassword ? 'text' : 'password'}
									placeholder='확인'
									value={confirmPassword}
									onChange={e => {
										setConfirmPassword(e.target.value)
										setMemberResult(null)
									}}
									className={`pr-9 ${passwordMismatch ? 'border-destructive focus-visible:ring-destructive' : ''}`}
								/>
								<button
									type='button'
									onClick={() => setShowConfirmPassword(v => !v)}
									className='absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground'
								>
									{showConfirmPassword ? (
										<EyeOff className='w-4 h-4' />
									) : (
										<Eye className='w-4 h-4' />
									)}
								</button>
							</div>
							{passwordMismatch && (
								<p className='text-xs text-destructive'>
									비밀번호가 일치하지 않습니다.
								</p>
							)}
						</div>
					</div>

					{memberResult && (
						<div
							className={`flex items-center gap-2 p-3 rounded-lg text-sm ${memberResult.success ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' : 'bg-destructive/10 text-destructive'}`}
						>
							{memberResult.success ? (
								<CheckCircle2 className='w-4 h-4' />
							) : (
								<AlertCircle className='w-4 h-4' />
							)}
							{memberResult.message}
						</div>
					)}

					<Button
						onClick={handleCreateMember}
						disabled={!memberFormValid || memberSubmitting}
						className='w-full gap-2'
					>
						<Plus className='w-4 h-4' />
						{memberSubmitting ? '생성 중...' : '멤버 생성'}
					</Button>
				</div>
			</div>
		</div>
	)
}

export default OrganizationCreateCards
