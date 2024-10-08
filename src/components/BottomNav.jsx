import { BiHomeHeart, BiCalculator, BiMoneyWithdraw, BiHistory } from 'react-icons/bi';
import { useNavigate, useLocation } from 'react-router-dom';

const BottomNav = () => {
  const navigate = useNavigate(); // Initialize navigate hook
  const location = useLocation(); // Get the current location

  return (
    <div className="btm-nav bg-green-700 text-white border-slate-200 border-t-2">
      <button
        onClick={() => navigate('/')}
        className={`flex flex-col font-bold items-center justify-center w-full py-2 ${location.pathname === '/'
          ? 'border-t-4 border-green-500 bg-green-100 text-slate-700'
          : 'border-t-2 border-transparent'
          }`}
      >
        <BiHomeHeart />
        <span className="btm-nav-label">Home</span>
      </button>
      <button
        onClick={() => navigate('/transaksi')}
        className={`flex flex-col font-bold items-center justify-center w-full py-2 ${location.pathname === '/transaksi'
          ? 'border-t-4 border-green-500 bg-green-100 text-slate-700  '
          : 'border-t-2 border-transparent'
          }`}
      >
        <BiCalculator />
        <span className="btm-nav-label">Transaksi</span>
      </button>
      <button
        onClick={() => navigate('/history')}
        className={`flex flex-col font-bold items-center justify-center w-full py-2 ${location.pathname === '/history'
          ? 'border-t-4 border-green-500 bg-green-100 text-slate-700'
          : 'border-t-2 border-transparent'
          }`}
      >
        <BiHistory />
        <span className="btm-nav-label">History</span>
      </button>
      <button
        onClick={() => navigate('/pengeluaran')}
        className={`flex flex-col font-bold items-center justify-center w-full py-2 ${location.pathname === '/pengeluaran'
          ? 'border-t-4 border-green-500 bg-green-100 text-slate-700'
          : 'border-t-2 border-transparent'
          }`}
      >
        <BiMoneyWithdraw />
        <span className="btm-nav-label">Pengeluaran</span>
      </button>
    </div>
  );
};

export default BottomNav;
