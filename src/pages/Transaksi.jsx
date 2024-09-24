import { useState, useEffect } from 'react';
import axios from 'axios';
import ProductCard from '../components/ProductCard';
import Skeleton from 'react-loading-skeleton';
import TransaksiModal from '../components/TransaksiModal';
import Swal from 'sweetalert2';

const Transaksi = () => {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState({});
  const [isCartVisible, setIsCartVisible] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('');
  const [purchaseMethods, setPurchaseMethods] = useState([]);
  const [selectedPurchaseMethod, setSelectedPurchaseMethod] = useState('');
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  const baseURL = import.meta.env.VITE_BASE_URL;

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  useEffect(() => {
    if (isOnline) {
      syncPendingTransactions();
    }
  }, [isOnline]);

  const fetchProducts = async () => {
    try {
      if (isOnline) {
        const response = await axios.get(`${baseURL}/api/produk`);
        const fetchedProducts = response.data.data;
        setProducts(fetchedProducts);
        localStorage.setItem('cachedProducts', JSON.stringify(fetchedProducts));
        localStorage.setItem('lastProductsFetch', Date.now().toString());
      } else {
        const cachedProducts = localStorage.getItem('cachedProducts');
        if (cachedProducts) {
          setProducts(JSON.parse(cachedProducts));
        }
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      const cachedProducts = localStorage.getItem('cachedProducts');
      if (cachedProducts) {
        setProducts(JSON.parse(cachedProducts));
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [baseURL, isOnline]);

  const fetchPurchaseMethods = async () => {
    try {
      let methods;
      if (isOnline) {
        const response = await axios.get(`${baseURL}/api/metode-pembelian`);
        methods = response.data.data;
        setPurchaseMethods(methods);
        localStorage.setItem('cachedPurchaseMethods', JSON.stringify(methods));
      } else {
        const cachedMethods = localStorage.getItem('cachedPurchaseMethods');
        if (cachedMethods) {
          methods = JSON.parse(cachedMethods);
          setPurchaseMethods(methods);
        }
      }

      const defaultPurchaseMethod = methods.find((method) => method.nama.toLowerCase() === 'toko');
      if (defaultPurchaseMethod) {
        setSelectedPurchaseMethod(defaultPurchaseMethod.id);
      }
    } catch (error) {
      console.error('Error fetching purchase methods:', error);
      const cachedMethods = localStorage.getItem('cachedPurchaseMethods');
      if (cachedMethods) {
        setPurchaseMethods(JSON.parse(cachedMethods));
      }
    }
  };

  useEffect(() => {
    fetchPurchaseMethods();
  }, [baseURL, isOnline]);

  const fetchPaymentMethods = async () => {
    try {
      let methods;
      if (isOnline) {
        const response = await fetch(`${baseURL}/api/metode-pembayaran`);
        const data = await response.json();
        methods = data.data;
        setPaymentMethods(methods);
        localStorage.setItem('cachedPaymentMethods', JSON.stringify(methods));
      } else {
        const cachedMethods = localStorage.getItem('cachedPaymentMethods');
        if (cachedMethods) {
          methods = JSON.parse(cachedMethods);
          setPaymentMethods(methods);
        }
      }

      const defaultPaymentMethod = methods.find((method) => method.nama.toLowerCase() === 'tunai');
      if (defaultPaymentMethod) {
        setPaymentMethod(defaultPaymentMethod.id);
      }
    } catch (error) {
      console.error('Error fetching payment methods:', error);
      const cachedMethods = localStorage.getItem('cachedPaymentMethods');
      if (cachedMethods) {
        setPaymentMethods(JSON.parse(cachedMethods));
      }
    }
  };

  useEffect(() => {
    fetchPaymentMethods();
  }, [baseURL, isOnline]);

  const renderSkeletons = () => {
    return Array(6).fill().map((_, index) => (
      <div key={index} className="bg-gray-200 p-4 rounded shadow-md">
        <Skeleton height={100} />
        <Skeleton count={3} />
      </div>
    ));
  };

  const handleAddToCart = (id) => {
    setCart((prevCart) => ({
      ...prevCart,
      [id]: (prevCart[id] || 0) + 1,
    }));
    setIsCartVisible(true);
  };

  const handleRemoveFromCart = (id) => {
    setCart((prevCart) => {
      if (prevCart[id] > 1) {
        return {
          ...prevCart,
          [id]: prevCart[id] - 1,
        };
      } else {
        const updatedCart = { ...prevCart };
        delete updatedCart[id];
        return updatedCart;
      }
    });
  };

  const calculateTotal = () => {
    return products.reduce((total, product) => {
      const quantity = cart[product.id] || 0;
      return total + quantity * product.harga;
    }, 0);
  };

  const createTransactionData = () => {
    const produk_id = Object.keys(cart).map(Number);
    const jumlah = Object.values(cart);
    const total = calculateTotal();

    return {
      produk_id,
      jumlah,
      metode_pembayaran_id: paymentMethod,
      metode_pembelian_id: selectedPurchaseMethod,
      total,
    };
  };

  const handleCheckOut = () => {
    setIsModalOpen(true);
  };

  const storePendingTransaction = (transactionData) => {
    const pendingTransactions = JSON.parse(localStorage.getItem('pendingTransactions') || '[]');
    pendingTransactions.push(transactionData);
    localStorage.setItem('pendingTransactions', JSON.stringify(pendingTransactions));
  };

  const syncPendingTransactions = async () => {
    const pendingTransactions = JSON.parse(localStorage.getItem('pendingTransactions') || '[]');
    if (pendingTransactions.length === 0) return;

    for (const transaction of pendingTransactions) {
      try {
        await axios.post(`${baseURL}/api/transaksi`, transaction);
        // Remove the synced transaction from pendingTransactions
        const updatedPendingTransactions = pendingTransactions.filter(t => t !== transaction);
        localStorage.setItem('pendingTransactions', JSON.stringify(updatedPendingTransactions));
      } catch (error) {
        console.error('Error syncing transaction:', error);
      }
    }

    Swal.fire({
      icon: 'success',
      title: 'Sinkronisasi Berhasil',
      text: 'Transaksi pending telah berhasil disinkronkan.',
    });
  };

  const confirmTransaction = async () => {
    if (paymentMethod && selectedPurchaseMethod && Object.keys(cart).length > 0) {
      const transactionData = createTransactionData();
      console.log('Transaction Data:', transactionData);

      if (isOnline) {
        try {
          const response = await axios.post(`${baseURL}/api/transaksi`, transactionData);
          console.log('Transaction Success:', response.data);
          Swal.fire({
            icon: 'success',
            title: 'Transaksi Berhasil',
            text: 'Terima kasih atas pembelian Anda!',
          });

          // Reset state after successful transaction
          setIsModalOpen(false);
          setCart({});
          setIsCartVisible(false);
        } catch (error) {
          console.error('Transaction Error:', error);
          Swal.fire({
            icon: 'error',
            title: 'Transaksi Gagal',
            text: 'Terjadi kesalahan saat memproses transaksi. Silakan coba lagi.',
          });
        }
      } else {
        storePendingTransaction(transactionData);
        Swal.fire({
          icon: 'info',
          title: 'Transaksi Pending',
          text: 'Transaksi Anda akan diproses saat koneksi internet tersedia.',
        });

        // Reset state after storing pending transaction
        setIsModalOpen(false);
        setCart({});
        setIsCartVisible(false);
      }
    } else {
      Swal.fire({
        icon: 'warning',
        title: 'Informasi Tidak Lengkap',
        text: 'Pilih metode pembayaran, pembelian, dan produk terlebih dahulu.',
      });
    }
  };

  return (
    <div className="p-4">
      <h1 className='mb-3 text-2xl font-bold'>Transaksi</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 pb-72 gap-4">
        {isLoading ? (
          renderSkeletons()
        ) : (
          products.length > 0 ? (
            products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                cart={cart}
                handleAddToCart={handleAddToCart}
                handleRemoveFromCart={handleRemoveFromCart}
              />
            ))
          ) : (
            <p>data gagal di muat ... x _ X</p>
          )
        )}
      </div>

      {/* Keranjang total */}
      <div
        className={`fixed left-0 right-0 mx-5 card bg-green-700 shadow-lg transform transition-transform duration-300 ${isCartVisible ? 'translate-y-0' : 'translate-y-full'}`}
        style={{ bottom: isCartVisible ? '100px' : '-100%' }}
      >
        <div className="card-body p-3 text-white text-lg">
          <div className='flex justify-between'>
            <div>
              Total: Rp {calculateTotal().toLocaleString()}
            </div>
            <div>
              <button onClick={handleCheckOut} className="btn bg-slate-900 text-white">OK</button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal untuk memilih metode pembayaran dan pembelian */}
      <TransaksiModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        purchaseMethods={purchaseMethods}
        selectedPurchaseMethod={selectedPurchaseMethod}
        setSelectedPurchaseMethod={setSelectedPurchaseMethod}
        paymentMethods={paymentMethods}
        paymentMethod={paymentMethod}
        setPaymentMethod={setPaymentMethod}
        onConfirm={confirmTransaction}
      />
    </div>
  );
};

export default Transaksi;