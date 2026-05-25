import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { CheckCircle, Eye, EyeOff, Loader2 } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { Link, useNavigate } from 'react-router-dom'
import AnimatedBackground from '../../../components/AnimatedBackground'
import GssLogo from '../../../components/GssLogo'
import { useSignup } from '../hooks/useAuth'
import { SignupDto } from '../types/auth.types'

export default function Register() {
	const navigate = useNavigate()

	const [showPassword, setShowPassword] = useState(false)
	const [error, setError] = useState('')
	const [success, setSuccess] = useState(false)
	const { t } = useTranslation()

	const {
		register,
		handleSubmit,
		watch,
		formState: { errors, isSubmitting },
	} = useForm({
		defaultValues: {
			name: '',
			email: '',
			phone: '',
			userType: 'worker',
			password: '',
			confirmPassword: '',
		} as SignupDto,
	})

	const password = watch('password')

	const signupMutation = useSignup()

	const onSubmit = async (data: SignupDto) => {
		setError('')
		try {
			await signupMutation.mutateAsync(data)
			setSuccess(true)
			setTimeout(() => navigate('/login'), 2000)
		} catch (err) {
			setError(
				err instanceof Error ? err.message : 'Signup failed. Please try again.',
			)
		}
	}

	if (success) {
		return (
			<div className='relative min-h-screen flex items-center justify-center p-4'>
				<AnimatedBackground />
				<div className='relative z-10 glass-strong rounded-2xl p-8 text-center max-w-sm w-full'>
					<div className='w-14 h-14 rounded-full bg-gss-safe/10 flex items-center justify-center mx-auto mb-4'>
						<CheckCircle className='w-7 h-7 text-gss-safe' />
					</div>
					<h2 className='text-lg font-bold text-foreground mb-2'>
						Account Created
					</h2>
					<p className='text-sm text-muted-foreground'>
						Redirecting to login...
					</p>
				</div>
			</div>
		)
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
							{t('auth.register.title')}
						</h1>
						<p className='text-sm text-muted-foreground'>
							{t('auth.register.description')}
						</p>
					</div>

					{error && (
						<div className='mb-4 p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-sm text-destructive'>
							{error}
						</div>
					)}

					<form onSubmit={handleSubmit(onSubmit)} className='space-y-3'>
						<div className='space-y-1.5'>
							<Label htmlFor='name' className='text-sm'>
								{t('auth.register.name')}
							</Label>
							<Input
								id='name'
								placeholder='Your name'
								className='bg-muted/30 border-border/50 focus:border-primary/50'
								{...register('name', { required: 'Name is required' })}
							/>
							{errors.name && (
								<p className='text-xs text-destructive'>
									{errors.name.message}
								</p>
							)}
						</div>

						<div className='space-y-1.5'>
							<Label htmlFor='email' className='text-sm'>
								{t('auth.register.email')}
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

						<div className='space-y-1.5'>
							<Label htmlFor='phone' className='text-sm'>
								{t('auth.register.phone')}
							</Label>
							<Input
								id='phone'
								type='tel'
								placeholder='010-0000-0000'
								className='bg-muted/30 border-border/50 focus:border-primary/50'
								{...register('phone', { required: 'Phone is required' })}
							/>
							{errors.phone && (
								<p className='text-xs text-destructive'>
									{errors.phone.message}
								</p>
							)}
						</div>

						<div className='space-y-1.5'>
							<Label htmlFor='password' className='text-sm'>
								{t('auth.register.password')}
							</Label>
							<div className='relative'>
								<Input
									id='password'
									type={showPassword ? 'text' : 'password'}
									placeholder='••••••••'
									className='bg-muted/30 border-border/50 focus:border-primary/50 pr-10'
									{...register('password', {
										required: 'Password is required',
										minLength: { value: 6, message: 'Minimum 6 characters' },
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

						<div className='space-y-1.5'>
							<Label htmlFor='confirmPassword' className='text-sm'>
								{t('auth.register.confirmPassword')}
							</Label>
							<Input
								id='confirmPassword'
								type='password'
								placeholder='••••••••'
								className='bg-muted/30 border-border/50 focus:border-primary/50'
								{...register('confirmPassword', {
									required: 'Please confirm your password',
									validate: value =>
										value === password || 'Passwords do not match',
								})}
							/>
							{errors.confirmPassword && (
								<p className='text-xs text-destructive'>
									{errors.confirmPassword.message}
								</p>
							)}
						</div>

						<Button
							type='submit'
							className='w-full bg-primary hover:bg-primary/90 text-primary-foreground mt-2'
							disabled={isSubmitting}
						>
							{isSubmitting ? (
								<>
									<Loader2 className='w-4 h-4 mr-2 animate-spin' />{' '}
									{t('auth.register.signingUp')}
								</>
							) : (
								'Create Account'
							)}
						</Button>
					</form>

					<p className='text-center text-sm text-muted-foreground mt-5'>
						{t('auth.register.question')}{' '}
						<Link
							to='/login'
							className='text-primary hover:underline font-medium'
						>
							{t('auth.register.action')}
						</Link>
					</p>
				</div>
			</div>
		</div>
	)
}
