'use client'

import { motion } from 'framer-motion'
import FarmerAI from '@/components/FarmerAI'

export default function FarmerPage() {
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
            किसान मित्र (Kisan Mitra)
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            AI-powered agricultural assistant for Indian farmers. Get personalized advice on crops,
            weather, market prices, government schemes, and modern farming techniques.
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
              <span className="text-2xl">🌾</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Crop Intelligence</h3>
            <p className="text-gray-600 text-sm">
              AI recommendations for crop selection, rotation, and disease management
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🌤️</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Weather Insights</h3>
            <p className="text-gray-600 text-sm">
              Real-time weather data and farming advice based on forecasts
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 text-center">
            <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">💰</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Market Prices</h3>
            <p className="text-gray-600 text-sm">
              Current MSP rates, market trends, and price predictions
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 text-center">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🏛️</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Government Schemes</h3>
            <p className="text-gray-600 text-sm">
              Information about PM-KISAN, crop insurance, and subsidies
            </p>
          </div>
        </motion.div>

        {/* Farmer AI Component */}
        <FarmerAI />
      </div>
    </div>
  )
}