import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface User {
  id: string
  name: string
  email: string
}

interface AuthState {
  user: User | null
  token: string | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  signup: (name: string, email: string, password: string) => Promise<void>
  logout: () => void
  checkAuth: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isLoading: false,

      login: async (email: string, password: string) => {
        set({ isLoading: true })
        try {
          const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
          })

          const data = await response.json()

          if (!response.ok) {
            throw new Error(data.error || 'Login failed')
          }

          set({
            user: data.user,
            token: data.token,
            isLoading: false
          })

          // Store token in localStorage
          localStorage.setItem('token', data.token)
        } catch (error) {
          set({ isLoading: false })
          throw error
        }
      },

      signup: async (name: string, email: string, password: string) => {
        set({ isLoading: true })
        try {
          const response = await fetch('/api/auth/signup', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name, email, password })
          })

          const data = await response.json()

          if (!response.ok) {
            throw new Error(data.error || 'Signup failed')
          }

          set({
            user: data.user,
            token: data.token,
            isLoading: false
          })

          localStorage.setItem('token', data.token)
        } catch (error) {
          set({ isLoading: false })
          throw error
        }
      },

      logout: () => {
        set({ user: null, token: null })
        localStorage.removeItem('token')
      },

      checkAuth: () => {
        const token = localStorage.getItem('token')
        if (token) {
          // You could verify the token here if needed
          set({ token })
        }
      }
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ user: state.user, token: state.token })
    }
  )
)