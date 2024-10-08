import axios from "axios";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Swal from 'sweetalert2';
import { BiSave, BiSolidTrash } from "react-icons/bi";

const EditTransaksi = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [transaksi, setTransaksi] = useState([]);
  const [produkList, setProdukList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const baseURL = import.meta.env.VITE_BASE_URL;

  useEffect(() => {
    fetchTransaksi();
    fetchProdukList();
  }, [id, baseURL]);

  const fetchTransaksi = async () => {
    try {
      const response = await axios.get(`${baseURL}/api/transaksi/${id}`);
      setTransaksi(response.data.data);
    } catch (error) {
      console.error('Error fetching transaksi:', error);
      setError("Gagal memuat data transaksi");
    }
  };

  const fetchProdukList = async () => {
    try {
      const response = await axios.get(`${baseURL}/api/produk`);
      setProdukList(response.data.data);
    } catch (error) {
      console.error('Error fetching produk list:', error);
      setError("Gagal memuat daftar produk");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDetailChange = (index, field, value) => {
    const updatedTransaksi = [...transaksi];
    updatedTransaksi[index][field] = value;

    if (field === 'produk_id') {
      const selectedProduk = produkList.find(p => p.id === parseInt(value));
      updatedTransaksi[index].harga = selectedProduk.harga;
    }

    updatedTransaksi[index].subtotal = updatedTransaksi[index].qty * updatedTransaksi[index].harga;
    setTransaksi(updatedTransaksi);
  };

  const handleDeleteDetail = async (detailId, index) => {
    const result = await Swal.fire({
      title: 'Apakah Anda yakin?',
      text: "Anda akan menghapus item ini dari transaksi",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Ya, hapus!',
      cancelButtonText: 'Batal'
    });

    if (result.isConfirmed) {
      try {
        await axios.delete(`${baseURL}/api/transaksi/${detailId}`);
        const updatedTransaksi = transaksi.filter((_, i) => i !== index);
        setTransaksi(updatedTransaksi);
        Swal.fire(
          'Terhapus!',
          'Item transaksi telah dihapus.',
          'success'
        );
      } catch (error) {
        console.error('Error deleting detail:', error);
        Swal.fire(
          'Error!',
          'Gagal menghapus item transaksi.',
          'error'
        );
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const result = await Swal.fire({
      title: 'Apakah Anda yakin?',
      text: "Anda akan memperbarui transaksi ini",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Ya, perbarui!',
      cancelButtonText: 'Batal'
    });

    if (result.isConfirmed) {
      setIsLoading(true);
      try {
        await axios.put(`${baseURL}/api/transaksi/${id}`, { details: transaksi });
        Swal.fire(
          'Berhasil!',
          'Transaksi telah diperbarui.',
          'success'
        );
        navigate("/transaksi");
      } catch (error) {
        console.error('Error updating transaksi:', error);
        Swal.fire(
          'Error!',
          'Gagal memperbarui transaksi.',
          'error'
        );
      } finally {
        setIsLoading(false);
      }
    }
  };

  if (isLoading) return <p>Memuat data...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="p-4 pb-36">
      <h1 className="text-2xl font-bold mb-4">Edit Transaksi</h1>
      <form onSubmit={handleSubmit}>
        {transaksi.map((detail, index) => (
          <div key={detail.id} className="card border-l-4 border-t-2 border-green-600 bg-base-100 w-full shadow-xl mb-4">
            <div className="card-body">
              <h2 className="card-title">Kode: {detail.kode}</h2>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Produk:</span>
                </label>
                <select
                  value={detail.produk_id}
                  onChange={(e) => handleDetailChange(index, 'produk_id', e.target.value)}
                  className="select select-bordered w-full max-w-xs"
                >
                  {produkList.map((produk) => (
                    <option key={produk.id} value={produk.id}>{produk.nama}</option>
                  ))}
                </select>
              </div>
              <p>Harga: Rp{detail.harga.toLocaleString()}</p>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Jumlah:</span>
                </label>
                <input
                  type="number"
                  value={detail.qty}
                  onChange={(e) => handleDetailChange(index, 'qty', parseInt(e.target.value))}
                  className="input input-bordered w-full max-w-xs"
                  min="1"
                />
              </div>
              <p>Subtotal: Rp{detail.subtotal.toLocaleString()}</p>
              <div className="card-actions justify-end mt-2">
                <button
                  type="button"
                  className="btn btn-error text-white"
                  onClick={() => handleDeleteDetail(detail.id, index)}
                >
                  <BiSolidTrash /> Hapus
                </button>
              </div>
            </div>
          </div>
        ))}
        <div className="mt-4">
          <button type="submit" className="btn btn-primary" disabled={isLoading}><BiSave />
            {isLoading ? "Menyimpan..." : "Simpan Perubahan"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditTransaksi;