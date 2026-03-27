import { useState, useEffect, useRef } from 'react'
import {
  Box, Button, Typography, Paper, Chip, Stack,
  Dialog, DialogTitle, DialogContent, DialogActions,
  Alert, CircularProgress, IconButton, Tooltip,
  TextField, InputAdornment, MenuItem, Select,
  FormControl, InputLabel, Tabs, Tab
} from '@mui/material'
import {
  Add, Upload, Search, Refresh, Close, CheckCircle, Download, Edit, Delete
} from '@mui/icons-material'
import { DataGrid } from '@mui/x-data-grid'
import api from '../../api/axios'
import toast from 'react-hot-toast'
import ProductEditDialog from '../../components/ProductEditDialog'

// ── helpers ──────────────────────────────────────────────────────────────────
const fmtPrice = (val) =>
  val ? `Rp ${Number(val).toLocaleString('id-ID')}` : '-'

const MAX_VARIANTS = 5

const formatStorage = (val) => {
  if (!val) return null
  const n = parseInt(val)
  if (isNaN(n)) return val
  if (n >= 1000) return `${n / 1000} TB`
  return `${n} GB`
}

// ── columns ──────────────────────────────────────────────────────────────────
const actionColumn = (onEdit) => ({
  field: '_actions', headerName: 'Aksi', width: 80, sortable: false, disableColumnMenu: true,
  renderCell: ({ row }) => (
    <Tooltip title="Edit">
      <IconButton size="small" onClick={() => onEdit(row.id)}>
        <Edit fontSize="small" />
      </IconButton>
    </Tooltip>
  ),
})

const buildDemoColumns = (onEdit) => {
  const variantCols = []
  for (let i = 1; i <= MAX_VARIANTS; i++) {
    variantCols.push({
      field: `var_${i}_ram_rom`,
      headerName: `RAM/ROM - Var ${i}`,
      width: 150,
      valueGetter: (_, row) => {
        const v = (row.variants || []).find(v => v.variant_number === i)
        if (!v) return '-'
        const ram = formatStorage(v.ram)
        const rom = formatStorage(v.rom)
        if (ram && rom) return `${ram} / ${rom}`
        if (rom) return rom
        return '-'
      },
    })
    variantCols.push({
      field: `var_${i}_price`,
      headerName: `Price - Var ${i}`,
      width: 150,
      valueGetter: (_, row) => {
        const v = (row.variants || []).find(v => v.variant_number === i)
        return v?.unit_price ? fmtPrice(v.unit_price) : '-'
      },
    })
  }

  return [
    actionColumn(onEdit),
    {
      field: 'product_id', headerName: 'Product ID', width: 160,
      renderCell: ({ value }) => (
        <Chip label={value} size="small" color="primary" variant="outlined"
          sx={{ fontWeight: 700, fontSize: 11 }} />
      ),
    },
    { field: 'brand', headerName: 'Brand', width: 120 },
    { field: 'commercial_name', headerName: 'Commercial Name', width: 200 },
    {
      field: 'variants', headerName: 'Total Var', width: 90,
      renderCell: ({ value }) => (
        <Chip label={`${value?.length || 0} var`} size="small"
          color={value?.length > 1 ? 'secondary' : 'default'}
          sx={{ fontWeight: 600, fontSize: 11 }} />
      ),
    },
    ...variantCols,
    { field: 'colour', headerName: 'Colour', width: 200 },
    { field: 'usp_1', headerName: 'USP 1', width: 220 },
    { field: 'usp_2', headerName: 'USP 2', width: 220 },
    { field: 'usp_3', headerName: 'USP 3', width: 220 },
    { field: 'usp_4', headerName: 'USP 4', width: 220 },
  ]
}

const buildAccessoryColumns = (onEdit) => [
  actionColumn(onEdit),
  {
    field: 'product_id', headerName: 'Kode Item', width: 160,
    renderCell: ({ value }) => (
      <Chip label={value} size="small" color="secondary" variant="outlined"
        sx={{ fontWeight: 700, fontSize: 11 }} />
    ),
  },
  { field: 'brand', headerName: 'Brand', width: 150 },
  { field: 'commercial_name', headerName: 'Nama Produk', width: 280 },
  { field: 'colour', headerName: 'Color Option', width: 200 },
  {
    field: 'srp', headerName: 'SRP', width: 160,
    valueGetter: (_, row) => {
      const v = (row.variants || [])[0]
      return v?.unit_price ? fmtPrice(v.unit_price) : '-'
    },
  },
]


