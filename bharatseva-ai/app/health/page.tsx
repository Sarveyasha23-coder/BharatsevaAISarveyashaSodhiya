'use client'

import { motion } from 'framer-motion'
import HealthAI from '@/components/HealthAI'

export default function HealthPage() {
  return (
    <div className="min-h-screen bg-[#fdf2f2] pt-20">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 text-center"
        >
          <h1 className="mb-4 text-4xl font-bold text-gray-900">Ayushman Assistant</h1>
          <p className="mx-auto max-w-3xl text-xl text-gray-600">
            General health guidance, hospital discovery, public health schemes, and telemedicine support
            for Indian citizens.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="mb-8 rounded-xl border border-red-200 bg-red-50 p-6"
        >
          <h2 className="mb-3 text-lg font-semibold text-red-900">Important medical disclaimer</h2>
          <p className="text-sm leading-7 text-red-800">
            This is not medical advice. Ayushman Assistant does not replace qualified healthcare
            professionals. If symptoms are severe, worsening, or urgent, contact a doctor immediately or
            call 108.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-4"
        >
          <div className="rounded-xl border border-gray-200 bg-white p-6 text-center shadow-sm">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-xl">
              H
            </div>
            <h3 className="mb-2 text-lg font-semibold text-gray-900">Health guidance</h3>
            <p className="text-sm text-gray-600">General advice, symptom questions, and escalation cues.</p>
          </div>
          <div className="rounded-xl border border-gray-200 bg-white p-6 text-center shadow-sm">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-xl">
              M
            </div>
            <h3 className="mb-2 text-lg font-semibold text-gray-900">Hospital finder</h3>
            <p className="text-sm text-gray-600">Nearby hospital discovery backed by live map data.</p>
          </div>
          <div className="rounded-xl border border-gray-200 bg-white p-6 text-center shadow-sm">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-xl">
              S
            </div>
            <h3 className="mb-2 text-lg font-semibold text-gray-900">Scheme support</h3>
            <p className="text-sm text-gray-600">Ayushman Bharat and public health service pointers.</p>
          </div>
          <div className="rounded-xl border border-gray-200 bg-white p-6 text-center shadow-sm">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-purple-100 text-xl">
              T
            </div>
            <h3 className="mb-2 text-lg font-semibold text-gray-900">Telemedicine</h3>
            <p className="text-sm text-gray-600">Faster pathways into eSanjeevani and remote consultations.</p>
          </div>
        </motion.div>

        <HealthAI />
      </div>
    </div>
  )
}
