'use client'

import { motion } from 'framer-motion'
import DevicesCreateSection from '../components/DevicesCreateForms'
import DevicesTabsSection from '../components/DevicesTabsSection'

// Node types available
export const NODE_TYPES = [
	{ value: 'door_node', label: '비계 출입문 노드' },
	{ value: 'tilt_node', label: '비계전도 노드' },
	{ value: 'vertical_node', label: '수직구명줄 노드' },
]

// Gateway types available
export const GATEWAY_TYPES = [
	{ value: 'nodes_gateway', label: 'Nodes gateway' },
	{ value: 'security_office_gateway', label: 'Security room gateway' },
]

// Mock nodes data
export const MOCK_NODES = [
	{
		node_number: 1,
		node_type: 'door_node',
		gateway_number: 'GW-001',
		node_status: 'active',
		position: 'A동 3층',
		company_name: '삼성건설',
	},
	{
		node_number: 2,
		node_type: 'door_node',
		gateway_number: 'GW-001',
		node_status: 'active',
		position: 'A동 4층',
		company_name: '삼성건설',
	},
	{
		node_number: 3,
		node_type: 'tilt_node',
		gateway_number: 'GW-002',
		node_status: 'inactive',
		position: 'B동 2층',
		company_name: '현대건설',
	},
	{
		node_number: 4,
		node_type: 'vertical_node',
		gateway_number: 'GW-002',
		node_status: 'active',
		position: 'B동 5층',
		company_name: '현대건설',
	},
	{
		node_number: 5,
		node_type: 'door_node',
		gateway_number: null,
		node_status: 'unassigned',
		position: '-',
		company_name: '-',
	},
	{
		node_number: 13,
		node_type: 'tilt_node',
		gateway_number: 'GW-003',
		node_status: 'active',
		position: 'C동 1층',
		company_name: 'GS건설',
	},
	{
		node_number: 23,
		node_type: 'vertical_node',
		gateway_number: null,
		node_status: 'unassigned',
		position: '-',
		company_name: '-',
	},
	{
		node_number: 43,
		node_type: 'door_node',
		gateway_number: 'GW-001',
		node_status: 'warning',
		position: 'A동 7층',
		company_name: '삼성건설',
	},
]

// Mock gateways data
export const MOCK_GATEWAYS = [
	{
		gw_number: 'GW-001',
		gateway_type: 'standard',
		status: 'active',
		company_name: '삼성건설',
		building_name: '강남 타워',
		gateway_alive: true,
		zone_name: 'A동',
	},
	{
		gw_number: 'GW-002',
		gateway_type: 'long_range',
		status: 'active',
		company_name: '현대건설',
		building_name: '서초 센터',
		gateway_alive: true,
		zone_name: 'B동',
	},
	{
		gw_number: 'GW-003',
		gateway_type: 'industrial',
		status: 'inactive',
		company_name: 'GS건설',
		building_name: '용산 플라자',
		gateway_alive: false,
		zone_name: 'C동',
	},
	{
		gw_number: 'GW-004',
		gateway_type: 'standard',
		status: 'active',
		company_name: '대우건설',
		building_name: '영등포 빌딩',
		gateway_alive: true,
		zone_name: null,
	},
]

// Parse node number input
export function parseNodeNumbers(input: string): number[] {
	const trimmed = input.trim()
	if (!trimmed) return []

	if (trimmed.includes('-') && !trimmed.includes(',')) {
		const [start, end] = trimmed.split('-').map(s => parseInt(s.trim(), 10))
		if (isNaN(start) || isNaN(end) || start > end) return []
		const result: number[] = []
		for (let i = start; i <= end; i++) {
			result.push(i)
		}
		return result
	}

	if (trimmed.includes(',')) {
		return trimmed
			.split(',')
			.map(s => parseInt(s.trim(), 10))
			.filter(n => !isNaN(n))
	}

	const single = parseInt(trimmed, 10)
	return isNaN(single) ? [] : [single]
}

export default function AdminDevicesPage() {
	return (
		<motion.div
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			className='min-h-screen bg-background'
		>
			{/* Header */}
			<div className='border-b border-border bg-card'>
				<div className='max-w-7xl mx-auto px-4 sm:px-6 py-6'>
					<h1 className='text-xl sm:text-2xl font-bold text-foreground'>
						장치 등록
					</h1>
					<p className='text-sm text-muted-foreground mt-1'>
						노드 및 게이트웨이를 시스템에 등록합니다.
					</p>
				</div>
			</div>

			{/* Content */}
			<div className='max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-8'>
				<DevicesCreateSection />
				<DevicesTabsSection />
			</div>
		</motion.div>
	)
}
