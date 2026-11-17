import PropTypes from "prop-types";

const TransaksiModal = ({
    isOpen,
    onClose,
    purchaseMethods,
    selectedPurchaseMethod,
    setSelectedPurchaseMethod,
    paymentMethods,
    paymentMethod,
    setPaymentMethod,
    onConfirm,
    isSubmitting = false,
}) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-6 rounded-lg shadow-lg">
                <div className="flex flex-col">
                    <h3 className="font-semibold mb-2">Metode Pembelian</h3>
                    <div className="flex flex-wrap gap-3">
                        {purchaseMethods.map((method) => (
                            <label key={method.id} className="mb-2">
                                <input
                                    type="radio"
                                    value={method.id}
                                    checked={
                                        selectedPurchaseMethod === method.id
                                    }
                                    onChange={() =>
                                        setSelectedPurchaseMethod(method.id)
                                    }
                                />
                                <span className="ml-2">{method.nama}</span>
                            </label>
                        ))}
                    </div>
                </div>

                <div className="flex flex-col mt-4">
                    <h3 className="font-semibold mb-2">Metode Pembayaran</h3>
                    <div className="flex flex-wrap gap-3">
                        {paymentMethods.map((method) => (
                            <label key={method.id} className="mb-2">
                                <input
                                    type="radio"
                                    value={method.id}
                                    checked={paymentMethod === method.id}
                                    onChange={() => setPaymentMethod(method.id)}
                                />
                                <span className="ml-2">{method.nama}</span>
                            </label>
                        ))}
                    </div>
                </div>

                <div className="mt-6 flex justify-end gap-2">
                    <button
                        onClick={onConfirm}
                        disabled={isSubmitting}
                        className={`btn text-white ${
                            isSubmitting
                                ? "bg-green-400 cursor-not-allowed"
                                : "bg-green-500 hover:bg-green-600"
                        }`}
                    >
                        {isSubmitting ? "Memproses..." : "Konfirmasi"}
                    </button>

                    <button
                        onClick={onClose}
                        disabled={isSubmitting}
                        className="btn bg-red-600 text-white hover:bg-red-700 disabled:opacity-50"
                    >
                        Batal
                    </button>
                </div>
            </div>
        </div>
    );
};

// Tambahkan PropTypes untuk validasi
TransaksiModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    purchaseMethods: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.number.isRequired,
            nama: PropTypes.string.isRequired,
        }),
    ).isRequired,
    selectedPurchaseMethod: PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.string,
    ]).isRequired,
    setSelectedPurchaseMethod: PropTypes.func.isRequired,
    paymentMethods: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.number.isRequired,
            nama: PropTypes.string.isRequired,
        }),
    ).isRequired,
    paymentMethod: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
        .isRequired,
    setPaymentMethod: PropTypes.func.isRequired,
    onConfirm: PropTypes.func.isRequired,
};

export default TransaksiModal;
