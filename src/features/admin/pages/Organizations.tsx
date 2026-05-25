'use client'

import { motion } from 'framer-motion'
import OrganizationCreateCards from '../components/OrganizationCreateForms'
import OrganizationTabsSection from '../components/OrganizationTabsSection'

// Mock data for gateways (existing, some unassigned)
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
		company_id: 1,
		company_name: '테크놀로지 주식회사',
		gateway_count: 2,
	},
	{
		id: 2,
		name: 'B동',
		address: '서울시 서초구 서초대로 456',
		company_id: null,
		company_name: '',
		gateway_count: 0,
	},
	{
		id: 3,
		name: 'C동',
		address: '서울시 송파구 올림픽로 789',
		company_id: 2,
		company_name: '스마트빌딩 코리아',
		gateway_count: 0,
	},
	{
		id: 4,
		name: 'D동',
		address: '서울시 마포구 월드컵북로 321',
		company_id: null,
		company_name: '',
		gateway_count: 0,
	},
]

// Mock data for companies
export const MOCK_COMPANIES = [
	{
		id: 1,
		name: '테크놀로지 주식회사',
		business_number: '123-45-67890',
		contact: '02-1234-5678',
		building_count: 1,
	},
	{
		id: 2,
		name: '스마트빌딩 코리아',
		business_number: '234-56-78901',
		contact: '02-2345-6789',
		building_count: 1,
	},
	{
		id: 3,
		name: '그린에너지 솔루션',
		business_number: '345-67-89012',
		contact: '02-3456-7890',
		building_count: 0,
	},
]

export default function AdminOrganizationPage() {
	return (
		<motion.div
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			className='min-h-screen bg-background'
		>
			<div className='border-b border-border bg-card'>
				<div className='max-w-7xl mx-auto px-4 sm:px-6 py-6'>
					<h1 className='text-xl sm:text-2xl font-bold text-foreground'>
						조직 관리
					</h1>
					<p className='text-sm text-muted-foreground mt-1'>
						건물 및 회사를 등록하고 게이트웨이를 할당합니다.
					</p>
				</div>
			</div>

			<div className='max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-8'>
				<OrganizationCreateCards />
				<OrganizationTabsSection />
			</div>
		</motion.div>
	)
}
