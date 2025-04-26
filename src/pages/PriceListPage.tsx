
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

// Mock data for the price list
const priceCategoriesData = [
  { id: 1, name: "Консультации специалистов" },
  { id: 2, name: "Диагностика" },
  { id: 3, name: "Лабораторные анализы" },
  { id: 4, name: "УЗИ" },
  { id: 5, name: "Кардиология" },
  { id: 6, name: "Неврология" },
  { id: 7, name: "Терапия" },
  { id: 8, name: "Хирургия" },
];

const priceListData = [
  { id: 1, categoryId: 1, name: "Первичная консультация терапевта", price: 100000 },
  { id: 2, categoryId: 1, name: "Повторная консультация терапевта", price: 80000 },
  { id: 3, categoryId: 1, name: "Консультация кардиолога", price: 150000 },
  { id: 4, categoryId: 1, name: "Консультация невролога", price: 140000 },
  { id: 5, categoryId: 2, name: "ЭКГ", price: 80000 },
  { id: 6, categoryId: 2, name: "Рентген грудной клетки", price: 120000 },
  { id: 7, categoryId: 3, name: "Общий анализ крови", price: 50000 },
  { id: 8, categoryId: 3, name: "Биохимический анализ крови", price: 180000 },
  { id: 9, categoryId: 3, name: "Анализ на гормоны щитовидной железы", price: 200000 },
  { id: 10, categoryId: 4, name: "УЗИ брюшной полости", price: 150000 },
  { id: 11, categoryId: 4, name: "УЗИ щитовидной железы", price: 120000 },
  { id: 12, categoryId: 4, name: "УЗИ сердца (ЭхоКГ)", price: 220000 },
  { id: 13, categoryId: 5, name: "Холтеровское мониторирование", price: 250000 },
  { id: 14, categoryId: 5, name: "Стресс-ЭКГ", price: 300000 },
  { id: 15, categoryId: 6, name: "Электроэнцефалография (ЭЭГ)", price: 220000 },
  { id: 16, categoryId: 6, name: "Электронейромиография (ЭНМГ)", price: 280000 },
  { id: 17, categoryId: 7, name: "Спирометрия", price: 100000 },
  { id: 18, categoryId: 7, name: "Гастроскопия", price: 280000 },
  { id: 19, categoryId: 8, name: "Удаление доброкачественных новообразований", price: 500000 },
  { id: 20, categoryId: 8, name: "Местная анестезия", price: 80000 },
];

const PriceListPage = () => {
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Filter the price list based on the selected category and search query
  const filteredPriceList = priceListData.filter((item) => {
    const matchesCategory = selectedCategory ? item.categoryId === selectedCategory : true;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

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
          {/* Sidebar with categories */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">Категории</h2>
              
              <div className="space-y-2">
                <button
                  onClick={() => setSelectedCategory(null)}
                  className={`w-full text-left px-3 py-2 rounded-md transition-colors ${
                    selectedCategory === null
                      ? "bg-brand-blue text-white"
                      : "hover:bg-gray-100"
                  }`}
                >
                  Все услуги
                </button>
                
                {priceCategoriesData.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`w-full text-left px-3 py-2 rounded-md transition-colors ${
                      selectedCategory === category.id
                        ? "bg-brand-blue text-white"
                        : "hover:bg-gray-100"
                    }`}
                  >
                    {category.name}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Price list */}
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
                    {filteredPriceList.length > 0 ? (
                      filteredPriceList.map((item) => (
                        <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="py-4 px-4">{item.name}</td>
                          <td className="py-4 px-4 text-right font-medium">{item.price.toLocaleString()} сум</td>
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

              <div className="mt-6 text-sm text-gray-500">
                <p>* Цены указаны в национальной валюте (сум)</p>
                <p>* Цены могут быть изменены. Актуальную информацию уточняйте у администраторов клиники</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PriceListPage;
