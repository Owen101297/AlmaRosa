import { useState, useEffect, useCallback } from "react";
import { AdminLayout } from "./AdminLayout";
import {
  ShoppingCart,
  Loader2,
  CheckCircle,
  Clock,
  Package,
  Truck,
  XCircle,
  AlertCircle,
} from "lucide-react";

interface Order {
  id: number;
  userId: string;
  status: string;
  totalAmount: number;
  shippingAddress: any;
  paymentStatus: string;
  notes: string;
  createdAt: string;
}

interface OrderItem {
  id: number;
  productName: string;
  productImage: string;
  size: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

const STATUS_OPTIONS = [
  {
    value: "pending",
    label: "Pendiente",
    color: "bg-yellow-100 text-yellow-700",
  },
  {
    value: "processing",
    label: "Procesando",
    color: "bg-blue-100 text-blue-700",
  },
  {
    value: "shipped",
    label: "Enviado",
    color: "bg-purple-100 text-purple-700",
  },
  {
    value: "delivered",
    label: "Entregado",
    color: "bg-green-100 text-green-700",
  },
  { value: "cancelled", label: "Cancelado", color: "bg-red-100 text-red-700" },
];

export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [orderItems, setOrderItems] = useState<Record<number, OrderItem[]>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [updatingId, setUpdatingId] = useState<number | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/orders");
      if (!res.ok) throw new Error("Error al cargar pedidos");
      const data = await res.json();
      setOrders(
        data.sort(
          (a: Order, b: Order) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        ),
      );
    } catch (err: any) {
      console.error("Failed to fetch orders", err);
      setError(err.message || "Error al cargar pedidos");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const fetchOrderItems = async (orderId: number) => {
    try {
      const res = await fetch(`/api/orders/${orderId}/items`);
      if (res.ok) {
        const data = await res.json();
        setOrderItems((prev) => ({ ...prev, [orderId]: data }));
      }
    } catch (err) {
      console.error("Failed to fetch order items", err);
    }
  };

  const updateOrderStatus = async (orderId: number, newStatus: string) => {
    setUpdatingId(orderId);
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) {
        throw new Error("Error al actualizar pedido");
      }

      setOrders(
        orders.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o)),
      );
      setSelectedOrder(null);
      setSuccessMessage("Pedido actualizado");
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err: any) {
      console.error("Failed to update order", err);
      alert(err.message || "Error al actualizar pedido");
    } finally {
      setUpdatingId(null);
    }
  };

  const getStatusInfo = (status: string) => {
    return STATUS_OPTIONS.find((s) => s.value === status) || STATUS_OPTIONS[0];
  };

  const viewOrderDetails = (order: Order) => {
    setSelectedOrder(order);
    if (!orderItems[order.id]) {
      fetchOrderItems(order.id);
    }
  };

  const stats = {
    pending: orders.filter((o) => o.status === "pending").length,
    processing: orders.filter((o) => o.status === "processing").length,
    shipped: orders.filter((o) => o.status === "shipped").length,
    delivered: orders.filter((o) => o.status === "delivered").length,
  };

  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="font-serif text-3xl text-stone-900">Pedidos</h1>
        <p className="text-gray-500 mt-1">
          Gestiona los pedidos ({orders.length} pedidos)
        </p>
      </div>

      {successMessage && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2 text-green-600">
          <CheckCircle className="w-5 h-5" />
          {successMessage}
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 text-yellow-600 mb-2">
            <Clock className="w-5 h-5" />
            <span className="font-medium">Pendientes</span>
          </div>
          <p className="text-3xl font-bold text-stone-900">{stats.pending}</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 text-blue-600 mb-2">
            <Package className="w-5 h-5" />
            <span className="font-medium">Procesando</span>
          </div>
          <p className="text-3xl font-bold text-stone-900">
            {stats.processing}
          </p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 text-purple-600 mb-2">
            <Truck className="w-5 h-5" />
            <span className="font-medium">Enviados</span>
          </div>
          <p className="text-3xl font-bold text-stone-900">{stats.shipped}</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 text-green-600 mb-2">
            <CheckCircle className="w-5 h-5" />
            <span className="font-medium">Entregados</span>
          </div>
          <p className="text-3xl font-bold text-stone-900">{stats.delivered}</p>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 text-rose-500 animate-spin" />
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center h-64 p-6">
          <AlertCircle className="w-12 h-12 text-red-400 mb-4" />
          <p className="text-gray-500 mb-4">{error}</p>
          <button
            onClick={fetchOrders}
            className="px-4 py-2 bg-rose-500 text-white rounded-lg hover:bg-rose-600"
          >
            Reintentar
          </button>
        </div>
      ) : orders.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 bg-white rounded-xl">
          <ShoppingCart className="w-12 h-12 text-gray-300 mb-4" />
          <p className="text-gray-500">No hay pedidos</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-3">
                    Pedido
                  </th>
                  <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-3">
                    Cliente
                  </th>
                  <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-3">
                    Total
                  </th>
                  <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-3">
                    Estado
                  </th>
                  <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-3">
                    Fecha
                  </th>
                  <th className="text-right text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-3">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {orders.map((order) => {
                  const statusInfo = getStatusInfo(order.status);
                  return (
                    <tr key={order.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <span className="font-medium text-stone-900">
                          #{order.id}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {order.shippingAddress?.fullName || "Cliente"}
                      </td>
                      <td className="px-6 py-4 font-medium text-stone-900">
                        ${Number(order.totalAmount).toFixed(2)}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-2 py-1 text-xs rounded-full ${statusInfo.color}`}
                        >
                          {statusInfo.label}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {new Date(order.createdAt).toLocaleDateString("es-MX")}
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => viewOrderDetails(order)}
                          className="text-rose-500 hover:underline text-sm"
                        >
                          Ver detalles
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {selectedOrder && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-serif text-xl text-stone-900">
                  Pedido #{selectedOrder.id}
                </h2>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <XCircle className="w-5 h-5" />
                </button>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cambiar Estado
                </label>
                <div className="flex flex-wrap gap-2">
                  {STATUS_OPTIONS.map((status) => (
                    <button
                      key={status.value}
                      onClick={() =>
                        updateOrderStatus(selectedOrder.id, status.value)
                      }
                      disabled={
                        updatingId === selectedOrder.id ||
                        selectedOrder.status === status.value
                      }
                      className={`px-3 py-1.5 text-sm rounded-lg ${status.color} disabled:opacity-50 ${
                        selectedOrder.status === status.value
                          ? "ring-2 ring-offset-2 ring-current"
                          : ""
                      }`}
                    >
                      {status.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-medium text-stone-900">Productos</h3>
                {orderItems[selectedOrder.id] ? (
                  orderItems[selectedOrder.id].map((item) => (
                    <div
                      key={item.id}
                      className="flex gap-4 p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="w-16 h-16 bg-gray-200 rounded-lg overflow-hidden">
                        {item.productImage && (
                          <img
                            src={item.productImage}
                            alt={item.productName}
                            className="w-full h-full object-cover"
                          />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">{item.productName}</p>
                        <p className="text-sm text-gray-500">
                          Talla: {item.size} | Cant: {item.quantity}
                        </p>
                      </div>
                      <p className="font-medium">
                        ${item.totalPrice.toFixed(2)}
                      </p>
                    </div>
                  ))
                ) : (
                  <Loader2 className="w-6 h-6 text-rose-500 animate-spin" />
                )}
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span>${Number(selectedOrder.totalAmount).toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
