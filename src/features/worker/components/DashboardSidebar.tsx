import { Button } from '@/components/ui/button'
import {
	ChevronLeft,
	ChevronRight,
	LayoutDashboard,
	LogOut,
	Menu,
	X,
} from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useLocation } from 'react-router-dom'

import GssLogo from '@/components/GssLogo'
import { useLogout } from '@/features/auth/hooks/useAuth'
import { getAssetUrl } from '@/lib/getAssetUrl'
import { getUserTypeClassName, getUserTypeLabel } from '@/lib/getUserBadge'
import { useAuth } from '@/shared/store/useAuthStoreValue'
import { useNavigate } from 'react-router-dom'
import { useWorkerMyCompany } from '../hooks/useWorkerQueries'

const NAV_ITEMS = [
	{
		labelKey: 'nav.dashboard',
		icon: LayoutDashboard,
		path: '/worker/dashboard/buildings',
	},
]

export default function DashboardSidebar() {
	const [collapsed, setCollapsed] = useState(false)
	const [mobileOpen, setMobileOpen] = useState(false)
	const location = useLocation()
	const { user } = useAuth()

	const { data: company } = useWorkerMyCompany()

	const logoUrl = company?.companyLogo
		? getAssetUrl(company.companyLogo)
		: '/fallback-logo.png'

	const logoutMutation = useLogout()

	const { t } = useTranslation()
	const navigate = useNavigate()

	const handleLogout = async () => {
		navigate('/', { replace: true })
		await logoutMutation.mutateAsync()
	}

	const isActive = (path: string) => location.pathname === path

	const sidebarContent = (
		<div className='flex flex-col h-full'>
			{/* Logo */}
			<div className='flex items-center justify-between p-4 border-b border-border/50'>
				{!collapsed && <GssLogo size='sm' />}
				<Button
					variant='outline'
					size='icon'
					className='hidden lg:flex h-8 w-8 text-foreground'
					onClick={() => setCollapsed(!collapsed)}
				>
					{collapsed ? (
						<ChevronRight className='w-4 h-4' />
					) : (
						<ChevronLeft className='w-4 h-4' />
					)}
				</Button>
			</div>

			{/* Nav items */}
			<nav className='flex-1 p-3 space-y-1'>
				{NAV_ITEMS.map(item => (
					<Link
						key={item.path}
						to={item.path}
						onClick={() => setMobileOpen(false)}
						className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
							isActive(item.path)
								? 'bg-primary/10 text-primary'
								: 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
						}`}
					>
						<item.icon className='w-4 h-4 shrink-0' />
						{!collapsed && <span>{t(item.labelKey)}</span>}
					</Link>
				))}
			</nav>
			<div className='w-full h-24 p-3 border-t border-border'>
				<img
					src={logoUrl}
					alt={t('common.companyLogo')}
					className='w-full h-full object-cover'
				/>
			</div>

			{/* User + logout */}
			<div className='p-3 border-t border-border/50'>
				{!collapsed && user && (
					<div className='px-3 py-2 mb-2 rounded-lg bg-muted/30 border border-border/40'>
						<div className='flex items-start justify-between gap-2'>
							<div className='min-w-0'>
								<p className='text-sm font-medium text-foreground truncate'>
									{user.name}
								</p>
								<p className='text-xs text-muted-foreground truncate'>
									{user.email}
								</p>
							</div>

							<span
								className={`shrink-0 px-2 py-0.5 rounded-full border text-[10px] font-semibold tracking-wide ${getUserTypeClassName(
									user.userType,
								)}`}
							>
								{getUserTypeLabel(user.userType)}
							</span>
						</div>
					</div>
				)}
				<button
					onClick={handleLogout}
					className='flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium  text-destructive/70 bg-destructive/10 hover:bg-destructive/15 transition-all w-full'
				>
					<LogOut className='w-4 h-4 shrink-0' />
					{!collapsed && <span>{t('sidebar.logout')}</span>}
				</button>
			</div>
		</div>
	)

	return (
		<>
			{/* Mobile toggle */}
			<Button
				variant='ghost'
				size='icon'
				className='fixed top-3 left-3 z-50 lg:hidden h-9 w-9 glass rounded-lg'
				onClick={() => setMobileOpen(!mobileOpen)}
			>
				{mobileOpen ? <X className='w-4 h-4' /> : <Menu className='w-4 h-4' />}
			</Button>

			{/* Mobile overlay */}
			{mobileOpen && (
				<div
					className='fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden'
					onClick={() => setMobileOpen(false)}
				/>
			)}

			{/* Sidebar */}
			<aside
				className={`fixed top-0 left-0 h-full z-40 bg-sidebar border-r border-sidebar-border transition-all duration-300
					${mobileOpen ? 'translate-x-0' : '-translate-x-full'}
					lg:translate-x-0 lg:static
					${collapsed ? 'w-16' : 'w-60'}
				`}
			>
				{sidebarContent}
			</aside>
		</>
	)
}
