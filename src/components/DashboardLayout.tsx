// ─── DashboardLayout.jsx ────────────────────────────────────────────────────
// Replace your existing DashboardLayout with this.
// BuildingsSidebar lives here so it persists across all dashboard sub-routes.

import DashboardSidebar from '@/components/DashboardSidebar'
import { Outlet } from 'react-router-dom'

export default function DashboardLayout() {
	return (
		<div className='flex min-h-screen bg-background'>
			{/* Left nav sidebar (existing) */}
			<DashboardSidebar />
			{/* Main content */}
			<main className='flex-1 min-h-screen overflow-auto'>
				<div className='p-4 lg:p-6 pt-14 lg:pt-6'>
					<Outlet />
				</div>
			</main>
		</div>
	)
}
