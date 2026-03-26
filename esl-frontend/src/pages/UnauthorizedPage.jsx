import { Box, Button, Paper, Typography } from '@mui/material'
import { GppBad } from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'

export default function UnauthorizedPage() {
  const navigate = useNavigate()
  return (
    <Box sx={{
      minHeight: '100vh', display: 'flex', alignItems: 'center',
      justifyContent: 'center', bgcolor: '#F8FAFC', px: 2,
    }}>
      <Box sx={{ textAlign: 'center', maxWidth: 360 }}>
        <Box sx={{
          width: 72, height: 72, bgcolor: '#FEE2E2', borderRadius: 3,
          display: 'flex', alignItems: 'center', justifyContent: 'center', mx: 'auto', mb: 3,
        }}>
          <GppBad sx={{ fontSize: 40, color: '#EF4444' }} />
        </Box>
        <Typography variant="h5" fontWeight={800} mb={1}>Access Denied</Typography>
        <Typography variant="body2" color="text.secondary" mb={4}>
          You don't have permission to view this page. Contact your administrator if you think this is a mistake.
        </Typography>
        <Button
          variant="contained"
          onClick={() => navigate(-1)}
          sx={{ fontWeight: 600, borderRadius: 2, px: 4 }}
        >
          Go Back
        </Button>
      </Box>
    </Box>
  )
}
