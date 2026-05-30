import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'
import { ArrowLeft, LogIn, ShieldOff } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

export default function UnauthorizedPage() {
	const { t } = useTranslation()

	return (
		<div className='min-h-screen bg-background flex items-center justify-center p-4'>
			{/* Background subtle pattern */}
			<div className='absolute inset-0 overflow-hidden pointer-events-none'>
				<div className='absolute top-1/4 -left-20 w-72 h-72 bg-gss-danger/5 rounded-full blur-3xl' />
				<div className='absolute bottom-1/4 -right-20 w-72 h-72 bg-gss-danger/5 rounded-full blur-3xl' />
			</div>

			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5 }}
				className='relative w-full max-w-md'
			>
				<div className='glass-strong rounded-2xl p-6 sm:p-8 text-center'>
					{/* Icon */}
					<motion.div
						initial={{ scale: 0 }}
						animate={{ scale: 1 }}
						transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
						className='mx-auto w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gss-danger/10 flex items-center justify-center mb-5 sm:mb-6'
					>
						<ShieldOff
							className='w-8 h-8 sm:w-10 sm:h-10 text-gss-danger'
							strokeWidth={1.5}
						/>
					</motion.div>

					{/* Error code */}
					<motion.p
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						transition={{ delay: 0.3 }}
						className='text-xs sm:text-sm font-mono text-gss-danger font-semibold tracking-wider mb-2'
					>
						{t('pages.unauthorized.code')}
					</motion.p>

					{/* Title */}
					<motion.h1
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						transition={{ delay: 0.35 }}
						className='text-xl sm:text-2xl font-bold text-foreground mb-2'
					>
						{t('pages.unauthorized.title')}
					</motion.h1>

					{/* Subtitle */}
					<motion.p
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						transition={{ delay: 0.4 }}
						className='text-sm sm:text-base text-muted-foreground mb-6 sm:mb-8'
					>
						{t('pages.unauthorized.descriptionLine1')}
						<br />
						{t('pages.unauthorized.descriptionLine2')}
					</motion.p>

					{/* Actions */}
					<motion.div
						initial={{ opacity: 0, y: 10 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.5 }}
						className='flex flex-col sm:flex-row gap-3 justify-center'
					>
						<Button asChild variant='outline' className='gap-2 text-sm'>
							<Link to='/'>
								<ArrowLeft className='w-4 h-4' />
								{t('common.backHome')}
							</Link>
						</Button>
						<Button
							asChild
							className='gap-2 text-sm bg-primary hover:bg-primary/90'
						>
							<Link to='/login'>
								<LogIn className='w-4 h-4' />
								{t('common.signin')}
							</Link>
						</Button>
					</motion.div>
				</div>

				{/* Footer hint */}
				<motion.p
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ delay: 0.6 }}
					className='text-center text-xs text-muted-foreground mt-4'
				>
					{t('pages.unauthorized.footer')}
				</motion.p>
			</motion.div>
		</div>
	)
}