// ── Import Dialog ─────────────────────────────────────────────────────────────
function ImportDialog({ open, onClose, onSuccess, productType }) {
  const fileRef = useRef()
  const [file, setFile] = useState(null)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')

  const isDemo = productType === 'demo'

  const reset = () => { setFile(null); setResult(null); setError('') }
  const handleClose = () => { reset(); onClose() }

  const handleFileChange = (e) => {
    const f = e.target.files[0]
    if (f) { setFile(f); setResult(null); setError('') }
  }

  const handleImport = async () => {
    if (!file) return
    setLoading(true)
    setError('')
    try {
      const formData = new FormData()
      formData.append('file', file)
      const endpoint = isDemo ? '/products/import/' : '/products/import/accessories/'
      const { data } = await api.post(endpoint, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      setResult(data)
      onSuccess()
      if (isDemo) {
        toast.success(`Import berhasil! ${data.created} produk baru, ${data.updated} diupdate.`)
      } else {
        toast.success(`Import berhasil! ${data.created} produk baru, ${data.skipped} duplikat dilewati.`)
      }
    } catch (err) {
      setError(err.response?.data?.detail || 'Import gagal.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography fontWeight={700}>
          Import {isDemo ? 'Demo Item' : 'Accessories Item'} CSV
        </Typography>
        <IconButton size="small" onClick={handleClose}><Close fontSize="small" /></IconButton>
      </DialogTitle>
      <DialogContent dividers>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
          <Alert severity="info" sx={{ fontSize: 12 }}>
            {isDemo
              ? <>Upload file CSV Demo Item. Produk yang sudah ada akan diupdate, produk baru dibuat otomatis dengan ID <strong>DEMOITEMxxxx</strong>.</>
              : <>Upload file CSV Accessories Item. Kolom yang dipakai: <strong>Brand2, Kode Item, Rename Final, Color Option, SRP</strong>. Duplikat otomatis dilewati.</>
            }
          </Alert>

          <Box
            onClick={() => fileRef.current.click()}
            sx={{
              border: '2px dashed', borderColor: file ? 'primary.main' : 'grey.300',
              borderRadius: 2, p: 3, textAlign: 'center', cursor: 'pointer',
              bgcolor: file ? 'primary.50' : 'grey.50',
              '&:hover': { borderColor: 'primary.main', bgcolor: 'primary.50' },
              transition: 'all 0.2s',
            }}
          >
            <Upload sx={{ fontSize: 32, color: file ? 'primary.main' : 'grey.400', mb: 1 }} />
            <Typography fontSize={13} color={file ? 'primary.main' : 'text.secondary'} fontWeight={file ? 600 : 400}>
              {file ? file.name : 'Klik untuk pilih file CSV'}
            </Typography>
            {file && (
              <Typography fontSize={11} color="text.secondary" mt={0.5}>
                {(file.size / 1024).toFixed(1)} KB
              </Typography>
            )}
            <input ref={fileRef} type="file" accept=".csv" hidden onChange={handleFileChange} />
          </Box>

          {error && <Alert severity="error">{error}</Alert>}

          {result && (
            <Alert severity="success" icon={<CheckCircle />}>
              <Typography fontWeight={700} fontSize={13}>Import Berhasil!</Typography>
              <Stack direction="row" spacing={1} mt={1} flexWrap="wrap">
                <Chip label={`${result.created} Baru`} size="small" color="success" />
                {result.updated !== undefined && (
                  <Chip label={`${result.updated} Diupdate`} size="small" color="primary" />
                )}
                {result.skipped > 0 && (
                  <Chip label={`${result.skipped} Duplikat Dilewati`} size="small" color="warning" />
                )}
                <Chip label={`${result.total_products} Total`} size="small" color="default" />
              </Stack>
            </Alert>
          )}
        </Box>
      </DialogContent>
      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={handleClose} color="inherit">Tutup</Button>
        <Button
          variant="contained" onClick={handleImport}
          disabled={!file || loading}
          startIcon={loading ? <CircularProgress size={14} color="inherit" /> : <Upload />}
          sx={{ fontWeight: 600 }}
        >
          {loading ? 'Mengimport...' : 'Import'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function ProductPage() {
  const [tab, setTab] = useState(0)  // 0 = Demo Item, 1 = Accessories Item
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(false)
  const [search, setSearch] = useState('')
  const [brandFilter, setBrandFilter] = useState('')
  const [brands, setBrands] = useState([])
  const [importOpen, setImportOpen] = useState(false)
  const [exporting, setExporting] = useState(false)
  const [editDialog, setEditDialog] = useState({ open: false, productId: null })
  const [deleting, setDeleting] = useState(false)
  // selectedIds: Set of numeric IDs — persists across search changes
  const [selectedIds, setSelectedIds] = useState(new Set())
  const productType = tab === 0 ? 'demo' : 'accessory'

  // When DataGrid selection changes, merge with existing (persist across search)
  const handleSelectionChange = (model) => {
    const visibleIds = new Set(rows.map(r => r.id))
    setSelectedIds(prev => {
      const next = new Set(prev)
      visibleIds.forEach(id => { if (!model.ids.has(id)) next.delete(id) })
      model.ids.forEach(id => next.add(id))
      return next
    })
  }

  const handleExport = async () => {
    setExporting(true)
    try {
      const params = new URLSearchParams()
      if (selectedIds.size > 0) {
        params.set('ids', [...selectedIds].join(','))  // numeric IDs, backend accepts both
      } else {
        if (search) params.set('search', search)
        if (brandFilter) params.set('brand', brandFilter)
      }
      const endpoint = tab === 0 ? 'demo' : 'accessories'
      const filename = tab === 0 ? 'esl_demo_export.xlsx' : 'esl_accessories_export.xlsx'
      const res = await api.get(`/products/export/${endpoint}/?${params.toString()}`, {
        responseType: 'blob',
      })
      const blob = res.data
      const a = document.createElement('a')
      a.href = URL.createObjectURL(blob)
      a.download = filename
      a.click()
      URL.revokeObjectURL(a.href)
      toast.success(`Export berhasil! ${selectedIds.size > 0 ? `${selectedIds.size} produk dipilih` : 'Semua produk'}`)
    } catch {
      toast.error('Export gagal.')
    } finally {
      setExporting(false)
    }
  }

  const handleBatchDelete = async () => {
    if (!window.confirm(`Hapus ${selectedIds.size} produk yang dipilih? Tindakan ini tidak bisa dibatalkan.`)) return
    setDeleting(true)
    try {
      const { data } = await api.delete('/products/batch/delete/', { data: { ids: [...selectedIds] } })
      toast.success(`${data.deleted} produk berhasil dihapus.`)
      setSelectedIds(new Set())
      fetchProducts()
    } catch {
      toast.error('Gagal menghapus produk.')
    } finally {
      setDeleting(false)
    }
  }

  const fetchProducts = async () => {
    setLoading(true)
    try {
      const params = { product_type: productType }
      if (search) params.search = search
      if (brandFilter) params.brand = brandFilter
      const { data } = await api.get('/products/', { params })
      setRows(data)
      const uniqueBrands = [...new Set(data.map(p => p.brand))].sort()
      setBrands(uniqueBrands)
    } catch {
      toast.error('Gagal memuat data produk.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    setSearch('')
    setBrandFilter('')
    setRows([])
    setSelectedIds(new Set())
    fetchProducts()
  }, [tab])

  const handleSearch = (e) => {
    if (e.key === 'Enter') fetchProducts()
  }

  const openEdit = (id) => setEditDialog({ open: true, productId: id })
  const columns = tab === 0 ? buildDemoColumns(openEdit) : buildAccessoryColumns(openEdit)

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', gap: 2 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 1.5 }}>
        <Box>
          <Typography variant="h6" fontWeight={700}>Product Management</Typography>
          <Typography variant="body2" color="text.secondary">
            {rows.length} produk terdaftar
          </Typography>
        </Box>
        <Stack direction="row" spacing={1.5}>
          <Button
            variant="outlined" startIcon={<Upload />}
            onClick={() => setImportOpen(true)}
            sx={{ fontWeight: 600, borderRadius: 2 }}
          >
            Import CSV
          </Button>
          <Button
            variant="outlined" color="success"
            startIcon={exporting ? <CircularProgress size={14} color="inherit" /> : <Download />}
            onClick={handleExport}
            disabled={exporting}
            sx={{ fontWeight: 600, borderRadius: 2 }}
          >
            {exporting ? 'Exporting...' : selectedIds.size > 0 ? `Export ${selectedIds.size} Item` : 'Export ESL'}
          </Button>
          <Button
            variant="contained" startIcon={<Add />}
            sx={{ fontWeight: 600, borderRadius: 2 }}
          >
            Tambah Produk
          </Button>
        </Stack>
      </Box>

      {/* Tabs */}
      <Paper elevation={0} sx={{ border: '1px solid #E2E8F0', borderRadius: 2 }}>
        <Tabs
          value={tab}
          onChange={(_, v) => setTab(v)}
          sx={{ px: 2, borderBottom: '1px solid #E2E8F0' }}
        >
          <Tab label="Demo Item" sx={{ fontWeight: 600, fontSize: 13 }} />
          <Tab label="Accessories Item" sx={{ fontWeight: 600, fontSize: 13 }} />
        </Tabs>

        {/* Filters */}
        <Box sx={{ p: 2 }}>
          <Stack direction="row" spacing={2} alignItems="center" flexWrap="wrap">
            <TextField
              size="small" placeholder="Cari produk atau brand..."
              value={search} onChange={(e) => setSearch(e.target.value)}
              onKeyDown={handleSearch}
              sx={{ minWidth: 260 }}
              InputProps={{
                startAdornment: <InputAdornment position="start"><Search fontSize="small" /></InputAdornment>
              }}
            />
            <FormControl size="small" sx={{ minWidth: 160 }}>
              <InputLabel>Brand</InputLabel>
              <Select value={brandFilter} label="Brand"
                onChange={(e) => { setBrandFilter(e.target.value); }}
              >
                <MenuItem value="">Semua Brand</MenuItem>
                {brands.map(b => <MenuItem key={b} value={b}>{b}</MenuItem>)}
              </Select>
            </FormControl>
            <Button variant="outlined" startIcon={<Search />} onClick={fetchProducts}
              sx={{ fontWeight: 600, borderRadius: 2 }}>
              Cari
            </Button>
            <Tooltip title="Refresh">
              <IconButton onClick={() => { setSearch(''); setBrandFilter(''); setTimeout(fetchProducts, 100) }}>
                <Refresh />
              </IconButton>
            </Tooltip>
          </Stack>
        </Box>
      </Paper>

      {/* Selection info bar */}
      {selectedIds.size > 0 && (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, px: 1 }}>
          <Chip
            label={`${selectedIds.size} item dipilih`}
            color="primary" size="small" sx={{ fontWeight: 600 }}
          />
          <Button size="small" variant="contained" color="error"
            startIcon={deleting ? <CircularProgress size={12} color="inherit" /> : <Delete fontSize="small" />}
            onClick={handleBatchDelete} disabled={deleting}
            sx={{ fontWeight: 600, fontSize: 12 }}>
            {deleting ? 'Menghapus...' : `Hapus ${selectedIds.size} Produk`}
          </Button>
          <Button size="small" color="inherit" onClick={() => setSelectedIds(new Set())}
            sx={{ fontSize: 12, textDecoration: 'underline', p: 0, minWidth: 0 }}>
            Batalkan pilihan
          </Button>
        </Box>
      )}

      {/* DataGrid */}
      <Paper elevation={0} sx={{ border: '1px solid #E2E8F0', borderRadius: 2, flex: 1, minHeight: 400 }}>
        <DataGrid
          rows={rows}
          columns={columns}
          loading={loading}
          pageSizeOptions={[25, 50, 100]}
          initialState={{ pagination: { paginationModel: { pageSize: 25 } } }}
          checkboxSelection
          disableRowSelectionOnClick
          keepNonExistentRowsSelected
          rowSelectionModel={{ type: 'include', ids: selectedIds }}
          onRowSelectionModelChange={handleSelectionChange}
          sx={{
            border: 'none',
            '& .MuiDataGrid-columnHeaders': { bgcolor: '#F8FAFC', fontWeight: 700 },
            '& .MuiDataGrid-row:hover': { bgcolor: '#F1F5F9' },
            '& .MuiDataGrid-cell': { fontSize: 13 },
            '& .MuiCheckbox-root svg': { display: 'block', width: 20, height: 20, visibility: 'visible', opacity: 1 },
            '& .MuiCheckbox-root': { color: 'rgba(0,0,0,0.54)' },
            '& .MuiCheckbox-root.Mui-checked': { color: '#2563EB' },
          }}
        />
      </Paper>

      {/* Import Dialog */}
      <ImportDialog
        open={importOpen}
        onClose={() => setImportOpen(false)}
        onSuccess={fetchProducts}
        productType={productType}
      />

      {/* Edit Dialog */}
      <ProductEditDialog
        open={editDialog.open}
        productId={editDialog.productId}
        onClose={() => setEditDialog({ open: false, productId: null })}
        onSuccess={fetchProducts}
      />
    </Box>
  )
}
