'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Satellite, MapPin, Search, Calendar, Eye, Cloud } from 'lucide-react'
import toast from 'react-hot-toast'

interface SatelliteData {
  location: string
  coordinates: { lat: number; lon: number }
  imageCount: number
  dateRange: { start: string; end: string }
  insights: {
    vegetationIndex: string
    cropHealth: string
    recommendations: string[]
  }
  images: Array<{
    date: string
    type: string
    satellite: string
    cloudCover: number
    imageUrl: string | null
  }>
}

export default function SatellitePage() {
  const [satelliteData, setSatelliteData] = useState<SatelliteData | null>(null)
  const [location, setLocation] = useState('New Delhi')
  const [days, setDays] = useState(30)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchSatelliteData()
  }, [])

  const fetchSatelliteData = async (searchLocation?: string, searchDays?: number) => {
    setLoading(true)
    try {
      const response = await fetch(`/api/satellite?location=${searchLocation || location}&days=${searchDays || days}`)
      const data = await response.json()
      setSatelliteData(data)
    } catch (error) {
      toast.error('Failed to fetch satellite data')
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    fetchSatelliteData(location, days)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 to-purple-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white text-xl">Loading satellite data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 to-purple-900 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center mb-4">
            <Satellite className="w-12 h-12 text-white mr-4" />
            <h1 className="text-4xl font-bold text-white">Satellite Farm Intelligence</h1>
          </div>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto">
            Monitor your crops from space with real-time satellite imagery and vegetation analysis
          </p>
        </motion.div>

        {/* Search */}
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          onSubmit={handleSearch}
          className="max-w-2xl mx-auto mb-8"
        >
          <div className="flex space-x-4">
            <div className="flex-1 relative">
              <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Enter location..."
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-white focus:border-transparent"
              />
            </div>
            <div className="relative">
              <Calendar className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <select
                value={days}
                onChange={(e) => setDays(parseInt(e.target.value))}
                className="pl-10 pr-8 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-white focus:border-transparent appearance-none"
              >
                <option value={7}>7 days</option>
                <option value={14}>14 days</option>
                <option value={30}>30 days</option>
                <option value={60}>60 days</option>
                <option value={90}>90 days</option>
              </select>
            </div>
            <button
              type="submit"
              className="px-6 py-3 bg-white text-blue-900 rounded-lg hover:bg-gray-100 font-medium"
            >
              <Search className="w-4 h-4 inline mr-2" />
              Search
            </button>
          </div>
        </motion.form>

        {satelliteData && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Insights Panel */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/20">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                  <Eye className="w-5 h-5 mr-2" />
                  Farm Insights
                </h3>

                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-blue-200">Location</p>
                    <p className="text-white font-medium">{satelliteData.location}</p>
                  </div>

                  <div>
                    <p className="text-sm text-blue-200">Images Available</p>
                    <p className="text-white font-medium">{satelliteData.imageCount} images</p>
                  </div>

                  <div>
                    <p className="text-sm text-blue-200">Date Range</p>
                    <p className="text-white font-medium">
                      {new Date(satelliteData.dateRange.start).toLocaleDateString()} - {new Date(satelliteData.dateRange.end).toLocaleDateString()}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-blue-200">Vegetation Index</p>
                    <p className="text-white font-medium">{satelliteData.insights.vegetationIndex}</p>
                  </div>

                  <div>
                    <p className="text-sm text-blue-200">Crop Health Status</p>
                    <p className="text-white font-medium">{satelliteData.insights.cropHealth}</p>
                  </div>
                </div>

                <div className="mt-6">
                  <h4 className="text-sm font-semibold text-blue-200 mb-3">Recommendations:</h4>
                  <ul className="space-y-2">
                    {satelliteData.insights.recommendations.map((rec, index) => (
                      <li key={index} className="text-sm text-white flex items-start">
                        <span className="text-green-400 mr-2">•</span>
                        {rec}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>

            {/* Satellite Images */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="lg:col-span-2"
            >
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/20">
                <h3 className="text-xl font-bold text-white mb-6 flex items-center">
                  <Satellite className="w-5 h-5 mr-2" />
                  Recent Satellite Images
                </h3>

                {satelliteData.images.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {satelliteData.images.map((image, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.5 + index * 0.1 }}
                        className="bg-white/5 rounded-lg p-4 border border-white/10"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-white font-medium">{image.date}</span>
                          <div className="flex items-center space-x-2">
                            <Cloud className="w-4 h-4 text-gray-300" />
                            <span className="text-sm text-gray-300">{image.cloudCover}%</span>
                          </div>
                        </div>

                        <div className="bg-gray-800 rounded-lg h-32 flex items-center justify-center mb-3">
                          {image.imageUrl ? (
                            <img
                              src={image.imageUrl}
                              alt={`Satellite image ${image.date}`}
                              className="w-full h-full object-cover rounded-lg"
                            />
                          ) : (
                            <div className="text-center text-gray-400">
                              <Satellite className="w-8 h-8 mx-auto mb-2" />
                              <p className="text-sm">Image not available</p>
                            </div>
                          )}
                        </div>

                        <div className="text-xs text-gray-300">
                          <p>Satellite: {image.satellite}</p>
                          <p>Type: {image.type}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Satellite className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-300 text-lg">No satellite images available for this location</p>
                    <p className="text-gray-400 text-sm mt-2">Try a different location or time range</p>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  )
}