import React, { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Search, Plus, Edit, Trash, Image } from "lucide-react";
import { adminService, Doctor, NewsItem, Service } from "@/services/adminService";

const PLACEHOLDER_IMAGE = "/placeholder.svg";

const AdminPage = () => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [showDoctorForm, setShowDoctorForm] = useState(false);
  const [showNewsForm, setShowNewsForm] = useState(false);
  const [showServiceForm, setShowServiceForm] = useState(false);

  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [news, setNews] = useState<NewsItem[]>([]);
  const [services, setServices] = useState<Service[]>([]);

  const initialDoctorFormState = {
    name: "",
    specialization: "",
    experience: "",
    education: "",
    description: "",
    image: null as string | null,
  };

  const initialNewsFormState = {
    title: "",
    category: "",
    content: "",
    image: null as string | null,
    date: "",
  };

  const initialServiceFormState = {
    name: "",
    price: 0,
    category: "",
  };

  const [doctorForm, setDoctorForm] = useState(initialDoctorFormState);
  const [newsForm, setNewsForm] = useState(initialNewsFormState);
  const [serviceForm, setServiceForm] = useState(initialServiceFormState);
  const [editingId, setEditingId] = useState<number | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [doctorsData, newsData, servicesData] = await Promise.all([
        adminService.getDoctors(),
        adminService.getNews(),
        adminService.getServices(),
      ]);
      setDoctors(doctorsData || []);
      setNews(newsData || []);
      setServices(servicesData || []);
    } catch (error) {
      console.error("Failed to load data:", error);
      toast({
        title: "Ошибка загрузки данных",
        description: "Не удалось получить данные с сервера.",
        variant: "destructive",
      });
      setDoctors([]);
      setNews([]);
      setServices([]);
    }
  };

  // --- Filtering (REVISED) ---
  const lowerCaseQuery = searchQuery.toLowerCase();

  const filteredDoctors = doctors.filter((doctor) =>
      !searchQuery ||
      doctor.name.toLowerCase().includes(lowerCaseQuery) ||
      doctor.specialization.toLowerCase().includes(lowerCaseQuery)
  );

  const filteredNews = news.filter((newsItem) =>
      !searchQuery ||
      newsItem.title.toLowerCase().includes(lowerCaseQuery) ||
      newsItem.category.toLowerCase().includes(lowerCaseQuery)
  );

  const filteredServices = services.filter((service) =>
      !searchQuery ||
      service.name.toLowerCase().includes(lowerCaseQuery) ||
      service.category.toLowerCase().includes(lowerCaseQuery)
  );


  const handleDoctorFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setDoctorForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleNewsFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewsForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleServiceFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setServiceForm((prev) => ({
      ...prev,
      [name]: name === "price" ? (value === "" ? 0 : parseInt(value, 10)) : value,
    }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, formType: "doctor" | "news") => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const imageUrl = reader.result as string;
        if (formType === "doctor") {
          setDoctorForm((prev) => ({ ...prev, image: imageUrl }));
        } else if (formType === "news") {
          setNewsForm((prev) => ({ ...prev, image: imageUrl }));
        }
      };
      reader.onerror = (error) => {
          console.error("Error reading file:", error);
          toast({ title: "Ошибка чтения файла", variant: "destructive"});
      }
      reader.readAsDataURL(file);
       e.target.value = "";
    }
  };

  const resetDoctorForm = () => {
    setDoctorForm(initialDoctorFormState);
    setEditingId(null);
    setShowDoctorForm(false);
  };

  const resetNewsForm = () => {
    setNewsForm(initialNewsFormState);
    setEditingId(null);
    setShowNewsForm(false);
  };

  const resetServiceForm = () => {
    setServiceForm(initialServiceFormState);
    setEditingId(null);
    setShowServiceForm(false);
  };

  // --- Submit Handlers (REVISED Add Logic) ---
  const handleDoctorSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      if (editingId !== null) {
        await adminService.updateDoctor(editingId, doctorForm);
        toast({
          title: "Врач обновлен",
          description: `Врач ${doctorForm.name} был успешно обновлен.`,
        });
      } else {
        await adminService.addDoctor(doctorForm);
        toast({
          title: "Врач добавлен",
          description: `Врач ${doctorForm.name} был успешно добавлен.`,
        });
      }
      await loadData();
      resetDoctorForm();
    } catch (error) {
      console.error("Doctor submit error:", error);
      toast({
        title: "Ошибка",
        description: "Произошла ошибка при сохранении данных врача.",
        variant: "destructive",
      });
    }
  };

  const handleNewsSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      if (editingId !== null) {
        await adminService.updateNews(editingId, newsForm);
        toast({
          title: "Новость обновлена",
          description: `Новость "${newsForm.title}" была успешно обновлена.`,
        });
      } else {
        await adminService.addNews(newsForm);
        toast({
          title: "Новость добавлена",
          description: `Новость "${newsForm.title}" была успешно добавлена.`,
        });
      }
      await loadData();
      resetNewsForm();
    } catch (error) {
      console.error("News submit error:", error);
      toast({
        title: "Ошибка",
        description: "Произошла ошибка при сохранении данных новости.",
        variant: "destructive",
      });
    }
  };

  const handleServiceSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
     if (!serviceForm.name || serviceForm.price < 0 || !serviceForm.category) {
        toast({ title: "Ошибка", description: "Пожалуйста, заполните все обязательные поля корректно.", variant: "destructive"});
        return;
    }
    try {
      if (editingId !== null) {
        await adminService.updateService(editingId, serviceForm);
        toast({
          title: "Услуга обновлена",
          description: `Услуга "${serviceForm.name}" была успешно обновлена.`,
        });
      } else {
        await adminService.addService(serviceForm);
        toast({
          title: "Услуга добавлена",
          description: `Услуга "${serviceForm.name}" была успешно добавлена.`,
        });
      }
      await loadData();
      resetServiceForm();
    } catch (error) {
      console.error("Service submit error:", error);
      toast({
        title: "Ошибка",
        description: "Произошла ошибка при сохранении данных услуги.",
        variant: "destructive",
      });
    }
  };

  const handleEditDoctor = (doctor: Doctor) => {
    setDoctorForm({
      name: doctor.name,
      specialization: doctor.specialization || "",
      experience: doctor.experience || "",
      education: doctor.education || "",
      description: doctor.description || "",
      image: doctor.image
    });
    setEditingId(doctor.id);
    setShowDoctorForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleEditNews = (newsItem: NewsItem) => {
    setNewsForm({
      title: newsItem.title,
      category: newsItem.category || "",
      content: newsItem.content || "",
      image: newsItem.image,
      date: newsItem.date || ""
    });
    setEditingId(newsItem.id);
    setShowNewsForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleEditService = (service: Service) => {
    setServiceForm({
      name: service.name,
      category: service.category || "",
      price: service.price ?? 0
    });
    setEditingId(service.id);
    setShowServiceForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id: number, type: "doctor" | "news" | "service") => {
    if (!window.confirm("Вы уверены, что хотите удалить этот элемент?")) {
        return;
    }

    try {
      switch (type) {
        case "doctor":
          await adminService.deleteDoctor(id);
          break;
        case "news":
          await adminService.deleteNews(id);
          break;
        case "service":
          await adminService.deleteService(id);
          break;
        default:
            console.warn("Unknown delete type:", type);
            return;
      }
      await loadData();
      toast({
        title: "Успешно удалено",
        description: "Элемент был успешно удален.",
      });
    } catch (error) {
      console.error("Delete error:", error);
      toast({
        title: "Ошибка удаления",
        description: "Произошла ошибка при удалении элемента.",
        variant: "destructive",
      });
    }
  };

  return (
    <Tabs defaultValue="doctors" className="w-full">
      <div className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">Панель администратора</h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Управление контентом сайта - врачи, новости, услуги
            </p>
          </div>

          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="doctors" className="text-base py-3">
              Врачи
            </TabsTrigger>
            <TabsTrigger value="news" className="text-base py-3">
              Новости
            </TabsTrigger>
            <TabsTrigger value="services" className="text-base py-3">
              Услуги и цены
            </TabsTrigger>
          </TabsList>

          {/* Doctors Tab */}
          <TabsContent value="doctors" className="mt-0">
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
              <div className="p-6">
                {/* Search and Add Button Row */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                  <div className="relative w-full md:w-auto flex-grow md:max-w-md">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      type="text"
                      placeholder="Поиск врачей..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Button
                    onClick={() => {
                      resetDoctorForm();
                      setShowDoctorForm(true);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="bg-brand-blue hover:bg-blue-700 w-full md:w-auto"
                  >
                    <Plus className="mr-2 h-4 w-4" /> Добавить врача
                  </Button>
                </div>

                {/* Doctor Add/Edit Form */}
                {showDoctorForm && (
                  <Card className="p-6 mb-6 border border-gray-200">
                    <h3 className="text-lg font-semibold mb-4">
                      {editingId !== null ? "Редактировать врача" : "Добавить врача"}
                    </h3>
                    <form onSubmit={handleDoctorSubmit}>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">ФИО*</label>
                          <Input id="name" name="name" value={doctorForm.name} onChange={handleDoctorFormChange} placeholder="Иванов Иван Иванович" required />
                        </div>
                        <div>
                          <label htmlFor="specialization" className="block text-sm font-medium text-gray-700 mb-1">Специализация*</label>
                          <Input id="specialization" name="specialization" value={doctorForm.specialization} onChange={handleDoctorFormChange} placeholder="Кардиолог" required />
                        </div>
                        <div>
                          <label htmlFor="experience" className="block text-sm font-medium text-gray-700 mb-1">Опыт работы*</label>
                          <Input id="experience" name="experience" value={doctorForm.experience} onChange={handleDoctorFormChange} placeholder="10 лет опыта" required />
                        </div>
                        <div>
                          <label htmlFor="education" className="block text-sm font-medium text-gray-700 mb-1">Образование</label>
                          <Input id="education" name="education" value={doctorForm.education ?? ''} onChange={handleDoctorFormChange} placeholder="Ташкентская медицинская академия" />
                        </div>
                        <div className="md:col-span-2">
                          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Описание</label>
                          <Textarea id="description" name="description" value={doctorForm.description ?? ''} onChange={handleDoctorFormChange} placeholder="Информация о враче..." rows={3} />
                        </div>
                        <div className="md:col-span-2">
                          <label htmlFor="doctor-image" className="block text-sm font-medium text-gray-700 mb-1">Фотография</label>
                          <div className="flex items-center gap-4">
                            {doctorForm.image && (
                              <div className="h-20 w-20 rounded overflow-hidden bg-gray-100">
                                <img src={doctorForm.image} alt="Предпросмотр" className="h-full w-full object-cover" onError={(e) => e.currentTarget.src = PLACEHOLDER_IMAGE} />
                              </div>
                            )}
                            <label className="cursor-pointer bg-gray-100 hover:bg-gray-200 text-gray-600 px-4 py-2 rounded flex items-center">
                              <Image className="h-4 w-4 mr-2" />
                              {doctorForm.image ? "Изменить фото" : "Загрузить фото"}
                              <input id="doctor-image" type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e, "doctor")} />
                            </label>
                            {doctorForm.image && (
                                <Button size="sm" variant="ghost" onClick={() => setDoctorForm(prev => ({...prev, image: null}))} className="text-red-500">Удалить фото</Button>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex justify-end gap-2">
                        <Button type="button" variant="outline" onClick={resetDoctorForm}>Отмена</Button>
                        <Button type="submit" className="bg-brand-blue hover:bg-blue-700">{editingId !== null ? "Сохранить изменения" : "Добавить врача"}</Button>
                      </div>
                    </form>
                  </Card>
                )}

                {/* Doctors List */}
                {filteredDoctors.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredDoctors.map((doctor) => (
                      <Card key={doctor.id} className="overflow-hidden">
                        <div className="flex h-full">
                          <div className="h-auto w-28 flex-shrink-0 bg-gray-100">
                            <img
                              src={doctor.image || PLACEHOLDER_IMAGE}
                              alt={doctor.name}
                              className="h-full w-full object-cover"
                              onError={(e) => e.currentTarget.src = PLACEHOLDER_IMAGE}
                            />
                          </div>
                          <div className="p-4 flex flex-col justify-between flex-grow">
                            <div>
                              <h3 className="font-semibold">{doctor.name}</h3>
                              <p className="text-sm text-gray-600">{doctor.specialization}</p>
                              <p className="text-xs text-gray-500 mt-1">{doctor.experience}</p>
                            </div>
                            <div className="flex justify-end gap-2 mt-3">
                              <Button size="sm" variant="outline" onClick={() => handleEditDoctor(doctor)}>
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button size="sm" variant="outline" className="text-red-500 hover:text-red-700 border-red-300 hover:bg-red-50" onClick={() => handleDelete(doctor.id, "doctor")}>
                                <Trash className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 text-gray-500">
                    {searchQuery ? "Врачи не найдены по вашему запросу." : "Список врачей пуст. Добавьте первого врача!"}
                  </div>
                )}
              </div>
            </div>
          </TabsContent>

          {/* News Tab */}
          <TabsContent value="news" className="mt-0">
             <div className="bg-white shadow-md rounded-lg overflow-hidden">
              <div className="p-6">
                 {/* Search and Add Button Row */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                  <div className="relative w-full md:w-auto flex-grow md:max-w-md">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      type="text"
                      placeholder="Поиск новостей..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Button
                    onClick={() => {
                      resetNewsForm();
                      setShowNewsForm(true);
                       window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="bg-brand-blue hover:bg-blue-700 w-full md:w-auto"
                  >
                    <Plus className="mr-2 h-4 w-4" /> Добавить новость
                  </Button>
                </div>

                {/* News Add/Edit Form */}
                 {showNewsForm && (
                  <Card className="p-6 mb-6 border border-gray-200">
                    <h3 className="text-lg font-semibold mb-4">
                        {editingId !== null ? "Редактировать новость" : "Добавить новость"}
                    </h3>
                    <form onSubmit={handleNewsSubmit}>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div className="md:col-span-2">
                           <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">Заголовок*</label>
                           <Input id="title" name="title" value={newsForm.title} onChange={handleNewsFormChange} placeholder="Заголовок новости" required />
                        </div>
                        <div>
                           <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">Категория*</label>
                           <Input id="category" name="category" value={newsForm.category} onChange={handleNewsFormChange} placeholder="Категория" required />
                        </div>
                        <div>
                          <label htmlFor="news-image" className="block text-sm font-medium text-gray-700 mb-1">Изображение</label>
                          <div className="flex items-center gap-4">
                            {newsForm.image && (
                              <div className="h-20 w-20 rounded overflow-hidden bg-gray-100">
                                <img src={newsForm.image} alt="Предпросмотр" className="h-full w-full object-cover" onError={(e) => e.currentTarget.src = PLACEHOLDER_IMAGE} />
                              </div>
                            )}
                            <label className="cursor-pointer bg-gray-100 hover:bg-gray-200 text-gray-600 px-4 py-2 rounded flex items-center">
                              <Image className="h-4 w-4 mr-2" />
                               {newsForm.image ? "Изменить фото" : "Загрузить фото"}
                              <input id="news-image" type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e, "news")} />
                            </label>
                             {newsForm.image && (
                                <Button size="sm" variant="ghost" onClick={() => setNewsForm(prev => ({...prev, image: null}))} className="text-red-500">Удалить фото</Button>
                            )}
                          </div>
                        </div>
                        <div className="md:col-span-2">
                            <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">Содержание*</label>
                            <Textarea id="content" name="content" value={newsForm.content} onChange={handleNewsFormChange} placeholder="Текст новости..." required rows={5} />
                        </div>
                      </div>
                      <div className="flex justify-end gap-2">
                        <Button type="button" variant="outline" onClick={resetNewsForm}>Отмена</Button>
                        <Button type="submit" className="bg-brand-blue hover:bg-blue-700">{editingId !== null ? "Сохранить изменения" : "Добавить новость"}</Button>
                      </div>
                    </form>
                  </Card>
                 )}

                 {/* News List */}
                {filteredNews.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-gray-200 bg-gray-50">
                          <th className="text-left py-3 px-4 font-semibold text-sm text-gray-600">Заголовок</th>
                          <th className="text-left py-3 px-4 font-semibold text-sm text-gray-600">Дата</th>
                          <th className="text-left py-3 px-4 font-semibold text-sm text-gray-600">Категория</th>
                          <th className="text-right py-3 px-4 font-semibold text-sm text-gray-600">Действия</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredNews.map((newsItem) => (
                          <tr key={newsItem.id} className="border-b border-gray-100 hover:bg-gray-50">
                            <td className="py-3 px-4 align-top">
                              <div className="flex items-center">
                                <div className="h-10 w-10 mr-3 bg-gray-100 rounded overflow-hidden flex-shrink-0">
                                  <img
                                    src={newsItem.image || PLACEHOLDER_IMAGE}
                                    alt={newsItem.title}
                                    className="h-full w-full object-cover"
                                    onError={(e) => (e.currentTarget.src = PLACEHOLDER_IMAGE)}
                                  />
                                </div>
                                <span className="font-medium text-gray-800">{newsItem.title}</span>
                              </div>
                            </td>
                            <td className="py-3 px-4 text-sm text-gray-600 align-top">
                                {newsItem.date ? newsItem.date : <span className="text-gray-400 italic">Нет даты</span>}
                            </td>
                            <td className="py-3 px-4 align-top">
                              <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-medium">{newsItem.category}</span>
                            </td>
                            <td className="py-3 px-4 text-right align-top">
                              <div className="flex justify-end gap-2">
                                <Button size="sm" variant="outline" onClick={() => handleEditNews(newsItem)}>
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button size="sm" variant="outline" className="text-red-500 hover:text-red-700 border-red-300 hover:bg-red-50" onClick={() => handleDelete(newsItem.id, "news")}>
                                  <Trash className="h-4 w-4" />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-12 text-gray-500">
                     {searchQuery ? "Новости не найдены по вашему запросу." : "Список новостей пуст. Добавьте первую новость!"}
                  </div>
                )}
              </div>
            </div>
          </TabsContent>

          {/* Services Tab */}
          <TabsContent value="services" className="mt-0">
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
              <div className="p-6">
                  {/* Search and Add Button Row */}
                 <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                    <div className="relative w-full md:w-auto flex-grow md:max-w-md">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                        <Input
                        type="text"
                        placeholder="Поиск услуг..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                        />
                    </div>
                    <Button
                        onClick={() => {
                        resetServiceForm();
                        setShowServiceForm(true);
                         window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        className="bg-brand-blue hover:bg-blue-700 w-full md:w-auto"
                    >
                        <Plus className="mr-2 h-4 w-4" /> Добавить услугу
                    </Button>
                 </div>

                  {/* Service Add/Edit Form */}
                  {showServiceForm && (
                    <Card className="p-6 mb-6 border border-gray-200">
                        <h3 className="text-lg font-semibold mb-4">
                        {editingId !== null ? "Редактировать услугу" : "Добавить услугу"}
                        </h3>
                        <form onSubmit={handleServiceSubmit}>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                            <div className="md:col-span-2">
                            <label htmlFor="service-name" className="block text-sm font-medium text-gray-700 mb-1">Наименование услуги*</label>
                            <Input id="service-name" name="name" value={serviceForm.name} onChange={handleServiceFormChange} placeholder="Консультация терапевта" required />
                            </div>
                            <div>
                            <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">Цена (сум)*</label>
                            <Input id="price" name="price" type="number" value={serviceForm.price} onChange={handleServiceFormChange} placeholder="150000" required min="0" />
                            </div>
                            <div className="md:col-span-3">
                             <label htmlFor="service-category" className="block text-sm font-medium text-gray-700 mb-1">Категория*</label>
                             <Input id="service-category" name="category" value={serviceForm.category} onChange={handleServiceFormChange} placeholder="Терапия" required />
                            </div>
                        </div>
                        <div className="flex justify-end gap-2">
                            <Button type="button" variant="outline" onClick={resetServiceForm}>Отмена</Button>
                            <Button type="submit" className="bg-brand-blue hover:bg-blue-700">{editingId !== null ? "Сохранить изменения" : "Добавить услугу"}</Button>
                        </div>
                        </form>
                    </Card>
                    )}

                  {/* Services List */}
                {filteredServices.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                        <thead>
                            <tr className="border-b border-gray-200 bg-gray-50">
                            <th className="text-left py-3 px-4 font-semibold text-sm text-gray-600">Наименование услуги</th>
                            <th className="text-left py-3 px-4 font-semibold text-sm text-gray-600">Категория</th>
                            <th className="text-right py-3 px-4 font-semibold text-sm text-gray-600">Цена (сум)</th>
                            <th className="text-right py-3 px-4 font-semibold text-sm text-gray-600">Действия</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredServices.map((service) => (
                            <tr key={service.id} className="border-b border-gray-100 hover:bg-gray-50">
                                <td className="py-3 px-4 font-medium text-gray-800">{service.name}</td>
                                <td className="py-3 px-4 text-gray-600">{service.category}</td>
                                <td className="py-3 px-4 text-right font-medium text-gray-800">{service.price.toLocaleString('uz-UZ')}</td>
                                <td className="py-3 px-4 text-right">
                                <div className="flex justify-end gap-2">
                                    <Button size="sm" variant="outline" onClick={() => handleEditService(service)}>
                                        <Edit className="h-4 w-4" />
                                    </Button>
                                    <Button size="sm" variant="outline" className="text-red-500 hover:text-red-700 border-red-300 hover:bg-red-50" onClick={() => handleDelete(service.id, "service")}>
                                        <Trash className="h-4 w-4" />
                                    </Button>
                                </div>
                                </td>
                            </tr>
                            ))}
                        </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="text-center py-12 text-gray-500">
                         {searchQuery ? "Услуги не найдены по вашему запросу." : "Список услуг пуст. Добавьте первую услугу!"}
                    </div>
                )}
              </div>
            </div>
          </TabsContent>
        </div>
      </div>
    </Tabs>
  );
};

export default AdminPage;
