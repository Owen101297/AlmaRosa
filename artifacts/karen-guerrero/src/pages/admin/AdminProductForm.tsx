import { useState, useEffect, useCallback, useRef } from "react";
import { useParams } from "wouter";
import { Link } from "wouter";
import { AdminLayout } from "./AdminLayout";
import {
  Package,
  ChevronLeft,
  ChevronRight,
  Save,
  Plus,
  X,
  Upload,
  Image as ImageIcon,
  Loader2,
  AlertCircle,
  CheckCircle,
  Trash2,
  GripVertical,
  ExternalLink,
} from "lucide-react";

interface Category {
  id: number;
  name: string;
  slug: string;
}

interface Product {
  id?: number;
  name: string;
  description: string;
  price: number;
  salePrice: number | null;
  categoryId: number;
  images: string[];
  sizes: string[];
  featured: boolean;
  isNew: boolean;
  stockQuantity: number;
}

interface UploadedImage {
  url: string;
  path?: string;
  isNew?: boolean;
}

const defaultProduct: Product = {
  name: "",
  description: "",
  price: 0,
  salePrice: null,
  categoryId: 0,
  images: [],
  sizes: [],
  featured: false,
  isNew: false,
  stockQuantity: 0,
};

const predefinedSizes = ["XS", "S", "M", "L", "XL", "2XL", "3XL"];

