import { useState, useEffect, useCallback } from "react";
import { Link } from "wouter";
import { AdminLayout } from "./AdminLayout";
import {
  Package,
  Tag,
  ShoppingCart,
  ArrowRight,
  AlertCircle,
  CheckCircle,
  Clock,
  TrendingUp,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  Eye,
  Edit,
  Star,
  RefreshCw,
  Loader2,
  MessageSquare,
} from "lucide-react";

interface DashboardStats {
  totalProducts: number;
  totalCategories: number;
  onSaleCount: number;
  newArrivals: number;
  lowStockCount: number;
}

interface OrderStats {
  total: number;
  pending: number;
  processing: number;
  shipped: number;
  delivered: number;
  cancelled: number;
  revenue: number;
}

interface TestimonialStats {
  total: number;
  pending: number;
  active: number;
}

interface RecentOrder {
  id: number;
  status: string;
  totalAmount: number;
  shippingAddress: any;
  createdAt: string;
}

interface TopProduct {
  id: number;
  name: string;
  image: string;
  salesCount: number;
  revenue: number;
}

interface TrendData {
  date: string;
  orders: number;
  revenue: number;
}

const LOW_STOCK_THRESHOLD = 5;

const STATUS_CONFIG: Record<
  string,
  { label: string; color: string; icon: any }
> = {
  pending: {
    label: "Pendiente",
    color: "bg-yellow-100 text-yellow-700",
    icon: Clock,
  },
  processing: {
    label: "Procesando",
    color: "bg-blue-100 text-blue-700",
    icon: RefreshCw,
  },
  shipped: {
    label: "Enviado",
    color: "bg-purple-100 text-purple-700",
    icon: ShoppingCart,
  },
  delivered: {
    label: "Entregado",
    color: "bg-green-100 text-green-700",
    icon: CheckCircle,
  },
  cancelled: {
    label: "Cancelado",
    color: "bg-red-100 text-red-700",
    icon: AlertCircle,
  },
};

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [orderStats, setOrderStats] = useState<OrderStats | null>(null);
  const [testimonialStats, setTestimonialStats] =
    useState<TestimonialStats | null>(null);
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);
  const [topProducts, setTopProducts] = useState<TopProduct[]>([]);
  const [trendData, setTrendData] = useState<TrendData[]>([]);
  const [lowStockProducts, setLowStockProducts] = useState<TopProduct[]>([]);

  const fetchAllStats = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [productsRes, ordersRes, testimonialsRes] = await Promise.all([
        fetch("/api/products/summary").catch(() => ({
          json: () => null,
          ok: false,
        })),
        fetch("/api/orders").catch(() => ({ json: () => null, ok: false })),
        fetch("/api/testimonials").catch(() => ({
          json: () => null,
          ok: false,
        })),
      ]);

      // Products stats
      if (productsRes.ok) {
        const data = await productsRes.json();
        setStats({
          totalProducts: data.totalProducts || 0,
          totalCategories: data.totalCategories || 0,
          onSaleCount: data.onSaleCount || 0,
          newArrivals: 0,
          lowStockCount: 0,
        });
      }

      // Orders stats
      if (ordersRes.ok) {
        const data = await ordersRes.json();
        const orders = Array.isArray(data) ? data : [];

        const delivered = orders.filter((o: any) => o.status === "delivered");
        const revenue = delivered.reduce(
          (sum: number, o: any) => sum + Number(o.totalAmount || 0),
          0,
        );

        setOrderStats({
          total: orders.length,
          pending: orders.filter((o: any) => o.status === "pending").length,
          processing: orders.filter((o: any) => o.status === "processing")
            .length,
          shipped: orders.filter((o: any) => o.status === "shipped").length,
          delivered: delivered.length,
          cancelled: orders.filter((o: any) => o.status === "cancelled").length,
          revenue: revenue,
        });

        setRecentOrders(orders.slice(0, 5));
      }

      // Testimonials stats
      if (testimonialsRes.ok) {
        const data = await testimonialsRes.json();
        const testimonials = Array.isArray(data) ? data : [];
        setTestimonialStats({
          total: testimonials.length,
          pending: testimonials.filter((t: any) => !t.isActive).length,
          active: testimonials.filter((t: any) => t.isActive).length,
        });
      }

      // Fetch low stock products
      try {
        const productsRes = await fetch("/api/products");
        if (productsRes.ok) {
          const products = await productsRes.json();
          const lowStock = products
            .filter((p: any) => p.stockQuantity <= LOW_STOCK_THRESHOLD)
            .slice(0, 5);
          setLowStockProducts(
            lowStock.map((p: any) => ({
              id: p.id,
              name: p.name,
              image: p.images?.[0] || "",
              salesCount: 0,
              revenue: 0,
            })),
          );
        }
      } catch (err) {
        console.error("Failed to fetch low stock", err);
      }

      setLastUpdate(new Date());
    } catch (err) {
      console.error("Failed to fetch stats", err);
      setError("Error al cargar estadísticas");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAllStats();
  }, [fetchAllStats]);

  const statCards = [
    {
      label: "Productos",
      value: stats?.totalProducts || 0,
      icon: Package,
      color: "bg-blue-500",
      href: "/admin/productos",
      subtitle: `${stats?.onSaleCount || 0} en oferta`,
    },
    {
      label: "Categorías",
      value: stats?.totalCategories || 0,
      icon: Tag,
      color: "bg-green-500",
      href: "/admin/categorias",
      subtitle: "categorías",
    },
    {
      label: "Pedidos",
      value: orderStats?.total || 0,
      icon: ShoppingCart,
      color: "bg-purple-500",
      href: "/admin/pedidos",
      subtitle: `${orderStats?.pending || 0} pendientes`,
    },
    {
      label: "Ingresos",
      value: `$${(orderStats?.revenue || 0).toLocaleString("es-MX", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      icon: DollarSign,
      color: "bg-emerald-500",
      href: "/admin/pedidos",
      subtitle: "total ejecutado",
    },
  ];

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("es-MX", {
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <AdminLayout>
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="font-serif text-3xl text-stone-900">
              Panel de Administración
            </h1>
            <p className="text-gray-500 mt-1">Bienvenida a Alma Rosa</p>
          </div>
          <div className="flex items-center gap-3">
            {lastUpdate && (
              <span className="text-xs text-gray-400">
                Actualizado: {lastUpdate.toLocaleTimeString("es-MX")}
              </span>
            )}
            <button
              onClick={fetchAllStats}
              disabled={loading}
              className="flex items-center gap-2 px-3 py-1.5 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              <RefreshCw
                className={`w-4 h-4 ${loading ? "animate-spin" : ""}`}
              />
              Actualizar
            </button>
          </div>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-600">
          <AlertCircle className="w-5 h-5" />
          {error}
          <button onClick={fetchAllStats} className="ml-2 underline">
            Reintentar
          </button>
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 text-rose-500 animate-spin" />
        </div>
      ) : (
        <>
          {/* Main Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {statCards.map((stat) => {
              const Icon = stat.icon;
              return (
                <Link
                  key={stat.href}
                  href={stat.href}
                  className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-500 text-sm">{stat.label}</p>
                      <p className="text-2xl font-bold text-stone-900 mt-1">
                        {stat.value}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        {stat.subtitle}
                      </p>
                    </div>
                    <div
                      className={`w-12 h-12 rounded-full ${stat.color} flex items-center justify-center`}
                    >
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>

          {/* Low Stock Alert */}
          {lowStockProducts.length > 0 && (
            <div className="mb-8">
              <div className="bg-red-50 border border-red-200 rounded-xl p-6">
                <div className="flex items-center gap-2 mb-4">
                  <AlertCircle className="w-5 h-5 text-red-600" />
                  <h2 className="font-serif text-lg text-red-700">
                    Stock Bajo - RequiereAtención
                  </h2>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  {lowStockProducts.map((product) => (
                    <Link
                      key={product.id}
                      href={`/admin/productos/${product.id}`}
                      className="bg-white rounded-lg p-3 hover:shadow-md transition-shadow"
                    >
                      <div className="w-full aspect-square bg-gray-100 rounded-lg mb-2 overflow-hidden">
                        {product.image ? (
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Package className="w-6 h-6 text-gray-400" />
                          </div>
                        )}
                      </div>
                      <p className="text-sm font-medium text-stone-900 truncate">
                        {product.name}
                      </p>
                      <p className="text-xs text-red-600 font-medium">
                        Stock bajo
                      </p>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Orders & Stats */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Order Status Distribution */}
            <div className="lg:col-span-2 bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-serif text-lg text-stone-900">
                  Estado de Pedidos
                </h2>
                <Link
                  href="/admin/pedidos"
                  className="text-sm text-rose-500 hover:underline"
                >
                  Ver todos
                </Link>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {Object.entries(STATUS_CONFIG).map(([key, config]) => {
                  const count =
                    key === "pending"
                      ? orderStats?.pending
                      : key === "processing"
                        ? orderStats?.processing
                        : key === "shipped"
                          ? orderStats?.shipped
                          : key === "delivered"
                            ? orderStats?.delivered
                            : key === "cancelled"
                              ? orderStats?.cancelled
                              : 0;
                  const Icon = config.icon;
                  return (
                    <div
                      key={key}
                      className={`text-center p-4 rounded-lg ${config.color}`}
                    >
                      <Icon className="w-6 h-6 mx-auto mb-2" />
                      <p className="text-2xl font-bold">{count}</p>
                      <p className="text-xs">{config.label}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Testimonials Summary */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-serif text-lg text-stone-900">
                  Testimonios
                </h2>
                <Link
                  href="/admin/testimonios"
                  className="text-sm text-rose-500 hover:underline"
                >
                  Gestionar
                </Link>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span className="text-sm text-green-700">Publicados</span>
                  </div>
                  <span className="font-bold text-green-700">
                    {testimonialStats?.active || 0}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-yellow-600" />
                    <span className="text-sm text-yellow-700">Pendientes</span>
                  </div>
                  <span className="font-bold text-yellow-700">
                    {testimonialStats?.pending || 0}
                  </span>
                </div>
                <Link
                  href="/admin/testimonios"
                  className="flex items-center justify-center gap-2 w-full p-3 bg-rose-50 text-rose-700 rounded-lg hover:bg-rose-100 transition-colors"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span className="text-sm font-medium">
                    Gestionar Testimonios
                  </span>
                </Link>
              </div>
            </div>
          </div>

          {/* Recent Orders */}
          {recentOrders.length > 0 && (
            <div className="mb-8">
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="flex items-center justify-between p-6 border-b border-gray-100">
                  <h2 className="font-serif text-lg text-stone-900">
                    Últimos Pedidos
                  </h2>
                  <Link
                    href="/admin/pedidos"
                    className="text-sm text-rose-500 hover:underline"
                  >
                    Ver todos
                  </Link>
                </div>
                <div className="divide-y divide-gray-100">
                  {recentOrders.map((order) => {
                    const statusInfo =
                      STATUS_CONFIG[order.status] || STATUS_CONFIG.pending;
                    const StatusIcon = statusInfo.icon;
                    return (
                      <div
                        key={order.id}
                        className="flex items-center justify-between p-4 hover:bg-gray-50"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-sm font-bold text-gray-600">
                            #{order.id}
                          </div>
                          <div>
                            <p className="font-medium text-stone-900">
                              {order.shippingAddress?.fullName || "Cliente"}
                            </p>
                            <p className="text-xs text-gray-500">
                              {formatDate(order.createdAt)}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <span
                            className={`px-3 py-1 text-xs rounded-full ${statusInfo.color}`}
                          >
                            <StatusIcon className="w-3 h-3 inline mr-1" />
                            {statusInfo.label}
                          </span>
                          <span className="font-bold text-stone-900">
                            ${Number(order.totalAmount).toFixed(2)}
                          </span>
                          <Link
                            href={`/admin/pedidos`}
                            className="p-2 text-gray-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg"
                          >
                            <Eye className="w-4 h-4" />
                          </Link>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Testimonials Preview */}
          {testimonialStats && testimonialStats.pending > 0 && (
            <div className="mb-8">
              <div className="bg-gradient-to-r from-amber-50 to-yellow-50 border border-yellow-200 rounded-xl p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center">
                      <Star className="w-6 h-6 text-yellow-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-stone-900">
                        Tienes {testimonialStats.pending} testimonio(s)
                        pendiente(s)
                      </h3>
                      <p className="text-sm text-gray-600">
                        Revisa y publica los testimonios de tus clientas
                      </p>
                    </div>
                  </div>
                  <Link
                    href="/admin/testimonios"
                    className="flex items-center gap-2 px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors"
                  >
                    Revisar Testimonios
                  </Link>
                </div>
              </div>
            </div>
          )}

          {/* Quick Actions */}
          <div>
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h2 className="font-serif text-lg text-stone-900 mb-4">
                Acciones Rápidas
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Link
                  href="/admin/productos/nuevo"
                  className="flex flex-col items-center gap-2 p-4 bg-rose-50 rounded-lg text-rose-600 hover:bg-rose-100 transition-colors"
                >
                  <Package className="w-6 h-6" />
                  <span className="text-sm font-medium text-center">
                    Nuevo Producto
                  </span>
                </Link>
                <Link
                  href="/admin/categorias"
                  className="flex flex-col items-center gap-2 p-4 bg-blue-50 rounded-lg text-blue-600 hover:bg-blue-100 transition-colors"
                >
                  <Tag className="w-6 h-6" />
                  <span className="text-sm font-medium text-center">
                    Categorías
                  </span>
                </Link>
                <Link
                  href="/admin/pedidos"
                  className="flex flex-col items-center gap-2 p-4 bg-green-50 rounded-lg text-green-600 hover:bg-green-100 transition-colors"
                >
                  <ShoppingCart className="w-6 h-6" />
                  <span className="text-sm font-medium text-center">
                    Ver Pedidos
                  </span>
                </Link>
                <Link
                  href="/"
                  target="_blank"
                  className="flex flex-col items-center gap-2 p-4 bg-gray-50 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
                >
                  <ArrowRight className="w-6 h-6" />
                  <span className="text-sm font-medium text-center">
                    Ver Tienda
                  </span>
                </Link>
              </div>
            </div>
          </div>

          {/* Empty States */}
          {orderStats?.total === 0 && (
            <div className="mt-8 bg-gradient-to-br from-rose-50 to-pink-50 rounded-xl p-8 text-center">
              <ShoppingCart className="w-16 h-16 text-rose-300 mx-auto mb-4" />
              <h3 className="font-serif text-xl text-stone-900 mb-2">
                Aún no hay pedidos
              </h3>
              <p className="text-gray-600 mb-4">
                Comparte tu tienda para empezar a recibir pedidos
              </p>
              <Link
                href="/"
                target="_blank"
                className="inline-flex items-center gap-2 px-4 py-2 bg-rose-500 text-white rounded-lg hover:bg-rose-600 transition-colors"
              >
                Ir a la tienda
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          )}
        </>
      )}
    </AdminLayout>
  );
}
