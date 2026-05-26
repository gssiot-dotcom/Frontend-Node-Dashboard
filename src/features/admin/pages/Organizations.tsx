'use client'

import { motion } from 'framer-motion'
import OrganizationCreateCards from '../components/OrganizationCreateForms'
import OrganizationTabsSection from '../components/OrganizationTabsSection'

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
