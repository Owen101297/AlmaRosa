import { useState, ReactNode } from "react";
import { Link, useLocation } from "wouter";
import {
  Package,
  Plus,
  Tag,
  MessageSquare,
  ChevronLeft,
  ChevronRight,
  BarChart3,
  Users,
  LogOut,
} from "lucide-react";

const adminNavItems = [
  { href: "/admin", label: "Dashboard", icon: BarChart3 },
  { href: "/admin/productos", label: "Productos", icon: Package },
  { href: "/admin/productos/nuevo", label: "Nuevo", icon: Plus },
  { href: "/admin/categorias", label: "Categorías", icon: Tag },
  { href: "/admin/pedidos", label: "Pedidos", icon: Users },
  { href: "/admin/testimonios", label: "Testimonios", icon: MessageSquare },
];

export function AdminLayout({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Admin Sidebar - Standalone */}
      <aside
        className={`fixed left-0 top-0 h-full bg-stone-900 text-white transition-all duration-300 z-50 ${
          isSidebarOpen ? "w-64" : "w-16"
        }`}
      >
        <div className="p-4 flex items-center justify-between border-b border-stone-800">
          {isSidebarOpen && (
            <Link
              href="/admin"
              className="font-serif text-xl font-bold text-rose-400"
            >
              ALMA ROSA
            </Link>
          )}
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-1.5 rounded hover:bg-stone-800"
          >
            {isSidebarOpen ? (
              <ChevronLeft className="w-5 h-5" />
            ) : (
              <ChevronRight className="w-5 h-5" />
            )}
          </button>
        </div>

        <nav className="p-2 space-y-1">
          {adminNavItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              location === item.href ||
              (item.href !== "/admin" && location.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                  isActive
                    ? "bg-rose-500 text-white"
                    : "text-gray-400 hover:bg-stone-800 hover:text-white"
                }`}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                {isSidebarOpen && <span className="text-sm">{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        <div className="absolute bottom-4 left-0 right-0 px-2">
          <Link
            href="/"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-400 hover:bg-stone-800 hover:text-white transition-colors"
          >
            <LogOut className="w-5 h-5" />
            {isSidebarOpen && <span className="text-sm">Salir al sitio</span>}
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main
        className={`flex-1 p-8 overflow-auto transition-all duration-300 ${
          isSidebarOpen ? "ml-64" : "ml-16"
        }`}
      >
        {children}
      </main>
    </div>
  );
}
