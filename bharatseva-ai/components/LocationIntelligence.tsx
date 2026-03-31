'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MapPin, Navigation, Phone, Hospital, Shield, Building, Train } from 'lucide-react'

interface LocationData {
  location: {
    district: string
    state: string
    coordinates: { lat: number; lng: number }
    address: string
  }
  nearbyServices: {
    police: Array<{ name: string; distance: string; phone: string }>
    hospitals: Array<{ name: string; distance: string; type: string }>
    governmentOffices: Array<{ name: string; distance: string; services: string[] }>
  }
  localSchemes: string[]
  emergencyContacts: { [key: string]: string }
}

export default function LocationIntelligence() {
  const [currentLocation, setCurrentLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [locationData, setLocationData] = useState<LocationData | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [selectedService, setSelectedService] = useState('all')
  const [query, setQuery] = useState('')
  const [locationInfo, setLocationInfo] = useState<any>(null)

  // Get user's current location
  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords
          setCurrentLocation({ lat: latitude, lng: longitude })
          fetchLocationData(latitude, longitude)
        },
        (error) => {
          console.error('Error getting location:', error)
          // Fallback to Delhi coordinates
          setCurrentLocation({ lat: 28.6139, lng: 77.2090 })
          fetchLocationData(28.6139, 77.2090)
        }
      )
    }
  }

  // Load location information on component mount
  useEffect(() => {
    const loadLocationInfo = async () => {
      try {
        const response = await fetch('/api/location')
        const data = await response.json()
        setLocationInfo(data)
      } catch (error) {
        console.error('Failed to load location info:', error)
      }
    }
    loadLocationInfo()
    getCurrentLocation()
  }, [])

  const fetchLocationData = async (lat: number, lng: number) => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/location', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          latitude: lat,
          longitude: lng,
          query
        })
      })

      const data = await response.json()
      setLocationData(data.locationData)
    } catch (error) {
      console.error('Failed to fetch location data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleLocationSearch = () => {
    if (currentLocation) {
      fetchLocationData(currentLocation.lat, currentLocation.lng)
    }
  }

  const filterServices = (services: any[], type: string) => {
    if (selectedService === 'all' || selectedService === type) {
      return services
    }
    return []
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Main Location Interface */}
        <div className="lg:col-span-3">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-xl border border-gray-200 p-6"
          >
            {/* Header */}
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-green-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <MapPin size={32} className="text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Location Intelligence AI
              </h2>
              <p className="text-gray-600">
                GPS-powered government services and location-based assistance
              </p>
            </div>

            {/* Location Status */}
            <div className="mb-6">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <div className="flex items-center">
                  <Navigation size={20} className="text-green-600 mr-3" />
                  <div>
                    <p className="font-medium text-gray-900">Current Location</p>
                    <p className="text-sm text-gray-600">
                      {currentLocation
                        ? `${currentLocation.lat.toFixed(4)}, ${currentLocation.lng.toFixed(4)}`
                        : 'Getting location...'
                      }
                    </p>
                  </div>
                </div>
                <button
                  onClick={getCurrentLocation}
                  className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                >
                  Refresh
                </button>
              </div>
            </div>

            {/* Search and Filters */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Search Services
                </label>
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="e.g., hospitals, police, government offices"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Filter by Service
                </label>
                <select
                  value={selectedService}
                  onChange={(e) => setSelectedService(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="all">All Services</option>
                  <option value="healthcare">Healthcare</option>
                  <option value="police">Police</option>
                  <option value="government">Government Offices</option>
                  <option value="transport">Transportation</option>
                </select>
              </div>
            </div>

            <button
              onClick={handleLocationSearch}
              disabled={isLoading}
              className="w-full bg-green-500 text-white py-3 px-6 rounded-xl hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium mb-6"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Finding Services...
                </div>
              ) : (
                'Find Nearby Services'
              )}
            </button>

            {/* Location Data Display */}
            <AnimatePresence>
              {locationData && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-6"
                >
                  {/* Current Location Info */}
                  <div className="p-4 bg-blue-50 rounded-xl">
                    <h3 className="font-semibold text-blue-900 mb-2">📍 Your Location</h3>
                    <p className="text-blue-800">
                      <strong>{locationData.location.district}, {locationData.location.state}</strong><br />
                      {locationData.location.address}
                    </p>
                  </div>

                  {/* Emergency Contacts */}
                  <div className="p-4 bg-red-50 rounded-xl">
                    <h3 className="font-semibold text-red-900 mb-3 flex items-center">
                      <Phone size={18} className="mr-2" />
                      Emergency Contacts
                    </h3>
                    <div className="grid grid-cols-2 gap-3">
                      {Object.entries(locationData.emergencyContacts).map(([service, number]) => (
                        <div key={service} className="flex justify-between items-center">
                          <span className="text-red-800 capitalize">{service}:</span>
                          <span className="font-bold text-red-600">{number}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Nearby Services */}
                  <div className="space-y-4">
                    {/* Police Stations */}
                    {filterServices(locationData.nearbyServices.police, 'police').length > 0 && (
                      <div className="p-4 bg-blue-50 rounded-xl">
                        <h3 className="font-semibold text-blue-900 mb-3 flex items-center">
                          <Shield size={18} className="mr-2" />
                          Police Stations
                        </h3>
                        <div className="space-y-2">
                          {locationData.nearbyServices.police.map((station, index) => (
                            <div key={index} className="flex justify-between items-center p-2 bg-white rounded-lg">
                              <div>
                                <p className="font-medium text-blue-900">{station.name}</p>
                                <p className="text-sm text-blue-700">{station.distance}</p>
                              </div>
                              <span className="text-blue-600 font-bold">{station.phone}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Hospitals */}
                    {filterServices(locationData.nearbyServices.hospitals, 'healthcare').length > 0 && (
                      <div className="p-4 bg-green-50 rounded-xl">
                        <h3 className="font-semibold text-green-900 mb-3 flex items-center">
                          <Hospital size={18} className="mr-2" />
                          Hospitals
                        </h3>
                        <div className="space-y-2">
                          {locationData.nearbyServices.hospitals.map((hospital, index) => (
                            <div key={index} className="flex justify-between items-center p-2 bg-white rounded-lg">
                              <div>
                                <p className="font-medium text-green-900">{hospital.name}</p>
                                <p className="text-sm text-green-700">{hospital.distance} • {hospital.type}</p>
                              </div>
                              <span className="text-green-600">Get Directions</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Government Offices */}
                    {filterServices(locationData.nearbyServices.governmentOffices, 'government').length > 0 && (
                      <div className="p-4 bg-purple-50 rounded-xl">
                        <h3 className="font-semibold text-purple-900 mb-3 flex items-center">
                          <Building size={18} className="mr-2" />
                          Government Offices
                        </h3>
                        <div className="space-y-2">
                          {locationData.nearbyServices.governmentOffices.map((office, index) => (
                            <div key={index} className="p-2 bg-white rounded-lg">
                              <p className="font-medium text-purple-900">{office.name}</p>
                              <p className="text-sm text-purple-700">{office.distance}</p>
                              <p className="text-xs text-purple-600">Services: {office.services.join(', ')}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Local Schemes */}
                  <div className="p-4 bg-yellow-50 rounded-xl">
                    <h3 className="font-semibold text-yellow-900 mb-3">🏛️ Local Government Schemes</h3>
                    <ul className="space-y-1">
                      {locationData.localSchemes.map((scheme, index) => (
                        <li key={index} className="text-yellow-800 text-sm">• {scheme}</li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>

        {/* Sidebar with Information */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-xl shadow-lg border border-gray-200 p-6"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Quick Actions
            </h3>

            <div className="space-y-3">
              <button
                onClick={() => setSelectedService('healthcare')}
                className="w-full p-3 bg-red-50 hover:bg-red-100 rounded-lg text-left transition-colors"
              >
                <div className="flex items-center">
                  <Hospital size={18} className="text-red-600 mr-3" />
                  <span className="text-red-900 font-medium">Find Hospitals</span>
                </div>
              </button>

              <button
                onClick={() => setSelectedService('police')}
                className="w-full p-3 bg-blue-50 hover:bg-blue-100 rounded-lg text-left transition-colors"
              >
                <div className="flex items-center">
                  <Shield size={18} className="text-blue-600 mr-3" />
                  <span className="text-blue-900 font-medium">Police Stations</span>
                </div>
              </button>

              <button
                onClick={() => setSelectedService('government')}
                className="w-full p-3 bg-green-50 hover:bg-green-100 rounded-lg text-left transition-colors"
              >
                <div className="flex items-center">
                  <Building size={18} className="text-green-600 mr-3" />
                  <span className="text-green-900 font-medium">Govt Offices</span>
                </div>
              </button>

              <button
                onClick={() => setSelectedService('transport')}
                className="w-full p-3 bg-purple-50 hover:bg-purple-100 rounded-lg text-left transition-colors"
              >
                <div className="flex items-center">
                  <Train size={18} className="text-purple-600 mr-3" />
                  <span className="text-purple-900 font-medium">Transport</span>
                </div>
              </button>
            </div>
          </motion.div>

          {/* Location Stats */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl shadow-lg border border-gray-200 p-6"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              India Statistics
            </h3>

            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">States:</span>
                <span className="font-bold">28</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">UTs:</span>
                <span className="font-bold">8</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Districts:</span>
                <span className="font-bold">736</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Population:</span>
                <span className="font-bold">1.4B</span>
              </div>
            </div>
          </motion.div>

          {/* Service Categories */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-gray-50 rounded-xl shadow-lg border border-gray-200 p-6"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Service Categories
            </h3>

            <div className="space-y-2">
              {locationInfo?.serviceCategories?.map((category: string, index: number) => (
                <div key={index} className="flex items-center">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                  <span className="text-gray-700 text-sm">{category}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
