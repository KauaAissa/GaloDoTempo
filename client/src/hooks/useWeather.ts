import { useEffect, useEffectEvent, useState } from 'react'
import type { WeatherReading } from '../types'

const POLL_INTERVAL = 15_000
const API_URL = `${import.meta.env.VITE_API_URL ?? ''}/api/weather`

export function useWeather() {
  const [weather, setWeather] = useState<WeatherReading | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  const fetchWeather = useEffectEvent(async (signal: AbortSignal) => {
    setRefreshing(true)
    try {
      const response = await fetch(API_URL, { signal })
      const body = (await response.json()) as WeatherReading | { error?: string }
      if (!response.ok) {
        throw new Error('error' in body && body.error ? body.error : 'Falha ao buscar o clima.')
      }
      setWeather(body as WeatherReading)
      setError(null)
    } catch (caughtError) {
      if (!signal.aborted) {
        setError(caughtError instanceof Error ? caughtError.message : 'Falha ao buscar o clima.')
      }
    } finally {
      if (!signal.aborted) {
        setLoading(false)
        setRefreshing(false)
      }
    }
  })

  useEffect(() => {
    const controller = new AbortController()
    queueMicrotask(() => void fetchWeather(controller.signal))
    const interval = window.setInterval(() => {
      if (!document.hidden) void fetchWeather(controller.signal)
    }, POLL_INTERVAL)

    return () => {
      controller.abort()
      window.clearInterval(interval)
    }
  }, [])

  return { weather, error, loading, refreshing }
}