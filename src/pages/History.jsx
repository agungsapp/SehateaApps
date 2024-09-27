import { useState, useEffect } from 'react';
import axios from 'axios';
import { BiSolidPencil } from "react-icons/bi";
import { Link } from 'react-router-dom';

const History = () => {
  const [activeTab, setActiveTab] = useState('transaksi');
  const [transaksi, setTransaksi] = useState([]);
  const [detailTransaksi, setDetailTransaksi] = useState([]);

  const baseURL = import.meta.env.VITE_BASE_URL;

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
      setTransaksi(response.data.data);
    } catch (error) {
      console.error('Error fetching transaksi:', error);
    }
  };

  const fetchDetailTransaksi = async () => {
    try {
      const response = await axios.get(`${baseURL}/api/history`);
      setDetailTransaksi(response.data.data);
    } catch (error) {
      console.error('Error fetching detail transaksi:', error);
    }
  };

  return (
    <div className="p-4">
      <h1 className="font-bold text-lg">Riwayat Transaksi</h1>

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

      <div className="mt-4">
        {activeTab === 'transaksi' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {transaksi.map((trx) => (
              <div key={trx.id} className="card overflow-hidden relative bg-base-100 shadow-md border-t-2 border-green-600 border-l-4 p-4">
                <p>
                  <div className="font-bold text-slate-700">
                    {trx.detail_transaksi.slice(0, 3).map((detail, index) =>
                      `${detail.produk.nama}` + (index < Math.min(trx.detail_transaksi.length, 3) - 1 ? " + " : "")
                    )}
                  </div>
                </p>
                <p>Grand Total: Rp {parseInt(trx.grand_total).toLocaleString()}</p>
                <p>
                  Pembayaran{" "}
                  <div className="badge badge-primary">
                    {trx.metode_pembayaran.nama}
                  </div>{" "}
                  bayar{" "}
                  <div className="badge badge-success">
                    {trx.metode_pembelian.nama}
                  </div>
                </p>

                <p className="absolute  text-sm bg-green-600 top-0 right-0 px-2 py-1 rounded-es-xl text-white font-bold">
                  {new Date(trx.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>


                <Link className="absolute bg-orange-600 bottom-3 right-4 rounded-md p-3 text-white font-bold" to={`/edit-transaksi/${trx.id}`}><BiSolidPencil /></Link>


              </div>
            ))}
          </div>
        )}

        {activeTab === 'detail' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3  gap-4">
            {detailTransaksi.map((detail) => (
              <div key={detail.id} className="overflow-hidden card relative border-t-2 border-l-4 border-green-600 bg-base-100 shadow-md mt-2 p-4">
                <p className='font-bold text-slate-700'>{detail.produk.nama}</p>
                <p>Jumlah: {detail.qty}</p>
                <p>Subtotal: Rp {parseInt(detail.subtotal).toLocaleString()}</p>
                <p className='absolute text-sm bg-green-600 top-0 right-0 px-2 py-1 rounded-es-xl text-white font-bold'> {new Date(detail.created_at).toLocaleString([], { hour: '2-digit', minute: '2-digit' })}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default History;