import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { ChevronRight, MapPin } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

// Mock Buildings for selected company
const COMPANY_BUILDINGS: Record<
	string,
	Array<{
		id: string
		name: string
		location: string
		status: 'active' | 'maintenance' | 'paused'
		totalNodes: number
		onlineNodes: number
		alerts: number
		progress: number
		phase: string
	}>
> = {
	'comp-001': [
		{
			id: 'bld-001',
			name: '알파 타워',
			location: '강남구',
			status: 'active',
			totalNodes: 42,
			onlineNodes: 40,
			alerts: 2,
			progress: 78,
			phase: '구조물',
		},
		{
			id: 'bld-002',
			name: '베타 센터',
			location: '서초구',
			status: 'active',
			totalNodes: 35,
			onlineNodes: 33,
			alerts: 1,
			progress: 65,
			phase: 'MEP 설치',
		},
		{
			id: 'bld-003',
			name: '감마 플라자',
			location: '송파구',
			status: 'maintenance',
			totalNodes: 28,
			onlineNodes: 22,
			alerts: 4,
			progress: 45,
			phase: '기초공사',
		},
		{
			id: 'bld-004',
			name: '델타 오피스',
			location: '마포구',
			status: 'active',
			totalNodes: 50,
			onlineNodes: 48,
			alerts: 0,
			progress: 92,
			phase: '마감공사',
		},
	],
	'comp-002': [
		{
			id: 'bld-005',
			name: '리버사이드 타워',
			location: '성남시',
			status: 'active',
			totalNodes: 38,
			onlineNodes: 36,
			alerts: 2,
			progress: 55,
			phase: '구조물',
		},
		{
			id: 'bld-006',
			name: '그린 허브',
			location: '수원시',
			status: 'active',
			totalNodes: 32,
			onlineNodes: 30,
			alerts: 1,
			progress: 70,
			phase: 'MEP 설치',
		},
	],
	'comp-003': [
		{
			id: 'bld-007',
			name: '해운대 타워',
			location: '해운대구',
			status: 'active',
			totalNodes: 45,
			onlineNodes: 42,
			alerts: 3,
			progress: 60,
			phase: '구조물',
		},
		{
			id: 'bld-008',
			name: '센텀 빌딩',
			location: '수영구',
			status: 'active',
			totalNodes: 44,
			onlineNodes: 40,
			alerts: 2,
			progress: 85,
			phase: '마감공사',
		},
	],
	'comp-004': [
		{
			id: 'bld-009',
			name: '송도 타워',
			location: '연수구',
			status: 'maintenance',
			totalNodes: 55,
			onlineNodes: 48,
			alerts: 8,
			progress: 40,
			phase: '기초공사',
		},
		{
			id: 'bld-010',
			name: '청라 센터',
			location: '서구',
			status: 'active',
			totalNodes: 53,
			onlineNodes: 47,
			alerts: 4,
			progress: 52,
			phase: '구조물',
		},
	],
	'comp-005': [
		{
			id: 'bld-011',
			name: '둔산 타워',
			location: '서구',
			status: 'active',
			totalNodes: 62,
			onlineNodes: 60,
			alerts: 1,
			progress: 88,
			phase: '마감공사',
		},
		{
			id: 'bld-012',
			name: '유성 플라자',
			location: '유성구',
			status: 'active',
			totalNodes: 65,
			onlineNodes: 62,
			alerts: 1,
			progress: 72,
			phase: 'MEP 설치',
		},
		{
			id: 'bld-013',
			name: '대덕 허브',
			location: '대덕구',
			status: 'active',
			totalNodes: 60,
			onlineNodes: 58,
			alerts: 0,
			progress: 95,
			phase: '마감공사',
		},
	],
}

export function BuildingCard({
	building,
}: {
	building: (typeof COMPANY_BUILDINGS)['comp-001'][0]
}) {
	const statusColors = {
		active: 'bg-green-500/20 text-green-600',
		maintenance: 'bg-amber-500/20 text-amber-600',
		paused: 'bg-muted text-muted-foreground',
	}

	const statusLabels = {
		active: '운영중',
		maintenance: '점검중',
		paused: '일시중지',
	}

	const navigate = useNavigate()

	return (
		<div className='bg-card border border-border rounded-xl p-4 hover:border-primary/30 transition-colors'>
			<div className='flex items-start justify-between mb-3'>
				<div>
					<h3 className='font-semibold text-foreground'>{building.name}</h3>
					<div className='flex items-center gap-1 text-xs text-muted-foreground mt-0.5'>
						<MapPin className='h-3 w-3' />
						<span>{building.location}</span>
					</div>
				</div>
				<span
					className={cn(
						'text-xs px-2 py-0.5 rounded-full',
						statusColors[building.status],
					)}
				>
					{statusLabels[building.status]}
				</span>
			</div>

			{/* Progress bar */}
			<div className='mb-3'>
				<div className='flex items-center justify-between text-xs mb-1'>
					<span className='text-muted-foreground'>{building.phase}</span>
					<span className='font-medium text-foreground'>
						{building.progress}%
					</span>
				</div>
				<div className='h-1.5 bg-muted rounded-full overflow-hidden'>
					<div
						className='h-full bg-primary rounded-full transition-all'
						style={{ width: `${building.progress}%` }}
					/>
				</div>
			</div>

			{/* Stats */}
			<div className='grid grid-cols-3 gap-2 text-center'>
				<div className='bg-muted/30 rounded-lg py-2'>
					<p className='text-sm font-semibold text-foreground'>
						{building.totalNodes}
					</p>
					<p className='text-[10px] text-muted-foreground'>전체 노드</p>
				</div>
				<div className='bg-muted/30 rounded-lg py-2'>
					<p className='text-sm font-semibold text-green-500'>
						{building.onlineNodes}
					</p>
					<p className='text-[10px] text-muted-foreground'>온라인</p>
				</div>
				<div className='bg-muted/30 rounded-lg py-2'>
					<p className='text-sm font-semibold text-amber-500'>
						{building.alerts}
					</p>
					<p className='text-[10px] text-muted-foreground'>알림</p>
				</div>
			</div>

			{/* Action */}
			<Button
				onClick={() => navigate(`/admin/buildings/${building.id}`)}
				variant='ghost'
				size='sm'
				className='w-full mt-3 text-xs'
			>
				건물 관리
				<ChevronRight className='h-3 w-3 ml-1' />
			</Button>
		</div>
	)
}
