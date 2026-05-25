import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { getDashboardPath } from '@/shared/lib/getDashboardPath'
import { useAuth } from '@/shared/store/useAuthStoreValue'
import { Eye, EyeOff, Loader2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { Link, useNavigate } from 'react-router-dom'
import AnimatedBackground from '../../../components/AnimatedBackground'
import GssLogo from '../../../components/GssLogo'
import { useLogin } from '../hooks/useAuth'
import { LoginDto } from '../types/auth.types'

export default function Login() {
	const navigate = useNavigate()
	const { user, isAuthInitialized } = useAuth()

	const [showPassword, setShowPassword] = useState(false)
	const [error, setError] = useState('')
	const { t } = useTranslation()
	const loginMutation = useLogin()

	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
	} = useForm({
		defaultValues: { email: '', password: '' },
	})

	useEffect(() => {
		if (!isAuthInitialized && user) {
			const path = getDashboardPath(user.userType)
			navigate(path, { replace: true })
		}
	}, [isAuthInitialized, user, navigate])

	const onSubmit = async (payload: LoginDto) => {
		setError('')
		try {
			const { data } = await loginMutation.mutateAsync(payload)

			const path = getDashboardPath(data.user.userType)
			navigate(path, { replace: true })
		} catch (err) {
			setError(
				err instanceof Error ? err.message : 'Login failed. Please try again.',
			)
		}
	}

	return (
		<div className='relative min-h-screen flex items-center justify-center p-4'>
			<AnimatedBackground />

			<div className='relative z-10 w-full max-w-sm'>
				<div className='flex justify-center mb-8'>
					<Link to='/'>
						<GssLogo size='lg' />
					</Link>
				</div>

				<div className='glass-strong rounded-2xl p-6 lg:p-8'>
					<div className='text-center mb-6'>
						<h1 className='text-xl font-bold text-foreground mb-1'>
							{t('auth.signin.title')}
						</h1>
						<p className='text-sm text-muted-foreground'>
							{t('auth.signin.description')}
						</p>
					</div>

					{error && (
						<div className='mb-4 p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-sm text-destructive'>
							{error}
						</div>
					)}

					<div className='mb-4 p-3 rounded-lg bg-primary/5 border border-primary/10 text-xs text-muted-foreground'>
						Demo:{' '}
						<span className='font-mono text-foreground'>admin@gss.io</span> /{' '}
						<span className='font-mono text-foreground'>admin123</span>
					</div>

					<form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
						<div className='space-y-2'>
							<Label htmlFor='email' className='text-sm text-foreground'>
								{t('auth.signin.email')}
							</Label>
							<Input
								id='email'
								type='email'
								placeholder='you@example.com'
								className='bg-muted/30 border-border/50 focus:border-primary/50'
								{...register('email', {
									required: 'Email is required',
									pattern: { value: /^\S+@\S+$/i, message: 'Invalid email' },
								})}
							/>
							{errors.email && (
								<p className='text-xs text-destructive'>
									{errors.email.message}
								</p>
							)}
						</div>

						<div className='space-y-2'>
							<Label htmlFor='password' className='text-sm text-foreground'>
								{t('auth.signin.password')}
							</Label>
							<div className='relative'>
								<Input
									id='password'
									type={showPassword ? 'text' : 'password'}
									placeholder='••••••••'
									className='bg-muted/30 border-border/50 focus:border-primary/50 pr-10'
									{...register('password', {
										required: 'Password is required',
										minLength: { value: 4, message: 'Minimum 4 characters' },
									})}
								/>
								<button
									type='button'
									onClick={() => setShowPassword(!showPassword)}
									className='absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground'
								>
									{showPassword ? (
										<EyeOff className='w-4 h-4' />
									) : (
										<Eye className='w-4 h-4' />
									)}
								</button>
							</div>
							{errors.password && (
								<p className='text-xs text-destructive'>
									{errors.password.message}
								</p>
							)}
						</div>

						<Button
							type='submit'
							className='w-full bg-primary hover:bg-primary/90 text-primary-foreground'
							disabled={isSubmitting}
						>
							{isSubmitting ? (
								<>
									<Loader2 className='w-4 h-4 mr-2 animate-spin' />{' '}
									{t('auth.signin.signingIn')}
								</>
							) : (
								'Sign In'
							)}
						</Button>
					</form>

					<p className='text-center text-sm text-muted-foreground mt-5'>
						{t('auth.signin.question')}{' '}
						<Link
							to='/register'
							className='text-primary hover:underline font-medium'
						>
							{t('auth.signin.action')}
						</Link>
					</p>
				</div>
			</div>
		</div>
	)
}
