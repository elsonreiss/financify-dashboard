import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppLayout } from "@/components/AppLayout";
import Dashboard from "@/pages/Dashboard";
import Categories from "@/pages/Categories";
import ComingSoon from "@/pages/ComingSoon";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route element={<AppLayout />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/categories" element={<Categories />} />
            <Route
              path="/revenues"
              element={
                <ComingSoon
                  title="Receitas"
                  description="Módulo de receitas será implementado em breve. A estrutura já está preparada para integração com /revenues."
                />
              }
            />
            <Route
              path="/expenses"
              element={
                <ComingSoon
                  title="Despesas"
                  description="Módulo de despesas será implementado em breve. A estrutura já está preparada para integração com /expenses."
                />
              }
            />
            <Route
              path="/reports"
              element={
                <ComingSoon
                  title="Relatórios"
                  description="Relatórios mensais serão implementados em breve. A estrutura já está preparada para integração com /reports/monthly."
                />
              }
            />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
