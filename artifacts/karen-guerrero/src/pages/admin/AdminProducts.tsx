import { useState, useEffect, useCallback, useMemo } from "react";
import { Link, useLocation } from "wouter";
import { useRoute } from "wouter";
import { AdminLayout } from "./AdminLayout";
import {
  Package,
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  AlertCircle,
  CheckCircle,
  Loader2,
  ChevronLeft,
  ChevronRight,
  Filter,
  X,
  ArrowUpDown,
} from "lucide-react";

interface Category {
  id: number;
  name: string;
  slug: string;
}

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  salePrice: number | null;
  categoryId: number;
  categoryName: string;
  images: string[];
  sizes: string[];
  featured: boolean;
  isNew: boolean;
  stockQuantity?: number;
}

interface PaginatedResponse {
  data: Product[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

type FilterStatus = "all" | "featured" | "new" | "normal";
type SortOption = "createdAt" | "name" | "price";

const defaultCategories: Category[] = [
  { id: 1, name: "Conjuntos", slug: "conjuntos" },
  { id: 2, name: "Brasieres", slug: "brasieres" },
  { id: 3, name: "Pantaletas", slug: "pantaletas" },
  { id: 4, name: "Bodysuits", slug: "bodysuits" },
  { id: 5, name: "Accessorios", slug: "accesorios" },
];

export default function AdminProducts() {
  const [_match, params] = useRoute("/admin/productos/:id");
  const [location, setLocation] = useLocation();

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>(defaultCategories);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<number | "all">("all");
  const [statusFilter, setStatusFilter] = useState<FilterStatus>("all");
  const [sortBy, setSortBy] = useState<SortOption>("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const [showFilters, setShowFilters] = useState(false);

  const fetchCategories = useCallback(async () => {
    try {
      const res = await fetch("/api/categories");
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) {
          setCategories(data);
        }
      }
    } catch (err) {
      console.error("Failed to fetch categories", err);
    }
  }, []);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);

    const queryParams = new URLSearchParams();
    queryParams.set("page", String(page));
    queryParams.set("limit", String(limit));
    queryParams.set("sortBy", sortBy);
    queryParams.set("sortOrder", sortOrder);

    if (search) {
      queryParams.set("search", search);
    }
    if (categoryFilter !== "all") {
      queryParams.set("categoryId", String(categoryFilter));
    }
    if (statusFilter === "featured") {
      queryParams.set("featured", "true");
    } else if (statusFilter === "new") {
      queryParams.set("isNew", "true");
    }

