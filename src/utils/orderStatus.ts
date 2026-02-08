// src/utils/orderStatus.ts

export type OrderStatus =
  | "placed"
  | "accepted"
  | "pending"
  | "confirmed"
  | "in_progress"
  | "shipped"
  | "delivered"
  | "cancelled";

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  placed: "Order Placed",
  accepted: "Accepted",
  pending: "Pending",
  confirmed: "Confirmed",
  in_progress: "In Progress",
  shipped: "Shipped",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

export const ORDER_STATUS_COLORS: Record<OrderStatus, string> = {
  placed: "text-purple-600",
  accepted: "text-blue-600",
  pending: "text-yellow-600",
  confirmed: "text-blue-600",
  in_progress: "text-purple-600",
  shipped: "text-orange-600",
  delivered: "text-green-600",
  cancelled: "text-red-600",
};
