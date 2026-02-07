import { useParams, Link } from "react-router-dom";

const OrderConfirmation = () => {
  const { orderId } = useParams();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-lg shadow-md text-center">
        <h1 className="text-3xl font-bold text-green-600 mb-4">
          Order Placed Successfully 🎉
        </h1>
        <p className="text-gray-700 mb-2">
          Your order ID:
        </p>
        <p className="font-mono text-purple-600 mb-6">
          {orderId}
        </p>

        <Link
          to="/orders"
          className="inline-block bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700"
        >
          View My Orders
        </Link>
      </div>
    </div>
  );
};

export default OrderConfirmation;
