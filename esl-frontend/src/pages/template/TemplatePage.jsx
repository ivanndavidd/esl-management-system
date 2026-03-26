import { useState, useEffect } from 'react'
import {
  Box, Button, Typography, Paper, Stack, Chip,
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, IconButton, Tooltip, CircularProgress,
  Table, TableBody, TableCell, TableHead, TableRow,
  Select, MenuItem, FormControl, InputLabel
} from '@mui/material'
import { Add, Edit, Delete, Close } from '@mui/icons-material'

const CATEGORY_OPTIONS = [
  { value: 'demo', label: 'Demo Item' },
  { value: 'accessory', label: 'Accessories' },
  { value: 'maintenance', label: 'UnderMaintenance' },
]

const categoryColor = (cat) => {
  if (cat === 'maintenance') return 'warning'
  if (cat === 'accessory') return 'secondary'
  return 'primary'
}

const categoryLabel = (cat) => {
  return CATEGORY_OPTIONS.find(o => o.value === cat)?.label || cat
}
import api from '../../api/axios'
import toast from 'react-hot-toast'

// ── Form Dialog ───────────────────────────────────────────────────────────────
function TemplateDialog({ open, onClose, onSuccess, template }) {
  const [templateId, setTemplateId] = useState('')
  const [label, setLabel] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState('demo')
  const [variantCount, setVariantCount] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (open) {
      setTemplateId(template ? String(template.template_id) : '')
      setLabel(template?.label || '')
      setDescription(template?.description || '')
      setCategory(template?.category || 'demo')
      setVariantCount(template?.variant_count != null ? String(template.variant_count) : '')
    }
  }, [open, template])

  const handleSubmit = async () => {
    if (!templateId || !label.trim()) return toast.error('Template ID dan Label wajib diisi.')
    if (isNaN(parseInt(templateId))) return toast.error('Template ID harus berupa angka.')
    if (category === 'demo' && (!variantCount || isNaN(parseInt(variantCount)))) return toast.error('Jumlah Varian wajib diisi untuk Demo Item.')
    setLoading(true)
    try {
      const body = {
        template_id: parseInt(templateId), label, description, category,
        variant_count: category === 'demo' ? parseInt(variantCount) : null,
      }
      if (template) {
        await api.put(`/planogram/templates/${template.id}/`, body)
        toast.success('Template berhasil diupdate.')
      } else {
        await api.post('/planogram/templates/', body)
        toast.success('Template berhasil dibuat.')
      }
      onSuccess()
      onClose()
    } catch (err) {
      const msg = err.response?.data?.template_id?.[0] || err.response?.data?.label?.[0] || 'Gagal menyimpan.'
      toast.error(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography fontWeight={700}>{template ? 'Edit Template' : 'Tambah Template'}</Typography>
        <IconButton size="small" onClick={onClose}><Close fontSize="small" /></IconButton>
      </DialogTitle>
      <DialogContent dividers>
        <Stack spacing={2.5} mt={0.5}>
          <TextField
            label="Template ID" size="small" fullWidth required
            value={templateId}
            onChange={e => setTemplateId(e.target.value)}
            disabled={!!template}
            placeholder="contoh: 26"
            helperText={template ? 'Template ID tidak bisa diubah.' : ''}
          />
          <TextField
            label="Label" size="small" fullWidth required
            value={label}
            onChange={e => setLabel(e.target.value)}
            placeholder="contoh: Accessories"
          />
          <FormControl size="small" fullWidth required>
            <InputLabel>Digunakan untuk</InputLabel>
            <Select value={category} label="Digunakan untuk" onChange={e => { setCategory(e.target.value); setVariantCount('') }}>
              {CATEGORY_OPTIONS.map(o => (
                <MenuItem key={o.value} value={o.value}>{o.label}</MenuItem>
              ))}
            </Select>
          </FormControl>
          {category === 'demo' && (
            <TextField
              label="Jumlah Varian" size="small" fullWidth required
              value={variantCount}
              onChange={e => setVariantCount(e.target.value)}
              placeholder="contoh: 1"
              helperText="Jumlah varian produk yang menggunakan template ini"
              type="number"
              inputProps={{ min: 1 }}
            />
          )}
          <TextField
            label="Deskripsi" size="small" fullWidth multiline rows={2}
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="contoh: Template untuk Accessories Item"
          />
        </Stack>
      </DialogContent>
      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={onClose} color="inherit">Batal</Button>
        <Button variant="contained" onClick={handleSubmit} disabled={loading}
          startIcon={loading && <CircularProgress size={14} color="inherit" />}
          sx={{ fontWeight: 600 }}>
          {loading ? 'Menyimpan...' : 'Simpan'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

// ── Delete Dialog ─────────────────────────────────────────────────────────────
function DeleteDialog({ open, onClose, onConfirm, template, loading }) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle fontWeight={700}>Konfirmasi Hapus</DialogTitle>
      <DialogContent>
        <Typography>
          Hapus template <strong>{template?.template_id} — {template?.label}</strong>?
          Tindakan ini tidak bisa dibatalkan.
        </Typography>
      </DialogContent>
      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={onClose} color="inherit">Batal</Button>
        <Button variant="contained" color="error" onClick={onConfirm} disabled={loading}
          startIcon={loading && <CircularProgress size={14} color="inherit" />}
          sx={{ fontWeight: 600 }}>
          Hapus
        </Button>
      </DialogActions>
    </Dialog>
  )
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function TemplatePage() {
  const [templates, setTemplates] = useState([])
  const [loading, setLoading] = useState(false)
  const [formDialog, setFormDialog] = useState({ open: false, template: null })
  const [deleteDialog, setDeleteDialog] = useState({ open: false, template: null, loading: false })

  const fetchTemplates = async () => {
    setLoading(true)
    try {
      const { data } = await api.get('/planogram/templates/')
      setTemplates(data)
    } catch {
      toast.error('Gagal memuat data template.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchTemplates() }, [])

  const handleDelete = async () => {
    setDeleteDialog(d => ({ ...d, loading: true }))
    try {
      await api.delete(`/planogram/templates/${deleteDialog.template.id}/`)
      toast.success('Template berhasil dihapus.')
      setDeleteDialog({ open: false, template: null, loading: false })
      fetchTemplates()
    } catch {
      toast.error('Gagal menghapus template.')
      setDeleteDialog(d => ({ ...d, loading: false }))
    }
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', gap: 2 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box>
          <Typography variant="h6" fontWeight={700}>Template Management</Typography>
          <Typography variant="body2" color="text.secondary">{templates.length} template terdaftar</Typography>
        </Box>
        <Button variant="contained" startIcon={<Add />}
          onClick={() => setFormDialog({ open: true, template: null })}
          sx={{ fontWeight: 600, borderRadius: 2 }}>
          Tambah Template
        </Button>
      </Box>

      {/* Table */}
      <Paper elevation={0} sx={{ border: '1px solid #E2E8F0', borderRadius: 2, flex: 1 }}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress />
          </Box>
        ) : templates.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography color="text.secondary">Belum ada template. Klik "Tambah Template" untuk memulai.</Typography>
          </Box>
        ) : (
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: '#F8FAFC' }}>
                <TableCell sx={{ fontWeight: 700, fontSize: 13, width: 120 }}>Template ID</TableCell>
                <TableCell sx={{ fontWeight: 700, fontSize: 13 }}>Label</TableCell>
                <TableCell sx={{ fontWeight: 700, fontSize: 13 }}>Deskripsi</TableCell>
                <TableCell sx={{ fontWeight: 700, fontSize: 13, width: 140 }}>Digunakan untuk</TableCell>
                <TableCell sx={{ fontWeight: 700, fontSize: 13, width: 100 }}>Varian</TableCell>
                <TableCell align="right" sx={{ fontWeight: 700, fontSize: 13 }}>Aksi</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {templates.map(t => (
                <TableRow key={t.id} hover>
                  <TableCell>
                    <Chip
                      label={t.template_id}
                      size="small"
                      color={categoryColor(t.category)}
                      sx={{ fontWeight: 700, fontSize: 13, minWidth: 40 }}
                    />
                  </TableCell>
                  <TableCell sx={{ fontSize: 13, fontWeight: 600 }}>{t.label}</TableCell>
                  <TableCell sx={{ fontSize: 12, color: 'text.secondary' }}>
                    {t.description || <Typography fontSize={12} color="text.disabled">—</Typography>}
                  </TableCell>
                  <TableCell>
                    <Chip label={categoryLabel(t.category)} size="small" color={categoryColor(t.category)} variant="outlined" sx={{ fontSize: 11 }} />
                  </TableCell>
                  <TableCell sx={{ fontSize: 12, color: 'text.secondary' }}>
                    {t.category === 'demo' && t.variant_count != null
                      ? `${t.variant_count} varian`
                      : <Typography fontSize={12} color="text.disabled">—</Typography>}
                  </TableCell>
                  <TableCell align="right">
                    <Stack direction="row" spacing={0.5} justifyContent="flex-end">
                      <Tooltip title="Edit">
                        <IconButton size="small"
                          onClick={() => setFormDialog({ open: true, template: t })}>
                          <Edit fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Hapus">
                        <IconButton size="small" color="error"
                          onClick={() => setDeleteDialog({ open: true, template: t, loading: false })}>
                          <Delete fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Paper>

      <TemplateDialog
        open={formDialog.open}
        template={formDialog.template}
        onClose={() => setFormDialog({ open: false, template: null })}
        onSuccess={fetchTemplates}
      />
      <DeleteDialog
        open={deleteDialog.open}
        template={deleteDialog.template}
        loading={deleteDialog.loading}
        onClose={() => setDeleteDialog({ open: false, template: null, loading: false })}
        onConfirm={handleDelete}
      />
    </Box>
  )
}
