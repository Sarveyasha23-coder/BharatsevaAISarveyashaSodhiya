'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { MapPin, Plus, Eye, AlertTriangle, CheckCircle, Droplets, Thermometer, Leaf } from 'lucide-react'
import toast from 'react-hot-toast'

interface Polygon {
  id: string
  name: string
  coordinates: number[][]
  crop: string
  area: number
  created: string
  lastUpdated: string
}

interface PolygonStats {
  polygon: Polygon
  currentConditions: {
    temperature: number
    humidity: number
    soilMoisture: number
    soilTemperature: number
  }
  vegetation: {
    ndvi: string
    health: string
    coverage: number
  }
  alerts: string[]
  recommendations: string[]
}

export default function CropMonitoringPage() {
  const [polygons, setPolygons] = useState<Polygon[]>([])
  const [selectedPolygon, setSelectedPolygon] = useState<PolygonStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [newPolygon, setNewPolygon] = useState({
    name: '',
    coordinates: '',
    crop: 'rice',
    area: ''
  })

  useEffect(() => {
    fetchPolygons()
  }, [])

  const fetchPolygons = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/crop-monitoring')
      const data = await response.json()
      setPolygons(data.polygons || [])
    } catch (error) {
      toast.error('Failed to fetch polygons')
    } finally {
      setLoading(false)
    }
  }

  const fetchPolygonStats = async (polygonId: string) => {
    try {
      const response = await fetch(`/api/crop-monitoring?polygonId=${polygonId}`)
      const data = await response.json()
      setSelectedPolygon(data)
    } catch (error) {
      toast.error('Failed to fetch polygon stats')
    }
  }

  const handleCreatePolygon = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      // Parse coordinates (expecting format: [[lat,lng],[lat,lng],...])
      const coordinates = JSON.parse(newPolygon.coordinates)

      const response = await fetch('/api/crop-monitoring', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: newPolygon.name,
          coordinates,
          crop: newPolygon.crop,
          area: newPolygon.area
        })
      })

      const data = await response.json()

      if (data.success) {
        toast.success('Polygon created successfully!')
        setShowCreateForm(false)
        setNewPolygon({ name: '', coordinates: '', crop: 'rice', area: '' })
        fetchPolygons()
      } else {
        toast.error(data.error || 'Failed to create polygon')
      }
    } catch (error) {
      toast.error('Invalid coordinates format. Use: [[lat,lng],[lat,lng],...]')
    }
  }

  const crops = [
    { value: 'rice', label: 'Rice (धान)', emoji: '🌾' },
    { value: 'wheat', label: 'Wheat (गेहूं)', emoji: '🌾' },
    { value: 'cotton', label: 'Cotton (कपास)', emoji: '🌿' },
    { value: 'sugarcane', label: 'Sugarcane (गन्ना)', emoji: '🎋' },
    { value: 'maize', label: 'Maize (मक्का)', emoji: '🌽' },
    { value: 'pulses', label: 'Pulses (दालें)', emoji: '🫘' },
    { value: 'potato', label: 'Potato (आलू)', emoji: '🥔' },
    { value: 'tomato', label: 'Tomato (टमाटर)', emoji: '🍅' }
  ]

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-400 to-blue-600">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white text-xl">Loading farm monitoring data...</p>
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
            <Leaf className="w-12 h-12 text-white mr-4" />
            <h1 className="text-4xl font-bold text-white">Crop Monitoring Dashboard</h1>
          </div>
          <p className="text-xl text-green-100 max-w-3xl mx-auto">
            Monitor your farm polygons with real-time satellite data, soil conditions, and crop health insights
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Polygons List */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-1"
          >
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-xl">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">Farm Polygons</h3>
                <button
                  onClick={() => setShowCreateForm(true)}
                  className="p-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-3">
                {polygons.map((polygon) => (
                  <div
                    key={polygon.id}
                    onClick={() => fetchPolygonStats(polygon.id)}
                    className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                      selectedPolygon?.polygon.id === polygon.id
                        ? 'border-green-500 bg-green-50'
                        : 'border-gray-200 hover:border-green-300'
                    }`}
                  >
                    <h4 className="font-semibold text-gray-900">{polygon.name}</h4>
                    <p className="text-sm text-gray-600">{polygon.crop} • {polygon.area} ha</p>
                    <p className="text-xs text-gray-500">Updated: {polygon.lastUpdated}</p>
                  </div>
                ))}

                {polygons.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <MapPin className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No polygons yet</p>
                    <p className="text-sm">Create your first farm polygon</p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>

          {/* Polygon Details */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-3"
          >
            {selectedPolygon ? (
              <div className="space-y-6">
                {/* Current Conditions */}
                <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-xl">
                  <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                    <Eye className="w-5 h-5 mr-2 text-green-600" />
                    {selectedPolygon.polygon.name} - Live Monitoring
                  </h3>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <Thermometer className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                      <p className="text-sm text-gray-600">Temperature</p>
                      <p className="text-2xl font-bold text-gray-900">{selectedPolygon.currentConditions.temperature}°C</p>
                    </div>

                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <Droplets className="w-8 h-8 text-green-500 mx-auto mb-2" />
                      <p className="text-sm text-gray-600">Humidity</p>
                      <p className="text-2xl font-bold text-gray-900">{selectedPolygon.currentConditions.humidity}%</p>
                    </div>

                    <div className="text-center p-4 bg-brown-50 rounded-lg">
                      <Droplets className="w-8 h-8 text-amber-500 mx-auto mb-2" />
                      <p className="text-sm text-gray-600">Soil Moisture</p>
                      <p className="text-2xl font-bold text-gray-900">{selectedPolygon.currentConditions.soilMoisture}%</p>
                    </div>

                    <div className="text-center p-4 bg-orange-50 rounded-lg">
                      <Thermometer className="w-8 h-8 text-orange-500 mx-auto mb-2" />
                      <p className="text-sm text-gray-600">Soil Temp</p>
                      <p className="text-2xl font-bold text-gray-900">{selectedPolygon.currentConditions.soilTemperature}°C</p>
                    </div>
                  </div>

                  {/* Vegetation Health */}
                  <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-4 mb-6">
                    <h4 className="text-lg font-semibold text-gray-900 mb-3">Vegetation Health</h4>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="text-center">
                        <p className="text-sm text-gray-600">NDVI Index</p>
                        <p className="text-2xl font-bold text-green-600">{selectedPolygon.vegetation.ndvi}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm text-gray-600">Health Status</p>
                        <p className={`text-lg font-bold ${
                          selectedPolygon.vegetation.health === 'Excellent' ? 'text-green-600' :
                          selectedPolygon.vegetation.health === 'Good' ? 'text-yellow-600' : 'text-red-600'
                        }`}>
                          {selectedPolygon.vegetation.health}
                        </p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm text-gray-600">Coverage</p>
                        <p className="text-2xl font-bold text-blue-600">{selectedPolygon.vegetation.coverage}%</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Alerts and Recommendations */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Alerts */}
                  <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-xl">
                    <h4 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                      <AlertTriangle className="w-5 h-5 mr-2 text-amber-500" />
                      Alerts ({selectedPolygon.alerts.length})
                    </h4>

                    {selectedPolygon.alerts.length > 0 ? (
                      <div className="space-y-3">
                        {selectedPolygon.alerts.map((alert, index) => (
                          <div key={index} className="flex items-start space-x-3 p-3 bg-amber-50 rounded-lg">
                            <AlertTriangle className="w-5 h-5 text-amber-500 mt-0.5 flex-shrink-0" />
                            <p className="text-sm text-gray-800">{alert}</p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-4 text-green-600">
                        <CheckCircle className="w-8 h-8 mx-auto mb-2" />
                        <p className="text-sm">No alerts - conditions are good!</p>
                      </div>
                    )}
                  </div>

                  {/* Recommendations */}
                  <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-xl">
                    <h4 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                      <CheckCircle className="w-5 h-5 mr-2 text-green-500" />
                      Recommendations
                    </h4>

                    <div className="space-y-3">
                      {selectedPolygon.recommendations.map((rec, index) => (
                        <div key={index} className="flex items-start space-x-3">
                          <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                          <p className="text-sm text-gray-800">{rec}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-12 shadow-xl text-center">
                <MapPin className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-2">Select a Farm Polygon</h3>
                <p className="text-gray-600">Choose a polygon from the list to view detailed monitoring data</p>
              </div>
            )}
          </motion.div>
        </div>

        {/* Create Polygon Modal */}
        {showCreateForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-2xl p-6 max-w-md w-full mx-4"
            >
              <h3 className="text-xl font-bold text-gray-900 mb-4">Create New Farm Polygon</h3>

              <form onSubmit={handleCreatePolygon} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Polygon Name</label>
                  <input
                    type="text"
                    value={newPolygon.name}
                    onChange={(e) => setNewPolygon({...newPolygon, name: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                    placeholder="e.g., Rice Field - Punjab"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Crop Type</label>
                  <select
                    value={newPolygon.crop}
                    onChange={(e) => setNewPolygon({...newPolygon, crop: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  >
                    {crops.map((crop) => (
                      <option key={crop.value} value={crop.value}>
                        {crop.emoji} {crop.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Area (hectares)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={newPolygon.area}
                    onChange={(e) => setNewPolygon({...newPolygon, area: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                    placeholder="2.5"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Coordinates (JSON format)
                  </label>
                  <textarea
                    value={newPolygon.coordinates}
                    onChange={(e) => setNewPolygon({...newPolygon, coordinates: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                    rows={4}
                    placeholder='[[lat,lng],[lat,lng],[lat,lng],[lat,lng]]'
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Enter coordinates as JSON array of [latitude, longitude] pairs
                  </p>
                </div>

                <div className="flex space-x-3">
                  <button
                    type="submit"
                    className="flex-1 bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition-colors"
                  >
                    Create Polygon
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowCreateForm(false)}
                    className="flex-1 bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  )
}