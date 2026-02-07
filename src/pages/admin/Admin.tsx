import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import { formatPrice } from "../../utils/formatPrice";
import { useAuthStore } from "../../store/authStore";
import { useNavigate } from "react-router-dom";

// Define interfaces for Designs & Orders
interface Design {
  id: string;
  name: string;
  price: number;
  pdf_url: string;
}

interface Order {
  id: string;
  user_id: string;
  total_amount: number;
  status: string;
}

const Admin = () => {
  const [designs, setDesigns] = useState<Design[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || !user.is_admin) {
      navigate("/login");
    }
  }, [user, navigate]);

  const fetchData = async () => {
    setLoading(true);
    await fetchDesigns();
    await fetchOrders();
    setLoading(false);
  };

  const fetchDesigns = async () => {
    try {
      const { data, error } = await supabase.from("designs").select("*");
      if (error) throw error;
      setDesigns(data || []);
    } catch (error) {
      console.error("Error fetching designs:", error);
    }
  };

  const fetchOrders = async () => {
    try {
      const { data, error } = await supabase.from("orders").select("*");
      if (error) throw error;
      setOrders(data || []);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

      <button 
        onClick={fetchData} 
        className="mb-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
      >
        Refresh Data
      </button>

      {loading && <p className="text-center text-gray-600">Loading...</p>}

      {/* Designs Section */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Designs</h2>
        {designs.length === 0 ? (
          <p className="text-gray-600">No designs found.</p>
        ) : (
          <table className="w-full border">
            <thead>
              <tr className="bg-gray-200">
                <th className="border p-2">ID</th>
                <th className="border p-2">Name</th>
                <th className="border p-2">Price</th>
                <th className="border p-2">PDF</th>
              </tr>
            </thead>
            <tbody>
              {designs.map((design) => (
                <tr key={design.id} className="border">
                  <td className="p-2">{design.id}</td>
                  <td className="p-2">{design.name}</td>
                  <td className="p-2">{formatPrice(design.price)}</td>
                  <td className="p-2">
                    <a 
                      href={design.pdf_url} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-blue-500"
                    >
                      View PDF
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      {/* Orders Section */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Orders</h2>
        {orders.length === 0 ? (
          <p className="text-gray-600">No orders placed yet.</p>
        ) : (
          <table className="w-full border">
            <thead>
              <tr className="bg-gray-200">
                <th className="border p-2">ID</th>
                <th className="border p-2">User ID</th>
                <th className="border p-2">Total Amount</th>
                <th className="border p-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id} className="border">
                  <td className="p-2">{order.id}</td>
                  <td className="p-2">{order.user_id}</td>
                  <td className="p-2">{formatPrice(order.total_amount)}</td>
                  <td className="p-2">{order.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </div>
  );
};

export default Admin;
