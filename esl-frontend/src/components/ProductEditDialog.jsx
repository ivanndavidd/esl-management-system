import { useState, useEffect } from 'react'
import {
  Box, Button, Typography, Stack, Divider,
  Dialog, DialogTitle, DialogContent, DialogActions,
  CircularProgress, IconButton, TextField
} from '@mui/material'
import { Close } from '@mui/icons-material'
import api from '../api/axios'
import toast from 'react-hot-toast'

export default function ProductEditDialog({ open, onClose, onSuccess, productId }) {
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({})
  const [variants, setVariants] = useState([])

  useEffect(() => {
    if (open && productId) {
      setLoading(true)
      api.get(`/products/${productId}/`).then(({ data }) => {
        setProduct(data)
        setForm({
          brand: data.brand || '',
          commercial_name: data.commercial_name || '',
          colour: data.colour || '',
          usp_1: data.usp_1 || '',
          usp_2: data.usp_2 || '',
          usp_3: data.usp_3 || '',
          usp_4: data.usp_4 || '',
        })
        setVariants((data.variants || []).map(v => ({ ...v })))
      }).catch(() => toast.error('Gagal memuat data produk.'))
        .finally(() => setLoading(false))
    }
  }, [open, productId])

  const setVariantField = (idx, field, value) => {
    setVariants(prev => prev.map((v, i) => i === idx ? { ...v, [field]: value } : v))
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      await api.patch(`/products/${productId}/`, form)
      for (const v of variants) {
        await api.patch(`/products/variants/${v.id}/`, {
          ram: v.ram, rom: v.rom, unit_price: v.unit_price, installment: v.installment,
        })
      }
      toast.success('Produk berhasil diupdate.')
      onSuccess?.()
      onClose()
    } catch {
      toast.error('Gagal menyimpan perubahan.')
    } finally {
      setSaving(false)
    }
  }

  const isDemo = product?.product_type === 'demo'

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box>
          <Typography fontWeight={700}>Edit Produk</Typography>
          {product && <Typography fontSize={12} color="text.secondary">{product.product_id}</Typography>}
        </Box>
        <IconButton size="small" onClick={onClose}><Close fontSize="small" /></IconButton>
      </DialogTitle>
      <DialogContent dividers>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}><CircularProgress /></Box>
        ) : (
          <Stack spacing={2.5}>
            <Stack direction="row" spacing={2}>
              <TextField label="Brand" size="small" fullWidth value={form.brand || ''}
                onChange={e => setForm(f => ({ ...f, brand: e.target.value }))} />
              <TextField label={isDemo ? 'Commercial Name' : 'Nama Produk'} size="small" fullWidth
                value={form.commercial_name || ''}
                onChange={e => setForm(f => ({ ...f, commercial_name: e.target.value }))} />
            </Stack>
            <TextField label="Colour / Color Option" size="small" fullWidth value={form.colour || ''}
              onChange={e => setForm(f => ({ ...f, colour: e.target.value }))} />
            {isDemo && (<>
              <TextField label="USP 1" size="small" fullWidth value={form.usp_1 || ''}
                onChange={e => setForm(f => ({ ...f, usp_1: e.target.value }))} />
              <TextField label="USP 2" size="small" fullWidth value={form.usp_2 || ''}
                onChange={e => setForm(f => ({ ...f, usp_2: e.target.value }))} />
              <TextField label="USP 3" size="small" fullWidth value={form.usp_3 || ''}
                onChange={e => setForm(f => ({ ...f, usp_3: e.target.value }))} />
              <TextField label="USP 4" size="small" fullWidth value={form.usp_4 || ''}
                onChange={e => setForm(f => ({ ...f, usp_4: e.target.value }))} />
            </>)}
            {variants.length > 0 && (
              <>
                <Divider><Typography fontSize={12} color="text.secondary">Varian</Typography></Divider>
                {variants.map((v, idx) => (
                  <Box key={v.id}>
                    <Typography fontSize={12} fontWeight={600} color="text.secondary" mb={1}>
                      Varian {v.variant_number}
                    </Typography>
                    <Stack direction="row" spacing={2}>
                      {isDemo && (<>
                        <TextField label="RAM" size="small" sx={{ width: 120 }} value={v.ram || ''}
                          onChange={e => setVariantField(idx, 'ram', e.target.value)} />
                        <TextField label="ROM" size="small" sx={{ width: 120 }} value={v.rom || ''}
                          onChange={e => setVariantField(idx, 'rom', e.target.value)} />
                      </>)}
                      <TextField label="Harga" size="small" sx={{ flex: 1 }}
                        value={v.unit_price || ''}
                        onChange={e => setVariantField(idx, 'unit_price', e.target.value)}
                        type="number" />
                      {isDemo && (
                        <TextField label="Cicilan" size="small" sx={{ flex: 1 }}
                          value={v.installment || ''}
                          onChange={e => setVariantField(idx, 'installment', e.target.value)}
                          type="number" />
                      )}
                    </Stack>
                  </Box>
                ))}
              </>
            )}
          </Stack>
        )}
      </DialogContent>
      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={onClose} color="inherit">Batal</Button>
        <Button variant="contained" onClick={handleSave} disabled={saving || loading}
          startIcon={saving && <CircularProgress size={14} color="inherit" />}
          sx={{ fontWeight: 600 }}>
          {saving ? 'Menyimpan...' : 'Simpan'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
