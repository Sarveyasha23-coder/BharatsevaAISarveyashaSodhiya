'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  MessageCircle,
  FileText,
  Tractor,
  Heart,
  Shield,
  Camera,
  Users,
  MapPin,
  Smartphone,
  Bot,
  Cloud,
  Zap,
  ChevronRight,
  User
} from 'lucide-react'
import Link from 'next/link'

interface Service {
  id: string
  title: string
  description: string
  icon: any
  href: string
  color: string
  available: boolean
}

export default function DashboardPage() {
  const [user, setUser] = useState({
    name: 'John Doe',
    district: 'Bhopal',
    state: 'Madhya Pradesh',
    avatar: '👤'
  })

  const services: Service[] = [
    {
      id: 'voice',
      title: 'Voice Assistant',
      description: 'Talk to our AI in Hindi, English & 10+ languages',
      icon: MessageCircle,
      href: '/voice',
      color: 'from-purple-500 to-pink-500',
      available: true
    },
    {
      id: 'chat',
      title: 'AI Chat',
      description: 'Text-based conversations with intelligent assistant',
      icon: Bot,
      href: '/chat',
      color: 'from-blue-500 to-cyan-500',
      available: true
    },
    {
      id: 'schemes',
      title: 'Government Schemes',
      description: 'Find personalized schemes for your needs',
      icon: FileText,
      href: '/schemes',
      color: 'from-green-500 to-emerald-500',
      available: true
    },
    {
      id: 'farmer',
      title: 'Farmer AI',
      description: 'Crop advice, weather updates & subsidies',
      icon: Tractor,
      href: '/farmer',
      color: 'from-amber-500 to-orange-500',
      available: true
    },
    {
      id: 'health',
      title: 'Health AI',
      description: 'Medical information & health schemes',
      icon: Heart,
      href: '/health',
      color: 'from-red-500 to-pink-500',
      available: true
    },
    {
      id: 'fraud',
      title: 'Fraud Shield',
      description: 'Detect scams & protect your money',
      icon: Shield,
      href: '/fraud',
      color: 'from-purple-500 to-indigo-500',
      available: true
    },
    {
      id: 'ocr',
      title: 'Document OCR',
      description: 'Extract text from government documents',
      icon: Camera,
      href: '/ocr',
      color: 'from-teal-500 to-green-500',
      available: true
    },
    {
      id: 'family',
      title: 'Family AI',
      description: 'Recommendations for your entire family',
      icon: Users,
      href: '/family',
      color: 'from-indigo-500 to-purple-500',
      available: true
    },
    {
      id: 'location',
      title: 'Local Services',
      description: 'Find nearby hospitals, offices & banks',
      icon: MapPin,
      href: '/location',
      color: 'from-orange-500 to-red-500',
      available: true
    },
    {
      id: 'agent',
      title: 'AI Agent',
      description: 'Personal AI companion with smart recommendations',
      icon: Smartphone,
      href: '/agent',
      color: 'from-pink-500 to-rose-500',
      available: true
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-lg p-8 mb-8"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-2xl">
                {user.avatar}
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Welcome back, {user.name}!</h1>
                <p className="text-gray-600 flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  {user.district}, {user.state}
                </p>
              </div>
            </div>
            <div className="hidden md:flex items-center space-x-4">
              <div className="bg-blue-50 px-4 py-2 rounded-lg">
                <p className="text-sm text-blue-800 font-medium">All Services Active</p>
              </div>
              <div className="bg-green-50 px-4 py-2 rounded-lg">
                <p className="text-sm text-green-800 font-medium">Premium User</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
        >
          <div className="bg-white rounded-xl shadow-sm p-6 text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <MessageCircle className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900">247</h3>
            <p className="text-gray-600">Queries Answered</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 text-center">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900">12</h3>
            <p className="text-gray-600">Schemes Found</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 text-center">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900">5</h3>
            <p className="text-gray-600">Scams Detected</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 text-center">
            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Heart className="w-6 h-6 text-orange-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900">₹50K</h3>
            <p className="text-gray-600">Benefits Received</p>
          </div>
        </motion.div>

        {/* AI Services Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-8"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Your AI Assistants</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {services.map((service, index) => (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                className="group"
              >
                <Link href={service.href}>
                  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                    <div className={`w-12 h-12 bg-gradient-to-r ${service.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                      <service.icon className="w-6 h-6 text-white" />
                    </div>

                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {service.title}
                    </h3>

                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {service.description}
                    </p>

                    <div className="flex items-center justify-between">
                      <span className="text-sm text-blue-600 font-medium group-hover:text-blue-700">
                        Try Now
                      </span>
                      <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white rounded-2xl shadow-lg p-8"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Recent Activity</h2>
          <div className="space-y-4">
            <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <FileText className="w-5 h-5 text-green-600" />
              </div>
              <div className="flex-1">
                <p className="text-gray-900 font-medium">Found 3 eligible schemes for PM Kisan</p>
                <p className="text-gray-600 text-sm">2 hours ago</p>
              </div>
            </div>

            <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <MessageCircle className="w-5 h-5 text-blue-600" />
              </div>
              <div className="flex-1">
                <p className="text-gray-900 font-medium">Voice conversation in Hindi</p>
                <p className="text-gray-600 text-sm">5 hours ago</p>
              </div>
            </div>

            <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
              <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                <Shield className="w-5 h-5 text-purple-600" />
              </div>
              <div className="flex-1">
                <p className="text-gray-900 font-medium">Detected potential UPI fraud attempt</p>
                <p className="text-gray-600 text-sm">1 day ago</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}