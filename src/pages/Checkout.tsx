import { useCartStore } from "../store/cartStore";
import { supabase } from "../lib/supabase";
import { useAuthStore } from "../store/authStore";
import { useState } from "react";

const Checkout = () => {
  const { cart, clearCart } = useCartStore();
  const { user } = useAuthStore();
  const [address, setAddress] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const placeOrder = async () => {
    setError("");

    if (!user) {
      setError("Please login to place order");
      return;
    }

    if (!address.trim()) {
      setError("Shipping address required");
      return;
    }

    if (cart.length === 0) {
      setError("Your cart is empty");
      return;
    }

    setLoading(true);

    // 1️⃣ CREATE ORDER
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
        user_id: user.id,
        shipping_address: address,
        payment_method: "COD",
        payment_status: "pending",
        status: "pending",
        total_amount: 0, // intentionally 0
      })
      .select()
      .single();

    if (orderError) {
      console.error("Order error:", orderError);
      setError(orderError.message);
      setLoading(false);
      return;
    }

    // 2️⃣ CREATE ORDER ITEMS
    const items = cart.map((item) => ({
      order_id: order.id,
      design_code: item.name,
      quantity: item.quantity,
      price_at_time: 0,
    }));

    const { error: itemsError } = await supabase
      .from("order_items")
      .insert(items);

    if (itemsError) {
      console.error("Order items error:", itemsError);
      setError(itemsError.message);
      setLoading(false);
      return;
    }

    clearCart();
    setLoading(false);
    alert("✅ Order placed successfully!");
  };

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4 text-center">Checkout</h1>

      {error && (
        <div className="bg-red-100 text-red-700 p-3 mb-4 rounded">
          {error}
        </div>
      )}

      <h2 className="font-semibold mb-2">Order Summary</h2>

      {cart.map((item) => (
        <p key={item.id}>
          {item.name} (x{item.quantity})
        </p>
      ))}

      <textarea
        placeholder="Shipping Address"
        className="w-full border p-3 rounded mt-4"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
      />

      <button
        disabled={loading}
        onClick={placeOrder}
        className="w-full mt-4 bg-purple-600 text-white py-3 rounded hover:bg-purple-700 disabled:opacity-50"
      >
        {loading ? "Placing order..." : "Place Order (Cash on Delivery)"}
      </button>
    </div>
  );
};

export default Checkout;