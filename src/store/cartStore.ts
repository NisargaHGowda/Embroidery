import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface CartItem {
  id: string;
  name: string;
  image_url: string;
  quantity: number;
}

interface CartState {
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      cart: [],

      addToCart: (item) =>
        set((state) => {
          const existing = state.cart.find((c) => c.id === item.id);

          if (existing) {
            return {
              cart: state.cart.map((c) =>
                c.id === item.id
                  ? { ...c, quantity: c.quantity + 1 }
                  : c
              ),
            };
          }

          return { cart: [...state.cart, item] };
        }),

      removeFromCart: (id) =>
        set((state) => ({
          cart: state.cart.filter((item) => item.id !== id),
        })),

      updateQuantity: (id, quantity) =>
        set((state) => ({
          cart: state.cart.map((item) =>
            item.id === id ? { ...item, quantity } : item
          ),
        })),

      clearCart: () => set({ cart: [] }),
    }),
    {
      name: "embroidery-cart", // 🔑 localStorage key
    }
  )
);

// import { create } from "zustand";
// import { persist } from "zustand/middleware";

// interface CartItem {
//   id: string;
//   name: string;
//   price: number; // keep 0 if price not decided yet
//   image_url: string;
//   quantity: number;
// }

// interface CartState {
//   cart: CartItem[];
//   addToCart: (item: CartItem) => void;
//   removeFromCart: (id: string) => void;
//   updateQuantity: (id: string, quantity: number) => void;
//   clearCart: () => void;
// }

// export const useCartStore = create<CartState>()(
//   persist(
//     (set) => ({
//       cart: [],

//       addToCart: (item) =>
//         set((state) => {
//           const existingItem = state.cart.find(
//             (cartItem) => cartItem.id === item.id
//           );

//           if (existingItem) {
//             return {
//               cart: state.cart.map((cartItem) =>
//                 cartItem.id === item.id
//                   ? { ...cartItem, quantity: cartItem.quantity + 1 }
//                   : cartItem
//               ),
//             };
//           }

//           return {
//             cart: [...state.cart, { ...item, quantity: 1 }],
//           };
//         }),

//       removeFromCart: (id) =>
//         set((state) => ({
//           cart: state.cart.filter((item) => item.id !== id),
//         })),

//       updateQuantity: (id, quantity) =>
//         set((state) => ({
//           cart: state.cart.map((item) =>
//             item.id === id
//               ? { ...item, quantity: Math.max(1, quantity) }
//               : item
//           ),
//         })),

//       clearCart: () => set({ cart: [] }),
//     }),
//     {
//       name: "embroidery-cart", // 🔑 key in localStorage
//     }
//   )
// );


