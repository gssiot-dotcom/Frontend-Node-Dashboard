import { useLanguage } from '@/context/LanguageContext'

export function LanguageToggle() {
	const { language, toggle } = useLanguage()

	return (
		<button
			onClick={toggle}
			className='
        h-9 px-2 rounded-md flex items-center gap-1
       bg-secondary hover:bg-muted transition-colors duration-200
        border border-border text-foreground
      '
			aria-label='Toggle language'
		>
			<span
				className={`text-[12px] font-medium tracking-wide transition-colors ${
					language === 'en' ? 'text-primary' : 'text-foreground/35'
				}`}
			>
				EN
			</span>
			<span className='text-[12px] text-foreground/20 select-none'>·</span>
			<span
				className={`text-[12px] font-medium tracking-wide transition-colors ${
					language === 'ko' ? 'text-primary' : 'text-foreground/35'
				}`}
			>
				한
			</span>
		</button>
	)
}