    try {
      const res = await fetch(`/api/products?${queryParams.toString()}`);
      if (!res.ok) throw new Error("Error al cargar productos");

      const data: PaginatedResponse = await res.json();
      setProducts(data.data || []);
      setTotal(data.pagination?.total || 0);
      setTotalPages(data.pagination?.totalPages || 0);
    } catch (err: any) {
      console.error("Failed to fetch products", err);
      setError(err.message || "Error al cargar productos");
    } finally {
      setLoading(false);
    }
  }, [page, limit, search, categoryFilter, statusFilter, sortBy, sortOrder]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchInput !== search) {
        setSearch(searchInput);
        setPage(1);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [searchInput, search]);

  useEffect(() => {
    setPage(1);
  }, [categoryFilter, statusFilter, sortBy, sortOrder]);

  const deleteProduct = async (id: number) => {
    if (
      !confirm(
        "¿Estás segura de eliminar este producto? Esta acción no se puede deshacer.",
      )
    ) {
      return;
    }

    setDeletingId(id);
    try {
      const res = await fetch(`/api/products/${id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Error al eliminar producto");
      }

      setProducts(products.filter((p) => p.id !== id));
      setTotal((prev) => prev - 1);
      setSuccessMessage("Producto eliminado exitosamente");
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err: any) {
      console.error("Failed to delete product", err);
      alert(err.message || "Error al eliminar producto");
    } finally {
      setDeletingId(null);
    }
  };

  const clearFilters = () => {
    setSearch("");
    setSearchInput("");
    setCategoryFilter("all");
    setStatusFilter("all");
    setSortBy("createdAt");
    setSortOrder("desc");
    setPage(1);
  };

  const hasActiveFilters =
    search || categoryFilter !== "all" || statusFilter !== "all";

  const getStatusBadge = (product: Product) => {
    if (product.featured) {
      return (
        <span className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs rounded-full">
          Destacado
        </span>
      );
    }
    if (product.isNew) {
      return (
        <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
          Nuevo
        </span>
      );
    }
    return (
      <span className="px-2 py-1 bg-gray-100 text-gray-500 text-xs rounded-full">
        Normal
      </span>
    );
  };

  const getStockBadge = (stock?: number) => {
    if (!stock || stock === 0) {
      return (
        <span className="px-2 py-1 bg-red-100 text-red-700 text-xs rounded-full">
          Sin stock
        </span>
      );
    }
    if (stock <= 5) {
      return (
        <span className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs rounded-full">
          Bajo ({stock})
        </span>
      );
    }
    return (
      <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
        Stock ({stock})
      </span>
    );
  };

  return (
    <AdminLayout>
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="font-serif text-3xl text-stone-900">Productos</h1>
            <p className="text-gray-500 mt-1">
              Gestiona tu inventario ({total} productos)
            </p>
          </div>
          <Link
            href="/admin/productos/nuevo"
            className="flex items-center gap-2 px-4 py-2 bg-rose-500 text-white rounded-lg hover:bg-rose-600 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Nuevo Producto
          </Link>
        </div>
      </div>

      {successMessage && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2 text-green-600">
          <CheckCircle className="w-5 h-5" />
          {successMessage}
        </div>
      )}

      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar productos..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
            />
          </div>

          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-4 py-2 border rounded-lg transition-colors ${
              showFilters || hasActiveFilters
                ? "bg-rose-50 border-rose-500 text-rose-600"
                : "border-gray-200 text-gray-600 hover:bg-gray-50"
            }`}
          >
            <Filter className="w-4 h-4" />
            Filtros
            {hasActiveFilters && (
              <span className="w-2 h-2 bg-rose-500 rounded-full" />
            )}
          </button>
        </div>

        {showFilters && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Categoría
                </label>
                <select
                  value={categoryFilter}
                  onChange={(e) =>
                    setCategoryFilter(
                      e.target.value === "all" ? "all" : Number(e.target.value),
                    )
                  }
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                >
                  <option value="all">Todas las categorías</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Estado
                </label>
                <select
                  value={statusFilter}
                  onChange={(e) =>
                    setStatusFilter(e.target.value as FilterStatus)
                  }
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                >
                  <option value="all">Todos</option>
                  <option value="featured">Destacados</option>
                  <option value="new">Nuevos</option>
                  <option value="normal">Normales</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ordenar por
                </label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortOption)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                >
                  <option value="createdAt">Fecha</option>
                  <option value="name">Nombre</option>
                  <option value="price">Precio</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Dirección
                </label>
                <select
                  value={sortOrder}
                  onChange={(e) =>
                    setSortOrder(e.target.value as "asc" | "desc")
                  }
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                >
                  <option value="desc">Mayor a menor</option>
                  <option value="asc">Menor a mayor</option>
                </select>
              </div>
            </div>

            {hasActiveFilters && (
              <div className="mt-4 flex items-center gap-2">
                <span className="text-sm text-gray-500">Filtros activos:</span>
                <button
                  onClick={clearFilters}
                  className="text-sm text-rose-500 hover:underline flex items-center gap-1"
                >
                  <X className="w-3 h-3" />
                  Limpiar filtros
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="w-8 h-8 text-rose-500 animate-spin" />
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center h-64 p-6">
            <AlertCircle className="w-12 h-12 text-red-400 mb-4" />
            <p className="text-gray-500 mb-4">{error}</p>
            <button
              onClick={fetchProducts}
              className="px-4 py-2 bg-rose-500 text-white rounded-lg hover:bg-rose-600"
            >
              Reintentar
            </button>
          </div>
        ) : products.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64">
            <Package className="w-12 h-12 text-gray-300 mb-4" />
            <p className="text-gray-500">
              {hasActiveFilters
                ? "No se encontraron productos"
                : "No hay productos"}
            </p>
            {!hasActiveFilters && (
              <Link
                href="/admin/productos/nuevo"
                className="text-rose-500 hover:underline mt-2"
              >
                Crear primer producto
              </Link>
            )}
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="text-rose-500 hover:underline mt-2"
              >
                Limpiar filtros
              </button>
            )}
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-3">
                      Producto
                    </th>
                    <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-3">
                      Categoría
                    </th>
                    <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-3">
                      Precio
                    </th>
                    <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-3">
                      Stock
                    </th>
                    <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-3">
                      Estado
                    </th>
                    <th className="text-right text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-3">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {products.map((product) => (
                    <tr key={product.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-lg bg-gray-100 overflow-hidden flex-shrink-0">
                            {product.images?.[0] ? (
                              <img
                                src={product.images[0]}
                                alt={product.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-gray-400">
                                <Package className="w-6 h-6" />
                              </div>
                            )}
                          </div>
                          <div>
                            <p className="font-medium text-stone-900">
                              {product.name}
                            </p>
                            <p className="text-xs text-gray-500 line-clamp-1 max-w-xs">
                              {product.description}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {product.categoryName || "-"}
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-medium text-stone-900">
                          ${product.price.toFixed(2)}
                        </span>
                        {product.salePrice && (
                          <span className="ml-2 text-sm text-rose-500 line-through">
                            ${product.salePrice.toFixed(2)}
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        {getStockBadge(product.stockQuantity)}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          {getStatusBadge(product)}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/producto/${product.id}`}
                            target="_blank"
                            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg"
                            title="Ver en tienda"
                          >
                            <Eye className="w-4 h-4" />
                          </Link>
                          <Link
                            href={`/admin/productos/${product.id}`}
                            className="p-2 text-blue-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
                            title="Editar"
                          >
                            <Edit className="w-4 h-4" />
                          </Link>
                          <button
                            onClick={() => deleteProduct(product.id)}
                            disabled={deletingId === product.id}
                            className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg disabled:opacity-50"
                            title="Eliminar"
                          >
                            {deletingId === product.id ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <Trash2 className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500">Mostrar</span>
                  <select
                    value={limit}
                    onChange={(e) => {
                      setLimit(Number(e.target.value));
                      setPage(1);
                    }}
                    className="px-2 py-1 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
                  >
                    <option value="10">10</option>
                    <option value="25">25</option>
                    <option value="50">50</option>
                  </select>
                  <span className="text-sm text-gray-500">por página</span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500">
                    Mostrando {(page - 1) * limit + 1} -{" "}
                    {Math.min(page * limit, total)} de {total}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setPage(Math.max(1, page - 1))}
                    disabled={page <= 1}
                    className="p-2 border border-gray-200 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>

                  <span className="text-sm text-gray-500">
                    Página {page} de {totalPages || 1}
                  </span>

                  <button
                    onClick={() => setPage(Math.min(totalPages, page + 1))}
                    disabled={page >= totalPages}
                    className="p-2 border border-gray-200 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </AdminLayout>
  );
}
