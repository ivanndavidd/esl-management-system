import {
  AppBar, Toolbar, Typography, Box, Avatar, Chip,
  IconButton, Tooltip, Divider, Button
} from '@mui/material'
import { Notifications, Logout } from '@mui/icons-material'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import useAuthStore from '../../store/authStore'
import api from '../../api/axios'

const roleChipColor = {
  developer: 'secondary',
  super_admin: 'primary',
  admin: 'success',
  user: 'default',
}

export default function Topbar({ title }) {
  const { user, activeBranch, logout } = useAuthStore()
  const navigate = useNavigate()
  const [loggingOut, setLoggingOut] = useState(false)

  const handleLogout = async () => {
    setLoggingOut(true)
    try {
      await api.post('/auth/logout/', { refresh: localStorage.getItem('refresh_token') })
    } finally {
      logout()
      navigate('/login')
    }
  }

  return (
    <AppBar
      position="static"
      elevation={0}
      sx={{
        bgcolor: 'white',
        borderBottom: '1px solid #E2E8F0',
        color: 'text.primary',
        zIndex: 1,
      }}
    >
      <Toolbar sx={{ minHeight: '64px !important', px: 3 }}>
        {/* Title */}
        <Box sx={{ flex: 1 }}>
          <Typography variant="subtitle1" fontWeight={700} color="text.primary" lineHeight={1.2}>
            {title}
          </Typography>
          {activeBranch && (
            <Typography variant="caption" color="text.secondary">
              Branch: <strong>{activeBranch.name}</strong>
            </Typography>
          )}
        </Box>

        {/* Right actions */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Tooltip title="Notifications">
            <IconButton size="small" sx={{ color: 'text.secondary' }}>
              <Notifications fontSize="small" />
            </IconButton>
          </Tooltip>

          <Divider orientation="vertical" flexItem sx={{ mx: 1, my: 1.5 }} />

          {/* User info */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Avatar sx={{ width: 34, height: 34, bgcolor: '#2563EB', fontSize: 13, fontWeight: 700 }}>
              {user?.name?.[0]?.toUpperCase()}
            </Avatar>
            <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
              <Typography fontSize={13} fontWeight={600} lineHeight={1.2}>
                {user?.name}
              </Typography>
              <Chip
                label={user?.role?.replace('_', ' ')}
                size="small"
                color={roleChipColor[user?.role] || 'default'}
                sx={{ height: 18, fontSize: 10, fontWeight: 600, textTransform: 'capitalize' }}
              />
            </Box>
          </Box>

          <Divider orientation="vertical" flexItem sx={{ mx: 1, my: 1.5 }} />

          <Tooltip title="Logout">
            <Button
              onClick={handleLogout}
              disabled={loggingOut}
              startIcon={<Logout fontSize="small" />}
              size="small"
              color="error"
              variant="text"
              sx={{ fontWeight: 600, fontSize: 12 }}
            >
              Logout
            </Button>
          </Tooltip>
        </Box>
      </Toolbar>
    </AppBar>
  )
}
