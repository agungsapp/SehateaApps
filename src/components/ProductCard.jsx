import PropTypes from 'prop-types';

const ProductCard = ({ product, cart, handleAddToCart, handleRemoveFromCart }) => {
  return (
    <div className="card bg-base-100 shadow-md border-t-2 border-green-600 border-l-4 p-4">
      <h2 className="text-lg font-semibold">{product.nama}</h2>
      <p className="text-gray-600">Rp {product.harga.toLocaleString()}</p>
      <div className="mt-2 flex items-center space-x-2">
        <button
          className="btn btn-sm bg-red-600 text-white"
          onClick={() => handleRemoveFromCart(product.id)}
          disabled={!cart[product.id]}
        >
          -
        </button>
        <span>{cart[product.id] || 0}</span>
        <button
          className="btn btn-sm bg-green-600 text-white"
          onClick={() => handleAddToCart(product.id)}
        >
          +
        </button>
      </div>
    </div>
  );
};

// Menambahkan validasi props menggunakan PropTypes
ProductCard.propTypes = {
  product: PropTypes.shape({
    id: PropTypes.number.isRequired,
    nama: PropTypes.string.isRequired,
    harga: PropTypes.number.isRequired,
  }).isRequired,
  cart: PropTypes.object.isRequired,
  handleAddToCart: PropTypes.func.isRequired,
  handleRemoveFromCart: PropTypes.func.isRequired,
};

export default ProductCard;
