import axios from 'axios'
import { getLatestWeather, WeatherDataError } from './_lib/weather'

interface VercelLikeRequest {
  method?: string
}

interface VercelLikeResponse {
  setHeader(name: string, value: string): void
  status(code: number): { json(body: unknown): void }
}

export default async function handler(request: VercelLikeRequest, response: VercelLikeResponse) {
  if (request.method && request.method !== 'GET') {
    response.setHeader('Allow', 'GET')
    response.status(405).json({ error: 'Método não permitido.' })
    return
  }

  response.setHeader('Cache-Control', 'no-store')
  try {
    response.status(200).json(await getLatestWeather())
  } catch (error) {
    if (error instanceof WeatherDataError) {
      response.status(503).json({ error: error.message })
      return
    }
    if (axios.isAxiosError(error)) {
      response.status(502).json({
        error: error.response?.status === 404 ? 'Canal ThingSpeak não encontrado.' : 'ThingSpeak indisponível no momento.',
      })
      return
    }
    console.error('Erro inesperado ao consultar o clima:', error)
    response.status(500).json({ error: 'Erro interno ao consultar o clima.' })
  }
}
