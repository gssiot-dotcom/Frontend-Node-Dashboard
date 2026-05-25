'use client'

import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'
import { ArrowLeft, FileQuestion, Home } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'

export default function PageNotFound() {
	const navigate = useNavigate()

	return (
		<div className='min-h-screen bg-background flex items-center justify-center p-4 relative overflow-hidden'>
			{/* Background blur elements */}
			<div className='absolute top-1/4 left-1/4 w-64 h-64 bg-primary/5 rounded-full blur-3xl' />
			<div className='absolute bottom-1/4 right-1/4 w-48 h-48 bg-muted/20 rounded-full blur-3xl' />

			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5 }}
				className='relative z-10 w-full max-w-md'
			>
				<div className='glass rounded-2xl p-8 sm:p-10 text-center'>
					{/* Icon */}
					<div className='inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-muted/50 mb-6'>
						<FileQuestion
							className='w-8 h-8 sm:w-10 sm:h-10 text-muted-foreground'
							strokeWidth={1.5}
						/>
					</div>

					{/* 404 Number */}
					<h1 className='text-6xl sm:text-7xl font-bold text-foreground/10 mb-2'>
						404
					</h1>

					{/* Title */}
					<h2 className='text-xl sm:text-2xl font-semibold text-foreground mb-2'>
						페이지를 찾을 수 없습니다
					</h2>

					{/* Description */}
					<p className='text-sm text-muted-foreground mb-8'>
						요청하신 페이지가 존재하지 않거나 이동되었습니다.
					</p>

					{/* Actions */}
					<div className='flex flex-col sm:flex-row items-center justify-center gap-3'>
						<Button
							variant='outline'
							onClick={() => navigate(-1)}
							className='w-full sm:w-auto gap-2'
						>
							<ArrowLeft className='w-4 h-4' />
							이전 페이지
						</Button>
						<Button asChild className='w-full sm:w-auto gap-2'>
							<Link to='/'>
								<Home className='w-4 h-4' />
								홈으로 이동
							</Link>
						</Button>
					</div>
				</div>
			</motion.div>
		</div>
	)
}
