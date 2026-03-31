'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Users, User, UserPlus, Heart, GraduationCap, Briefcase, Plus, Trash2 } from 'lucide-react'

interface FamilyMember {
  id: string
  name: string
  relation: string
  age: number
  occupation?: string
  income?: string
}

export default function FamilyAIPage() {
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([
    {
      id: '1',
      name: 'Rajesh Kumar',
      relation: 'Father',
      age: 45,
      occupation: 'Farmer',
      income: 'Middle Class'
    },
    {
      id: '2',
      name: 'Sunita Kumar',
      relation: 'Mother',
      age: 42,
      occupation: 'Housewife',
      income: 'Low Income'
    },
    {
      id: '3',
      name: 'Amit Kumar',
      relation: 'Son',
      age: 18,
      occupation: 'Student',
      income: 'Student'
    }
  ])

  const [newMember, setNewMember] = useState({
    name: '',
    relation: '',
    age: '',
    occupation: '',
    income: ''
  })

  const [recommendations, setRecommendations] = useState([
    {
      member: 'Rajesh Kumar (Father)',
      schemes: ['PM Kisan Samman Nidhi', 'Pradhan Mantri Fasal Bima Yojana'],
      benefits: '₹6,000 annual income support + crop insurance'
    },
    {
      member: 'Sunita Kumar (Mother)',
      schemes: ['Pradhan Mantri Matru Vandana Yojana', 'Ujjwala Yojana'],
      benefits: 'Maternity benefits + free LPG connection'
    },
    {
      member: 'Amit Kumar (Son)',
      schemes: ['National Scholarship Portal', 'PM POSHAN Scheme'],
      benefits: 'Education scholarships + free school meals'
    }
  ])

  const addMember = () => {
    if (!newMember.name || !newMember.relation || !newMember.age) return

    const member: FamilyMember = {
      id: Date.now().toString(),
      name: newMember.name,
      relation: newMember.relation,
      age: parseInt(newMember.age),
      occupation: newMember.occupation || undefined,
      income: newMember.income || undefined
    }

    setFamilyMembers([...familyMembers, member])
    setNewMember({ name: '', relation: '', age: '', occupation: '', income: '' })
  }

  const removeMember = (id: string) => {
    setFamilyMembers(familyMembers.filter(member => member.id !== id))
  }

  const getRelationIcon = (relation: string) => {
    switch (relation.toLowerCase()) {
      case 'father':
      case 'husband':
        return '👨'
      case 'mother':
      case 'wife':
        return '👩'
      case 'son':
        return '👦'
      case 'daughter':
        return '👧'
      default:
        return '👤'
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2 }}
            className="w-20 h-20 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <Users className="w-10 h-10 text-white" />
          </motion.div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Family AI Assistant
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Personalized government scheme recommendations for your entire family including pensions, scholarships, and health benefits
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Family Members */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="space-y-6"
          >
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <User className="w-6 h-6 text-indigo-600" />
                Your Family Members
              </h2>

              <div className="space-y-4 mb-6">
                {familyMembers.map((member) => (
                  <motion.div
                    key={member.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-xl">
                        {getRelationIcon(member.relation)}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{member.name}</h3>
                        <p className="text-sm text-gray-600">
                          {member.relation} • {member.age} years old
                        </p>
                        {member.occupation && (
                          <p className="text-xs text-gray-500">{member.occupation}</p>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => removeMember(member.id)}
                      className="text-red-500 hover:text-red-700 p-2"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </motion.div>
                ))}
              </div>

              {/* Add New Member */}
              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <UserPlus className="w-5 h-5 text-indigo-600" />
                  Add Family Member
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <input
                    type="text"
                    placeholder="Full Name"
                    value={newMember.name}
                    onChange={(e) => setNewMember({...newMember, name: e.target.value})}
                    className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                  <input
                    type="text"
                    placeholder="Relation (Father, Mother, Son, etc.)"
                    value={newMember.relation}
                    onChange={(e) => setNewMember({...newMember, relation: e.target.value})}
                    className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                  <input
                    type="number"
                    placeholder="Age"
                    value={newMember.age}
                    onChange={(e) => setNewMember({...newMember, age: e.target.value})}
                    className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                  <input
                    type="text"
                    placeholder="Occupation (Optional)"
                    value={newMember.occupation}
                    onChange={(e) => setNewMember({...newMember, occupation: e.target.value})}
                    className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>

                <button
                  onClick={addMember}
                  className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all flex items-center justify-center gap-2"
                >
                  <Plus className="w-5 h-5" />
                  Add Member
                </button>
              </div>
            </div>
          </motion.div>

          {/* AI Recommendations */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
            className="space-y-6"
          >
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <Heart className="w-6 h-6 text-pink-600" />
                AI Recommendations
              </h2>

              <div className="space-y-6">
                {recommendations.map((rec, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * index }}
                    className="border border-gray-200 rounded-xl p-6"
                  >
                    <h3 className="font-semibold text-gray-900 mb-3">{rec.member}</h3>

                    <div className="mb-4">
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Eligible Schemes:</h4>
                      <div className="flex flex-wrap gap-2">
                        {rec.schemes.map((scheme, idx) => (
                          <span
                            key={idx}
                            className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                          >
                            {scheme}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <GraduationCap className="w-4 h-4 text-green-600" />
                        <span className="text-sm font-medium text-green-800">Potential Benefits</span>
                      </div>
                      <p className="text-sm text-green-700">{rec.benefits}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Actions</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button className="p-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all flex items-center justify-center gap-2">
                  <Briefcase className="w-5 h-5" />
                  <span>Check All Schemes</span>
                </button>

                <button className="p-4 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl hover:from-green-600 hover:to-green-700 transition-all flex items-center justify-center gap-2">
                  <Heart className="w-5 h-5" />
                  <span>Health Benefits</span>
                </button>

                <button className="p-4 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl hover:from-purple-600 hover:to-purple-700 transition-all flex items-center justify-center gap-2">
                  <GraduationCap className="w-5 h-5" />
                  <span>Education Aid</span>
                </button>

                <button className="p-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl hover:from-orange-600 hover:to-orange-700 transition-all flex items-center justify-center gap-2">
                  <Users className="w-5 h-5" />
                  <span>Family Pension</span>
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}