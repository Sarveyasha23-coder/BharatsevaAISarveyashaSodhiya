'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import {
  Cloud,
  CloudRain,
  Droplets,
  MapPin,
  Search,
  Sun,
  Wind,
} from 'lucide-react'
import toast from 'react-hot-toast'

interface WeatherData {
  location: string
  temperature: number
  condition: string
  humidity: number
  windSpeed: number
  forecast: Array<{
    day: string
    temp: number
    tempLow: number
    condition: string
    precipitationProbability: number
  }>
  agricultural: {
    suitable: string[]
    warnings: string[]
    irrigationWindow: string
  }
  source: string
  lastUpdated: string
}

export default function WeatherPage() {
  const [weather, setWeather] = useState<WeatherData | null>(null)
  const [location, setLocation] = useState('New Delhi')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    void fetchWeather()
  }, [])

  const fetchWeather = async (targetLocation?: string) => {
    setLoading(true)
    try {
      const response = await fetch(`/api/weather?location=${encodeURIComponent(targetLocation || location)}`)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch weather data')
      }

      setWeather(data)
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to fetch weather data')
    } finally {
      setLoading(false)
    }
  }

  const getWeatherIcon = (condition: string) => {
    const normalized = condition.toLowerCase()

    if (normalized.includes('rain')) {
      return <CloudRain className="h-8 w-8 text-blue-500" />
    }

    if (normalized.includes('clear') || normalized.includes('sun')) {
      return <Sun className="h-8 w-8 text-amber-500" />
    }

    return <Cloud className="h-8 w-8 text-slate-500" />
  }

  if (loading && !weather) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f4f1e8] pt-20">
        <div className="h-24 w-24 animate-spin rounded-full border-b-2 border-[#1b5cff]" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#f4f1e8] pt-20 text-slate-900">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 rounded-[34px] border border-slate-200 bg-white p-8 shadow-[0_30px_80px_rgba(15,23,42,0.08)]"
        >
          <div className="mb-6 inline-flex rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-600">
            Live weather intelligence
          </div>
          <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
            Better field decisions start with cleaner weather context.
          </h1>
          <p className="mt-4 max-w-3xl text-lg text-slate-600">
            Search any city or district and get live weather, quick agricultural warnings, and a five-day
            planning window.
          </p>

          <form
            onSubmit={(event) => {
              event.preventDefault()
              void fetchWeather(location)
            }}
            className="mt-8 max-w-xl"
          >
            <div className="relative">
              <MapPin className="pointer-events-none absolute left-4 top-4 h-5 w-5 text-slate-400" />
              <input
                value={location}
                onChange={(event) => setLocation(event.target.value)}
                placeholder="Search city or district"
                className="w-full rounded-full border border-slate-200 bg-slate-50 py-4 pl-12 pr-16 outline-none"
              />
              <button
                type="submit"
                className="absolute right-2 top-2 rounded-full bg-[#1b5cff] p-3 text-white"
              >
                <Search className="h-4 w-4" />
              </button>
            </div>
          </form>
        </motion.div>

        {weather && (
          <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-[34px] border border-slate-200 bg-white p-8 shadow-[0_30px_80px_rgba(15,23,42,0.08)]"
            >
              <div className="mb-8 flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm uppercase tracking-[0.22em] text-[#1b5cff]">Current conditions</p>
                  <h2 className="mt-2 text-3xl font-semibold">{weather.location}</h2>
                  <p className="mt-2 text-sm text-slate-500">
                    Source: {weather.source} | Updated {new Date(weather.lastUpdated).toLocaleString('en-IN')}
                  </p>
                </div>
                <div className="rounded-2xl bg-slate-50 p-4">{getWeatherIcon(weather.condition)}</div>
              </div>

              <div className="grid gap-6 md:grid-cols-[0.9fr_1.1fr]">
                <div>
                  <p className="text-6xl font-semibold">{weather.temperature} C</p>
                  <p className="mt-3 text-lg text-slate-600">{weather.condition}</p>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-[24px] bg-slate-50 p-4">
                    <Droplets className="mb-3 h-5 w-5 text-cyan-600" />
                    <p className="text-sm text-slate-500">Humidity</p>
                    <p className="mt-2 text-2xl font-semibold">{weather.humidity}%</p>
                  </div>
                  <div className="rounded-[24px] bg-slate-50 p-4">
                    <Wind className="mb-3 h-5 w-5 text-slate-700" />
                    <p className="text-sm text-slate-500">Wind speed</p>
                    <p className="mt-2 text-2xl font-semibold">{weather.windSpeed} km/h</p>
                  </div>
                </div>
              </div>

              <div className="mt-8 rounded-[28px] bg-[#0f172a] p-6 text-white">
                <p className="text-sm uppercase tracking-[0.18em] text-slate-300">Agricultural readout</p>
                <div className="mt-5 flex flex-wrap gap-3">
                  {weather.agricultural.suitable.map((crop) => (
                    <span
                      key={crop}
                      className="rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm"
                    >
                      {crop}
                    </span>
                  ))}
                </div>
                <p className="mt-5 text-sm text-slate-300">{weather.agricultural.irrigationWindow}</p>
                <div className="mt-5 space-y-2">
                  {weather.agricultural.warnings.map((warning) => (
                    <p key={warning} className="text-sm text-slate-200">
                      {warning}
                    </p>
                  ))}
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 }}
              className="rounded-[34px] border border-slate-200 bg-white p-8 shadow-[0_30px_80px_rgba(15,23,42,0.08)]"
            >
              <h2 className="text-2xl font-semibold">Five-day runway</h2>
              <div className="mt-6 space-y-4">
                {weather.forecast.map((day) => (
                  <div key={day.day} className="rounded-[24px] border border-slate-200 bg-slate-50 p-4">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="text-lg font-semibold">{day.day}</p>
                        <p className="text-sm text-slate-500">{day.condition}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-semibold">{day.temp} C</p>
                        <p className="text-sm text-slate-500">Low {day.tempLow} C</p>
                      </div>
                    </div>
                    <p className="mt-3 text-sm text-slate-600">
                      Rain chance: {day.precipitationProbability}%
                    </p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  )
}
