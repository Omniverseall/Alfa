import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
// Используем GeneralService и getGeneralServices/subscribeGeneralServices
import { adminService, GeneralService } from "@/services/adminService";

const PriceListPage = () => {
  const [generalServices, setGeneralServices] = useState<GeneralService[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const fetchAndSetServices = async () => {
      if (!isMounted) return;
      setLoading(true);
      try {
        // Используем getGeneralServices
        const fetchedServices = await adminService.getGeneralServices();
        if (isMounted) setGeneralServices(fetchedServices);
      } catch (error) {
        console.error("Ошибка загрузки общих услуг:", error);
        if (isMounted) setGeneralServices([]);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchAndSetServices();

    // Используем subscribeGeneralServices
    const unsubscribe = adminService.subscribeGeneralServices((updatedServices) => {
        if (isMounted) setGeneralServices(updatedServices);
    });

    return () => {
      isMounted = false;
      if (unsubscribe) unsubscribe();
    };
  }, []);

  const filteredServices = generalServices.filter((service) =>
    service.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return <div className="container mx-auto px-4 py-12 text-center">Загрузка прайс-листа...</div>;
  }

  return (
    <div className="py-12 md:py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Прайс-лист</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Ознакомьтесь с актуальными ценами на медицинские услуги в нашей клинике
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="mb-6 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input
              type="text"
              placeholder="Поиск услуг..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 text-base" // Пример стилей, верните ваши если нужно
            />
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="py-3 px-4 text-left font-semibold text-gray-600">Наименование услуги</th>
                  <th className="py-3 px-4 text-right font-semibold text-gray-600">Цена (сум)</th>
                </tr>
              </thead>
              <tbody>
                {filteredServices.length > 0 ? (
                  filteredServices.map((service) => (
                    <tr key={service.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                      <td className="py-3 px-4">{service.name}</td>
                      <td className="py-3 px-4 text-right font-medium">{service.price.toLocaleString('uz-UZ')} сум</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={2} className="py-8 text-center text-gray-500">
                      {searchQuery ? "Услуги по вашему запросу не найдены." : "Список услуг пуст."}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PriceListPage;