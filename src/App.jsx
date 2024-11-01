// App.js
import './App.css';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Header from './components/Header';
import BottomNav from './components/BottomNav';
import Home from './pages/Home';
import Transaksi from './pages/Transaksi';
import Pengeluaran from './pages/Pengeluaran';
import History from './pages/History';
import { useEffect, useState } from 'react';
import SplashScreen from './components/SplashScreen';
import EditTransaksi from './pages/EditTransaksi';
import EditPengeluaran from './pages/EditPengeluaran';
import PengeluaranLain from './pages/PengeluaranLain';
import EditPengeluaranLain from './pages/EditPengeluaranLain';

function App() {

  const [isLoading, setIsLoading] = useState(true); // State untuk splash screen

  // Gunakan useEffect untuk mengatur timer splash screen
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false); // Matikan splash screen setelah beberapa detik
    }, 3000); // Durasi splash screen (misalnya 3 detik)

    return () => clearTimeout(timer); // Bersihkan timer saat komponen di-unmount
  }, []);

  // Jika splash screen masih aktif, tampilkan splash screen
  if (isLoading) {
    return <SplashScreen />;
  }

  return (
    <Router>
      <div className="drawer">
        {/* Drawer for the sidebar */}
        <input id="my-drawer" type="checkbox" className="drawer-toggle" />
        <div className="drawer-content">
          {/* Header and BottomNav will be available on all pages */}
          <Header />

          {/* Main Page Content */}
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/transaksi" element={<Transaksi />} />
            <Route path="/edit-transaksi/:id" element={<EditTransaksi />} />
            <Route path="/history" element={<History />} />
            <Route path="/pengeluaran" element={<Pengeluaran />} />
            <Route path="/pengeluaran/:id" element={<EditPengeluaran />} />
            <Route path="/pengeluaran-lain" element={<PengeluaranLain />} />
            <Route path="/pengeluaran-lain/:id" element={<EditPengeluaranLain />} />
          </Routes>

          {/* BottomNav */}
          <BottomNav />
        </div>

        {/* Drawer content (the sidebar) */}
        <div className="drawer-side">
          <label htmlFor="my-drawer" className="drawer-overlay"></label>
          <ul className="menu p-4 w-60 h-full bg-base-100 text-base-content">
            <li><a href="#">Data Produk <div className="badge badge-secondary">proses</div></a></li>
            <li><a href="#">Data Bahan Baku <div className="badge badge-secondary">proses</div></a></li>
            <li><Link to={`/pengeluaran-lain`}>Pengeluaran Lain - Lain<div className="badge badge-primary">ready</div></Link></li>
            <li><a href="#">Laporan Transaksi <div className="badge badge-secondary">proses</div></a></li>
          </ul>
        </div>
      </div>
    </Router>
  );
}

export default App;
