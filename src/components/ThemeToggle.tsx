import { useThemeContext } from '@/context/ThemeContext'
import { Moon, Sun } from 'lucide-react'

export function ThemeToggle() {
	const { theme, toggle } = useThemeContext()

	return (
		<button
			onClick={toggle}
			className='
        relative w-9 h-9 rounded-full flex items-center justify-center
        bg-secondary hover:bg-muted transition-colors duration-200
        border border-border text-foreground
      '
			aria-label='Toggle theme'
		>
			{theme === 'dark' ? (
				<Sun className='w-4 h-4 text-cyan-400' />
			) : (
				<Moon className='w-4 h-4 text-slate-600' />
			)}
		</button>
	)
}
