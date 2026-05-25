'use client'

import { motion } from 'framer-motion'
import OrganizationCreateCards from '../components/OrganizationCreateForms'
import OrganizationTabsSection from '../components/OrganizationTabsSection'

// Mock data for gateways
export const MOCK_GATEWAYS = [
	{
		id: 1,
		gw_number: 'GW-001',
		gateway_type: 'lora',
		status: 'active',
		building_id: null,
		building_name: '',
		zone_name: '',
	},
	{
		id: 2,
		gw_number: 'GW-002',
		gateway_type: 'wifi',
		status: 'active',
		building_id: null,
		building_name: '',
		zone_name: '',
	},
	{
		id: 3,
		gw_number: 'GW-003',
		gateway_type: 'lte',
		status: 'inactive',
		building_id: null,
		building_name: '',
		zone_name: '',
	},
	{
		id: 4,
		gw_number: 'GW-004',
		gateway_type: 'lora',
		status: 'active',
		building_id: 1,
		building_name: 'A동',
		zone_name: '1층',
	},
	{
		id: 5,
		gw_number: 'GW-005',
		gateway_type: 'wifi',
		status: 'active',
		building_id: 1,
		building_name: 'A동',
		zone_name: '2층',
	},
	{
		id: 6,
		gw_number: 'GW-006',
		gateway_type: 'lte',
		status: 'active',
		building_id: null,
		building_name: '',
		zone_name: '',
	},
	{
		id: 7,
		gw_number: 'GW-007',
		gateway_type: 'lora',
		status: 'inactive',
		building_id: null,
		building_name: '',
		zone_name: '',
	},
]

// Mock data for buildings
export const MOCK_BUILDINGS = [
	{
		id: 1,
		name: 'A동',
		address: '서울시 강남구 테헤란로 123',
		gateway_count: 2,
		worker_count: 2,
	},
	{
		id: 2,
		name: 'B동',
		address: '서울시 서초구 서초대로 456',
		gateway_count: 0,
		worker_count: 0,
	},
	{
		id: 3,
		name: 'C동',
		address: '서울시 송파구 올림픽로 789',
		gateway_count: 0,
		worker_count: 1,
	},
	{
		id: 4,
		name: 'D동',
		address: '서울시 마포구 월드컵북로 321',
		gateway_count: 0,
		worker_count: 0,
	},
]

// Mock data for nodes
export const MOCK_NODES = [
	{
		id: 1,
		node_number: 'ND-001',
		node_type: 'temperature',
		status: 'active',
		building_id: 1,
		building_name: 'A동',
		gateway_number: 'GW-004',
		zone_name: '1층',
	},
	{
		id: 2,
		node_number: 'ND-002',
		node_type: 'humidity',
		status: 'active',
		building_id: 1,
		building_name: 'A동',
		gateway_number: 'GW-004',
		zone_name: '1층',
	},
	{
		id: 3,
		node_number: 'ND-003',
		node_type: 'co2',
		status: 'inactive',
		building_id: 1,
		building_name: 'A동',
		gateway_number: 'GW-005',
		zone_name: '2층',
	},
	{
		id: 4,
		node_number: 'ND-004',
		node_type: 'motion',
		status: 'active',
		building_id: null,
		building_name: '',
		gateway_number: '',
		zone_name: '',
	},
	{
		id: 5,
		node_number: 'ND-005',
		node_type: 'door',
		status: 'active',
		building_id: null,
		building_name: '',
		gateway_number: '',
		zone_name: '',
	},
	{
		id: 6,
		node_number: 'ND-006',
		node_type: 'temperature',
		status: 'inactive',
		building_id: null,
		building_name: '',
		gateway_number: '',
		zone_name: '',
	},
]

// Mock data for members
export const MOCK_MEMBERS = [
	{
		id: 1,
		name: '김관리',
		user_type: 'admin',
		email: 'admin@example.com',
		phone: '010-1111-2222',
		building_id: null,
		building_name: '',
		status: 'active',
	},
	{
		id: 2,
		name: '이매니저',
		user_type: 'manager',
		email: 'manager@example.com',
		phone: '010-2222-3333',
		building_id: 1,
		building_name: 'A동',
		status: 'active',
	},
	{
		id: 3,
		name: '박작업',
		user_type: 'worker',
		email: 'worker1@example.com',
		phone: '010-3333-4444',
		building_id: 1,
		building_name: 'A동',
		status: 'active',
	},
	{
		id: 4,
		name: '최현장',
		user_type: 'worker',
		email: 'worker2@example.com',
		phone: '010-4444-5555',
		building_id: 1,
		building_name: 'A동',
		status: 'active',
	},
	{
		id: 5,
		name: '정작업',
		user_type: 'worker',
		email: 'worker3@example.com',
		phone: '010-5555-6666',
		building_id: 3,
		building_name: 'C동',
		status: 'inactive',
	},
	{
		id: 6,
		name: '한미배',
		user_type: 'worker',
		email: 'worker4@example.com',
		phone: '',
		building_id: null,
		building_name: '',
		status: 'active',
	},
	{
		id: 7,
		name: '오현장',
		user_type: 'manager',
		email: 'manager2@example.com',
		phone: '010-7777-8888',
		building_id: null,
		building_name: '',
		status: 'active',
	},
]

export default function OrganizationPage() {
	return (
		<motion.div
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			className='min-h-screen bg-background'
		>
			<div className='border-b border-border bg-card'>
				<div className='max-w-6xl mx-auto px-4 sm:px-6 py-6'>
					<h1 className='text-xl sm:text-2xl font-bold text-foreground'>
						조직 관리
					</h1>
					<p className='text-sm text-muted-foreground mt-1'>
						건물 및 멤버를 등록하고 게이트웨이와 작업자를 할당합니다.
					</p>
				</div>
			</div>

			<div className='max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-8'>
				<OrganizationCreateCards />
				<OrganizationTabsSection />
			</div>
		</motion.div>
	)
}
