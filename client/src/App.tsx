import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { CloudRain, Droplets, RefreshCw, Sun, Thermometer, Wifi, WifiOff } from 'lucide-react'
import { WeatherParticles } from './components/WeatherParticles'
import { WeatherRooster } from './components/WeatherRooster'
import { useWeather } from './hooks/useWeather'
import type { WeatherState } from './types'

const stateContent: Record<WeatherState, { label: string; phrase: string; icon: typeof Sun }> = {
  dry: { label: 'Tempo seco', phrase: 'O galo avisou: tempo seco, pode estender a roupa!', icon: Sun },
  transition: { label: 'Tempo indeciso', phrase: 'O galo está confuso... melhor levar um guarda-chuva por precaução.', icon: Droplets },
  rainy: { label: 'Tempo chuvoso', phrase: 'Corre que o galo ficou roxo: recolha os tapetes e a roupa do varal!', icon: CloudRain },
}

function App() {
  const { weather, error, loading, refreshing } = useWeather()
  const prefersReducedMotion = useReducedMotion()
  const state = weather?.state ?? 'transition'
  const content = stateContent[state]
  const StateIcon = content.icon

  return (
    <motion.main className={`weather-app weather-app--${state}`} animate={{ backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'] }} transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}>
      <WeatherParticles state={state} />
      <div className="shell">
        <header>
          <div><p className="eyebrow">Estação doméstica</p><h1>Galo do Tempo</h1></div>
          <div className="glass status" title={error ?? 'Sensor conectado'}>{error ? <WifiOff size={15} /> : <Wifi size={15} />}<span>{error ? 'Última leitura' : 'Ao vivo'}</span><RefreshCw size={13} className={refreshing ? 'spin' : ''} /></div>
        </header>
        <section className="content">
          <div className="reading">
            {prefersReducedMotion ? (
              <div key={state}>
                <div className="state-label"><StateIcon size={18} /><span>{content.label}</span></div>
                <h2>{content.phrase}</h2>
              </div>
            ) : (
              <AnimatePresence mode="wait">
                <motion.div key={state} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -14 }} transition={{ duration: .55 }}>
                  <div className="state-label"><StateIcon size={18} /><span>{content.label}</span></div>
                  <h2>{content.phrase}</h2>
                </motion.div>
              </AnimatePresence>
            )}
            <div className="metrics">
              <article className="glass metric"><Thermometer className="warm" size={22} /><div><p>Temperatura</p><strong>{weather ? weather.temperature.toFixed(1) : '--'}<small>°C</small></strong></div></article>
              <article className="glass metric"><Droplets className="cool" size={22} /><div><p>Umidade</p><strong>{weather ? weather.humidity.toFixed(0) : '--'}<small>%</small></strong></div></article>
            </div>
            {error && <p className="error" role="status">{error} {weather && 'Exibindo a última medição disponível.'}</p>}
          </div>
          <div className="rooster-stage">{loading && !weather ? <div className="loading">Consultando o galinheiro...</div> : <WeatherRooster state={state} />}</div>
        </section>
        <footer><span>ESP8266 + DHT11</span></footer>
      </div>
    </motion.main>
  )
}

export default App
