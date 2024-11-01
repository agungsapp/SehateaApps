import { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { BiSolidPencil } from 'react-icons/bi';
import { Link } from 'react-router-dom';

const Pengeluaran = () => {
  const [bahanList, setBahanList] = useState([]);
  const [bahanId, setBahanId] = useState('');
  const [hargaSatuan, setHargaSatuan] = useState(0);
  const [qty, setQty] = useState(1); // Default quantity 1
  const [subtotal, setSubtotal] = useState(0);
  const [pengeluaranList, setPengeluaranList] = useState([]); // Menyimpan daftar pengeluaran hari ini

  const baseURL = import.meta.env.VITE_BASE_URL;

  // Mengambil daftar bahan dari API
  useEffect(() => {
    const fetchBahan = async () => {
      try {
        const response = await axios.get(`${baseURL}/api/bahan`);
        setBahanList(response.data.data); // Menyimpan daftar bahan di state
      } catch (error) {
        console.error('Gagal mengambil data bahan:', error);
      }
    };

    fetchBahan();
  }, [baseURL]);

  // Mengambil data pengeluaran hari ini dari API
  useEffect(() => {
    const fetchPengeluaran = async () => {
      try {
        const response = await axios.get(`${baseURL}/api/pengeluaran`);
        setPengeluaranList(response.data.data); // Menyimpan daftar pengeluaran di state
      } catch (error) {
        console.error('Gagal mengambil data pengeluaran:', error);
      }
    };

    fetchPengeluaran();
  }, [baseURL]);

  // Menghitung subtotal ketika qty atau harga satuan berubah
  useEffect(() => {
    setSubtotal(qty * hargaSatuan);
  }, [qty, hargaSatuan]);

  // Handler untuk mengubah bahan yang dipilih
  const handleBahanChange = (e) => {
    const selectedBahan = bahanList.find((bahan) => bahan.id === parseInt(e.target.value));
    if (selectedBahan) {
      setBahanId(selectedBahan.id);
      setHargaSatuan(selectedBahan.harga); // Set harga satuan dari bahan, tetapi tetap bisa diubah
    }
  };

  // Handler untuk mengubah quantity
  const handleQtyChange = (value) => {
    if (value >= 1) {
      setQty(value);
    }
  };

  // Handler untuk submit form pengeluaran
  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = {
      bahan_id: bahanId,
      qty,
      harga_satuan: hargaSatuan,
      subtotal,
    };

    try {
      const response = await axios.post(`${baseURL}/api/pengeluaran`, data);
      console.log('Pengeluaran berhasil disimpan:', response.data);

      Swal.fire({
        icon: 'success',
        title: 'Pencatatan berhasil',
        text: 'Pengeluaran berhasil dicatat.',
      });
      // Reset form jika berhasil
      setBahanId('');
      setQty(1);
      setHargaSatuan(0);
      setSubtotal(0);

      // Muat ulang data pengeluaran
      const fetchPengeluaran = await axios.get(`${baseURL}/api/pengeluaran`);
      setPengeluaranList(fetchPengeluaran.data.data); // Update pengeluaran setelah penyimpanan
    } catch (error) {
      console.error('Gagal menyimpan pengeluaran:', error);
      Swal.fire({
        icon: 'error',
        title: 'Pengeluaran Gagal',
        text: 'Terjadi kesalahan saat memproses pengeluaran. Silakan coba lagi.',
      });
    }
  };

  const handleKirimLaporan = async () => {
    try {
      const response = await axios.post(`${baseURL}/api/send-laporan-pengeluaran`);

      if (response.status === 200) {
        Swal.fire({
          icon: 'success',
          title: 'Laporan berhasil dikirim',
          text: 'Laporan pengeluaran berhasil dikirimkan melalui WhatsApp.',
        });
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Gagal mengirim laporan',
        text: 'Terjadi kesalahan saat mengirim laporan pengeluaran. Silakan coba lagi.',
      });
      console.error('Error sending laporan pengeluaran:', error);
    }
  };

  return (
    <div className="px-4 pb-36">
      <h1 className="text-center font-bold">Pengeluaran Bahan</h1>

      <div className="card bg-base-100 w-full shadow-xl">
        <div className="card-body">
          <h2 className="card-title">Form Pengeluaran</h2>
          <p className="mb-3">Pengeluaran bahan baku harian.</p>

          <form onSubmit={handleSubmit}>
            {/* Input untuk Bahan */}
            <div className="mb-3">
              <label htmlFor="bahan">Bahan</label>
              <select
                id="bahan"
                className="select select-success w-full max-w-xs mt-2"
                value={bahanId}
                onChange={handleBahanChange}
                required
              >
                <option disabled value="">
                  - pilih bahan -
                </option>
                {bahanList.map((bahan) => (
                  <option key={bahan.id} value={bahan.id}>
                    {bahan.nama}
                  </option>
                ))}
              </select>
            </div>

            {/* Input untuk Harga Satuan (editable) */}
            <div className="mb-3">
              <label htmlFor="harga_satuan">Harga Satuan</label>
              <input
                id="harga_satuan"
                type="number"
                value={hargaSatuan}
                onChange={(e) => setHargaSatuan(Number(e.target.value))} // Mengizinkan inputan pengguna
                className="input input-bordered input-success mt-2 w-full max-w-xs"
              />
            </div>

            {/* Input untuk Quantity */}
            <div className="mb-3">
              <label htmlFor="qty">Quantity</label>
              <div className="flex items-center space-x-2 mt-2">
                <button
                  type="button"
                  className="btn btn-sm bg-red-600 text-white"
                  onClick={() => handleQtyChange(qty - 1)}
                >
                  -
                </button>
                <input
                  id="qty"
                  type="number"
                  value={qty}
                  onChange={(e) => handleQtyChange(parseInt(e.target.value))}
                  className="input input-bordered w-16 text-center"
                  min="1"
                />
                <button
                  type="button"
                  className="btn btn-sm bg-green-600 text-white"
                  onClick={() => handleQtyChange(qty + 1)}
                >
                  +
                </button>
              </div>
            </div>

            {/* Subtotal */}
            <div className="mb-3">
              <p className="text-end">Subtotal: {subtotal}</p>
            </div>

            {/* Submit Button */}
            <div className="card-actions justify-end">
              <button type="submit" className="btn btn-primary">
                Simpan
              </button>
            </div>
          </form>
        </div>
      </div>

      <div>
        <button
          className="btn btn-success btn-block mt-5 text-white text-xl"
          onClick={handleKirimLaporan}
        >
          kirim whatsapp
        </button>
      </div>

      {/* Menampilkan Pengeluaran Hari Ini */}
      <h2 className="mt-5 text-center font-bold">Pengeluaran Hari Ini</h2>
      {pengeluaranList.length > 0 ? (
        pengeluaranList.map((pengeluaran) => (
          <div key={pengeluaran.id} className="card bg-base-100 w-full mt-5 shadow-xl">
            <div className="card-body">
              <h2 className="card-title">{pengeluaran.bahan.nama}</h2>
              <p>{pengeluaran.qty} x Rp.{pengeluaran.harga_satuan}</p>
              <p>Subtotal: Rp.{pengeluaran.subtotal}</p>
              <Link className="absolute bg-orange-600 bottom-3 right-4 rounded-md p-3 text-white font-bold" to={`/pengeluaran/${pengeluaran.id}`}><BiSolidPencil /></Link>
            </div>
          </div>
        ))
      ) : (
        <p className="text-center mt-4">Belum ada pengeluaran hari ini.</p>
      )}
    </div>
  );
};

export default Pengeluaran;
