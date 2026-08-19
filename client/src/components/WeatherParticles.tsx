import { motion } from 'framer-motion'
import type { WeatherState } from '../types'

const particles = Array.from({ length: 28 }, (_, index) => ({
  id: index,
  left: `${(index * 37) % 100}%`,
  top: `${(index * 53) % 92}%`,
  delay: (index % 9) * 0.32,
  duration: 2.1 + (index % 5) * 0.35,
  size: 2 + (index % 4),
}))

export function WeatherParticles({ state }: { state: WeatherState }) {
  if (state === 'transition') {
    return <div className="fog" aria-hidden="true">{[0, 1, 2].map((layer) => <motion.i key={layer} style={{ top: `${24 + layer * 25}%` }} animate={{ x: ['-45%', '140%'], opacity: [0, .45, 0] }} transition={{ duration: 13 + layer * 3, repeat: Infinity, delay: layer * 2 }} />)}</div>
  }

  return (
    <div className="particles" aria-hidden="true">
      {particles.map((particle) => state === 'rainy' ? (
        <motion.i key={particle.id} className="raindrop" style={{ left: particle.left }} animate={{ y: ['0vh', '110vh'], x: [0, -30], opacity: [0, .85, .2] }} transition={{ duration: particle.duration, repeat: Infinity, delay: particle.delay, ease: 'linear' }} />
      ) : (
        <motion.i key={particle.id} className="sun-speck" style={{ left: particle.left, top: particle.top, width: particle.size, height: particle.size }} animate={{ y: [10, -22, 10], opacity: [.15, .9, .15], scale: [.7, 1.5, .7] }} transition={{ duration: particle.duration + 1, repeat: Infinity, delay: particle.delay }} />
      ))}
    </div>
  )
}