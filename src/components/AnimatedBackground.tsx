import { motion } from 'framer-motion'

const orbs = [
	{
		size: 300,
		x: '10%',
		y: '20%',
		color: 'from-cyan-500/10 to-blue-600/5',
		delay: 0,
		duration: 20,
	},
	{
		size: 200,
		x: '70%',
		y: '60%',
		color: 'from-indigo-500/8 to-purple-600/4',
		delay: 5,
		duration: 25,
	},
	{
		size: 250,
		x: '50%',
		y: '10%',
		color: 'from-blue-400/6 to-cyan-500/3',
		delay: 10,
		duration: 22,
	},
	{
		size: 180,
		x: '80%',
		y: '80%',
		color: 'from-cyan-400/8 to-indigo-500/4',
		delay: 3,
		duration: 18,
	},
]

export default function AnimatedBackground() {
	return (
		<div className='fixed inset-0 overflow-hidden pointer-events-none z-0'>
			{/* Grid pattern */}
			<div
				className='absolute inset-0 opacity-[0.03]'
				style={{
					backgroundImage: `linear-gradient(hsl(199 89% 48% / 0.3) 1px, transparent 1px),
                            linear-gradient(90deg, hsl(199 89% 48% / 0.3) 1px, transparent 1px)`,
					backgroundSize: '60px 60px',
				}}
			/>

			{/* Floating orbs */}
			{orbs.map((orb, i) => (
				<motion.div
					key={i}
					className={`absolute rounded-full bg-gradient-to-br ${orb.color} blur-3xl`}
					style={{
						width: orb.size,
						height: orb.size,
						left: orb.x,
						top: orb.y,
					}}
					animate={{
						x: [0, 30, -20, 10, 0],
						y: [0, -20, 15, -10, 0],
						scale: [1, 1.1, 0.95, 1.05, 1],
					}}
					transition={{
						duration: orb.duration,
						delay: orb.delay,
						repeat: Infinity,
						ease: 'easeInOut',
					}}
				/>
			))}

			{/* Radial gradient overlay */}
			<div className='absolute inset-0 bg-gradient-to-b from-transparent via-background/50 to-background' />
		</div>
	)
}
