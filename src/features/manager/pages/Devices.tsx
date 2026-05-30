'use client'

import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import NodesConnectionTabsSection from '../components/NodesConnectionPage'

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

export default function ManagerDevicesPage() {
	const { t } = useTranslation()

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
						{t('pages.devices.title')}
					</h1>
					<p className='text-sm text-muted-foreground mt-1'>
						{t('pages.devices.description')}
					</p>
				</div>
			</div>

			{/* Content */}
			<div className='max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-8'>
				<NodesConnectionTabsSection />
			</div>
		</motion.div>
	)
}
