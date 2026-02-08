import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { useAuthStore } from "../store/authStore";
import { useNavigate } from "react-router-dom";
import { Package, Truck, CheckCircle } from "lucide-react";
import { ORDER_STATUS_LABELS, type OrderStatus } from "../utils/orderStatus";

interface OrderItem {
  id: string;
  quantity: number;
  design_code?: string | null;
}

interface Order {
  id: string;
  status: OrderStatus;
  payment_status: "pending" | "paid" | "failed";
  created_at: string;
  updated_at?: string | null;
  accepted_at?: string | null;
  delivered_at?: string | null;
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

  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel("orders-status-updates")
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "orders" },
        (payload) => {
          const updated = payload.new as {
            id: string;
            status?: string;
            user_id?: string;
            updated_at?: string;
            accepted_at?: string;
            delivered_at?: string;
            payment_status?: "pending" | "paid" | "failed";
          };
          if (!updated?.id) return;
          if (updated.user_id && updated.user_id !== user.id) return;
          setOrders((prev) => {
            const exists = prev.some((o) => o.id === updated.id);
            if (!exists) {
              fetchOrders();
              return prev;
            }
            return prev.map((o) =>
              o.id === updated.id
                ? {
                    ...o,
                    status: (updated.status as OrderStatus) ?? o.status,
                    updated_at: updated.updated_at ?? o.updated_at,
                    accepted_at: updated.accepted_at ?? o.accepted_at,
                    delivered_at: updated.delivered_at ?? o.delivered_at,
                    payment_status: updated.payment_status ?? o.payment_status,
                  }
                : o
            );
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
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
        updated_at,
        accepted_at,
        delivered_at,
        order_items (
          id,
          quantity,
          design_code
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
        updated_at: o.updated_at ?? null,
        accepted_at: o.accepted_at ?? null,
        delivered_at: o.delivered_at ?? null,
        order_items: (o.order_items || []).map((it: any) => ({
          id: it.id,
          quantity: it.quantity,
          design_code: it.design_code ?? null,
        })),
      })) as Order[];
      setOrders(normalized);
    }

    setLoading(false);
  };

  const statusIcon = (status: OrderStatus) => {
    if (status === "delivered") return <CheckCircle className="text-green-500" />;
    if (status === "shipped") return <Truck className="text-orange-500" />;
    return <Package className="text-purple-500" />;
  };

  if (loading) {
    return <div className="text-center py-20">Loading orders...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">My Orders</h1>
        <button
          onClick={fetchOrders}
          className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 disabled:opacity-50"
          disabled={loading}
        >
          Refresh
        </button>
      </div>

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
                  Ordered: {new Date(order.created_at).toLocaleString()}
                </p>
                {order.accepted_at && (
                  <p className="text-sm text-gray-500">
                    Accepted: {new Date(order.accepted_at).toLocaleString()}
                  </p>
                )}
                {order.delivered_at && (
                  <p className="text-sm text-gray-500">
                    Delivered: {new Date(order.delivered_at).toLocaleString()}
                  </p>
                )}
                {order.updated_at && (
                  <p className="text-sm text-gray-500">
                    Updated: {new Date(order.updated_at).toLocaleString()}
                  </p>
                )}
              </div>
              <div className="flex items-center gap-2">
                {statusIcon(order.status)}
                <span>{ORDER_STATUS_LABELS[order.status] ?? order.status}</span>
              </div>
            </div>

            {order.order_items.map((item) => (
              <div key={item.id} className="flex items-center gap-4 py-2">
                <div>
                  <p className="font-semibold">
                    {item.design_code ?? "Unknown"}
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
