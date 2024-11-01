import axios from "axios";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Swal from 'sweetalert2';
import { BiSave, BiSolidTrash } from "react-icons/bi";

const EditPengeluaran = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [pengeluaran, setPengeluaran] = useState({});
  const [bahanList, setBahanList] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const baseURL = import.meta.env.VITE_BASE_URL;

  useEffect(() => {
    fetchPengeluaran();
    fetchBahan();
  }, [id, baseURL]);

  const fetchPengeluaran = async () => {
    try {
      const response = await axios.get(`${baseURL}/api/pengeluaran/${id}`);
      setPengeluaran(response.data.data);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching pengeluaran:', error);
      setError("Gagal memuat data pengeluaran");
      setIsLoading(false);
    }
  };

  const fetchBahan = async () => {
    try {
      const response = await axios.get(`${baseURL}/api/bahan`);
      setBahanList(response.data.data);
    } catch (error) {
      console.error('Error fetching bahan:', error);
    }
  };

  const handleFieldChange = (field, value) => {
    setPengeluaran(prev => ({
      ...prev,
      [field]: value,
      subtotal: field === 'qty' || field === 'harga_satuan'
        ? (prev.qty || 1) * (field === 'harga_satuan' ? value : prev.harga_satuan)
        : prev.subtotal,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await Swal.fire({
      title: 'Apakah Anda yakin?',
      text: "Anda akan memperbarui pengeluaran ini",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Ya, perbarui!',
      cancelButtonText: 'Batal'
    });

    if (result.isConfirmed) {
      setIsLoading(true);
      try {
        await axios.put(`${baseURL}/api/pengeluaran/${id}`, pengeluaran);
        Swal.fire('Berhasil!', 'Pengeluaran telah diperbarui.', 'success');
        navigate("/pengeluaran");
      } catch (error) {
        console.error('Error updating pengeluaran:', error);
        Swal.fire('Error!', 'Gagal memperbarui pengeluaran.', 'error');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleDelete = async () => {
    const result = await Swal.fire({
      title: 'Apakah Anda yakin?',
      text: "Pengeluaran ini akan dihapus secara permanen",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Ya, hapus!',
      cancelButtonText: 'Batal'
    });

    if (result.isConfirmed) {
      try {
        await axios.delete(`${baseURL}/api/pengeluaran/${id}`);
        Swal.fire('Dihapus!', 'Pengeluaran berhasil dihapus.', 'success');
        navigate("/pengeluaran");
      } catch (error) {
        console.error('Error deleting pengeluaran:', error);
        Swal.fire('Error!', 'Gagal menghapus pengeluaran.', 'error');
      }
    }
  };

  if (isLoading) return <p>Memuat data...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="p-4 pb-36">
      <h1 className="text-2xl font-bold mb-4">Edit Pengeluaran</h1>
      <form onSubmit={handleSubmit}>
        <div className="card bg-base-100 w-full shadow-xl mb-4">
          <div className="card-body">
            <h2 className="card-title">Kode: {pengeluaran.kode}</h2>

            <div className="form-control">
              <label className="label">Bahan:</label>
              <select
                value={pengeluaran.bahan_id || ''}
                onChange={(e) => handleFieldChange('bahan_id', parseInt(e.target.value))}
                className="select select-bordered w-full max-w-xs"
              >
                <option value="" disabled>- pilih bahan -</option>
                {bahanList.map((bahan) => (
                  <option key={bahan.id} value={bahan.id}>
                    {bahan.nama}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-control mt-4">
              <label className="label">Harga Satuan:</label>
              <input
                type="number"
                value={pengeluaran.harga_satuan || ''}
                onChange={(e) => handleFieldChange('harga_satuan', parseInt(e.target.value))}
                className="input input-bordered w-full max-w-xs"
              />
            </div>

            <div className="form-control mt-4">
              <label className="label">Jumlah:</label>
              <input
                type="number"
                value={pengeluaran.qty || ''}
                onChange={(e) => handleFieldChange('qty', parseInt(e.target.value))}
                className="input input-bordered w-full max-w-xs"
                min="1"
              />
            </div>

            <p className="mt-4">Subtotal: Rp{pengeluaran.subtotal?.toLocaleString()}</p>

            <div className="card-actions justify-end mt-4">
              <button
                type="button"
                className="btn btn-error text-white"
                onClick={handleDelete}
              >
                <BiSolidTrash /> Hapus Pengeluaran
              </button>
            </div>

            <div className="card-actions justify-end mt-4">
              <button type="submit" className="btn btn-primary" disabled={isLoading}>
                <BiSave /> {isLoading ? "Menyimpan..." : "Simpan Perubahan"}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default EditPengeluaran;
