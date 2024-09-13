import { useState, useEffect } from 'react';
import axios from 'axios';

const History = () => {
  const [activeTab, setActiveTab] = useState('transaksi'); // Default tab: transaksi
  const [transaksi, setTransaksi] = useState([]);
  const [detailTransaksi, setDetailTransaksi] = useState([]);

  const baseURL = import.meta.env.VITE_BASE_URL; // Base URL dari .env

  // Fetch data berdasarkan tab yang aktif
  useEffect(() => {
    if (activeTab === 'transaksi') {
      fetchTransaksi();
    } else if (activeTab === 'detail') {
      fetchDetailTransaksi();
    }
  }, [activeTab]);

  const fetchTransaksi = async () => {
    try {
      const response = await axios.get(`${baseURL}/api/transaksi`);
      setTransaksi(response.data.data); // Simpan data transaksi
    } catch (error) {
      console.error('Error fetching transaksi:', error);
    }
  };

  const fetchDetailTransaksi = async () => {
    try {
      const response = await axios.get(`${baseURL}/api/history`);
      setDetailTransaksi(response.data.data); // Simpan data detail transaksi
    } catch (error) {
      console.error('Error fetching detail transaksi:', error);
    }
  };

  return (
    <div className="p-4">
      <h1 className="font-bold text-lg">Riwayat Transaksi</h1>

      {/* Tabs */}
      <div role="tablist" className="tabs tabs-boxed">
        <a
          role="tab"
          className={`tab ${activeTab === 'transaksi' ? 'tab-active' : ''}`}
          onClick={() => setActiveTab('transaksi')}
        >
          Transaksi
        </a>
        <a
          role="tab"
          className={`tab ${activeTab === 'detail' ? 'tab-active' : ''}`}
          onClick={() => setActiveTab('detail')}
        >
          Detail Transaksi
        </a>
      </div>

      {/* Konten berdasarkan tab */}
      <div className="mt-4">
        {activeTab === 'transaksi' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {transaksi.map((trx) => (
              <div key={trx.id} className="card bg-base-100 shadow-md p-4">
                {/*<h2 className="font-semibold text-lg">Kode: {trx.kode}</h2>*/}
                <p>Grand Total: Rp {trx.grand_total.toLocaleString()}</p>
                <p>Pembayaran <div className="badge badge-primary">{trx.metode_pembayaran.nama}</div>  bayar <div className="badge badge-success">{trx.metode_pembelian.nama}</div> </p>
                <p>Tanggal: {new Date(trx.created_at).toLocaleString()}</p>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'detail' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {detailTransaksi.map((detail) => (
              <div key={detail.id} className="card bg-base-100 shadow-md p-4">
                <h2 className="font-semibold text-lg">{detail.produk.nama}</h2>

                <p>Jumlah: {detail.qty}</p>
                <p>Subtotal: Rp {detail.subtotal.toLocaleString()}</p>
                <p>Tanggal: {new Date(detail.created_at).toLocaleString()}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default History;
