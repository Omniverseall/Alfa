import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner"; // Предполагаю, что это Sonner для уведомлений
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Layout from "./components/Layout";
import HomePage from "./pages/HomePage";
import PriceListPage from "./pages/PriceListPage";
import DoctorsPage from "./pages/DoctorsPage";
import DoctorDetailPage from "./pages/DoctorDetailPage";
import NewsPage from "./pages/NewsPage";
import NewsDetailPage from "./pages/NewsDetailPage";
// import AppointmentPage from "./pages/AppointmentPage";
import AdminPage from "./pages/AdminPage";
import AdminLogin from "./components/AdminLogin";
import ProtectedRoute from "./components/ProtectedRoute";
import NotFound from "./pages/NotFound";
import ExternalServices from "./components/ExternalServices"; // Убедитесь, что путь правильный

// AmoCRM configuration (замените на ваши актуальные данные)
const AMO_CRM_ID = "428983"; // Ваш ID виджета amoCRM
const AMO_CRM_HASH = "69c11e8abd60654caa1e87852de38694587f1a1665806e8e51b1977d8f3df679"; // Ваш хэш виджета
const AMO_CRM_LOCALE = "ru"; // Опционально, если отличается от "ru" или вы хотите явно указать

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 2,
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner /> {/* Если Sonner используется, оставляем */}
      <BrowserRouter>
        <ExternalServices
          amoCrmId={AMO_CRM_ID}
          amoCrmHash={AMO_CRM_HASH}
          amoCrmLocale={AMO_CRM_LOCALE} // Передаем локаль, если она определена
        />
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="prices" element={<PriceListPage />} />
            <Route path="doctors" element={<DoctorsPage />} />
            <Route path="doctors/:id" element={<DoctorDetailPage />} />
            <Route path="news" element={<NewsPage />} />
            <Route path="news/:id" element={<NewsDetailPage />} />
            {/* <Route path="appointment" element={<AppointmentPage />} /> */}
            <Route path="admin" element={
              <ProtectedRoute>
                <AdminPage />
              </ProtectedRoute>
            } />
            <Route path="admin/login" element={<AdminLogin />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;