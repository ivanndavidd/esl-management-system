import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box, Button, TextField, Typography, InputAdornment,
  IconButton, Paper, Alert, CircularProgress
} from '@mui/material'
import { Visibility, VisibilityOff, Label } from '@mui/icons-material'
import toast from 'react-hot-toast'
import api from '../../api/axios'
import useAuthStore from '../../store/authStore'

export default function LoginPage() {
  const navigate = useNavigate()
  const { login } = useAuthStore()
  const [form, setForm] = useState({ email: '', password: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e) => {
    setError('')
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const { data } = await api.post('/auth/login/', form)
      login(data.user, data.access, data.refresh)
      toast.success(`Welcome back, ${data.user.name}!`)
      navigate('/')
    } catch (err) {
      const msg = err.response?.data?.detail || 'Invalid email or password'
      setError(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex' }}>
      {/* Left branding panel */}
      <Box
        sx={{
          display: { xs: 'none', md: 'flex' },
          flexDirection: 'column',
          justifyContent: 'space-between',
          width: '45%',
          background: 'linear-gradient(135deg, #1565C0 0%, #0D47A1 50%, #283593 100%)',
          p: 6,
          color: 'white',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box sx={{
            width: 40, height: 40, bgcolor: 'rgba(255,255,255,0.2)',
            borderRadius: 2, display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <Label sx={{ fontSize: 20 }} />
          </Box>
          <Typography fontWeight={700} fontSize={16}>ESL Management</Typography>
        </Box>

        <Box>
          <Typography variant="h3" fontWeight={800} lineHeight={1.2} mb={2}>
            Manage your<br />Electronic<br />Shelf Labels.
          </Typography>
          <Typography sx={{ color: 'rgba(255,255,255,0.7)', fontSize: 14, maxWidth: 320, lineHeight: 1.7 }}>
            Centralize branch management, product catalogues, templates, and planograms in one powerful platform.
          </Typography>
        </Box>

        <Typography sx={{ color: 'rgba(255,255,255,0.4)', fontSize: 12 }}>
          © 2026 ESL Management System
        </Typography>
      </Box>

      {/* Right form panel */}
      <Box sx={{
        flex: 1, display: 'flex', alignItems: 'center',
        justifyContent: 'center', bgcolor: '#F8FAFC', px: 3
      }}>
        <Box sx={{ width: '100%', maxWidth: 400 }}>
          <Box sx={{ mb: 4 }}>
            <Typography variant="h5" fontWeight={800} color="text.primary" mb={0.5}>
              Sign in to your account
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Enter your credentials to continue
            </Typography>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
            <TextField
              label="Email address"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              required
              fullWidth
              placeholder="you@example.com"
              variant="outlined"
              size="medium"
            />

            <TextField
              label="Password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              value={form.password}
              onChange={handleChange}
              required
              fullWidth
              variant="outlined"
              size="medium"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPassword(!showPassword)} edge="end" size="small">
                      {showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <Button
              type="submit"
              variant="contained"
              fullWidth
              size="large"
              disabled={loading}
              sx={{ mt: 1, py: 1.5, fontWeight: 700, borderRadius: 2, fontSize: 15 }}
            >
              {loading ? <CircularProgress size={22} color="inherit" /> : 'Sign In'}
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  )
}
