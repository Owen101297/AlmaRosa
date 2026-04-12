import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { CartProvider } from "@/components/cart/CartProvider";
import { AuthProvider } from "@/hooks/useAuth";
import NotFound from "@/pages/not-found";

import Home from "@/pages/Home";
import Shop from "@/pages/Shop";
import ProductDetail from "@/pages/ProductDetail";
import Collections from "@/pages/Collections";
import Sales from "@/pages/Sales";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import Checkout from "@/pages/Checkout";
import MyOrders from "@/pages/MyOrders";
import OrderDetail from "@/pages/OrderDetail";
import Account from "@/pages/Account";
import AdminDashboard from "@/pages/admin/AdminDashboard";
import AdminProducts from "@/pages/admin/AdminProducts";
import AdminProductForm from "@/pages/admin/AdminProductForm";
import AdminCategories from "@/pages/admin/AdminCategories";
import AdminOrders from "@/pages/admin/AdminOrders";
import AdminTestimonials from "@/pages/admin/AdminTestimonials";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000,
    },
  },
});

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/tienda" component={Shop} />
      <Route path="/producto/:id" component={ProductDetail} />
      <Route path="/colecciones" component={Collections} />
      <Route path="/ofertas" component={Sales} />
      <Route path="/login" component={Login} />
      <Route path="/registro" component={Register} />
      <Route path="/checkout" component={Checkout} />
      <Route path="/pedidos" component={MyOrders} />
      <Route path="/pedidos/:id" component={OrderDetail} />
      <Route path="/cuenta" component={Account} />
      <Route path="/admin" component={AdminDashboard} />
      <Route path="/admin/productos" component={AdminProducts} />
      <Route path="/admin/productos/nuevo" component={AdminProductForm} />
      <Route path="/admin/productos/:id" component={AdminProductForm} />
      <Route path="/admin/categorias" component={AdminCategories} />
      <Route path="/admin/pedidos" component={AdminOrders} />
      <Route path="/admin/testimonios" component={AdminTestimonials} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <CartProvider>
            <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
              <Router />
            </WouterRouter>
            <Toaster />
          </CartProvider>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
