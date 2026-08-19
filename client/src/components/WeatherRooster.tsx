import { motion } from 'framer-motion'
import type { WeatherState } from '../types'

export function WeatherRooster({ state }: { state: WeatherState }) {
  const label = state === 'dry' ? 'ensolarado' : state === 'rainy' ? 'chuvoso' : 'neutro'
  return (
    <motion.div className={`rooster rooster--${state}`} key={state} initial={{ opacity: 0, scale: .82, rotate: -4 }} animate={{ opacity: 1, scale: 1, rotate: 0, y: [0, -7, 0] }} transition={{ opacity: { duration: .5 }, scale: { duration: .5 }, y: { duration: 4, repeat: Infinity, ease: 'easeInOut' } }} role="img" aria-label={`Galo em estado ${label}`}>
      {state === 'dry' && <div className="rooster__sun" />}
      {state === 'rainy' && <div className="rooster__cloud">•••</div>}
      <div className="rooster__tail rooster__tail--back" /><div className="rooster__tail rooster__tail--front" />
      <div className="rooster__body"><div className="rooster__wing" /></div><div className="rooster__neck" />
      <div className="rooster__head"><i className="rooster__comb rooster__comb--one" /><i className="rooster__comb rooster__comb--two" /><i className="rooster__comb rooster__comb--three" /><i className="rooster__eye" /><i className="rooster__beak" /><i className="rooster__wattle" /></div>
      <div className="rooster__leg rooster__leg--left" /><div className="rooster__leg rooster__leg--right" /><div className="rooster__ground" />
    </motion.div>
  )
}