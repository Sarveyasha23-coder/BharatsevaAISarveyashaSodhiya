'use client'

import { motion } from 'framer-motion'
import LocationIntelligence from '@/components/LocationIntelligence'

export default function LocationPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Location Intelligence AI
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            GPS-powered location intelligence for government services. Find nearby hospitals,
            police stations, government offices, and location-specific schemes.
          </p>
        </motion.div>

        {/* Features */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
        >
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 text-center">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">📍</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">GPS Services</h3>
            <p className="text-gray-600 text-sm">
              Location-aware government service recommendations and facilities
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🏛️</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">District Intelligence</h3>
            <p className="text-gray-600 text-sm">
              State and district-specific schemes, offices, and local programs
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 text-center">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🚨</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Emergency Services</h3>
            <p className="text-gray-600 text-sm">
              Nearest police stations, hospitals, and emergency contacts
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 text-center">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🚇</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Local Transport</h3>
            <p className="text-gray-600 text-sm">
              Public transportation options and regional connectivity
            </p>
          </div>
        </motion.div>

        {/* Location Intelligence Component */}
        <LocationIntelligence />
      </div>
    </div>
  )
}