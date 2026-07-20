import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? '/api',
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      const storedRefreshToken = localStorage.getItem('refreshToken')
      if (storedRefreshToken && !(error.config as any)._retry) {
        ;(error.config as any)._retry = true
        try {
          const authService = await import('../services/authService')
          const refreshed = await authService.refresh(storedRefreshToken)
          localStorage.setItem('accessToken', refreshed.accessToken)
          localStorage.setItem('refreshToken', refreshed.refreshToken)
          error.config.headers.Authorization = `Bearer ${refreshed.accessToken}`
          return api(error.config)
        } catch {
          localStorage.removeItem('accessToken')
          localStorage.removeItem('refreshToken')
          localStorage.removeItem('user')
          window.location.href = '/login'
        }
      } else {
        localStorage.removeItem('accessToken')
        localStorage.removeItem('refreshToken')
        localStorage.removeItem('user')
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  }
)

export default api
