import { create } from 'zustand'

const useAuthStore = create((set) => ({
  user: JSON.parse(localStorage.getItem('user') || 'null'),
  accessToken: localStorage.getItem('access_token') || null,
  activeBranch: JSON.parse(localStorage.getItem('active_branch') || 'null'),

  login: (user, accessToken, refreshToken) => {
    localStorage.setItem('user', JSON.stringify(user))
    localStorage.setItem('access_token', accessToken)
    localStorage.setItem('refresh_token', refreshToken)
    set({ user, accessToken })
  },

  logout: () => {
    localStorage.clear()
    set({ user: null, accessToken: null, activeBranch: null })
  },

  setActiveBranch: (branch) => {
    localStorage.setItem('active_branch', JSON.stringify(branch))
    set({ activeBranch: branch })
  },
}))

export default useAuthStore
