import axios from 'axios'
import cors from 'cors'
import { config } from 'dotenv'
import express from 'express'
import helmet from 'helmet'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { getLatestWeather, WeatherDataError } from './weather.js'

const serverDirectory = resolve(dirname(fileURLToPath(import.meta.url)), '..')
config({ path: [resolve(serverDirectory, '.env'), resolve(serverDirectory, '../.env')], quiet: true })

const app = express()
const port = Number(process.env.PORT) || 3001

app.disable('x-powered-by')
app.use(helmet())
app.use(cors({ origin: process.env.CLIENT_ORIGIN ?? 'http://localhost:5173' }))

app.get('/health', (_request, response) => response.json({ status: 'ok' }))

app.get('/api/weather', async (_request, response) => {
  try {
    response.set('Cache-Control', 'no-store')
    response.json(await getLatestWeather())
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
})

app.listen(port, () => console.log(`API do Galo do Tempo disponível em http://localhost:${port}`))