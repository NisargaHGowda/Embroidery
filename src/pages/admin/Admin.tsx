import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import { formatPrice } from "../../utils/formatPrice";
import { useAuthStore } from "../../store/authStore";
import { useNavigate } from "react-router-dom";
import { ORDER_STATUS_LABELS, type OrderStatus } from "../../utils/orderStatus";

// Define interfaces for Designs & Orders
type Design = Record<string, any>;

interface OrderItem {
  id: string;
  quantity: number;
  design_code?: string | null;
  designs: {
    design_code: string;
    image_url?: string | null;
  } | null;
}

interface Order {
  id: string;
  user_id: string;
  total_amount: number;
  status: OrderStatus;
  payment_status: "pending" | "paid" | "failed";
  shipping_address?: string | null;
  created_at: string;
  updated_at?: string | null;
  accepted_at?: string | null;
  delivered_at?: string | null;
  order_items: OrderItem[];
}

const ORDER_STATUS_OPTIONS: OrderStatus[] = [
  "placed",
  "accepted",
  "pending",
  "confirmed",
  "in_progress",
  "shipped",
  "delivered",
  "cancelled",
];

const Admin = () => {
  const [designs, setDesigns] = useState<Design[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const { user, loading: authLoading } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (authLoading) return;
    if (!user || !user.is_admin) {
      navigate("/login", {
        replace: true,
        state: {
          message: "Admin access required",
          redirectTo: "/admin",
        },
      });
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (authLoading) return;
    if (!user || !user.is_admin) return;
    fetchData();
  }, [user, authLoading]);

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
      const { data, error } = await supabase
        .from("orders")
        .select(
          `
          id,
          user_id,
          total_amount,
          status,
          payment_status,
          shipping_address,
          created_at,
          updated_at,
          accepted_at,
          delivered_at,
          order_items (
            id,
            quantity,
            design_code,
            designs (
                design_code,
                image_url
              )
            )
        `
        )
        .order("created_at", { ascending: false });
      if (error) throw error;
      const normalized = (data || []).map((o: any) => ({
        id: o.id,
        user_id: o.user_id,
        total_amount: o.total_amount,
        status: o.status,
        payment_status: o.payment_status ?? "pending",
        shipping_address: o.shipping_address ?? null,
        created_at: o.created_at,
        updated_at: o.updated_at ?? null,
        accepted_at: o.accepted_at ?? null,
        delivered_at: o.delivered_at ?? null,
        order_items: (o.order_items || []).map((it: any) => ({
          id: it.id,
          quantity: it.quantity,
          design_code: it.design_code ?? null,
          designs: Array.isArray(it.designs) ? (it.designs[0] ?? null) : (it.designs ?? null),
        })),
      })) as Order[];
      setOrders(normalized);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  const updateOrderStatus = async (orderId: string, status: OrderStatus) => {
    try {
    const updates: Record<string, string> = {
      status,
      updated_at: new Date().toISOString(),
    };

    if (status === "accepted") {
      updates.accepted_at = new Date().toISOString();
    }
    if (status === "delivered") {
      updates.delivered_at = new Date().toISOString();
    }

    const { data, error } = await supabase
      .from("orders")
      .update(updates)
      .eq("id", orderId)
      .select()
      .single();
      if (error) throw error;
      setOrders((prev) =>
        prev.map((o) =>
          o.id === orderId
            ? {
                ...o,
                status: data.status,
                updated_at: data.updated_at ?? o.updated_at,
                accepted_at: data.accepted_at ?? o.accepted_at,
                delivered_at: data.delivered_at ?? o.delivered_at,
              }
            : o
        )
      );

      if (status === "delivered") {
        const { data } = await supabase.auth.getSession();
        const accessToken = data.session?.access_token;
        if (!accessToken) return;

        const apiBase =
          import.meta.env.VITE_API_BASE_URL ?? "http://localhost:5000";

        await fetch(`${apiBase}/notify-order-delivered`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({ orderId }),
        });
      }
    } catch (error) {
      console.error("Error updating order status:", error);
      alert("Failed to update order status. Check console for details.");
    }
  };

  const updatePaymentStatus = async (
    orderId: string,
    payment_status: Order["payment_status"]
  ) => {
    try {
      const updates: Record<string, string> = {
        payment_status,
        updated_at: new Date().toISOString(),
      };

      const { data, error } = await supabase
        .from("orders")
        .update(updates)
        .eq("id", orderId)
        .select()
        .single();
      if (error) throw error;
      setOrders((prev) =>
        prev.map((o) =>
          o.id === orderId
            ? {
                ...o,
                payment_status: data.payment_status ?? o.payment_status,
                updated_at: data.updated_at ?? o.updated_at,
              }
            : o
        )
      );
    } catch (error) {
      console.error("Error updating payment status:", error);
      alert("Failed to update payment status. Check console for details.");
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
          <div className="w-full overflow-x-auto">
          <table className="w-full border min-w-[900px] text-sm">
            <thead>
              <tr className="bg-gray-200">
                <th className="border p-2">ID</th>
                <th className="border p-2">Design Code</th>
                <th className="border p-2">Price Range</th>
                <th className="border p-2">Image</th>
              </tr>
            </thead>
            <tbody>
              {designs.map((design) => (
                <tr key={design.id} className="border">
                  <td className="p-2">{design.id}</td>
                  <td className="p-2">
                    {design.design_code ??
                      design.name ??
                      design.title ??
                      design.code ??
                      "Unknown"}
                  </td>
                  <td className="p-2">
                    {design.min_price != null && design.max_price != null
                      ? `${formatPrice(design.min_price)} - ${formatPrice(design.max_price)}`
                      : design.price != null
                        ? formatPrice(design.price)
                        : "Not set"}
                  </td>
                  <td className="p-2">
                    {design.image_url ? (
                      <a
                        href={design.image_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500"
                      >
                        View Image
                      </a>
                    ) : (
                      <span className="text-gray-400">No image</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        )}
      </section>

      {/* Orders Section */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Orders</h2>
        {orders.length === 0 ? (
          <p className="text-gray-600">No orders placed yet.</p>
        ) : (
          <div className="w-full overflow-x-auto">
          <table className="w-full border min-w-[1400px] text-sm">
            <thead>
              <tr className="bg-gray-200">
                <th className="border p-2 whitespace-nowrap">ID</th>
                <th className="border p-2 whitespace-nowrap">User ID</th>
                <th className="border p-2 whitespace-nowrap">Total</th>
                <th className="border p-2 whitespace-nowrap">Payment</th>
                <th className="border p-2 whitespace-nowrap">Status</th>
                <th className="border p-2">Address</th>
                <th className="border p-2 whitespace-nowrap">Ordered</th>
                <th className="border p-2 whitespace-nowrap">Accepted</th>
                <th className="border p-2 whitespace-nowrap">Delivered</th>
                <th className="border p-2 whitespace-nowrap">Updated</th>
                <th className="border p-2">Design Code</th>
                <th className="border p-2">Items</th>
                <th className="border p-2 whitespace-nowrap">Update</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id} className="border">
                  <td className="p-2 whitespace-nowrap">{order.id}</td>
                  <td className="p-2 whitespace-nowrap">{order.user_id}</td>
                  <td className="p-2 whitespace-nowrap">{formatPrice(order.total_amount)}</td>
                  <td className="p-2 whitespace-nowrap">
                    <select
                      className="border rounded px-2 py-1 min-w-[110px]"
                      value={order.payment_status}
                      onChange={(e) =>
                        updatePaymentStatus(
                          order.id,
                          e.target.value as Order["payment_status"]
                        )
                      }
                    >
                      <option value="pending">Pending</option>
                      <option value="paid">Paid</option>
                      <option value="failed">Failed</option>
                    </select>
                  </td>
                  <td className="p-2 whitespace-nowrap">
                    {ORDER_STATUS_LABELS[order.status] ?? order.status}
                  </td>
                  <td className="p-2 max-w-[220px]">
                    <div className="line-clamp-3">{order.shipping_address ?? "—"}</div>
                  </td>
                  <td className="p-2 whitespace-nowrap">
                    {order.created_at
                      ? new Date(order.created_at).toLocaleString()
                      : "—"}
                  </td>
                  <td className="p-2 whitespace-nowrap">
                    {order.accepted_at
                      ? new Date(order.accepted_at).toLocaleString()
                      : "—"}
                  </td>
                  <td className="p-2 whitespace-nowrap">
                    {order.delivered_at
                      ? new Date(order.delivered_at).toLocaleString()
                      : "—"}
                  </td>
                  <td className="p-2 whitespace-nowrap">
                    {order.updated_at
                      ? new Date(order.updated_at).toLocaleString()
                      : "—"}
                  </td>
                  <td className="p-2">
                    {order.order_items.length === 0
                      ? "—"
                      : Array.from(
                          new Set(
                            order.order_items
                              .map((it) => it.design_code ?? it.designs?.design_code)
                              .filter(Boolean)
                          )
                        ).join(", ")}
                  </td>
                  <td className="p-2 min-w-[220px]">
                    {order.order_items.length === 0 ? (
                      <span className="text-gray-400">No items</span>
                    ) : (
                      order.order_items.map((item) => (
                        <div key={item.id} className="flex items-center gap-2 py-1">
                          {item.designs?.image_url ? (
                            <img
                              src={item.designs.image_url}
                              alt={item.designs.design_code}
                              className="w-8 h-8 rounded object-cover"
                            />
                          ) : null}
                          <span>
                            {item.designs?.design_code ?? "Unknown"} × {item.quantity}
                          </span>
                        </div>
                      ))
                    )}
                  </td>
                  <td className="p-2 whitespace-nowrap">
                    <select
                      className="border rounded px-2 py-1 min-w-[130px]"
                      value={order.status}
                      onChange={(e) =>
                        updateOrderStatus(order.id, e.target.value as OrderStatus)
                      }
                    >
                      {ORDER_STATUS_OPTIONS.map((status) => (
                        <option key={status} value={status}>
                          {ORDER_STATUS_LABELS[status] ?? status}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        )}
      </section>
    </div>
  );
};

export default Admin;
