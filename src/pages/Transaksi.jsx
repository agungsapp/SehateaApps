import { useState, useEffect } from 'react';
import axios from 'axios';
import ProductCard from '../components/ProductCard';
import Skeleton from 'react-loading-skeleton';
import TransaksiModal from '../components/TransaksiModal';

const Transaksi = () => {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState({});
  const [isCartVisible, setIsCartVisible] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('');
  const [purchaseMethods, setPurchaseMethods] = useState([]);
  const [selectedPurchaseMethod, setSelectedPurchaseMethod] = useState('');
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [isLoading, setIsLoading] = useState(true); // State untuk loading

  const baseURL = import.meta.env.VITE_BASE_URL;

  // Fetch data produk menggunakan Axios
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`${baseURL}/api/produk`);
        setProducts(response.data.data);
        setIsLoading(false); // Setelah data ter-fetch, set loading ke false
      } catch (error) {
        console.error('Error fetching products:', error);
        setIsLoading(false); // Jika error, tetap matikan loading
      }
    };

    fetchProducts();
  }, [baseURL]);

  // Skeleton loader
  const renderSkeletons = () => {
    return Array(6).fill().map((_, index) => (
      <div key={index} className="bg-gray-200 p-4 rounded shadow-md">
        <Skeleton height={100} />
        <Skeleton count={3} />
      </div>
    ));
  };

  // Fetch metode pembelian
  useEffect(() => {
    const fetchPurchaseMethods = async () => {
      try {
        const response = await axios.get(`${baseURL}/api/metode-pembelian`);
        setPurchaseMethods(response.data.data);

        // Set default metode pembelian ke "Toko"
        const defaultPurchaseMethod = response.data.data.find((method) => method.nama.toLowerCase() === 'toko');
        if (defaultPurchaseMethod) {
          setSelectedPurchaseMethod(defaultPurchaseMethod.id);
        }
      } catch (error) {
        console.error('Error fetching purchase methods:', error);
      }
    };

    fetchPurchaseMethods();
  }, [baseURL]);

  // Fetch metode pembayaran
  useEffect(() => {
    const fetchPaymentMethods = async () => {
      try {
        const response = await fetch(`${baseURL}/api/metode-pembayaran`);
        const data = await response.json();
        setPaymentMethods(data.data);

        // Set default metode pembayaran ke "Tunai"
        const defaultPaymentMethod = data.data.find((method) => method.nama.toLowerCase() === 'tunai');
        if (defaultPaymentMethod) {
          setPaymentMethod(defaultPaymentMethod.id);
        }
      } catch (error) {
        console.error('Error fetching payment methods:', error);
      }
    };

    fetchPaymentMethods();
  }, [baseURL]);

  // Menambah produk ke keranjang
  const handleAddToCart = (id) => {
    setCart((prevCart) => ({
      ...prevCart,
      [id]: (prevCart[id] || 0) + 1,
    }));
    setIsCartVisible(true);
  };

  // Mengurangi produk dari keranjang
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

  // Menghitung total harga produk di keranjang
  const calculateTotal = () => {
    return products.reduce((total, product) => {
      const quantity = cart[product.id] || 0;
      return total + quantity * product.harga;
    }, 0);
  };

  // Mengonversi cart menjadi format untuk request body
  const createTransactionData = () => {
    const produk_id = Object.keys(cart).map(Number); // Array produk_id
    const jumlah = Object.values(cart); // Array jumlah produk
    const total = calculateTotal(); // Total harga

    return {
      produk_id,
      jumlah,
      metode_pembayaran_id: paymentMethod,
      metode_pembelian_id: selectedPurchaseMethod,
      total,
    };
  };

  // Fungsi checkout
  const handleCheckOut = () => {
    setIsModalOpen(true);
  };

  // Konfirmasi transaksi
  const confirmTransaction = async () => {
    if (paymentMethod && selectedPurchaseMethod && Object.keys(cart).length > 0) {
      const transactionData = createTransactionData();
      console.log('Transaction Data:', transactionData);

      try {
        // Kirim POST request ke API transaksi
        const response = await axios.post(`${baseURL}/api/transaksi`, transactionData);
        console.log('Transaction Success:', response.data);

        // Setelah konfirmasi, tutup modal dan reset state
        setIsModalOpen(false);
        setCart({});
        setIsCartVisible(false);
      } catch (error) {
        console.error('Transaction Error:', error);
      }
    } else {
      alert('Pilih metode pembayaran, pembelian, dan produk terlebih dahulu.');
    }
  };

  return (
    <div className="p-4">
      <h1 className='mb-3 text-2xl font-bold'>Transaksi</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 pb-72 gap-4">
        {isLoading ? (
          renderSkeletons() // Tampilkan Skeleton saat isLoading = true
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
