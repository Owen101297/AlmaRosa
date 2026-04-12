import { useState, useEffect, useCallback } from "react";
import { AdminLayout } from "./AdminLayout";
import {
  MessageSquare,
  Loader2,
  CheckCircle,
  AlertCircle,
  Check,
  Trash2,
  Eye,
  Star,
  Clock,
} from "lucide-react";

interface Testimonial {
  id: number;
  name: string;
  comment: string;
  rating: number;
  avatar?: string;
  isActive: boolean;
  createdAt: string;
}

export default function AdminTestimonials() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<number | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const fetchTestimonials = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/testimonials");
      if (!res.ok) throw new Error("Error al cargar testimonios");
      const data = await res.json();
      setTestimonials(data);
    } catch (err: any) {
      console.error("Failed to fetch testimonials", err);
      setError(err.message || "Error al cargar testimonios");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTestimonials();
  }, [fetchTestimonials]);

  const toggleActive = async (id: number, currentStatus: boolean) => {
    setUpdatingId(id);
    try {
      const res = await fetch(`/api/testimonials/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !currentStatus }),
      });

      if (!res.ok) {
        throw new Error("Error al actualizar testimonio");
      }

      setTestimonials(
        testimonials.map((t) =>
          t.id === id ? { ...t, isActive: !currentStatus } : t,
        ),
      );
      setSuccessMessage(
        !currentStatus ? "Testimonio publicado" : "Testimonio ocultado",
      );
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err: any) {
      console.error("Failed to update testimonial", err);
      alert(err.message || "Error al actualizar testimonio");
    } finally {
      setUpdatingId(null);
    }
  };

  const deleteTestimonial = async (id: number) => {
    if (
      !confirm(
        "¿Estás segura de eliminar este testimonio? Esta acción no se puede deshacer.",
      )
    ) {
      return;
    }

    setUpdatingId(id);
    try {
      const res = await fetch(`/api/testimonials/${id}`, { method: "DELETE" });

      if (!res.ok) {
        throw new Error("Error al eliminar testimonio");
      }

      setTestimonials(testimonials.filter((t) => t.id !== id));
      setSuccessMessage("Testimonio eliminado");
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err: any) {
      console.error("Failed to delete testimonial", err);
      alert(err.message || "Error al eliminar testimonio");
    } finally {
      setUpdatingId(null);
    }
  };

  const activeTestimonials = testimonials.filter((t) => t.isActive);
  const pendingTestimonials = testimonials.filter((t) => !t.isActive);

  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="font-serif text-3xl text-stone-900">Testimonios</h1>
        <p className="text-gray-500 mt-1">
          Gestiona los testimonios de clientas ({testimonials.length} total)
        </p>
      </div>

      {successMessage && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2 text-green-600">
          <CheckCircle className="w-5 h-5" />
          {successMessage}
        </div>
      )}

      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 text-green-600 mb-2">
            <Check className="w-5 h-5" />
            <span className="font-medium">Publicados</span>
          </div>
          <p className="text-3xl font-bold text-stone-900">
            {activeTestimonials.length}
          </p>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 text-yellow-600 mb-2">
            <Clock className="w-5 h-5" />
            <span className="font-medium">Pendientes</span>
          </div>
          <p className="text-3xl font-bold text-stone-900">
            {pendingTestimonials.length}
          </p>
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
            onClick={fetchTestimonials}
            className="px-4 py-2 bg-rose-500 text-white rounded-lg hover:bg-rose-600"
          >
            Reintentar
          </button>
        </div>
      ) : testimonials.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 bg-white rounded-xl">
          <MessageSquare className="w-12 h-12 text-gray-300 mb-4" />
          <p className="text-gray-500">No hay testimonios</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className={`bg-white rounded-xl p-6 shadow-sm border ${
                testimonial.isActive
                  ? "border-gray-100"
                  : "border-yellow-200 bg-yellow-50"
              }`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                    {testimonial.avatar ? (
                      <img
                        src={testimonial.avatar}
                        alt={testimonial.name}
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      <span className="text-lg font-medium text-gray-600">
                        {testimonial.name.charAt(0).toUpperCase()}
                      </span>
                    )}
                  </div>
                  <div>
                    <h3 className="font-medium text-stone-900">
                      {testimonial.name}
                    </h3>
                    <p className="text-xs text-gray-500">
                      {new Date(testimonial.createdAt).toLocaleDateString(
                        "es-MX",
                      )}
                    </p>
                  </div>
                </div>
                <span
                  className={`px-2 py-1 text-xs rounded-full ${
                    testimonial.isActive
                      ? "bg-green-100 text-green-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {testimonial.isActive ? "Activo" : "Pendiente"}
                </span>
              </div>

              <div className="flex gap-1 mb-3 text-rose-500">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${i < testimonial.rating ? "fill-current" : "text-gray-300"}`}
                  />
                ))}
              </div>

              <p className="text-gray-600 text-sm mb-4">
                "{testimonial.comment}"
              </p>

              <div className="flex gap-2">
                <button
                  onClick={() =>
                    toggleActive(testimonial.id, testimonial.isActive)
                  }
                  disabled={updatingId === testimonial.id}
                  className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm ${
                    testimonial.isActive
                      ? "bg-yellow-100 text-yellow-700 hover:bg-yellow-200"
                      : "bg-green-100 text-green-700 hover:bg-green-200"
                  } disabled:opacity-50`}
                >
                  {updatingId === testimonial.id ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : testimonial.isActive ? (
                    <>
                      <Eye className="w-4 h-4" />
                      Ocultar
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4" />
                      Publicar
                    </>
                  )}
                </button>
                <button
                  onClick={() => deleteTestimonial(testimonial.id)}
                  disabled={updatingId === testimonial.id}
                  className="px-3 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 disabled:opacity-50"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </AdminLayout>
  );
}
