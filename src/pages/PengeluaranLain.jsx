import { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { Link } from 'react-router-dom';
import { BiSolidPencil } from 'react-icons/bi';

const PengeluaranLain = () => {
  const [nama, setNama] = useState('');
  const [harga, setHarga] = useState(0);
  const [keterangan, setKeterangan] = useState('');
  const [tanggalPengeluaran, setTanggalPengeluaran] = useState(new Date().toISOString().split('T')[0]);
  const [pengeluaranLainList, setPengeluaranLainList] = useState([]);
  const baseURL = import.meta.env.VITE_BASE_URL;

  // Fetch initial list of PengeluaranLain records once on component mount
  useEffect(() => {
    fetchPengeluaranLain();
  }, []); // Empty dependency array ensures this runs only once

  const fetchPengeluaranLain = async () => {
    try {
      const response = await axios.get(`${baseURL}/api/pengeluaran-lain`);
      setPengeluaranLainList(response.data.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  // Handler for submitting a new expense
  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = {
      nama,
      harga,
      keterangan,
      tanggal_pengeluaran: tanggalPengeluaran,
    };

    try {
      const response = await axios.post(`${baseURL}/api/pengeluaran-lain`, data);
      Swal.fire({
        icon: 'success',
        title: 'Pengeluaran berhasil disimpan',
        text: response.data.message,
      });

      // Reset form fields
      setNama('');
      setHarga(0);
      setKeterangan('');
      setTanggalPengeluaran(new Date().toISOString().split('T')[0]);

      // Refresh the list of expenses
      fetchPengeluaranLain();
    } catch (error) {
      console.error('Gagal menyimpan pengeluaran:', error);
      Swal.fire({
        icon: 'error',
        title: 'Pengeluaran Gagal',
        text: 'Terjadi kesalahan saat memproses pengeluaran. Silakan coba lagi.',
      });
    }
  };

  return (
    <div className="px-4 pb-36">
      <h1 className="text-center font-bold">Pengeluaran Lain</h1>
      <p className='text-center'>( masih dalam pengembangan edit delete belum bisa )</p>

      <div className="card bg-base-100 w-full shadow-xl">
        <div className="card-body">
          <h2 className="card-title">Form Pengeluaran Lain</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="nama">Nama Pengeluaran</label>
              <input
                id="nama"
                type="text"
                value={nama}
                onChange={(e) => setNama(e.target.value)}
                className="input input-bordered input-success mt-2 w-full max-w-xs"
                required
              />
            </div>

            <div className="mb-3">
              <label htmlFor="harga">Harga</label>
              <input
                id="harga"
                type="number"
                value={harga}
                onChange={(e) => setHarga(parseInt(e.target.value))}
                className="input input-bordered input-success mt-2 w-full max-w-xs"
                required
              />
            </div>

            <div className="mb-3">
              <label htmlFor="keterangan">Keterangan</label>
              <input
                id="keterangan"
                type="text"
                value={keterangan}
                onChange={(e) => setKeterangan(e.target.value)}
                className="input input-bordered input-success mt-2 w-full max-w-xs"
              />
            </div>

            <div className="mb-3">
              <label htmlFor="tanggal_pengeluaran">Tanggal Pengeluaran</label>
              <input
                id="tanggal_pengeluaran"
                type="date"
                value={tanggalPengeluaran}
                onChange={(e) => setTanggalPengeluaran(e.target.value)}
                className="input input-bordered input-success mt-2 w-full max-w-xs"
                required
              />
            </div>

            <div className="card-actions justify-end">
              <button type="submit" className="btn btn-primary">
                Simpan
              </button>
            </div>
          </form>
        </div>
      </div>

      <h2 className="mt-5 text-center font-bold">Daftar Pengeluaran Lain</h2>
      {pengeluaranLainList.length > 0 ? (
        pengeluaranLainList.map((pengeluaran) => (
          <div key={pengeluaran.id} className="card bg-base-100 w-full mt-5 shadow-xl">
            <div className="card-body">
              <h2 className="card-title">{pengeluaran.nama}</h2>
              <p>Harga: Rp.{parseInt(pengeluaran.harga).toLocaleString()}</p>
              <p>Keterangan: {pengeluaran.keterangan || '-'}</p>
              <p>Jenis Pengeluaran: {pengeluaran.jenis_pengeluaran?.nama || '-'}</p>
              <p>Sumber Dana: {pengeluaran.sumber_dana?.nama || '-'}</p>
              <p>Tanggal Pengeluaran: {pengeluaran.tanggal_pengeluaran}</p>
              <Link className="absolute bg-orange-600 bottom-3 right-4 rounded-md p-3 text-white font-bold" to={`/pengeluaran-lain/${pengeluaran.id}`}>
                <BiSolidPencil />
              </Link>
            </div>
          </div>
        ))
      ) : (
        <p className="text-center mt-4">Belum ada pengeluaran lain yang tercatat.</p>
      )}
    </div>
  );
};

export default PengeluaranLain;
