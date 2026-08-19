export type WeatherState = 'dry' | 'transition' | 'rainy'

export interface WeatherReading {
  temperature: number
  humidity: number
  state: WeatherState
  observedAt: string
  fetchedAt: string
}