'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Sprout, MapPin, Search, Thermometer, Droplets, Cloud, AlertTriangle, CheckCircle } from 'lucide-react'
import toast from 'react-hot-toast'

interface CropAdvice {
  location: string
  crop: string
  currentConditions: {
    temperature: string
    humidity: string
    soilMoisture: string
  }
  analysis: {
    recommendations: string[]
    warnings: string[]
    nextSteps: string[]
  }
  farmingTips: string[]
  timestamp: string
}

export default function CropAdvicePage() {
  const [advice, setAdvice] = useState<CropAdvice | null>(null)
  const [location, setLocation] = useState('New Delhi')
  const [crop, setCrop] = useState('rice')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchCropAdvice()
  }, [])

  const fetchCropAdvice = async (searchLocation?: string, searchCrop?: string) => {
    setLoading(true)
    try {
      const response = await fetch(`/api/crop-advice?location=${searchLocation || location}&crop=${searchCrop || crop}`)
      const data = await response.json()
      setAdvice(data)
    } catch (error) {
      toast.error('Failed to fetch crop advice')
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    fetchCropAdvice(location, crop)
  }

  const crops = [
    { value: 'rice', label: 'Rice (धान)', emoji: '🌾' },
    { value: 'wheat', label: 'Wheat (गेहूं)', emoji: '🌾' },
    { value: 'cotton', label: 'Cotton (कपास)', emoji: '🌿' },
    { value: 'sugarcane', label: 'Sugarcane (गन्ना)', emoji: '🎋' },
    { value: 'maize', label: 'Maize (मक्का)', emoji: '🌽' }
  ]

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-400 to-blue-600">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white text-xl">Analyzing crop conditions...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-400 to-blue-600 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center mb-4">
            <Sprout className="w-12 h-12 text-white mr-4" />
            <h1 className="text-4xl font-bold text-white">AI Crop Advisor</h1>
          </div>
          <p className="text-xl text-green-100 max-w-3xl mx-auto">
            Get personalized farming advice based on real-time weather, soil data, and crop conditions
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
              <Sprout className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <select
                value={crop}
                onChange={(e) => setCrop(e.target.value)}
                className="pl-10 pr-8 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-white focus:border-transparent appearance-none"
              >
                {crops.map((cropOption) => (
                  <option key={cropOption.value} value={cropOption.value}>
                    {cropOption.emoji} {cropOption.label}
                  </option>
                ))}
              </select>
            </div>
            <button
              type="submit"
              className="px-6 py-3 bg-white text-green-700 rounded-lg hover:bg-gray-100 font-medium"
            >
              <Search className="w-4 h-4 inline mr-2" />
              Get Advice
            </button>
          </div>
        </motion.form>

        {advice && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Current Conditions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-xl">
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                  <Thermometer className="w-5 h-5 mr-2 text-red-500" />
                  Current Conditions
                </h3>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700">Location:</span>
                    <span className="font-medium text-gray-900">{advice.location}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-gray-700">Crop:</span>
                    <span className="font-medium text-gray-900">{advice.crop}</span>
                  </div>

                  <div className="border-t pt-4 space-y-3">
                    <div className="flex items-center space-x-3">
                      <Thermometer className="w-4 h-4 text-red-500" />
                      <div>
                        <p className="text-sm text-gray-600">Temperature</p>
                        <p className="font-medium">{advice.currentConditions.temperature}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <Droplets className="w-4 h-4 text-blue-500" />
                      <div>
                        <p className="text-sm text-gray-600">Humidity</p>
                        <p className="font-medium">{advice.currentConditions.humidity}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <Cloud className="w-4 h-4 text-gray-500" />
                      <div>
                        <p className="text-sm text-gray-600">Soil Moisture</p>
                        <p className="font-medium">{advice.currentConditions.soilMoisture}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Recommendations & Warnings */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="lg:col-span-2"
            >
              <div className="space-y-6">
                {/* Recommendations */}
                <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-xl">
                  <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                    <CheckCircle className="w-5 h-5 mr-2 text-green-500" />
                    Recommendations
                  </h3>

                  <div className="space-y-3">
                    {advice.analysis.recommendations.map((rec, index) => (
                      <div key={index} className="flex items-start space-x-3 p-3 bg-green-50 rounded-lg">
                        <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <p className="text-gray-800">{rec}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Warnings */}
                {advice.analysis.warnings.length > 0 && (
                  <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-xl">
                    <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                      <AlertTriangle className="w-5 h-5 mr-2 text-amber-500" />
                      Important Warnings
                    </h3>

                    <div className="space-y-3">
                      {advice.analysis.warnings.map((warning, index) => (
                        <div key={index} className="flex items-start space-x-3 p-3 bg-amber-50 rounded-lg">
                          <AlertTriangle className="w-5 h-5 text-amber-500 mt-0.5 flex-shrink-0" />
                          <p className="text-gray-800">{warning}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Next Steps */}
                <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-xl">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Next Steps</h3>

                  <div className="space-y-3">
                    {advice.analysis.nextSteps.map((step, index) => (
                      <div key={index} className="flex items-start space-x-3">
                        <span className="flex-shrink-0 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-medium">
                          {index + 1}
                        </span>
                        <p className="text-gray-800">{step}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* General Farming Tips */}
                <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-xl">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">General Farming Tips</h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {advice.farmingTips.map((tip, index) => (
                      <div key={index} className="flex items-start space-x-2 p-3 bg-gray-50 rounded-lg">
                        <span className="text-green-500 text-lg">💡</span>
                        <p className="text-sm text-gray-700">{tip}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  )
}