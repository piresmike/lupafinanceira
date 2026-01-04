import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Assinatura from "./pages/Assinatura";
import Checkout from "./pages/Checkout";
import PerfilInvestidor from "./pages/PerfilInvestidor";
import Dashboard from "./pages/Dashboard";
import DashboardHome from "./pages/dashboard/DashboardHome";
import Noticias from "./pages/dashboard/Noticias";
import Cursos from "./pages/dashboard/Cursos";
import Relatorios from "./pages/dashboard/Relatorios";
import Historico from "./pages/dashboard/Historico";
import Cotacoes from "./pages/dashboard/Cotacoes";
import Calculadora from "./pages/dashboard/Calculadora";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/assinatura" element={<Assinatura />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/perfil-investidor" element={<PerfilInvestidor />} />
          <Route path="/dashboard" element={<Dashboard />}>
            <Route index element={<DashboardHome />} />
            <Route path="noticias" element={<Noticias />} />
            <Route path="cursos" element={<Cursos />} />
            <Route path="relatorios" element={<Relatorios />} />
            <Route path="historico" element={<Historico />} />
            <Route path="cotacoes" element={<Cotacoes />} />
            <Route path="calculadora" element={<Calculadora />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;