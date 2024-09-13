import { useState, useEffect } from 'react';
import axios from 'axios';

const Home = () => {
  const [ringkasan, setRingkasan] = useState({
    total_cup: 0,
    saldo_cash: 0,
    saldo_online: 0,
  });

  const baseURL = import.meta.env.VITE_BASE_URL;

  // Fetch data using Axios
  useEffect(() => {
    const fetchRingkasan = async () => {
      try {
        const response = await axios.get(`${baseURL}/api/ringkasan`);
        setRingkasan(response.data.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchRingkasan();
  }, [baseURL]);

  return (
    <div className="p-4">
      <h1 className='mb-3 text-2xl font-bold'>Dashboard</h1>
      <div className="grid grid-cols-2 gap-2">
        {/* Card for total cups sold */}
        <div className="card bg-orange-600 text-white col-span-2">
          <div className="card-body">
            <h4 className="card-title text-center">Total Cup Terjual</h4>
            <div className="card-actions justify-center">
              <h5>{ringkasan.total_cup} Cup</h5>
            </div>
          </div>
        </div>

        {/* Card for cash balance */}
        <div className="card bg-green-600 text-white">
          <div className="card-body cursor-pointer">
            <h4 className="card-title text-center">Uang Cash</h4>
            <div className="card-actions justify-center">
              <h5>Rp. {ringkasan.saldo_cash.toLocaleString('id-ID')}</h5>
            </div>
          </div>
        </div>

        {/* Card for online balance */}
        <div className="card bg-blue-600 text-white">
          <div className="card-body cursor-pointer">
            <h4 className="card-title text-center">Saldo Online</h4>
            <div className="card-actions justify-center">
              <h5>Rp. {ringkasan.saldo_online.toLocaleString('id-ID')}</h5>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Home;
