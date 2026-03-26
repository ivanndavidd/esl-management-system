import { Box, Button, Paper, Typography } from '@mui/material'
import { Add, AccountTree } from '@mui/icons-material'

export default function BranchPage() {
  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
        <Box>
          <Typography variant="h6" fontWeight={700}>Branch Management</Typography>
          <Typography variant="body2" color="text.secondary">Manage and configure your branches</Typography>
        </Box>
        <Button variant="contained" startIcon={<Add />} sx={{ fontWeight: 600, borderRadius: 2 }}>
          Add Branch
        </Button>
      </Box>

      {/* Empty state */}
      <Paper elevation={0} sx={{
        border: '1px solid #E2E8F0', borderRadius: 3,
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        justifyContent: 'center', py: 12, textAlign: 'center',
      }}>
        <Box sx={{
          width: 64, height: 64, bgcolor: '#EFF6FF', borderRadius: 3,
          display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2,
        }}>
          <AccountTree sx={{ fontSize: 32, color: '#2563EB' }} />
        </Box>
        <Typography fontWeight={600} color="text.primary" mb={0.5}>No branches yet</Typography>
        <Typography variant="body2" color="text.secondary" maxWidth={280}>
          Get started by adding your first branch to the system.
        </Typography>
      </Paper>
    </Box>
  )
}
