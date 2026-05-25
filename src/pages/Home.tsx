import { LanguageToggle } from '@/components/LanguageToggle'
import { ThemeToggle } from '@/components/ThemeToggle'
import { Button } from '@/components/ui/button'
import { getDashboardPath } from '@/shared/lib/getDashboardPath'
import { useAuth } from '@/shared/store/useAuthStoreValue'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowRight, Globe, Menu, Shield, X, Zap } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import AnimatedBackground from '../components/AnimatedBackground'
import GssLogo from '../components/GssLogo'

const features = [
	{
		icon: Zap,
		title: 'home.cards.realTimeMonitoring.title',
		desc: 'home.cards.realTimeMonitoring.description',
	},
	{
		icon: Shield,
		title: 'home.cards.instantAlerts.title',
		desc: 'home.cards.instantAlerts.description',
	},
	{
		icon: Globe,
		title: 'home.cards.remoteAccess.title',
		desc: 'home.cards.remoteAccess.description',
	},
]

export default function Home() {
	// const { isAuthenticated, isAuthInitialized } = useGssAuth()
	const [menuOpen, setMenuOpen] = useState(false)
	const { t } = useTranslation()
	const { isAuthenticated, isAuthInitialized, user } = useAuth()
	const isGuest = isAuthInitialized && !isAuthenticated
	const isLoggedIn = isAuthInitialized && isAuthenticated && user
	const dashboardPath = user ? getDashboardPath(user.userType) : '/login'

	return (
		<div className='relative min-h-screen flex flex-col overflow-hidden'>
			<AnimatedBackground />

			{/* Header */}
			<header className='relative z-10 flex items-center justify-between px-4 py-3 lg:px-12 lg:py-4'>
				<GssLogo />

				{/* Desktop nav */}
				<div className='hidden sm:flex items-center gap-4'>
					<LanguageToggle />
					<ThemeToggle />

					{isGuest && (
						<>
							<Link to='/login'>
								<Button
									variant='ghost'
									size='sm'
									className='text-muted-foreground hover:text-secondary h-9 px-3 text-xs bg-secondary'
								>
									{t('common.signin')}
								</Button>
							</Link>
							<Link to='/register'>
								<Button
									size='sm'
									className='bg-primary/90 hover:bg-primary text-primary-foreground h-9 px-3 text-xs'
								>
									{t('common.signup')}
								</Button>
							</Link>
						</>
					)}

					{isLoggedIn && (
						<Link to={dashboardPath}>
							<Button
								size='sm'
								className='bg-primary/90 hover:bg-primary text-primary-foreground h-9 px-3 text-xs'
							>
								{t('common.goToDashboard')}
								<ArrowRight className='w-3 h-3 ml-1' />
							</Button>
						</Link>
					)}
				</div>

				{/* Mobile nav */}
				<div className='flex sm:hidden items-center gap-2'>
					<LanguageToggle />
					<ThemeToggle />

					{isGuest && (
						<button
							onClick={() => setMenuOpen(o => !o)}
							className='
              h-9 w-9 rounded-md flex items-center justify-center
              bg-secondary hover:bg-muted transition-colors duration-200
        border border-primary
            '
						>
							{menuOpen ? (
								<X className='w-4 h-4 text-primary' />
							) : (
								<Menu className='w-4 h-4 text-primary' />
							)}
						</button>
					)}

					{isLoggedIn && (
						<Link to={dashboardPath}>
							<Button
								size='sm'
								className='bg-primary/90 hover:bg-primary text-primary-foreground h-9 px-3 text-xs'
							>
								{t('common.goToDashboard')}
								<ArrowRight className='w-3 h-3 ml-1' />
							</Button>
						</Link>
					)}
				</div>

				{/* Mobile dropdown */}
				<AnimatePresence>
					{menuOpen && isGuest && (
						<motion.div
							initial={{ height: 0, opacity: 0, y: -10 }}
							animate={{ height: 'auto', opacity: 1, y: 0 }}
							exit={{ height: 0, opacity: 0, y: -10 }}
							transition={{ duration: 0.25, ease: 'easeInOut' }}
							className='absolute top-full left-0 w-full overflow-hidden sm:hidden z-50'
						>
							<div className='mx-4 mt-2 text-primary dark:text-secondary-foreground rounded-xl border border-border bg-card/95 backdrop-blur-xl shadow-lg'>
								<Link
									to='/login'
									onClick={() => setMenuOpen(false)}
									className='block px-4 py-3 rounded-xl text-sm font-medium hover:bg-primary/10 transition-colors'
								>
									{t('common.signin')}
								</Link>

								<div className='border-t border-border/50' />

								<Link
									to='/register'
									onClick={() => setMenuOpen(false)}
									className='block px-4 py-3 rounded-xl text-sm font-medium hover:bg-primary/10 transition-colors'
								>
									{t('common.signup')}
								</Link>
							</div>
						</motion.div>
					)}
				</AnimatePresence>
			</header>

			{/* Hero */}
			<main className='relative flex-1 flex flex-col items-center justify-center px-6 text-center'>
				<motion.div
					initial={{ opacity: 0, y: 30 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.8, ease: 'easeOut' }}
					className='max-w-2xl'
				>
					<div className='inline-flex items-center gap-2 px-3 py-1 rounded-full glass text-xs text-muted-foreground mb-6'>
						<span className='w-1.5 h-1.5 rounded-full bg-gss-safe animate-pulse' />
						IoT Monitoring Platform
					</div>

					<h1 className='text-4xl lg:text-6xl font-bold tracking-tight mb-4 leading-tight'>
						<span className='text-foreground'>{t('home.header.title1')}</span>
						<span className='text-gradient'>{t('home.header.title2')}</span>
						<br />
						<span className='text-foreground'>{t('home.header.title3')}</span>
					</h1>

					<p className='text-base lg:text-lg text-muted-foreground max-w-lg mx-auto mb-8 leading-relaxed'>
						{t('home.header.description')}
					</p>

					{/* CTA */}
					<div className='flex items-center justify-center gap-3'>
						{isGuest ? (
							<>
								<Link to='/login'>
									<Button
										size='lg'
										className='bg-primary hover:bg-primary/90 text-primary-foreground px-8 glow-primary'
									>
										{t('common.signin')}
									</Button>
								</Link>
								<Link to='/register'>
									<Button
										size='lg'
										variant='outline'
										className='border-border/50 hover:bg-muted/70 hover:text-secondary-foreground px-8'
									>
										{t('common.signup')}
									</Button>
								</Link>
							</>
						) : isLoggedIn ? (
							<Link to={dashboardPath}>
								<Button
									size='lg'
									className='bg-primary hover:bg-primary/90 text-primary-foreground px-8 glow-primary'
								>
									{t('common.goToDashboard')}{' '}
									<ArrowRight className='w-4 h-4 ml-2' />
								</Button>
							</Link>
						) : null}
					</div>
				</motion.div>

				{/* Features */}
				<motion.div
					initial={{ opacity: 0, y: 40 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.8, delay: 0.3, ease: 'easeOut' }}
					className='grid grid-cols-1 md:grid-cols-3 gap-4 mt-16 max-w-3xl w-full'
				>
					{features.map((f, i) => (
						<div
							key={i}
							className='glass rounded-xl p-5 text-left hover:bg-white/[0.06] transition-all duration-300'
						>
							<div className='w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center mb-3'>
								<f.icon className='w-4 h-4 text-primary' />
							</div>
							<h3 className='text-sm font-semibold text-foreground mb-1'>
								{t(f.title)}
							</h3>
							<p className='text-xs text-muted-foreground leading-relaxed'>
								{t(f.desc)}
							</p>
						</div>
					))}
				</motion.div>
			</main>

			{/* Footer accent */}
			<div className='relative z-10 text-center py-6'>
				<p className='text-xs text-muted-foreground/50'>
					© 2026 GSS.io — Global Structural Sensing
				</p>
			</div>
		</div>
	)
}
