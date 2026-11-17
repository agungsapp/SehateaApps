Baca dan pahami file frontend Pengeluaran yang saya berikan/yang ada di project. Jangan audit seluruh project dan jangan ubah backend. Backend Laravel untuk fitur stock Pengeluaran SUDAH selesai disesuaikan.

Scope hanya:

- Pengeluaran.jsx
- EditPengeluaran.jsx
- API/service frontend yang benar-benar digunakan oleh kedua halaman tersebut jika memang ada.

JANGAN menyentuh:

- PengeluaranLain.jsx
- EditPengeluaranLain.jsx
- Laravel backend
- migration
- StockService
- controller backend
- HPP
- komposisi
- transaksi penjualan

## Konteks backend

API Pengeluaran sekarang mendukung field:

bahan_id
qty
isi_per_satuan
harga_satuan
subtotal
keterangan

Backend menghitung quantity stock:

qty_stock = qty × isi_per_satuan

Stock dikelola sepenuhnya oleh backend. React TIDAK boleh menghitung saldo stock atau melakukan update stock sendiri.

## Existing Pengeluaran.jsx

Saat ini:

- bahan diambil dari GET /api/bahan
- pengeluaran diambil dari GET /api/pengeluaran
- saat bahan dipilih, hargaSatuan diisi dari selectedBahan.harga
- subtotal dihitung sebagai qty × hargaSatuan
- POST saat ini mengirim bahan_id, qty, harga_satuan, subtotal
- setelah berhasil form di-reset dan daftar pengeluaran di-refresh

Pertahankan behavior tersebut.

Tambahkan state:

isiPerSatuan
keterangan

Default:

isiPerSatuan = 1
keterangan = ''

## Form Pengeluaran

Tambahkan field "Isi per Satuan".

Field ini berarti jumlah satuan dasar Bahan yang terdapat dalam 1 unit pembelian.

Contoh Cup 22oz:

Pembelian warung:
qty = 1
isi_per_satuan = 50
harga_satuan = 20000
keterangan = "1 slop"

Backend akan menambah stock 50 pcs.

Pembelian Shopee:
qty = 1
isi_per_satuan = 1000
harga_satuan = 350000
keterangan = "1 dus Shopee"

Backend akan menambah stock 1000 pcs.

Jika langsung membeli satuan dasar:

qty = 50
isi_per_satuan = 1

Jangan membuat master packaging atau sistem inventory baru.

Tambahkan field "Keterangan" sebagai optional.

## Harga

PERTAHANKAN konsep existing:

Saat bahan dipilih:

setHargaSatuan(selectedBahan.harga)

Harga tersebut adalah harga pembelian yang sedang dicatat dan tetap editable.

Jangan menggantinya menjadi selectedBahan.harga_satuan.

Contoh:
1 dus cup = Rp350000
isi_per_satuan = 1000
harga_satuan = 350000

Bukan harga per pcs Rp350.

## Subtotal

Tetap:

subtotal = qty × hargaSatuan

isi_per_satuan TIDAK ikut menghitung subtotal.

Contoh:
qty = 1
isi_per_satuan = 1000
hargaSatuan = 350000
subtotal = 350000

## Payload POST

Ubah payload menjadi:

{
bahan_id,
qty,
isi_per_satuan,
harga_satuan,
subtotal,
keterangan
}

Gunakan nama backend persis:
isi_per_satuan
keterangan

Jangan membuat camelCase baru untuk payload.

## Reset setelah berhasil

Reset:

bahanId = ''
qty = 1
isiPerSatuan = 1
hargaSatuan = 0
subtotal = 0
keterangan = ''

Pertahankan refresh daftar pengeluaran setelah berhasil.

## Pengeluaran List

Jangan redesign.

Tetap tampilkan informasi existing.

Jika response API sekarang memiliki isi_per_satuan dan keterangan, boleh tampilkan informasi tambahan secara sederhana agar pembelian mudah dipahami.

Contoh:

1 × 1000 pcs
Keterangan: 1 dus Shopee

Tetapi jangan membuat UI kompleks.

## EditPengeluaran.jsx

Ini penting.

Saat ini halaman edit mengambil:

GET /api/pengeluaran/{id}

dan langsung mengirim object pengeluaran ke:

PUT /api/pengeluaran/{id}

Sesuaikan form edit agar mendukung:

isi_per_satuan
keterangan

Jika data lama tidak mempunyai isi_per_satuan, gunakan fallback 1.

Pastikan ketika field qty atau harga_satuan berubah, subtotal tetap dihitung:

qty × harga_satuan

Jangan memasukkan isi_per_satuan ke subtotal.

Pastikan PUT mengirim field yang dibutuhkan backend, termasuk:

bahan_id
qty
isi_per_satuan
harga_satuan
subtotal
keterangan

Jangan mengirim data stock dari frontend.

Delete tetap menggunakan endpoint existing:

DELETE /api/pengeluaran/{id}

Jangan menambahkan logic pengurangan stock di React. Backend sudah menangani koreksi stock ketika delete.

## Validation

Frontend:

- bahan wajib
- qty >= 1
- isi_per_satuan >= 1
- harga_satuan >= 0
- keterangan optional

Jangan melakukan validasi berdasarkan stock.

Stock boleh 0, kurang, atau minus.

## Jangan ubah backend

Backend sudah selesai.

Jangan:

- membuat migration
- mengubah controller Laravel
- mengubah StockService
- membuat endpoint stock
- membuat logic stock di React
- mengubah HPP
- mengubah komposisi
- mengubah transaksi
- menyentuh PengeluaranLain
- melakukan refactor besar

## Setelah selesai

Jalankan build/test frontend yang tersedia.

Verifikasi minimal:

1. Create Pengeluaran mengirim isi_per_satuan.
2. Create Pengeluaran mengirim keterangan.
3. Default isi_per_satuan = 1.
4. Subtotal tetap qty × harga_satuan.
5. Harga pembelian tetap mengambil selectedBahan.harga.
6. Edit Pengeluaran dapat membaca isi_per_satuan.
7. Edit Pengeluaran dapat mengubah isi_per_satuan.
8. Edit Pengeluaran dapat mengirim keterangan.
9. Delete tetap menggunakan endpoint existing.
10. Tidak ada logic stock di React.
11. Build frontend berhasil.

Setelah selesai laporkan:

- file yang diubah
- perubahan masing-masing file
- payload POST/PUT
- hasil build/test
- masalah/asumsi jika ada

Jangan mengubah file di luar scope kecuali memang diperlukan agar flow Pengeluaran berjalan.
