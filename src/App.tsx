
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Layout from "./components/Layout";
import HomePage from "./pages/HomePage";
import PriceListPage from "./pages/PriceListPage";
import DoctorsPage from "./pages/DoctorsPage";
import NewsPage from "./pages/NewsPage";
import NewsDetailPage from "./pages/NewsDetailPage";
import AppointmentPage from "./pages/AppointmentPage";
import AdminPage from "./pages/AdminPage";
import NotFound from "./pages/NotFound";
import ExternalServices from "./components/ExternalServices";

// Tawk.to configuration с обновленными данными
const TAWK_TO_PROPERTY_ID = "68065b7156ea99190dda8d75";
const TAWK_TO_WIDGET_ID = "1ipcdadm5";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <ExternalServices 
        tawkToPropertyId={TAWK_TO_PROPERTY_ID}
        tawkToWidgetId={TAWK_TO_WIDGET_ID}
      />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="prices" element={<PriceListPage />} />
            <Route path="doctors" element={<DoctorsPage />} />
            <Route path="news" element={<NewsPage />} />
            <Route path="news/:id" element={<NewsDetailPage />} />
            <Route path="appointment" element={<AppointmentPage />} />
            <Route path="admin" element={<AdminPage />} />
            {/* Убрали <Route path="feedback" ... /> */}
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
