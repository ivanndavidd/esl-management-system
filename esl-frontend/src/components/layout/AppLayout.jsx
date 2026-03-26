import { Outlet, useLocation } from 'react-router-dom'
import { Box } from '@mui/material'
import Sidebar from './Sidebar'
import Topbar from './Topbar'

const pageTitles = {
  '/branch': 'Branch Management',
  '/product': 'Product Management',
  '/template': 'Template Management',
  '/planogram': 'Planogram',
}

export default function AppLayout() {
  const location = useLocation()
  const title = pageTitles[location.pathname] || 'ESL Management System'

  return (
    <Box sx={{ display: 'flex', height: '100vh', overflow: 'hidden', bgcolor: '#F1F5F9' }}>
      <Sidebar />
      <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
        <Topbar title={title} />
        <Box component="main" sx={{ flex: 1, overflow: 'auto', p: 3, display: 'flex', flexDirection: 'column' }}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  )
}
