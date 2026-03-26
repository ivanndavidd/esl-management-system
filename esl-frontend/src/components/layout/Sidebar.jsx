import { NavLink } from 'react-router-dom'
import {
  Box, List, ListItem, ListItemButton, ListItemIcon,
  ListItemText, Typography, Tooltip, Avatar, Chip, Divider, IconButton
} from '@mui/material'
import {
  AccountTree, Inventory2, Description, GridView,
  ChevronLeft, ChevronRight, Label
} from '@mui/icons-material'
import { useState } from 'react'
import useAuthStore from '../../store/authStore'

const navItems = [
  { label: 'Branch Management', icon: AccountTree, path: '/branch' },
  { label: 'Product Management', icon: Inventory2, path: '/product' },
  { label: 'Template Management', icon: Description, path: '/template' },
  { label: 'Planogram', icon: GridView, path: '/planogram' },
]

const roleChipColor = {
  developer: 'secondary',
  super_admin: 'primary',
  admin: 'success',
  user: 'default',
}

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false)
  const { user } = useAuthStore()
  const width = collapsed ? 72 : 256

  return (
    <Box
      component="aside"
      sx={{
        width,
        minHeight: '100vh',
        bgcolor: '#0F172A',
        color: 'white',
        display: 'flex',
        flexDirection: 'column',
        transition: 'width 0.3s ease',
        position: 'relative',
        flexShrink: 0,
      }}
    >
      {/* Logo */}
      <Box sx={{
        display: 'flex', alignItems: 'center', gap: 1.5,
        px: collapsed ? 1.5 : 2.5, py: 2.5,
        borderBottom: '1px solid rgba(255,255,255,0.08)',
        justifyContent: collapsed ? 'center' : 'flex-start',
        minHeight: 72,
      }}>
        <Box sx={{
          width: 36, height: 36, bgcolor: '#2563EB',
          borderRadius: 2, display: 'flex', alignItems: 'center',
          justifyContent: 'center', flexShrink: 0,
        }}>
          <Label sx={{ fontSize: 18, color: 'white' }} />
        </Box>
        {!collapsed && (
          <Box>
            <Typography fontWeight={700} fontSize={14} color="white" lineHeight={1.2}>
              ESL Manager
            </Typography>
            <Typography fontSize={11} sx={{ color: 'rgba(255,255,255,0.4)' }}>
              Management System
            </Typography>
          </Box>
        )}
      </Box>

      {/* Nav label */}
      {!collapsed && (
        <Typography sx={{
          px: 2.5, pt: 2.5, pb: 1,
          fontSize: 10, fontWeight: 700,
          letterSpacing: 1.5, color: 'rgba(255,255,255,0.3)',
          textTransform: 'uppercase'
        }}>
          Menu
        </Typography>
      )}

      {/* Nav items */}
      <List sx={{ px: 1, flex: 1, py: 0.5 }}>
        {navItems.map(({ label, icon: Icon, path }) => (
          <Tooltip key={path} title={collapsed ? label : ''} placement="right" arrow>
            <ListItem disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                component={NavLink}
                to={path}
                sx={{
                  borderRadius: 2,
                  px: collapsed ? 1.5 : 1.5,
                  py: 1.2,
                  justifyContent: collapsed ? 'center' : 'flex-start',
                  minHeight: 44,
                  color: 'rgba(255,255,255,0.55)',
                  '&:hover': { bgcolor: 'rgba(255,255,255,0.06)', color: 'white' },
                  '&.active': {
                    bgcolor: '#2563EB',
                    color: 'white',
                    '& .MuiListItemIcon-root': { color: 'white' },
                    boxShadow: '0 4px 14px rgba(37,99,235,0.4)',
                  },
                }}
              >
                <ListItemIcon sx={{
                  minWidth: collapsed ? 0 : 36,
                  color: 'inherit',
                  justifyContent: 'center',
                }}>
                  <Icon sx={{ fontSize: 20 }} />
                </ListItemIcon>
                {!collapsed && (
                  <ListItemText
                    primary={label}
                    primaryTypographyProps={{ fontSize: 13, fontWeight: 500 }}
                  />
                )}
              </ListItemButton>
            </ListItem>
          </Tooltip>
        ))}
      </List>

      {/* User info */}
      {!collapsed && user && (
        <Box sx={{ p: 2 }}>
          <Box sx={{
            p: 1.5, borderRadius: 2,
            bgcolor: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.08)',
            display: 'flex', alignItems: 'center', gap: 1.5,
          }}>
            <Avatar sx={{ width: 32, height: 32, bgcolor: '#2563EB', fontSize: 13, fontWeight: 700 }}>
              {user.name?.[0]?.toUpperCase()}
            </Avatar>
            <Box sx={{ minWidth: 0 }}>
              <Typography fontSize={13} fontWeight={600} color="white" noWrap>
                {user.name}
              </Typography>
              <Chip
                label={user.role.replace('_', ' ')}
                size="small"
                color={roleChipColor[user.role] || 'default'}
                sx={{ height: 18, fontSize: 10, fontWeight: 600, mt: 0.3, textTransform: 'capitalize' }}
              />
            </Box>
          </Box>
        </Box>
      )}

      {/* Collapse button */}
      <IconButton
        onClick={() => setCollapsed(!collapsed)}
        size="small"
        sx={{
          position: 'absolute', top: 20, right: -14,
          bgcolor: '#1E293B', border: '1px solid rgba(255,255,255,0.1)',
          color: 'white', width: 28, height: 28,
          '&:hover': { bgcolor: '#2563EB' },
          zIndex: 10,
        }}
      >
        {collapsed ? <ChevronRight sx={{ fontSize: 16 }} /> : <ChevronLeft sx={{ fontSize: 16 }} />}
      </IconButton>
    </Box>
  )
}
