import { useState, useEffect, useRef } from 'react'
import { useSearchParams } from 'react-router-dom'
import {
  Box, Button, Typography, Paper, Stack, Chip,
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, IconButton, Tooltip, CircularProgress,
  Table, TableBody, TableCell, TableHead, TableRow,
  Breadcrumbs, Link, Divider, InputAdornment, Autocomplete,
  Checkbox
} from '@mui/material'
import {
  Add, Edit, Delete, ArrowBack, Place, ViewModule, Close,
  DevicesOther, UploadFile, Search, Settings, LinkOff, BuildCircle, Download
} from '@mui/icons-material'
import api from '../../api/axios'
import toast from 'react-hot-toast'
import * as XLSX from 'xlsx'
import ProductEditDialog from '../../components/ProductEditDialog'

// ── Site Form Dialog ──────────────────────────────────────────────────────────
function SiteDialog({ open, onClose, onSuccess, site }) {
  const [name, setName] = useState('')
  const [location, setLocation] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (open) {
      setName(site?.name || '')
      setLocation(site?.location || '')
    }
  }, [open, site])

  const handleSubmit = async () => {
    if (!name.trim()) return toast.error('Nama site wajib diisi.')
    setLoading(true)
    try {
      if (site) {
        await api.put(`/planogram/sites/${site.id}/`, { name, location })
        toast.success('Site berhasil diupdate.')
      } else {
        await api.post('/planogram/sites/', { name, location })
        toast.success('Site berhasil dibuat.')
      }
      onSuccess()
      onClose()
    } catch (err) {
      toast.error(err.response?.data?.name?.[0] || 'Gagal menyimpan site.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography fontWeight={700}>{site ? 'Edit Site' : 'Tambah Site'}</Typography>
        <IconButton size="small" onClick={onClose}><Close fontSize="small" /></IconButton>
      </DialogTitle>
      <DialogContent dividers>
        <Stack spacing={2.5} mt={0.5}>
          <TextField label="Nama Site" size="small" fullWidth required
            value={name} onChange={e => setName(e.target.value)}
            placeholder="contoh: Blibli Jakarta Pusat" />
          <TextField label="Lokasi" size="small" fullWidth multiline rows={2}
            value={location} onChange={e => setLocation(e.target.value)}
            placeholder="contoh: Jl. MH Thamrin No.1, Jakarta" />
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

// ── Segment Form Dialog ───────────────────────────────────────────────────────
function SegmentDialog({ open, onClose, onSuccess, siteId, segment }) {
  const [name, setName] = useState('')
  const [eslType, setEslType] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (open) {
      setName(segment?.name || '')
      setEslType(segment?.esl_type || '')
    }
  }, [open, segment])

  const handleSubmit = async () => {
    if (!name.trim()) return toast.error('Nama layout wajib diisi.')
    setLoading(true)
    try {
      if (segment) {
        await api.put(`/planogram/sites/${siteId}/segments/${segment.id}/`, { name, esl_type: eslType })
        toast.success('Segment berhasil diupdate.')
      } else {
        await api.post(`/planogram/sites/${siteId}/segments/`, { name, esl_type: eslType })
        toast.success('Segment berhasil dibuat.')
      }
      onSuccess()
      onClose()
    } catch (err) {
      toast.error(err.response?.data?.name?.[0] || 'Gagal menyimpan segment.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography fontWeight={700}>{segment ? 'Edit Segment' : 'Tambah Layout Segment'}</Typography>
        <IconButton size="small" onClick={onClose}><Close fontSize="small" /></IconButton>
      </DialogTitle>
      <DialogContent dividers>
        <Stack spacing={2.5} mt={0.5}>
          <TextField label="Nama Layout" size="small" fullWidth required
            value={name} onChange={e => setName(e.target.value)}
            placeholder="contoh: Accessories Apple" />
          <TextField label="Type ESL" size="small" fullWidth
            value={eslType} onChange={e => setEslType(e.target.value)}
            placeholder="contoh: 2.13 inch, 4.2 inch" />
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

// ── Delete Confirm Dialog ─────────────────────────────────────────────────────
function DeleteDialog({ open, onClose, onConfirm, label, loading }) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle fontWeight={700}>Konfirmasi Hapus</DialogTitle>
      <DialogContent>
        <Typography>Hapus <strong>{label}</strong>? Tindakan ini tidak bisa dibatalkan.</Typography>
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

// ── Helpers ───────────────────────────────────────────────────────────────────
const MAINTENANCE_TEMPLATES = [
  { template_id: 34, label: 'UnderMaintenance 2.13 inch' },
  { template_id: 35, label: 'UnderMaintenance 4.20 inch' },
]

function templateLabel(templateId) {
  if (!templateId) return '—'
  const t = parseInt(templateId)
  if (t === 26) return '26 (Accessories)'
  if (t === 34) return '34 (Maintenance 2.13)'
  if (t === 35) return '35 (Maintenance 4.20)'
  if (t === 3)  return '3 (1 Varian)'
  if (t === 30) return '30 (2 Varian)'
  if (t === 31) return '31 (3 Varian)'
  return String(templateId)
}

// ── Batch Action Dialog ───────────────────────────────────────────────────────
function BatchActionDialog({ open, onClose, onSuccess, segmentId, selectedIds }) {
  const [mode, setMode] = useState('unbind')
  const [maintenanceTemplate, setMaintenanceTemplate] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (open) { setMode('unbind'); setMaintenanceTemplate(null) }
  }, [open])

  const handleSave = async () => {
    if (mode === 'maintenance' && !maintenanceTemplate) {
      return toast.error('Pilih template maintenance.')
    }
    setLoading(true)
    try {
      const body = mode === 'unbind'
        ? { ids: selectedIds, action: 'unbind' }
        : { ids: selectedIds, action: 'maintenance', template: maintenanceTemplate }
      await api.post(`/planogram/segments/${segmentId}/devices/batch/`, body)
      toast.success(`${selectedIds.length} device berhasil diupdate.`)
      onSuccess()
      onClose()
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Gagal batch action.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box>
          <Typography fontWeight={700}>Batch Action</Typography>
          <Typography fontSize={12} color="text.secondary">{selectedIds.length} device dipilih</Typography>
        </Box>
        <IconButton size="small" onClick={onClose}><Close fontSize="small" /></IconButton>
      </DialogTitle>
      <DialogContent dividers>
        <Stack spacing={2}>
          <Stack direction="row" spacing={1}>
            <Button size="small" variant={mode === 'unbind' ? 'contained' : 'outlined'}
              color="error" onClick={() => setMode('unbind')} sx={{ fontWeight: 600, fontSize: 12 }}>
              Hapus Binding
            </Button>
            <Button size="small" variant={mode === 'maintenance' ? 'contained' : 'outlined'}
              onClick={() => setMode('maintenance')} sx={{ fontWeight: 600, fontSize: 12 }}>
              UnderMaintenance
            </Button>
          </Stack>

          {mode === 'unbind' && (
            <Typography fontSize={13} color="text.secondary">
              Barcode, template, dan binding produk akan dihapus dari {selectedIds.length} device yang dipilih.
            </Typography>
          )}

          {mode === 'maintenance' && (
            <Stack direction="row" spacing={1.5}>
              {MAINTENANCE_TEMPLATES.map(t => (
                <Paper key={t.template_id} elevation={0}
                  onClick={() => setMaintenanceTemplate(t.template_id)}
                  sx={{
                    flex: 1, p: 1.5, textAlign: 'center', cursor: 'pointer',
                    border: maintenanceTemplate === t.template_id ? '2px solid #1976d2' : '1px solid #E2E8F0',
                    borderRadius: 2,
                    bgcolor: maintenanceTemplate === t.template_id ? '#EBF4FF' : 'white',
                  }}>
                  <Typography fontWeight={700} fontSize={20} color="primary.main">{t.template_id}</Typography>
                  <Typography fontSize={11} color="text.secondary">{t.label}</Typography>
                </Paper>
              ))}
            </Stack>
          )}
        </Stack>
      </DialogContent>
      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={onClose} color="inherit">Batal</Button>
        <Button variant="contained" color={mode === 'unbind' ? 'error' : 'primary'}
          onClick={handleSave} disabled={loading}
          startIcon={loading && <CircularProgress size={14} color="inherit" />}
          sx={{ fontWeight: 600 }}>
          {loading ? 'Menyimpan...' : `Terapkan ke ${selectedIds.length} Device`}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

// ── Maintenance/Unbind Dialog (Settings button) ───────────────────────────────
function MaintenanceDialog({ open, onClose, onSuccess, segmentId, device }) {
  const [mode, setMode] = useState('maintenance')
  const [maintenanceTemplate, setMaintenanceTemplate] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!open) return
    const tpl = String(device?.template || '')
    setMaintenanceTemplate(tpl === '34' || tpl === '35' ? parseInt(tpl) : null)
    setMode('maintenance')
  }, [open, device])

  const handleSave = async () => {
    if (mode === 'maintenance' && !maintenanceTemplate) {
      return toast.error('Pilih template maintenance.')
    }
    setLoading(true)
    try {
      const body = mode === 'unbind'
        ? { product_id: null }
        : { template: maintenanceTemplate }
      await api.patch(`/planogram/segments/${segmentId}/devices/${device.id}/bind/`, body)
      toast.success('Berhasil disimpan.')
      onSuccess()
      onClose()
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Gagal menyimpan.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box>
          <Typography fontWeight={700}>Pengaturan Device</Typography>
          <Typography fontSize={12} color="text.secondary" fontFamily="monospace">{device?.code}</Typography>
        </Box>
        <IconButton size="small" onClick={onClose}><Close fontSize="small" /></IconButton>
      </DialogTitle>
      <DialogContent dividers>
        <Stack spacing={2}>
          <Stack direction="row" spacing={1}>
            <Button size="small" variant={mode === 'maintenance' ? 'contained' : 'outlined'}
              onClick={() => setMode('maintenance')} sx={{ fontWeight: 600, fontSize: 12 }}>
              UnderMaintenance
            </Button>
            <Button size="small" variant={mode === 'unbind' ? 'contained' : 'outlined'}
              color="error" onClick={() => setMode('unbind')} sx={{ fontWeight: 600, fontSize: 12 }}>
              Hapus Binding
            </Button>
          </Stack>

          {mode === 'maintenance' && (
            <Stack direction="row" spacing={1.5}>
              {MAINTENANCE_TEMPLATES.map(t => (
                <Paper key={t.template_id} elevation={0}
                  onClick={() => setMaintenanceTemplate(t.template_id)}
                  sx={{
                    flex: 1, p: 1.5, textAlign: 'center', cursor: 'pointer',
                    border: maintenanceTemplate === t.template_id ? '2px solid #1976d2' : '1px solid #E2E8F0',
                    borderRadius: 2,
                    bgcolor: maintenanceTemplate === t.template_id ? '#EBF4FF' : 'white',
                  }}>
                  <Typography fontWeight={700} fontSize={20} color="primary.main">{t.template_id}</Typography>
                  <Typography fontSize={11} color="text.secondary">{t.label}</Typography>
                </Paper>
              ))}
            </Stack>
          )}

          {mode === 'unbind' && (
            <Typography fontSize={13} color="text.secondary">
              Barcode, template, dan binding produk akan dihapus dari device ini.
            </Typography>
          )}
        </Stack>
      </DialogContent>
      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={onClose} color="inherit">Batal</Button>
        <Button variant="contained" color={mode === 'unbind' ? 'error' : 'primary'}
          onClick={handleSave} disabled={loading}
          startIcon={loading && <CircularProgress size={14} color="inherit" />}
          sx={{ fontWeight: 600 }}>
          {loading ? 'Menyimpan...' : 'Simpan'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

// ── Inline Product Search Cell ────────────────────────────────────────────────
function ProductSearchCell({ device, segmentId, allProducts, onSaved }) {
  const [saving, setSaving] = useState(false)

  const handleChange = async (_, product) => {
    if (!product) return
    setSaving(true)
    try {
      await api.patch(`/planogram/segments/${segmentId}/devices/${device.id}/bind/`, {
        product_id: product.product_id
      })
      toast.success('Produk berhasil di-set.')
      onSaved()
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Gagal menyimpan.')
    } finally {
      setSaving(false)
    }
  }

  const current = allProducts.find(p => p.id === device.product) || null

  return (
    <Autocomplete
      options={allProducts}
      value={current}
      onChange={handleChange}
      loading={saving}
      size="small"
      sx={{ minWidth: 220 }}
      getOptionLabel={p => `${p.product_id} — ${p.brand} ${p.commercial_name}`}
      renderOption={(props, p) => (
        <li {...props} key={p.id}>
          <Box>
            <Typography fontSize={12} fontWeight={600}>{p.product_id}</Typography>
            <Typography fontSize={11} color="text.secondary">
              {p.brand} {p.commercial_name}
              {' · '}
              <span style={{ color: p.product_type === 'accessory' ? '#ed6c02' : '#1976d2' }}>
                {p.product_type === 'accessory' ? 'Accessories' : `Demo · ${p.variants?.length || 0} varian`}
              </span>
            </Typography>
          </Box>
        </li>
      )}
      renderInput={params => (
        <TextField {...params} placeholder="Cari ID atau nama produk..." size="small"
          InputProps={{
            ...params.InputProps,
            endAdornment: saving ? <CircularProgress size={14} /> : params.InputProps.endAdornment,
            sx: { fontSize: 12 }
          }}
        />
      )}
      isOptionEqualToValue={(a, b) => a.id === b.id}
      noOptionsText="Tidak ditemukan"
      clearOnBlur={false}
    />
  )
}

// ── ESL Device View ───────────────────────────────────────────────────────────
function ESLDeviceView({ site, segment, onBack }) {
  const [devices, setDevices] = useState([])
  const [allProducts, setAllProducts] = useState([])
  const [loading, setLoading] = useState(false)
  const [importing, setImporting] = useState(false)
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState(new Set())
  const [batchDialog, setBatchDialog] = useState(false)
  const [settingsDialog, setSettingsDialog] = useState({ open: false, device: null })
  const [deleteDialog, setDeleteDialog] = useState({ open: false, device: null, loading: false })
  const [productEditDialog, setProductEditDialog] = useState({ open: false, productId: null })
  const fileInputRef = useRef()

  const fetchDevices = async () => {
    setLoading(true)
    try {
      const { data } = await api.get(`/planogram/segments/${segment.id}/devices/`)
      setDevices(data)
    } catch {
      toast.error('Gagal memuat ESL device.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDevices()
    api.get('/products/').then(({ data }) => {
      setAllProducts(Array.isArray(data) ? data : (data.results || []))
    }).catch(() => {})
  }, [segment.id])

  // Selection helpers
  const toggleOne = (id) => setSelected(prev => {
    const next = new Set(prev)
    next.has(id) ? next.delete(id) : next.add(id)
    return next
  })
  const toggleAll = () => {
    if (selected.size === filtered.length) {
      setSelected(new Set())
    } else {
      setSelected(new Set(filtered.map(d => d.id)))
    }
  }
  const clearSelection = () => setSelected(new Set())

  const handleImport = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    e.target.value = ''
    setImporting(true)
    const form = new FormData()
    form.append('file', file)
    try {
      const { data } = await api.post(
        `/planogram/segments/${segment.id}/devices/import/`,
        form,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      )
      toast.success(`Import selesai: ${data.created} baru, ${data.updated} diupdate.`)
      if (data.errors?.length) {
        data.errors.slice(0, 3).forEach(err => toast.error(err, { duration: 5000 }))
      }
      fetchDevices()
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Import gagal.')
    } finally {
      setImporting(false)
    }
  }

  const handleDelete = async () => {
    setDeleteDialog(d => ({ ...d, loading: true }))
    try {
      await api.delete(`/planogram/segments/${segment.id}/devices/${deleteDialog.device.id}/`)
      toast.success('Device berhasil dihapus.')
      setDeleteDialog({ open: false, device: null, loading: false })
      fetchDevices()
    } catch {
      toast.error('Gagal menghapus device.')
      setDeleteDialog(d => ({ ...d, loading: false }))
    }
  }

  const filtered = devices.filter(d => {
    const q = search.toLowerCase()
    return (
      (d.barcode || '').toLowerCase().includes(q) ||
      d.code.toLowerCase().includes(q) ||
      (d.product_id || '').toLowerCase().includes(q) ||
      (d.product_name || '').toLowerCase().includes(q)
    )
  })

  const handleExport = () => {
    const rows = devices.map(d => ({
      Code: d.code,
      Barcode: d.barcode || '',
      Templates: d.template || '',
      Ap: d.ap || '',
      Desc: d.desc || '',
    }))
    const ws = XLSX.utils.json_to_sheet(rows)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'ESL Devices')
    XLSX.writeFile(wb, `${segment.name} - ${site.name}.xlsx`)
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', gap: 2 }}>
      {/* Header */}
      <Box>
        <Breadcrumbs sx={{ mb: 0.5 }}>
          <Link component="button" underline="hover" color="inherit" fontSize={13}
            onClick={() => onBack('sites')} sx={{ cursor: 'pointer', background: 'none', border: 'none' }}>
            Site Management
          </Link>
          <Link component="button" underline="hover" color="inherit" fontSize={13}
            onClick={() => onBack('segments')} sx={{ cursor: 'pointer', background: 'none', border: 'none' }}>
            {site.name}
          </Link>
          <Typography fontSize={13} color="text.primary" fontWeight={600}>{segment.name}</Typography>
        </Breadcrumbs>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <IconButton size="small" onClick={() => onBack('segments')}><ArrowBack fontSize="small" /></IconButton>
            <Box>
              <Typography variant="h6" fontWeight={700}>{segment.name}</Typography>
              <Typography variant="body2" color="text.secondary">
                {site.name}{segment.esl_type ? ` · ${segment.esl_type}` : ''}
              </Typography>
            </Box>
          </Box>
          <Stack direction="row" spacing={1}>
            <input ref={fileInputRef} type="file" accept=".xlsx,.xls" hidden onChange={handleImport} />
            <Button variant="outlined" startIcon={<Download />}
              onClick={handleExport}
              disabled={devices.length === 0}
              sx={{ fontWeight: 600, borderRadius: 2 }}>
              Export Excel
            </Button>
            <Button variant="outlined" startIcon={importing ? <CircularProgress size={14} /> : <UploadFile />}
              onClick={() => fileInputRef.current?.click()}
              disabled={importing} sx={{ fontWeight: 600, borderRadius: 2 }}>
              {importing ? 'Mengimport...' : 'Import Excel'}
            </Button>
          </Stack>
        </Box>
      </Box>

      {/* Search + Batch toolbar */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap' }}>
        <TextField
          size="small" placeholder="Cari code, barcode, atau produk..."
          value={search}
          onChange={e => { setSearch(e.target.value); clearSelection() }}
          InputProps={{
            startAdornment: <InputAdornment position="start"><Search fontSize="small" /></InputAdornment>
          }}
          sx={{ maxWidth: 360 }}
        />
        {selected.size > 0 && (
          <Paper elevation={0} sx={{
            display: 'flex', alignItems: 'center', gap: 1, px: 2, py: 0.75,
            border: '1px solid #1976d2', borderRadius: 2, bgcolor: '#EBF4FF'
          }}>
            <Typography fontSize={13} fontWeight={600} color="primary.main">
              {selected.size} dipilih
            </Typography>
            <Tooltip title="Hapus Binding / UnderMaintenance">
              <Button size="small" variant="contained" color="primary"
                startIcon={<BuildCircle fontSize="small" />}
                onClick={() => setBatchDialog(true)}
                sx={{ fontWeight: 600, fontSize: 12 }}>
                Batch Action
              </Button>
            </Tooltip>
            <Tooltip title="Batal pilih">
              <IconButton size="small" onClick={clearSelection}>
                <Close fontSize="small" />
              </IconButton>
            </Tooltip>
          </Paper>
        )}
      </Box>

      {/* Device Table */}
      <Paper elevation={0} sx={{ border: '1px solid #E2E8F0', borderRadius: 2, flex: 1, overflow: 'auto' }}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress />
          </Box>
        ) : devices.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <DevicesOther sx={{ fontSize: 48, color: 'text.disabled', mb: 1 }} />
            <Typography color="text.secondary">Belum ada ESL device. Import Excel untuk memulai.</Typography>
          </Box>
        ) : (
          <Table stickyHeader size="small">
            <TableHead>
              <TableRow sx={{ bgcolor: '#F8FAFC' }}>
                <TableCell padding="checkbox">
                  <Checkbox
                    size="small"
                    indeterminate={selected.size > 0 && selected.size < filtered.length}
                    checked={filtered.length > 0 && selected.size === filtered.length}
                    onChange={toggleAll}
                  />
                </TableCell>
                <TableCell sx={{ fontWeight: 700, fontSize: 13, whiteSpace: 'nowrap' }}>Code</TableCell>
                <TableCell sx={{ fontWeight: 700, fontSize: 13, whiteSpace: 'nowrap' }}>AP</TableCell>
                <TableCell sx={{ fontWeight: 700, fontSize: 13, minWidth: 240 }}>Produk (Barcode)</TableCell>
                <TableCell sx={{ fontWeight: 700, fontSize: 13, whiteSpace: 'nowrap' }}>Template</TableCell>
                <TableCell sx={{ fontWeight: 700, fontSize: 13 }}>Nama Produk</TableCell>
                <TableCell align="right" sx={{ fontWeight: 700, fontSize: 13 }}>Aksi</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filtered.map(dev => {
                const isMaintenance = dev.template === '34' || dev.template === '35'
                return (
                  <TableRow key={dev.id} sx={isMaintenance ? { bgcolor: '#FFF8F0' } : {}}
                    selected={selected.has(dev.id)}>
                    <TableCell padding="checkbox">
                      <Checkbox size="small" checked={selected.has(dev.id)} onChange={() => toggleOne(dev.id)} />
                    </TableCell>
                    <TableCell sx={{ fontSize: 12, fontFamily: 'monospace', color: 'text.secondary', whiteSpace: 'nowrap' }}>
                      {dev.code}
                    </TableCell>
                    <TableCell sx={{ fontSize: 12, fontFamily: 'monospace', color: 'text.secondary', whiteSpace: 'nowrap' }}>
                      {dev.ap || <Typography fontSize={12} color="text.disabled">—</Typography>}
                    </TableCell>
                    <TableCell sx={{ py: 0.5 }}>
                      {isMaintenance ? (
                        <Typography fontSize={12} color="text.disabled">— (UnderMaintenance)</Typography>
                      ) : (
                        <ProductSearchCell
                          device={dev}
                          segmentId={segment.id}
                          allProducts={allProducts}
                          onSaved={fetchDevices}
                        />
                      )}
                    </TableCell>
                    <TableCell>
                      {dev.template ? (
                        <Chip label={templateLabel(dev.template)} size="small"
                          color={isMaintenance ? 'warning' : 'primary'}
                          variant="outlined" sx={{ fontSize: 11, fontWeight: 600 }} />
                      ) : (
                        <Typography fontSize={12} color="text.disabled">—</Typography>
                      )}
                    </TableCell>
                    <TableCell>
                      {dev.product_id ? (
                        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 0.5 }}>
                          <Box>
                            <Typography fontSize={12} fontWeight={600} sx={{ fontFamily: 'monospace' }}>
                              {dev.product_id}
                            </Typography>
                            <Typography fontSize={11} color="text.secondary">{dev.product_name}</Typography>
                            <Typography fontSize={10} color={dev.product_type === 'accessory' ? 'warning.main' : 'primary.main'}>
                              {dev.product_type === 'accessory' ? 'Accessories' : `Demo · ${dev.variant_count} varian`}
                            </Typography>
                          </Box>
                          <Tooltip title="Edit Produk">
                            <IconButton size="small" sx={{ mt: 0.25 }}
                              onClick={() => setProductEditDialog({ open: true, productId: dev.product })}>
                              <Edit fontSize="small" sx={{ fontSize: 14 }} />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      ) : isMaintenance ? (
                        <Chip label="UnderMaintenance" size="small" color="warning" variant="outlined" sx={{ fontSize: 11 }} />
                      ) : (
                        <Chip label="Belum terbind" size="small" variant="outlined"
                          sx={{ fontSize: 11, color: 'text.disabled', borderColor: '#E2E8F0' }} />
                      )}
                    </TableCell>
                    <TableCell align="right">
                      <Stack direction="row" spacing={0.5} justifyContent="flex-end">
                        <Tooltip title="UnderMaintenance / Hapus Binding">
                          <IconButton size="small" color="primary"
                            onClick={() => setSettingsDialog({ open: true, device: dev })}>
                            <Settings fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Hapus">
                          <IconButton size="small" color="error"
                            onClick={() => setDeleteDialog({ open: true, device: dev, loading: false })}>
                            <Delete fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Stack>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        )}
      </Paper>

      {devices.length > 0 && (
        <Typography fontSize={12} color="text.secondary">
          {filtered.length} dari {devices.length} device{search ? ' (difilter)' : ''}
        </Typography>
      )}

      <BatchActionDialog
        open={batchDialog}
        selectedIds={[...selected]}
        segmentId={segment.id}
        onClose={() => setBatchDialog(false)}
        onSuccess={() => { fetchDevices(); clearSelection() }}
      />
      <MaintenanceDialog
        open={settingsDialog.open}
        device={settingsDialog.device}
        segmentId={segment.id}
        onClose={() => setSettingsDialog({ open: false, device: null })}
        onSuccess={fetchDevices}
      />
      <DeleteDialog
        open={deleteDialog.open}
        label={deleteDialog.device?.code}
        loading={deleteDialog.loading}
        onClose={() => setDeleteDialog({ open: false, device: null, loading: false })}
        onConfirm={handleDelete}
      />
      <ProductEditDialog
        open={productEditDialog.open}
        productId={productEditDialog.productId}
        onClose={() => setProductEditDialog({ open: false, productId: null })}
        onSuccess={fetchDevices}
      />
    </Box>
  )
}

// ── Segment View ──────────────────────────────────────────────────────────────
function SegmentView({ site, onBack, onSelectSegment }) {
  const [segments, setSegments] = useState([])
  const [loading, setLoading] = useState(false)
  const [segDialog, setSegDialog] = useState({ open: false, segment: null })
  const [deleteDialog, setDeleteDialog] = useState({ open: false, segment: null, loading: false })

  const fetchSegments = async () => {
    setLoading(true)
    try {
      const { data } = await api.get(`/planogram/sites/${site.id}/segments/`)
      setSegments(data)
    } catch {
      toast.error('Gagal memuat segment.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchSegments() }, [site.id])

  const handleDelete = async () => {
    setDeleteDialog(d => ({ ...d, loading: true }))
    try {
      await api.delete(`/planogram/sites/${site.id}/segments/${deleteDialog.segment.id}/`)
      toast.success('Segment berhasil dihapus.')
      setDeleteDialog({ open: false, segment: null, loading: false })
      fetchSegments()
    } catch {
      toast.error('Gagal menghapus segment.')
      setDeleteDialog(d => ({ ...d, loading: false }))
    }
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', gap: 2 }}>
      <Box>
        <Breadcrumbs sx={{ mb: 0.5 }}>
          <Link component="button" underline="hover" color="inherit" fontSize={13}
            onClick={onBack} sx={{ cursor: 'pointer', background: 'none', border: 'none' }}>
            Site Management
          </Link>
          <Typography fontSize={13} color="text.primary" fontWeight={600}>{site.name}</Typography>
        </Breadcrumbs>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <IconButton size="small" onClick={onBack}><ArrowBack fontSize="small" /></IconButton>
            <Box>
              <Typography variant="h6" fontWeight={700}>{site.name}</Typography>
              {site.location && (
                <Typography variant="body2" color="text.secondary">{site.location}</Typography>
              )}
            </Box>
          </Box>
          <Button variant="contained" startIcon={<Add />}
            onClick={() => setSegDialog({ open: true, segment: null })}
            sx={{ fontWeight: 600, borderRadius: 2 }}>
            Tambah Segment
          </Button>
        </Box>
      </Box>

      <Paper elevation={0} sx={{ border: '1px solid #E2E8F0', borderRadius: 2, flex: 1 }}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress />
          </Box>
        ) : segments.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <ViewModule sx={{ fontSize: 48, color: 'text.disabled', mb: 1 }} />
            <Typography color="text.secondary">Belum ada segment. Klik "Tambah Segment" untuk memulai.</Typography>
          </Box>
        ) : (
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: '#F8FAFC' }}>
                <TableCell sx={{ fontWeight: 700, fontSize: 13 }}>Nama Layout</TableCell>
                <TableCell sx={{ fontWeight: 700, fontSize: 13 }}>Type ESL</TableCell>
                <TableCell sx={{ fontWeight: 700, fontSize: 13 }}>ESL Device</TableCell>
                <TableCell sx={{ fontWeight: 700, fontSize: 13 }}>Dibuat</TableCell>
                <TableCell align="right" sx={{ fontWeight: 700, fontSize: 13 }}>Aksi</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {segments.map(seg => (
                <TableRow key={seg.id} hover>
                  <TableCell sx={{ fontSize: 13, fontWeight: 600 }}>{seg.name}</TableCell>
                  <TableCell>
                    {seg.esl_type
                      ? <Chip label={seg.esl_type} size="small" variant="outlined" color="primary" sx={{ fontSize: 11 }} />
                      : <Typography fontSize={12} color="text.disabled">—</Typography>}
                  </TableCell>
                  <TableCell>
                    <Chip
                      icon={<DevicesOther sx={{ fontSize: '14px !important' }} />}
                      label={`${seg.device_count} device`}
                      size="small" variant="outlined"
                      color={seg.device_count > 0 ? 'success' : 'default'}
                      sx={{ fontSize: 11, cursor: 'pointer' }}
                      onClick={() => onSelectSegment(seg)}
                    />
                  </TableCell>
                  <TableCell sx={{ fontSize: 12, color: 'text.secondary' }}>
                    {new Date(seg.created_at).toLocaleDateString('id-ID')}
                  </TableCell>
                  <TableCell align="right">
                    <Stack direction="row" spacing={0.5} justifyContent="flex-end">
                      <Tooltip title="Kelola ESL Device">
                        <IconButton size="small" color="primary" onClick={() => onSelectSegment(seg)}>
                          <DevicesOther fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Edit">
                        <IconButton size="small" onClick={() => setSegDialog({ open: true, segment: seg })}>
                          <Edit fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Hapus">
                        <IconButton size="small" color="error"
                          onClick={() => setDeleteDialog({ open: true, segment: seg, loading: false })}>
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

      <SegmentDialog
        open={segDialog.open}
        segment={segDialog.segment}
        siteId={site.id}
        onClose={() => setSegDialog({ open: false, segment: null })}
        onSuccess={fetchSegments}
      />
      <DeleteDialog
        open={deleteDialog.open}
        label={deleteDialog.segment?.name}
        loading={deleteDialog.loading}
        onClose={() => setDeleteDialog({ open: false, segment: null, loading: false })}
        onConfirm={handleDelete}
      />
    </Box>
  )
}

// ── Site List View ────────────────────────────────────────────────────────────
function SiteListView({ onSelectSite }) {
  const [sites, setSites] = useState([])
  const [loading, setLoading] = useState(false)
  const [siteDialog, setSiteDialog] = useState({ open: false, site: null })
  const [deleteDialog, setDeleteDialog] = useState({ open: false, site: null, loading: false })

  const fetchSites = async () => {
    setLoading(true)
    try {
      const { data } = await api.get('/planogram/sites/')
      setSites(data)
    } catch {
      toast.error('Gagal memuat data site.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchSites() }, [])

  const handleDelete = async () => {
    setDeleteDialog(d => ({ ...d, loading: true }))
    try {
      await api.delete(`/planogram/sites/${deleteDialog.site.id}/`)
      toast.success('Site berhasil dihapus.')
      setDeleteDialog({ open: false, site: null, loading: false })
      fetchSites()
    } catch {
      toast.error('Gagal menghapus site.')
      setDeleteDialog(d => ({ ...d, loading: false }))
    }
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', gap: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box>
          <Typography variant="h6" fontWeight={700}>Planogram — Site Management</Typography>
          <Typography variant="body2" color="text.secondary">{sites.length} site terdaftar</Typography>
        </Box>
        <Button variant="contained" startIcon={<Add />}
          onClick={() => setSiteDialog({ open: true, site: null })}
          sx={{ fontWeight: 600, borderRadius: 2 }}>
          Tambah Site
        </Button>
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      ) : sites.length === 0 ? (
        <Paper elevation={0} sx={{ border: '1px solid #E2E8F0', borderRadius: 2, p: 6, textAlign: 'center' }}>
          <Place sx={{ fontSize: 48, color: 'text.disabled', mb: 1 }} />
          <Typography color="text.secondary">Belum ada site. Klik "Tambah Site" untuk memulai.</Typography>
        </Paper>
      ) : (
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 2 }}>
          {sites.map(site => (
            <Paper key={site.id} elevation={0}
              sx={{
                border: '1px solid #E2E8F0', borderRadius: 2, p: 2.5,
                cursor: 'pointer', transition: 'all 0.15s',
                '&:hover': { borderColor: 'primary.main', boxShadow: '0 0 0 1px #1976d2' }
              }}
              onClick={() => onSelectSite(site)}>
              <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                <Box sx={{ flex: 1 }}>
                  <Typography fontWeight={700} fontSize={15}>{site.name}</Typography>
                  {site.location && (
                    <Typography fontSize={12} color="text.secondary" mt={0.5}>{site.location}</Typography>
                  )}
                </Box>
                <Stack direction="row" spacing={0.5} onClick={e => e.stopPropagation()}>
                  <Tooltip title="Edit">
                    <IconButton size="small" onClick={() => setSiteDialog({ open: true, site })}>
                      <Edit fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Hapus">
                    <IconButton size="small" color="error"
                      onClick={() => setDeleteDialog({ open: true, site, loading: false })}>
                      <Delete fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Stack>
              </Box>
              <Divider sx={{ my: 1.5 }} />
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <ViewModule fontSize="small" sx={{ color: 'text.secondary' }} />
                <Typography fontSize={13} color="text.secondary">
                  {site.segment_count} Layout Segment
                </Typography>
              </Box>
            </Paper>
          ))}
        </Box>
      )}

      <SiteDialog
        open={siteDialog.open}
        site={siteDialog.site}
        onClose={() => setSiteDialog({ open: false, site: null })}
        onSuccess={fetchSites}
      />
      <DeleteDialog
        open={deleteDialog.open}
        label={deleteDialog.site?.name}
        loading={deleteDialog.loading}
        onClose={() => setDeleteDialog({ open: false, site: null, loading: false })}
        onConfirm={handleDelete}
      />
    </Box>
  )
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function PlanogramPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [selectedSite, setSelectedSite] = useState(null)
  const [selectedSegment, setSelectedSegment] = useState(null)

  const siteId = searchParams.get('site')
  const segmentId = searchParams.get('segment')

  // On mount or URL change: restore state from API if IDs present in URL
  useEffect(() => {
    if (!siteId) {
      setSelectedSite(null)
      setSelectedSegment(null)
      return
    }
    if (siteId && !selectedSite) {
      api.get(`/planogram/sites/${siteId}/`).then(({ data }) => {
        setSelectedSite(data)
      }).catch(() => setSearchParams({}))
    }
    if (segmentId && siteId && !selectedSegment) {
      api.get(`/planogram/sites/${siteId}/segments/${segmentId}/`).then(({ data }) => {
        setSelectedSegment(data)
      }).catch(() => setSearchParams({ site: siteId }))
    }
  }, [siteId, segmentId])

  const handleSelectSite = (site) => {
    setSelectedSite(site)
    setSelectedSegment(null)
    setSearchParams({ site: site.id })
  }

  const handleSelectSegment = (seg) => {
    setSelectedSegment(seg)
    setSearchParams({ site: selectedSite.id, segment: seg.id })
  }

  const handleBack = (target) => {
    if (target === 'sites' || !target) {
      setSelectedSite(null)
      setSelectedSegment(null)
      setSearchParams({})
    } else {
      setSelectedSegment(null)
      setSearchParams({ site: selectedSite.id })
    }
  }

  if (selectedSite && selectedSegment) {
    return (
      <ESLDeviceView
        site={selectedSite}
        segment={selectedSegment}
        onBack={handleBack}
      />
    )
  }

  if (selectedSite) {
    return (
      <SegmentView
        site={selectedSite}
        onBack={() => handleBack('sites')}
        onSelectSegment={handleSelectSegment}
      />
    )
  }

  return <SiteListView onSelectSite={handleSelectSite} />
}
