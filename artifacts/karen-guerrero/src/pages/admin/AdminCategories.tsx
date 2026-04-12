import { useState, useEffect, useCallback } from "react";
import { AdminLayout } from "./AdminLayout";
import {
  Tag,
  Plus,
  Edit,
  Trash2,
  X,
  Loader2,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string;
  productCount?: number;
}

export default function AdminCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [newCategory, setNewCategory] = useState({
    name: "",
    slug: "",
    description: "",
  });
  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const fetchCategories = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/categories");
      if (!res.ok) throw new Error("Error al cargar categorías");
      const data = await res.json();
      setCategories(data);
    } catch (err: any) {
      console.error("Failed to fetch categories", err);
      setError(err.message || "Error al cargar categorías");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategory.name || !newCategory.slug) {
      alert("Nombre y slug son requeridos");
      return;
    }

    setSaving(true);
    try {
      const url = editingId
        ? `/api/categories/${editingId}`
        : "/api/categories";
      const method = editingId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newCategory),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Error al guardar categoría");
      }

      setSuccessMessage(
        editingId ? "Categoría actualizada" : "Categoría creada",
      );
      setTimeout(() => setSuccessMessage(null), 3000);

      setIsAdding(false);
      setEditingId(null);
      setNewCategory({ name: "", slug: "", description: "" });
      fetchCategories();
    } catch (err: any) {
      console.error("Failed to save category", err);
      alert(err.message || "Error al guardar categoría");
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (category: Category) => {
    setNewCategory({
      name: category.name,
      slug: category.slug,
      description: category.description || "",
    });
    setEditingId(category.id);
    setIsAdding(true);
  };

  const deleteCategory = async (id: number) => {
    if (
      !confirm(
        "¿Estás segura de eliminar esta categoría? Los productos asociados quedarán sin categoría.",
      )
    ) {
      return;
    }

    try {
      const res = await fetch(`/api/categories/${id}`, { method: "DELETE" });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Error al eliminar categoría");
      }

      setCategories(categories.filter((c) => c.id !== id));
      setSuccessMessage("Categoría eliminada");
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err: any) {
      console.error("Failed to delete category", err);
      alert(err.message || "Error al eliminar categoría");
    }
  };

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
  };

  return (
    <AdminLayout>
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="font-serif text-3xl text-stone-900">Categorías</h1>
            <p className="text-gray-500 mt-1">
              Gestiona las categorías ({categories.length})
            </p>
          </div>
          <button
            onClick={() => {
              setIsAdding(true);
              setEditingId(null);
              setNewCategory({ name: "", slug: "", description: "" });
            }}
            className="flex items-center gap-2 px-4 py-2 bg-rose-500 text-white rounded-lg hover:bg-rose-600 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Nueva Categoría
          </button>
        </div>
      </div>

      {successMessage && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2 text-green-600">
          <CheckCircle className="w-5 h-5" />
          {successMessage}
        </div>
      )}

      {isAdding && (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-6">
          <h2 className="font-serif text-lg text-stone-900 mb-4">
            {editingId ? "Editar Categoría" : "Nueva Categoría"}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre *
                </label>
                <input
                  type="text"
                  value={newCategory.name}
                  onChange={(e) =>
                    setNewCategory({
                      ...newCategory,
                      name: e.target.value,
                      slug: generateSlug(e.target.value),
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Slug *
                </label>
                <input
                  type="text"
                  value={newCategory.slug}
                  onChange={(e) =>
                    setNewCategory({ ...newCategory, slug: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Descripción
                </label>
                <input
                  type="text"
                  value={newCategory.description}
                  onChange={(e) =>
                    setNewCategory({
                      ...newCategory,
                      description: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <button
                type="submit"
                disabled={saving}
                className="flex items-center gap-2 px-4 py-2 bg-rose-500 text-white rounded-lg hover:bg-rose-600 disabled:opacity-50"
              >
                {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                {editingId ? "Actualizar" : "Crear"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsAdding(false);
                  setEditingId(null);
                  setNewCategory({ name: "", slug: "", description: "" });
                }}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

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
              onClick={fetchCategories}
              className="px-4 py-2 bg-rose-500 text-white rounded-lg hover:bg-rose-600"
            >
              Reintentar
            </button>
          </div>
        ) : categories.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64">
            <Tag className="w-12 h-12 text-gray-300 mb-4" />
            <p className="text-gray-500">No hay categorías</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-6">
            {categories.map((category) => (
              <div
                key={category.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
              >
                <div>
                  <h3 className="font-medium text-stone-900">
                    {category.name}
                  </h3>
                  <p className="text-sm text-gray-500">/{category.slug}</p>
                  <p className="text-xs text-gray-400 mt-1">
                    {category.productCount || 0} productos
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(category)}
                    className="p-2 text-blue-400 hover:bg-blue-50 rounded-lg"
                    title="Editar"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => deleteCategory(category.id)}
                    className="p-2 text-red-400 hover:bg-red-50 rounded-lg"
                    title="Eliminar"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
