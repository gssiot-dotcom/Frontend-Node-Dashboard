import {
	Cloud,
	CloudLightning,
	Compass,
	Droplets,
	Thermometer,
	Wind,
} from 'lucide-react'
import { useTranslation } from 'react-i18next'

const WEATHER_DATA = {
	windSpeed: '12 m/s',
	windDirection: 'NW',
	weatherKey: 'weather.clear',
	temperature: '24°C',
	humidity: '65%',
	typhoonKey: 'weather.none',
}

export function WeatherWidget() {
	const { t } = useTranslation()

	const weatherItems = [
		{
			icon: Wind,
			label: t('weather.windSpeed'),
			value: WEATHER_DATA.windSpeed,
			color: 'text-sky-500',
		},
		{
			icon: Compass,
			label: t('weather.windDirection'),
			value: WEATHER_DATA.windDirection,
			color: 'text-emerald-500',
		},
		{
			icon: Cloud,
			label: t('weather.weather'),
			value: t(WEATHER_DATA.weatherKey),
			color: 'text-slate-400',
		},
		{
			icon: Thermometer,
			label: t('weather.temperature'),
			value: WEATHER_DATA.temperature,
			color: 'text-rose-500',
		},
		{
			icon: Droplets,
			label: t('weather.humidity'),
			value: WEATHER_DATA.humidity,
			color: 'text-blue-500',
		},
		{
			icon: CloudLightning,
			label: t('weather.typhoon'),
			value: t(WEATHER_DATA.typhoonKey),
			color: 'text-amber-500',
		},
	]

	return (
		<div className='bg-card/50 border border-border rounded-xl px-4 py-3'>
			<p className='text-xs text-muted-foreground mb-2 font-medium uppercase tracking-wider'>
				{t('weather.title')}
			</p>
			<div className='grid grid-cols-3 gap-x-5 gap-y-2'>
				{weatherItems.map((item, i) => (
					<div key={i} className='flex items-center gap-1.5'>
						<item.icon className={`h-4 w-4 shrink-0 ${item.color}`} />
						<span className='text-xs text-muted-foreground'>{item.label}:</span>
						<span className='text-xs font-medium text-foreground'>
							{item.value}
						</span>
					</div>
				))}
			</div>
		</div>
	)
}
