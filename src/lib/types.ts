export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}

export interface Paginated<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export type UserRole = "user" | "admin";

export interface AdminUser {
  _id: string;
  fullName: string;
  username?: string;
  email: string;
  phoneNumber: string;
  address?: string;
  role: UserRole;
  isActive: boolean;
  lastLogin?: string;
  createdAt: string;
}

export interface Book {
  _id: string;
  title: string;
  author: string;
  price: number;
  originalPrice?: number | null;
  discountPercent: number;
  coverImage?: string;
  description?: string;
  genre: string[];
  isbn?: string;
  stock: number;
  isVerified: boolean;
  isFeatured: boolean;
  rating: number;
  totalReviews: number;
  createdAt: string;
}

export type OrderStatus =
  | "placed"
  | "confirmed"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled";

export type PaymentStatus = "pending" | "paid" | "failed" | "refunded";

export interface OrderItem {
  book: string;
  title: string;
  author: string;
  coverImage?: string;
  quantity: number;
  price: number;
}

export interface OrderStatusEntry {
  status: string;
  note?: string;
  changedAt: string;
}

export interface Order {
  _id: string;
  orderId: string;
  user: { _id: string; fullName: string; email: string } | string;
  items: OrderItem[];
  deliveryAddress: {
    fullName: string;
    phone: string;
    street: string;
    city: string;
    province?: string;
  };
  deliveryOption: "standard" | "express";
  deliveryCharge: number;
  estimatedDelivery?: string;
  paymentMethod: string;
  paymentStatus: PaymentStatus;
  subtotal: number;
  total: number;
  status: OrderStatus;
  statusHistory: OrderStatusEntry[];
  cancelledAt?: string | null;
  cancelReason?: string | null;
  createdAt: string;
}

export type SupportStatus = "open" | "in_review" | "resolved" | "closed";

export interface SupportRequest {
  _id: string;
  user: { _id: string; fullName: string; email: string } | string;
  order?: string | null;
  issueType: string;
  description: string;
  email?: string;
  phoneNumber?: string;
  evidenceUrl?: string | null;
  status: SupportStatus;
  adminNote?: string | null;
  resolvedAt?: string | null;
  createdAt: string;
}

export interface DashboardStats {
  totalBooks: number;
  totalUsers: number;
  totalOrders: number;
  totalRevenue: number;
  ordersByStatus: Record<OrderStatus, number>;
  lowStockBooks: Book[];
  recentOrders: Order[];
  recentSupportRequests: SupportRequest[];
}
