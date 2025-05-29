import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { adminService, GeneralService, DoctorConsultationSlot } from "@/services/adminService";

const PriceListPage = () => {
  const [generalServices, setGeneralServices] = useState<GeneralService[]>([]);
  const [doctorSlots, setDoctorSlots] = useState<DoctorConsultationSlot[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loadingGeneral, setLoadingGeneral] = useState(true);
  const [loadingSlots, setLoadingSlots] = useState(true);
  const [activeTab, setActiveTab] = useState("doctorConsultations");

  useEffect(() => {
    let isMounted = true;

    const fetchGeneral = async () => {
      if (!isMounted) return;
      setLoadingGeneral(true);
      try {
        const fetched = await adminService.getGeneralServices();
        if (isMounted) setGeneralServices(fetched);
      } catch (error) { console.error("Ошибка загрузки общих услуг:", error); if (isMounted) setGeneralServices([]); }
      finally { if (isMounted) setLoadingGeneral(false); }
    };

    const fetchSlots = async () => {
      if (!isMounted) return;
      setLoadingSlots(true);
      try {
        const fetched = await adminService.getDoctorConsultationSlots();
        if (isMounted) setDoctorSlots(fetched);
      } catch (error) { console.error("Ошибка загрузки консультаций:", error); if (isMounted) setDoctorSlots([]); }
      finally { if (isMounted) setLoadingSlots(false); }
    };

    fetchGeneral();
    fetchSlots();

    const unsubGeneral = adminService.subscribeGeneralServices((updated) => { if (isMounted) setGeneralServices(updated); });
    const unsubSlots = adminService.subscribeDoctorConsultationSlots((updated) => { if (isMounted) setDoctorSlots(updated); });

    return () => {
      isMounted = false;
      if (unsubGeneral) unsubGeneral();
      if (unsubSlots) unsubSlots();
    };
  }, []);

  const filteredGeneralServices = generalServices.filter((service) =>
    service.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredDoctorSlots = doctorSlots.filter((slot) =>
    slot.specialization.toLowerCase().includes(searchQuery.toLowerCase()) ||
    slot.doctor_fio.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const LoadingState = ({ message } : { message: string}) => (
    <div className="text-center py-8 text-gray-600">{message}</div>
  );

  return (
    <div className="py-12 md:py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-4">Прайс-лист</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Ознакомьтесь с актуальными ценами на медицинские услуги в нашей клинике
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
          <div className="mb-6 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input
              type="text"
              placeholder="Поиск по названию или врачу..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 text-base"
            />
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-1 gap-2 sm:grid-cols-2 sm:gap-4 mb-6">
              <TabsTrigger value="doctorConsultations">Консультации врачей</TabsTrigger>
              <TabsTrigger value="generalDiagnostics">Диагностика и другие услуги</TabsTrigger>
            </TabsList>

            <TabsContent value="doctorConsultations">
              {loadingSlots ? (
                <LoadingState message="Загрузка консультаций..." />
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="hidden md:table-header-group">
                      <tr className="border-b border-gray-200 bg-gray-50">
                        <th className="py-3 px-4 text-left font-semibold text-gray-600 text-sm">Врач (Специализация)</th>
                        <th className="py-3 px-4 text-left font-semibold text-gray-600 text-sm">Ф.И.О.</th>
                        <th className="py-3 px-4 text-left font-semibold text-gray-600 text-sm">Дни приёма</th>
                        <th className="py-3 px-4 text-left font-semibold text-gray-600 text-sm">Часы приёма</th>
                        <th className="py-3 px-4 text-right font-semibold text-gray-600 text-sm">Цена (сум)</th>
                      </tr>
                    </thead>
                    <tbody className="block md:table-row-group">
                      {filteredDoctorSlots.length > 0 ? (
                        filteredDoctorSlots.map((slot) => (
                          <tr
                            key={slot.id}
                            className="block md:table-row mb-6 md:mb-0 bg-white rounded-lg shadow-md p-4 md:p-0 md:bg-transparent md:shadow-none md:border-b md:border-gray-100 md:hover:bg-gray-50 transition-colors last:mb-0"
                          >
                            <td className="block md:table-cell md:py-3 md:px-4 px-0 mb-3 md:mb-0 text-sm">
                              <div className="text-xs font-medium text-gray-500 uppercase md:hidden mb-1">Врач (Специализация)</div>
                              {slot.specialization}
                            </td>
                            <td className="block md:table-cell md:py-3 md:px-4 px-0 mb-3 md:mb-0 text-sm">
                              <div className="text-xs font-medium text-gray-500 uppercase md:hidden mb-1">Ф.И.О.</div>
                              {slot.doctor_fio}
                            </td>
                            <td className="block md:table-cell md:py-3 md:px-4 px-0 mb-3 md:mb-0 text-sm">
                              <div className="text-xs font-medium text-gray-500 uppercase md:hidden mb-1">Дни приёма</div>
                              {slot.reception_days || '-'}
                            </td>
                            <td className="block md:table-cell md:py-3 md:px-4 px-0 mb-3 md:mb-0 text-sm">
                              <div className="text-xs font-medium text-gray-500 uppercase md:hidden mb-1">Часы приёма</div>
                              {slot.reception_hours || '-'}
                            </td>
                            <td className="block md:table-cell md:py-3 md:px-4 px-0 md:text-right text-sm">
                              <div className="text-xs font-medium text-gray-500 uppercase md:hidden mb-1 md:text-left">Цена (сум)</div>
                              <span className="font-semibold">{slot.price.toLocaleString('uz-UZ')} сум</span>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr className="block md:table-row">
                          <td
                            colSpan={5}
                            className="block md:table-cell py-8 text-center text-gray-500"
                          >
                            {searchQuery ? "Консультации по вашему запросу не найдены." : "Список консультаций врачей пуст."}
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </TabsContent>

            <TabsContent value="generalDiagnostics">
              {loadingGeneral ? (
                <LoadingState message="Загрузка услуг..." />
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="hidden md:table-header-group">
                      <tr className="border-b border-gray-200 bg-gray-50">
                        <th className="py-3 px-4 text-left font-semibold text-gray-600 text-sm">Наименование услуги</th>
                        <th className="py-3 px-4 text-right font-semibold text-gray-600 text-sm">Цена (сум)</th>
                      </tr>
                    </thead>
                    <tbody className="block md:table-row-group">
                      {filteredGeneralServices.length > 0 ? (
                        filteredGeneralServices.map((service) => (
                          <tr
                            key={service.id}
                            className="block md:table-row mb-6 md:mb-0 bg-white rounded-lg shadow-md p-4 md:p-0 md:bg-transparent md:shadow-none md:border-b md:border-gray-100 md:hover:bg-gray-50 transition-colors last:mb-0"
                          >
                            <td className="block md:table-cell md:py-3 md:px-4 px-0 mb-3 md:mb-0 text-sm">
                              <div className="text-xs font-medium text-gray-500 uppercase md:hidden mb-1">Наименование услуги</div>
                              {service.name}
                            </td>
                            <td className="block md:table-cell md:py-3 md:px-4 px-0 md:text-right text-sm">
                              <div className="text-xs font-medium text-gray-500 uppercase md:hidden mb-1 md:text-left">Цена (сум)</div>
                              <span className="font-semibold">{service.price.toLocaleString('uz-UZ')} сум</span>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr className="block md:table-row">
                          <td
                            colSpan={2}
                            className="block md:table-cell py-8 text-center text-gray-500"
                          >
                            {searchQuery ? "Услуги по вашему запросу не найдены." : "Список услуг пуст."}
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default PriceListPage;