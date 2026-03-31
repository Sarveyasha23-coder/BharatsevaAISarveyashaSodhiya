"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Heart, Activity, AlertTriangle, CheckCircle, Stethoscope, Thermometer, Droplets, Wind, Zap, Brain, Shield, Phone, MapPin, Clock } from "lucide-react"

interface Symptom {
  name: string
  label: string
  icon: any
  selected: boolean
}

interface PredictionResult {
  prediction: string
  confidence: number
  description: string
  severity: string
  recommendations: string[]
  precautions: string
  additional_info: {
    emergency_contact: string
    nearest_hospital: string
    telemedicine: string
    schemes: string[]
  }
  disclaimer: string
}

export default function HealthPrediction() {
  const [symptoms, setSymptoms] = useState<Symptom[]>([
    { name: "fever", label: "Fever/High Temperature", icon: Thermometer, selected: false },
    { name: "cough", label: "Cough", icon: Wind, selected: false },
    { name: "headache", label: "Headache", icon: Brain, selected: false },
    { name: "fatigue", label: "Fatigue/Tiredness", icon: Zap, selected: false },
    { name: "nausea", label: "Nausea", icon: AlertTriangle, selected: false },
    { name: "vomiting", label: "Vomiting", icon: AlertTriangle, selected: false },
    { name: "diarrhea", label: "Diarrhea", icon: Droplets, selected: false },
    { name: "chest_pain", label: "Chest Pain", icon: Heart, selected: false },
    { name: "shortness_breath", label: "Shortness of Breath", icon: Wind, selected: false },
    { name: "sore_throat", label: "Sore Throat", icon: AlertTriangle, selected: false },
    { name: "runny_nose", label: "Runny Nose", icon: Droplets, selected: false },
    { name: "body_ache", label: "Body Ache/Muscle Pain", icon: Activity, selected: false },
    { name: "loss_appetite", label: "Loss of Appetite", icon: AlertTriangle, selected: false },
    { name: "dizziness", label: "Dizziness", icon: AlertTriangle, selected: false },
    { name: "sweating", label: "Excessive Sweating", icon: Droplets, selected: false },
    { name: "chills", label: "Chills/Shivering", icon: Thermometer, selected: false },
    { name: "joint_pain", label: "Joint Pain", icon: Activity, selected: false },
    { name: "rash", label: "Skin Rash", icon: AlertTriangle, selected: false },
    { name: "itching", label: "Itching", icon: AlertTriangle, selected: false },
    { name: "abdominal_pain", label: "Abdominal Pain", icon: AlertTriangle, selected: false },
    { name: "back_pain", label: "Back Pain", icon: Activity, selected: false },
    { name: "frequent_urination", label: "Frequent Urination", icon: Droplets, selected: false },
    { name: "weight_loss", label: "Unexplained Weight Loss", icon: AlertTriangle, selected: false },
    { name: "weight_gain", label: "Unexplained Weight Gain", icon: AlertTriangle, selected: false },
    { name: "mood_swings", label: "Mood Swings", icon: Brain, selected: false },
    { name: "insomnia", label: "Insomnia/Sleep Problems", icon: Brain, selected: false }
  ])

  const [prediction, setPrediction] = useState<PredictionResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showResults, setShowResults] = useState(false)

  const toggleSymptom = (index: number) => {
    const updatedSymptoms = [...symptoms]
    updatedSymptoms[index].selected = !updatedSymptoms[index].selected
    setSymptoms(updatedSymptoms)
  }

  const predictDisease = async () => {
    const selectedSymptoms = symptoms.filter(s => s.selected)
    if (selectedSymptoms.length === 0) {
      setError("Please select at least one symptom")
      return
    }

    setLoading(true)
    setError(null)

    try {
      // Convert symptoms to the format expected by the API
      const symptomData: { [key: string]: boolean } = {}
      symptoms.forEach(symptom => {
        symptomData[symptom.name] = symptom.selected
      })

      const response = await fetch('/api/health-prediction', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(symptomData),
      })

      if (!response.ok) {
        throw new Error('Prediction failed')
      }

      const result = await response.json()
      setPrediction(result)
      setShowResults(true)

    } catch (err) {
      setError("Unable to get prediction. Please check if the health service is running.")
      console.error('Prediction error:', err)
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setSymptoms(symptoms.map(s => ({ ...s, selected: false })))
    setPrediction(null)
    setShowResults(false)
    setError(null)
  }

  const getSeverityColor = (severity: string) => {
    switch (severity.toLowerCase()) {
      case 'mild': return 'text-green-600 bg-green-50 border-green-200'
      case 'moderate': return 'text-yellow-600 bg-yellow-50 border-yellow-200'
      case 'severe': return 'text-red-600 bg-red-50 border-red-200'
      case 'critical': return 'text-red-700 bg-red-50 border-red-300'
      default: return 'text-gray-600 bg-gray-50 border-gray-200'
    }
  }

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 80) return 'text-green-600'
    if (confidence >= 60) return 'text-yellow-600'
    return 'text-red-600'
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center mb-4">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-green-500 rounded-full flex items-center justify-center">
              <Stethoscope className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            BharatSeva Health AI
          </h1>
          <p className="text-xl text-gray-600 mb-4">
            Advanced Disease Prediction & Health Guidance
          </p>
          <div className="flex items-center justify-center space-x-6 text-sm text-gray-500">
            <div className="flex items-center">
              <Shield className="w-4 h-4 mr-1" />
              AI-Powered Analysis
            </div>
            <div className="flex items-center">
              <Heart className="w-4 h-4 mr-1" />
              20+ Disease Detection
            </div>
            <div className="flex items-center">
              <Activity className="w-4 h-4 mr-1" />
              Real-time Results
            </div>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Symptom Selection */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-2xl shadow-xl p-6"
          >
            <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
              <Activity className="w-6 h-6 mr-2 text-blue-500" />
              Select Your Symptoms
            </h2>

            {error && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg"
              >
                <div className="flex items-center">
                  <AlertTriangle className="w-5 h-5 text-red-500 mr-2" />
                  <p className="text-red-700">{error}</p>
                </div>
              </motion.div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
              {symptoms.map((symptom, index) => {
                const IconComponent = symptom.icon
                return (
                  <motion.button
                    key={symptom.name}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => toggleSymptom(index)}
                    className={`p-4 rounded-xl border-2 transition-all duration-200 text-left ${
                      symptom.selected
                        ? 'border-blue-500 bg-blue-50 shadow-md'
                        : 'border-gray-200 hover:border-gray-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <IconComponent className={`w-5 h-5 ${
                        symptom.selected ? 'text-blue-500' : 'text-gray-400'
                      }`} />
                      <span className={`text-sm font-medium ${
                        symptom.selected ? 'text-blue-700' : 'text-gray-700'
                      }`}>
                        {symptom.label}
                      </span>
                    </div>
                  </motion.button>
                )
              })}
            </div>

            <div className="flex space-x-4">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={predictDisease}
                disabled={loading}
                className="flex-1 bg-gradient-to-r from-blue-500 to-green-500 text-white py-3 px-6 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Analyzing...
                  </div>
                ) : (
                  <div className="flex items-center justify-center">
                    <Stethoscope className="w-5 h-5 mr-2" />
                    Predict Disease
                  </div>
                )}
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={resetForm}
                className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:border-gray-400 transition-all duration-200"
              >
                Reset
              </motion.button>
            </div>
          </motion.div>

          {/* Results */}
          <AnimatePresence>
            {showResults && prediction && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="bg-white rounded-2xl shadow-xl p-6"
              >
                <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
                  <CheckCircle className="w-6 h-6 mr-2 text-green-500" />
                  Prediction Results
                </h2>

                {/* Main Prediction */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-6 p-6 bg-gradient-to-r from-blue-50 to-green-50 rounded-xl border border-blue-200"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold text-gray-900">
                      {prediction.prediction}
                    </h3>
                    <div className={`px-3 py-1 rounded-full text-sm font-semibold border ${getSeverityColor(prediction.severity)}`}>
                      {prediction.severity}
                    </div>
                  </div>

                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-600">Confidence</span>
                      <span className={`text-sm font-bold ${getConfidenceColor(prediction.confidence)}`}>
                        {prediction.confidence}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${prediction.confidence}%` }}
                      ></div>
                    </div>
                  </div>

                  <p className="text-gray-700 mb-4">{prediction.description}</p>
                </motion.div>

                {/* Recommendations */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="mb-6"
                >
                  <h4 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                    <Heart className="w-5 h-5 mr-2 text-red-500" />
                    Recommendations
                  </h4>
                  <ul className="space-y-2">
                    {prediction.recommendations.map((rec, index) => (
                      <motion.li
                        key={index}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 * index }}
                        className="flex items-start space-x-2"
                      >
                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">{rec}</span>
                      </motion.li>
                    ))}
                  </ul>
                </motion.div>

                {/* Emergency Contacts */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl"
                >
                  <h4 className="text-lg font-semibold text-red-900 mb-3 flex items-center">
                    <Phone className="w-5 h-5 mr-2" />
                    Emergency Contacts
                  </h4>
                  <div className="space-y-2 text-red-800">
                    <p className="flex items-center">
                      <Phone className="w-4 h-4 mr-2" />
                      Ambulance: 108 | Health Helpline: 102
                    </p>
                    <p className="flex items-center">
                      <MapPin className="w-4 h-4 mr-2" />
                      {prediction.additional_info.nearest_hospital}
                    </p>
                  </div>
                </motion.div>

                {/* Government Schemes */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-xl"
                >
                  <h4 className="text-lg font-semibold text-blue-900 mb-3 flex items-center">
                    <Shield className="w-5 h-5 mr-2" />
                    Government Health Schemes
                  </h4>
                  <ul className="space-y-1 text-blue-800">
                    {prediction.additional_info.schemes.map((scheme, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <CheckCircle className="w-3 h-3 text-blue-500 mt-1 flex-shrink-0" />
                        <span className="text-sm">{scheme}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>

                {/* Telemedicine */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl"
                >
                  <h4 className="text-lg font-semibold text-green-900 mb-2 flex items-center">
                    <Clock className="w-5 h-5 mr-2" />
                    Telemedicine Services
                  </h4>
                  <p className="text-green-800 text-sm">
                    {prediction.additional_info.telemedicine}
                  </p>
                </motion.div>

                {/* Disclaimer */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="p-4 bg-yellow-50 border border-yellow-200 rounded-xl"
                >
                  <div className="flex items-start space-x-2">
                    <AlertTriangle className="w-5 h-5 text-yellow-500 mt-0.5 flex-shrink-0" />
                    <p className="text-yellow-800 text-sm font-medium">
                      {prediction.disclaimer}
                    </p>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-center mt-12 text-gray-500"
        >
          <p className="text-sm">
            Powered by Advanced AI • BharatSeva Health Initiative
          </p>
          <p className="text-xs mt-2">
            For emergency situations, please contact nearest healthcare facility immediately
          </p>
        </motion.div>
      </div>
    </div>
  )
}