export default function AdminProductForm() {
  const { id } = useParams();
  const isEditing = !!id;

  const [product, setProduct] = useState<Product>(defaultProduct);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const [newImageUrl, setNewImageUrl] = useState("");
  const [newSize, setNewSize] = useState("");

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const fetchCategories = useCallback(async () => {
    try {
      const res = await fetch("/api/categories");
      if (res.ok) {
        const data = await res.json();
        setCategories(data || []);
      }
    } catch (error) {
      console.error("Failed to fetch categories", error);
    }
  }, []);

  const fetchProduct = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/products/${id}`);
      if (res.ok) {
        const data = await res.json();
        setProduct({
          ...data,
          salePrice: data.salePrice || null,
        });
      }
    } catch (error) {
      console.error("Failed to fetch product", error);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  useEffect(() => {
    if (isEditing) {
      fetchProduct();
    }
  }, [isEditing, fetchProduct]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!product.name.trim()) {
      newErrors.name = "El nombre es requerido";
    } else if (product.name.trim().length < 3) {
      newErrors.name = "El nombre debe tener al menos 3 caracteres";
    }

    if (!product.description.trim()) {
      newErrors.description = "La descripción es requerida";
    }

    if (!product.categoryId) {
      newErrors.categoryId = "Selecciona una categoría";
    }

    if (!product.price || product.price <= 0) {
      newErrors.price = "El precio debe ser mayor a 0";
    }

    if (product.salePrice && product.salePrice >= product.price) {
      newErrors.salePrice =
        "El precio de oferta debe ser menor al precio regular";
    }

    if (product.images.length === 0) {
      newErrors.images = "Agrega al menos una imagen";
    }

    if (product.sizes.length === 0) {
      newErrors.sizes = "Agrega al menos una talla";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    setSaving(true);
    setErrors({});

    try {
      const method = isEditing ? "PUT" : "POST";
      const url = isEditing ? `/api/products/${id}` : "/api/products";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(product),
      });

      if (res.ok) {
        setSuccessMessage(
          isEditing
            ? "Producto actualizado exitosamente"
            : "Producto creado exitosamente",
        );
        setTimeout(() => {
          window.location.href = "/admin/productos";
        }, 1500);
      } else {
        const error = await res.json();
        setErrors({ submit: error.error || "Error al guardar producto" });
      }
    } catch (error) {
      console.error("Failed to save product", error);
      setErrors({ submit: "Error al guardar producto" });
    } finally {
      setSaving(false);
    }
  };

  const handleFileUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    setUploading(true);
    setUploadProgress(0);

    const fileArray = Array.from(files);
    const newUrls: string[] = [];

    for (let i = 0; i < fileArray.length; i++) {
      const file = fileArray[i];

      if (!file.type.startsWith("image/")) {
        setErrors((prev) => ({
          ...prev,
          images: "Solo se permiten archivos de imagen",
        }));
        continue;
      }

      if (file.size > 5 * 1024 * 1024) {
        setErrors((prev) => ({
          ...prev,
          images: "La imagen no puede superar 5MB",
        }));
        continue;
      }

      try {
        const formData = new FormData();
        formData.append("image", file);
        if (isEditing && id) {
          formData.append("productId", id);
        }

        const res = await fetch("/api/products/upload", {
          method: "POST",
          body: formData,
        });

        if (res.ok) {
          const data = await res.json();
          if (data.url) {
            newUrls.push(data.url);
          }
        }
      } catch (error) {
        console.error("Upload failed", error);
      }

      setUploadProgress(((i + 1) / fileArray.length) * 100);
    }

    if (newUrls.length > 0) {
      setProduct((prev) => ({
        ...prev,
        images: [...prev.images, ...newUrls],
      }));
    }

    setUploading(false);
    setUploadProgress(0);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileUpload(e.dataTransfer.files);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const addImageFromUrl = () => {
    if (!newImageUrl.trim()) return;

    try {
      new URL(newImageUrl);
    } catch {
      setErrors((prev) => ({
        ...prev,
        images: "URL de imagen inválida",
      }));
      return;
    }

    if (!product.images.includes(newImageUrl)) {
      setProduct((prev) => ({
        ...prev,
        images: [...prev.images, newImageUrl.trim()],
      }));
    }
    setNewImageUrl("");
    setErrors((prev) => {
      const { images, ...rest } = prev;
      return rest;
    });
  };

  const removeImage = (index: number) => {
    setProduct((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const moveImage = (from: number, to: number) => {
    if (to < 0 || to >= product.images.length) return;
    const newImages = [...product.images];
    const [removed] = newImages.splice(from, 1);
    newImages.splice(to, 0, removed);
    setProduct((prev) => ({ ...prev, images: newImages }));
  };

  const addSize = (size: string) => {
    const trimmedSize = size.trim().toUpperCase();
    if (trimmedSize && !product.sizes.includes(trimmedSize)) {
      setProduct((prev) => ({
        ...prev,
        sizes: [...prev.sizes, trimmedSize],
      }));
      setNewSize("");
    }
  };

  const removeSize = (index: number) => {
    setProduct((prev) => ({
      ...prev,
      sizes: prev.sizes.filter((_, i) => i !== index),
    }));
  };

  const toggleSize = (size: string) => {
    if (product.sizes.includes(size)) {
      removeSize(product.sizes.indexOf(size));
    } else {
      addSize(size);
    }
  };

  return (
    <AdminLayout>
      <form onSubmit={handleSubmit} className="max-w-4xl">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link
              href="/admin/productos"
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <ChevronLeft className="w-5 h-5 text-gray-600" />
            </Link>
            <div>
              <h1 className="font-serif text-3xl text-stone-900">
                {isEditing ? "Editar Producto" : "Nuevo Producto"}
              </h1>
              <p className="text-gray-500 mt-1">
                {isEditing
                  ? "Actualiza la información del producto"
                  : "Crea un nuevo producto para tu tienda"}
              </p>
            </div>
          </div>
          <button
            type="submit"
            disabled={saving || uploading}
            className="flex items-center gap-2 px-6 py-2.5 bg-rose-500 text-white rounded-lg hover:bg-rose-600 transition-colors disabled:opacity-50"
          >
            {saving ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Save className="w-5 h-5" />
            )}
            {saving ? "Guardando..." : "Guardar Producto"}
          </button>
        </div>

        {successMessage && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2 text-green-600">
            <CheckCircle className="w-5 h-5" />
            {successMessage}
          </div>
        )}

        {errors.submit && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-600">
            <AlertCircle className="w-5 h-5" />
            {errors.submit}
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="w-8 h-8 text-rose-500 animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h2 className="font-serif text-lg text-stone-900 mb-4">
                Información Básica
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nombre *
                  </label>
                  <input
                    type="text"
                    value={product.name}
                    onChange={(e) =>
                      setProduct({ ...product, name: e.target.value })
                    }
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 ${
                      errors.name ? "border-red-500" : "border-gray-200"
                    }`}
                  />
                  {errors.name && (
                    <p className="text-red-500 text-xs mt-1">{errors.name}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Descripción *
                  </label>
                  <textarea
                    value={product.description}
                    onChange={(e) =>
                      setProduct({
                        ...product,
                        description: e.target.value,
                      })
                    }
                    rows={4}
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 ${
                      errors.description ? "border-red-500" : "border-gray-200"
                    }`}
                  />
                  {errors.description && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.description}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Categoría *
                  </label>
                  <select
                    value={product.categoryId}
                    onChange={(e) =>
                      setProduct({
                        ...product,
                        categoryId: parseInt(e.target.value) || 0,
                      })
                    }
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 ${
                      errors.categoryId ? "border-red-500" : "border-gray-200"
                    }`}
                  >
                    <option value="">Seleccionar categoría</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                  {errors.categoryId && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.categoryId}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h2 className="font-serif text-lg text-stone-900 mb-4">
                Precios
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Precio Regular *
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
                      $
                    </span>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={product.price}
                      onChange={(e) =>
                        setProduct({
                          ...product,
                          price: parseFloat(e.target.value) || 0,
                        })
                      }
                      className={`w-full pl-8 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 ${
                        errors.price ? "border-red-500" : "border-gray-200"
                      }`}
                    />
                  </div>
                  {errors.price && (
                    <p className="text-red-500 text-xs mt-1">{errors.price}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Precio de Oferta
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
                      $
                    </span>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={product.salePrice || ""}
                      onChange={(e) =>
                        setProduct({
                          ...product,
                          salePrice: e.target.value
                            ? parseFloat(e.target.value)
                            : null,
                        })
                      }
                      className="w-full pl-8 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                      placeholder="Opcional"
                    />
                  </div>
                  {errors.salePrice && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.salePrice}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Cantidad en Stock
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={product.stockQuantity}
                    onChange={(e) =>
                      setProduct({
                        ...product,
                        stockQuantity: parseInt(e.target.value) || 0,
                      })
                    }
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                  />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 lg:col-span-2">
              <h2 className="font-serif text-lg text-stone-900 mb-4">
                Imágenes
              </h2>
              <p className="text-sm text-gray-500 mb-4">
                La primera imagen será la principal del producto.
              </p>

              <div className="mb-4">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={(e) => handleFileUpload(e.target.files)}
                  accept="image/*"
                  multiple
                  className="hidden"
                />

                <div
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onClick={() => fileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
                    isDragging
                      ? "border-rose-500 bg-rose-50"
                      : errors.images
                        ? "border-red-300 bg-red-50"
                        : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  {uploading ? (
                    <div className="flex flex-col items-center">
                      <Loader2 className="w-8 h-8 text-rose-500 animate-spin mb-2" />
                      <p className="text-sm text-gray-500">
                        Subiendo... {Math.round(uploadProgress)}%
                      </p>
                      <div className="w-full max-w-xs bg-gray-200 rounded-full h-2 mt-2">
                        <div
                          className="bg-rose-500 h-2 rounded-full transition-all"
                          style={{ width: `${uploadProgress}%` }}
                        />
                      </div>
                    </div>
                  ) : (
                    <>
                      <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-500">
                        Arrastra imágenes aquí o haz clic para seleccionar
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        JPEG, PNG, WebP o GIF (máx 5MB)
                      </p>
                    </>
                  )}
                </div>

                <div className="mt-3 flex gap-2">
                  <input
                    type="url"
                    value={newImageUrl}
                    onChange={(e) => setNewImageUrl(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && addImageFromUrl()}
                    placeholder="O pega una URL de imagen (Unsplash, etc.)"
                    className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                  />
                  <button
                    type="button"
                    onClick={addImageFromUrl}
                    className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
                {errors.images && (
                  <p className="text-red-500 text-xs mt-1">{errors.images}</p>
                )}
              </div>

              {product.images.length > 0 && (
                <div className="grid grid-cols-4 sm:grid-cols-5 gap-3">
                  {product.images.map((img, i) => (
                    <div
                      key={i}
                      className="relative group aspect-square rounded-lg overflow-hidden bg-gray-100 border-2 border-gray-100 hover:border-rose-300 transition-colors"
                    >
                      <img
                        src={img}
                        alt={`Imagen ${i + 1}`}
                        className="w-full h-full object-cover"
                      />
                      {i === 0 && (
                        <div className="absolute top-2 left-2 px-2 py-0.5 bg-rose-500 text-white text-xs rounded-full">
                          Principal
                        </div>
                      )}
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        <button
                          type="button"
                          onClick={() => moveImage(i, i - 1)}
                          disabled={i === 0}
                          className="p-1.5 bg-white rounded-full disabled:opacity-50"
                          title="Mover izquierda"
                        >
                          <ChevronLeft className="w-4 h-4 text-gray-700" />
                        </button>
                        <button
                          type="button"
                          onClick={() => removeImage(i)}
                          className="p-1.5 bg-red-500 rounded-full"
                          title="Eliminar"
                        >
                          <Trash2 className="w-4 h-4 text-white" />
                        </button>
                        <button
                          type="button"
                          onClick={() => moveImage(i, i + 1)}
                          disabled={i === product.images.length - 1}
                          className="p-1.5 bg-white rounded-full disabled:opacity-50"
                          title="Mover derecha"
                        >
                          <ChevronRight className="w-4 h-4 text-gray-700" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 lg:col-span-2">
              <h2 className="font-serif text-lg text-stone-900 mb-4">Tallas</h2>
              <div className="space-y-3">
                <div className="flex flex-wrap gap-2">
                  {predefinedSizes.map((size) => (
                    <button
                      key={size}
                      type="button"
                      onClick={() => toggleSize(size)}
                      className={`px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${
                        product.sizes.includes(size)
                          ? "bg-rose-500 text-white border-rose-500"
                          : "bg-white text-gray-700 border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>

                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newSize}
                    onChange={(e) => setNewSize(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addSize(newSize);
                      }
                    }}
                    placeholder="Otra talla (ej: 32, 34)"
                    className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                  />
                  <button
                    type="button"
                    onClick={() => addSize(newSize)}
                    className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>

                {errors.sizes && (
                  <p className="text-red-500 text-xs">{errors.sizes}</p>
                )}
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 lg:col-span-2">
              <h2 className="font-serif text-lg text-stone-900 mb-4">Estado</h2>
              <div className="space-y-3">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={product.featured}
                    onChange={(e) =>
                      setProduct({ ...product, featured: e.target.checked })
                    }
                    className="w-4 h-4 text-rose-500 rounded"
                  />
                  <span className="text-sm text-gray-700">
                    Producto destacado
                  </span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={product.isNew}
                    onChange={(e) =>
                      setProduct({ ...product, isNew: e.target.checked })
                    }
                    className="w-4 h-4 text-rose-500 rounded"
                  />
                  <span className="text-sm text-gray-700">Nuevo arrival</span>
                </label>
              </div>
            </div>
          </div>
        )}
      </form>
    </AdminLayout>
  );
}
