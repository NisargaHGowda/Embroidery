import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { useAuthStore } from "../store/authStore";
import { useNavigate } from "react-router-dom";
import { Package, Clock, CheckCircle } from "lucide-react";

interface OrderItem {
  id: string;
  quantity: number;
  designs: {
    design_code: string;
    image_url: string;
  } | null;
}

interface Order {
  id: string;
  status: "pending" | "processing" | "completed";
  payment_status: "pending" | "paid" | "failed";
  created_at: string;
  order_items: OrderItem[];
}

const Orders = () => {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    fetchOrders();
  }, [user]);

  const fetchOrders = async () => {
    setLoading(true);
    setError("");

    const { data, error } = await supabase
      .from("orders")
      .select(`
        id,
        status,
        payment_status,
        created_at,
        order_items (
          id,
          quantity,
          designs (
            design_code,
            image_url
          )
        )
      `)
      .eq("user_id", user!.id)
      .order("created_at", { ascending: false });

    if (error) {
      console.error(error);
      setError("Failed to load orders");
    } else {

      const normalized = (data || []).map((o: any) => ({
        id: o.id,
        status: o.status,
        payment_status: o.payment_status,
        created_at: o.created_at,
        order_items: (o.order_items || []).map((it: any) => ({
          id: it.id,
          quantity: it.quantity,
          designs: Array.isArray(it.designs) ? (it.designs[0] ?? null) : (it.designs ?? null),
        })),
      })) as Order[];
      setOrders(normalized);
    }

    setLoading(false);
  };

  const statusIcon = (status: string) => {
    if (status === "completed") return <CheckCircle className="text-green-500" />;
    if (status === "processing") return <Clock className="text-yellow-500" />;
    return <Package className="text-purple-500" />;
  };

  if (loading) {
    return <div className="text-center py-20">Loading orders...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">My Orders</h1>

      {error && (
        <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
          {error}
        </div>
      )}

      {orders.length === 0 ? (
        <p>No orders yet</p>
      ) : (
        orders.map((order) => (
          <div key={order.id} className="bg-white shadow rounded mb-6 p-4">
            <div className="flex justify-between items-center mb-4">
              <div>
                <p className="text-sm text-gray-500">
                  Order #{order.id.slice(0, 8)}
                </p>
                <p className="text-sm text-gray-500">
                  {new Date(order.created_at).toLocaleDateString()}
                </p>
              </div>
              <div className="flex items-center gap-2">
                {statusIcon(order.status)}
                <span className="capitalize">{order.status}</span>
              </div>
            </div>

            {order.order_items.map((item) => (
              <div key={item.id} className="flex items-center gap-4 py-2">
                <img
                  src={item.designs?.image_url}
                  className="w-16 h-16 rounded object-cover"
                />
                <div>
                  <p className="font-semibold">
                    {item.designs?.design_code}
                  </p>
                  <p className="text-sm text-gray-500">
                    Quantity: {item.quantity}
                  </p>
                </div>
              </div>
            ))}

            <p className="text-sm mt-2">
              Payment: {order.payment_status}
            </p>
          </div>
        ))
      )}
    </div>
  );
};

export default Orders;