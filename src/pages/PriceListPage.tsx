import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { adminService } from "@/services/adminService";

interface Service {
  id: number;
  name: string;
  category: string;
  price: number;
}

const PriceListPage = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const fetchedServices = await adminService.getServices();
        setServices(fetchedServices);
      } catch (error) {
        console.error("Ошибка загрузки услуг:", error);
      }
    };

    fetchServices();

    const unsubscribe = adminService.subscribeServices(fetchServices);

    return () => {
      unsubscribe();
    };
  }, []);

  const filteredServices = services.filter((service) => {
    const matchesSearch = service.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !selectedCategory || service.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = ["Все услуги", ...new Set(services.map((service) => service.category))];

  return (
    <div className="py-12 md:py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Прайс-лист</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Ознакомьтесь с актуальными ценами на медицинские услуги в нашей клинике
          </p>
        </div>

        <div className="grid md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">Категории</h2>
              <div className="space-y-2">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category === "Все услуги" ? null : category)}
                    className={`w-full text-left px-3 py-2 rounded-md transition-colors ${
                      (category === "Все услуги" && !selectedCategory) || category === selectedCategory
                        ? "bg-brand-blue text-white"
                        : "hover:bg-gray-100"
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="md:col-span-3">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="mb-6 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Поиск услуг..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="py-4 px-4 text-left font-semibold text-gray-600">Наименование услуги</th>
                      <th className="py-4 px-4 text-right font-semibold text-gray-600">Цена (сум)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredServices.length > 0 ? (
                      filteredServices.map((service) => (
                        <tr key={service.id} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="py-4 px-4">{service.name}</td>
                          <td className="py-4 px-4 text-right font-medium">{service.price.toLocaleString()} сум</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={2} className="py-8 text-center text-gray-500">
                          Услуги не найдены. Пожалуйста, измените параметры поиска.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PriceListPage;
