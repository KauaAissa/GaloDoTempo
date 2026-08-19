// Cópia autocontida de server/src/weather.ts: evita importar arquivos fora de api/,
// que a Vercel trata como módulo externo e quebra com ERR_REQUIRE_ESM em runtime.
import axios from 'axios'

export type WeatherState = 'dry' | 'transition' | 'rainy'

export interface WeatherReading {
  temperature: number
  humidity: number
  state: WeatherState
  observedAt: string
  fetchedAt: string
}

interface ThingSpeakFeed {
  created_at?: unknown
  field1?: unknown
  field2?: unknown
}

export class WeatherDataError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'WeatherDataError'
  }
}

export function classifyHumidity(humidity: number): WeatherState {
  if (humidity < 50) return 'dry'
  if (humidity <= 70) return 'transition'
  return 'rainy'
}

function parseReading(value: unknown, label: string): number {
  if (typeof value !== 'string' && typeof value !== 'number') {
    throw new WeatherDataError(`${label} não foi informado pelo sensor.`)
  }
  const parsed = Number(value)
  if (!Number.isFinite(parsed)) {
    throw new WeatherDataError(`${label} contém um valor inválido.`)
  }
  return parsed
}

export async function getLatestWeather(): Promise<WeatherReading> {
  const channelId = process.env.THINGSPEAK_CHANNEL_ID
  if (!channelId || channelId === 'SEU_CHANNEL_ID') {
    throw new WeatherDataError('THINGSPEAK_CHANNEL_ID não está configurado.')
  }

  const url = `https://api.thingspeak.com/channels/${encodeURIComponent(channelId)}/feeds/last.json`
  const response = await axios.get<ThingSpeakFeed>(url, {
    params: process.env.THINGSPEAK_READ_API_KEY ? { api_key: process.env.THINGSPEAK_READ_API_KEY } : undefined,
    timeout: 8_000,
  })
  const temperature = parseReading(response.data.field1, 'Temperatura')
  const humidity = parseReading(response.data.field2, 'Umidade')
  if (humidity < 0 || humidity > 100) {
    throw new WeatherDataError('Umidade fora do intervalo de 0 a 100%.')
  }

  return {
    temperature,
    humidity,
    state: classifyHumidity(humidity),
    observedAt: typeof response.data.created_at === 'string' ? response.data.created_at : new Date().toISOString(),
    fetchedAt: new Date().toISOString(),
  }
}
