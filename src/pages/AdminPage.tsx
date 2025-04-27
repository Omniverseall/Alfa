import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Search, Plus, Edit, Trash, User, FileText, Image } from "lucide-react";
import { adminService } from "@/services/adminService";

const AdminPage = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("doctors");
  const [searchQuery, setSearchQuery] = useState("");
  const [showDoctorForm, setShowDoctorForm] = useState(false);
  const [showNewsForm, setShowNewsForm] = useState(false);
  const [showServiceForm, setShowServiceForm] = useState(false);
  
  const [doctors, setDoctors] = useState([]);
  const [news, setNews] = useState([]);
  const [services, setServices] = useState([]);
  
  const [doctorForm, setDoctorForm] = useState({
    id: null,
    name: "",
    specialization: "",
    experience: "",
    education: "",
    description: "",
    image: null,
  });
  
  const [newsForm, setNewsForm] = useState({
    id: null,
    title: "",
    category: "",
    content: "",
    image: null,
  });
  
  const [serviceForm, setServiceForm] = useState({
    id: null,
    name: "",
    price: "",
    category: "",
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setDoctors(adminService.getDoctors());
    setNews(adminService.getNews());
    setServices(adminService.getServices());
  };

  // Filter data based on search query
  const filteredDoctors = doctors.filter((doctor) =>
    doctor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    doctor.specialization.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const filteredNews = news.filter((newsItem) =>
    newsItem.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    newsItem.category.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const filteredServices = services.filter((service) =>
    service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    service.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Handle form changes
  const handleDoctorFormChange = (e) => {
    const { name, value } = e.target;
    setDoctorForm({ ...doctorForm, [name]: value });
  };
  
  const handleNewsFormChange = (e) => {
    const { name, value } = e.target;
    setNewsForm({ ...newsForm, [name]: value });
  };
  
  const handleServiceFormChange = (e) => {
    const { name, value } = e.target;
    setServiceForm({ ...serviceForm, [name]: value });
  };

  // Handle image upload
  const handleImageUpload = (e, formType) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      
      if (formType === "doctor") {
        setDoctorForm({ ...doctorForm, image: imageUrl });
      } else if (formType === "news") {
        setNewsForm({ ...newsForm, image: imageUrl });
      }
    }
  };

  // Reset forms
  const resetDoctorForm = () => {
    setDoctorForm({
      id: null,
      name: "",
      specialization: "",
      experience: "",
      education: "",
      description: "",
      image: null,
    });
    setShowDoctorForm(false);
  };
  
  const resetNewsForm = () => {
    setNewsForm({
      id: null,
      title: "",
      category: "",
      content: "",
      image: null,
    });
    setShowNewsForm(false);
  };
  
  const resetServiceForm = () => {
    setServiceForm({
      id: null,
      name: "",
      price: "",
      category: "",
    });
    setShowServiceForm(false);
  };

  // Handle edit item
  const handleEditDoctor = (doctor) => {
    setDoctorForm({
      id: doctor.id,
      name: doctor.name,
      specialization: doctor.specialization,
      experience: doctor.experience,
      education: doctor.education || "",
      description: doctor.description || "",
      image: doctor.image,
    });
    setShowDoctorForm(true);
  };
  
  const handleEditNews = (news) => {
    setNewsForm({
      id: news.id,
      title: news.title,
      category: news.category,
      content: news.content || "",
      image: news.image,
    });
    setShowNewsForm(true);
  };
  
  const handleEditService = (service) => {
    setServiceForm({
      id: service.id,
      name: service.name,
      price: service.price.toString(),
      category: service.category,
    });
    setShowServiceForm(true);
  };

  // Handle form submissions
  const handleDoctorSubmit = (e) => {
    e.preventDefault();
    try {
      if (doctorForm.id) {
        adminService.updateDoctor(doctorForm.id, doctorForm);
      } else {
        adminService.addDoctor(doctorForm);
      }
      loadData();
      setShowDoctorForm(false);
      toast({
        title: doctorForm.id ? "Врач обновлен" : "Врач добавлен",
        description: `Врач ${doctorForm.name} был успешно ${doctorForm.id ? "обновлен" : "добавлен"}.`,
      });
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Произошла ошибка при сохранении данных.",
        variant: "destructive",
      });
    }
  };

  const handleNewsSubmit = (e) => {
    e.preventDefault();
    try {
      if (newsForm.id) {
        adminService.updateNews(newsForm.id, newsForm);
      } else {
        adminService.addNews(newsForm);
      }
      loadData();
      setShowNewsForm(false);
      toast({
        title: newsForm.id ? "Новость обновлена" : "Новость добавлена",
        description: `Новость "${newsForm.title}" была успешно ${newsForm.id ? "обновлена" : "добавлена"}.`,
      });
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Произошла ошибка при сохранении данных.",
        variant: "destructive",
      });
    }
  };

  const handleServiceSubmit = (e) => {
    e.preventDefault();
    try {
      if (serviceForm.id) {
        adminService.updateService(serviceForm.id, serviceForm);
      } else {
        adminService.addService(serviceForm);
      }
      loadData();
      setShowServiceForm(false);
      toast({
        title: serviceForm.id ? "Услуга обновлена" : "Услуга добавлена",
        description: `Услуга "${serviceForm.name}" была успешно ${serviceForm.id ? "обновлена" : "добавлена"}.`,
      });
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Произошла ошибка при сохранении данных.",
        variant: "destructive",
      });
    }
  };

  const handleDelete = (id, type) => {
    try {
      switch (type) {
        case "doctor":
          adminService.deleteDoctor(id);
          break;
        case "news":
          adminService.deleteNews(id);
          break;
        case "service":
          adminService.deleteService(id);
          break;
      }
      loadData();
      toast({
        title: "Успешно удалено",
        description: "Элемент был успешно удален.",
      });
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Произошла ошибка при удалении.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="py-12 md:py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Панель администратора</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Управление контентом сайта - врачи, новости, услуги
          </p>
        </div>

        <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
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
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                  <div className="relative w-full md:w-auto flex-grow md:max-w-md">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
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
                    }}
                    className="bg-brand-blue hover:bg-blue-700 w-full md:w-auto"
                  >
                    <Plus className="mr-2 h-4 w-4" /> Добавить врача
                  </Button>
                </div>

                {showDoctorForm && (
                  <Card className="p-6 mb-6 border border-gray-200">
                    <h3 className="text-lg font-semibold mb-4">
                      {doctorForm.id ? "Редактировать врача" : "Добавить врача"}
                    </h3>
                    <form onSubmit={handleDoctorSubmit}>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                            ФИО*
                          </label>
                          <Input
                            id="name"
                            name="name"
                            value={doctorForm.name}
                            onChange={handleDoctorFormChange}
                            placeholder="Иванов Иван Иванович"
                            required
                          />
                        </div>
                        <div>
                          <label htmlFor="specialization" className="block text-sm font-medium text-gray-700 mb-1">
                            Специализация*
                          </label>
                          <Input
                            id="specialization"
                            name="specialization"
                            value={doctorForm.specialization}
                            onChange={handleDoctorFormChange}
                            placeholder="Кардиолог"
                            required
                          />
                        </div>
                        <div>
                          <label htmlFor="experience" className="block text-sm font-medium text-gray-700 mb-1">
                            Опыт работы*
                          </label>
                          <Input
                            id="experience"
                            name="experience"
                            value={doctorForm.experience}
                            onChange={handleDoctorFormChange}
                            placeholder="10 лет опыта"
                            required
                          />
                        </div>
                        <div>
                          <label htmlFor="education" className="block text-sm font-medium text-gray-700 mb-1">
                            Образование
                          </label>
                          <Input
                            id="education"
                            name="education"
                            value={doctorForm.education}
                            onChange={handleDoctorFormChange}
                            placeholder="Ташкентская медицинская академия"
                          />
                        </div>
                        <div className="md:col-span-2">
                          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                            Описание
                          </label>
                          <Textarea
                            id="description"
                            name="description"
                            value={doctorForm.description}
                            onChange={handleDoctorFormChange}
                            placeholder="Информация о враче..."
                            rows={3}
                          />
                        </div>
                        <div className="md:col-span-2">
                          <label htmlFor="doctor-image" className="block text-sm font-medium text-gray-700 mb-1">
                            Фотография
                          </label>
                          <div className="flex items-center gap-4">
                            {doctorForm.image && (
                              <div className="h-20 w-20 rounded overflow-hidden bg-gray-100">
                                <img 
                                  src={doctorForm.image} 
                                  alt="Doctor preview" 
                                  className="h-full w-full object-cover"
                                />
                              </div>
                            )}
                            <label className="cursor-pointer bg-gray-100 hover:bg-gray-200 text-gray-600 px-4 py-2 rounded flex items-center">
                              <Image className="h-4 w-4 mr-2" />
                              Загрузить фото
                              <input
                                id="doctor-image"
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(e) => handleImageUpload(e, "doctor")}
                              />
                            </label>
                          </div>
                        </div>
                      </div>
                      <div className="flex justify-end gap-2">
                        <Button 
                          type="button" 
                          variant="outline" 
                          onClick={resetDoctorForm}
                        >
                          Отмена
                        </Button>
                        <Button 
                          type="submit"
                          className="bg-brand-blue hover:bg-blue-700"
                        >
                          {doctorForm.id ? "Сохранить изменения" : "Добавить врача"}
                        </Button>
                      </div>
                    </form>
                  </Card>
                )}

                {filteredDoctors.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredDoctors.map((doctor) => (
                      <Card key={doctor.id} className="overflow-hidden">
                        <div className="flex h-full">
                          <div className="h-auto w-28 flex-shrink-0">
                            <img 
                              src={doctor.image} 
                              alt={doctor.name} 
                              className="h-full w-full object-cover"
                            />
                          </div>
                          <div className="p-4 flex flex-col justify-between flex-grow">
                            <div>
                              <h3 className="font-medium">{doctor.name}</h3>
                              <p className="text-sm text-gray-600">{doctor.specialization}</p>
                              <p className="text-xs text-gray-500">{doctor.experience}</p>
                            </div>
                            <div className="flex justify-end gap-2 mt-3">
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => handleEditDoctor(doctor)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button 
                                size="sm" 
                                variant="outline" 
                                className="text-red-500 hover:text-red-700"
                                onClick={() => handleDelete(doctor.id, "doctor")}
                              >
                                <Trash className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <p className="text-gray-500">Врачи не найдены.</p>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>
          
          {/* News Tab */}
          <TabsContent value="news" className="mt-0">
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
              <div className="p-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                  <div className="relative w-full md:w-auto flex-grow md:max-w-md">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
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
                    }}
                    className="bg-brand-blue hover:bg-blue-700 w-full md:w-auto"
                  >
                    <Plus className="mr-2 h-4 w-4" /> Добавить новость
                  </Button>
                </div>

                {showNewsForm && (
                  <Card className="p-6 mb-6 border border-gray-200">
                    <h3 className="text-lg font-semibold mb-4">
                      {newsForm.id ? "Редактировать новость" : "Добавить новость"}
                    </h3>
                    <form onSubmit={handleNewsSubmit}>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div className="md:col-span-2">
                          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                            Заголовок*
                          </label>
                          <Input
                            id="title"
                            name="title"
                            value={newsForm.title}
                            onChange={handleNewsFormChange}
                            placeholder="Заголовок новости"
                            required
                          />
                        </div>
                        <div>
                          <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                            Категория*
                          </label>
                          <Input
                            id="category"
                            name="category"
                            value={newsForm.category}
                            onChange={handleNewsFormChange}
                            placeholder="Категория"
                            required
                          />
                        </div>
                        <div>
                          <label htmlFor="news-image" className="block text-sm font-medium text-gray-700 mb-1">
                            Изображение
                          </label>
                          <div className="flex items-center gap-4">
                            {newsForm.image && (
                              <div className="h-12 w-12 rounded overflow-hidden bg-gray-100">
                                <img 
                                  src={newsForm.image} 
                                  alt="News preview" 
                                  className="h-full w-full object-cover"
                                />
                              </div>
                            )}
                            <label className="cursor-pointer bg-gray-100 hover:bg-gray-200 text-gray-600 px-4 py-2 rounded flex items-center">
                              <Image className="h-4 w-4 mr-2" />
                              Загрузить фото
                              <input
                                id="news-image"
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(e) => handleImageUpload(e, "news")}
                              />
                            </label>
                          </div>
                        </div>
                        <div className="md:col-span-2">
                          <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
                            Содержание*
                          </label>
                          <Textarea
                            id="content"
                            name="content"
                            value={newsForm.content}
                            onChange={handleNewsFormChange}
                            placeholder="Текст новости..."
                            required
                            rows={5}
                          />
                        </div>
                      </div>
                      <div className="flex justify-end gap-2">
                        <Button 
                          type="button" 
                          variant="outline" 
                          onClick={resetNewsForm}
                        >
                          Отмена
                        </Button>
                        <Button 
                          type="submit"
                          className="bg-brand-blue hover:bg-blue-700"
                        >
                          {newsForm.id ? "Сохранить изменения" : "Добавить новость"}
                        </Button>
                      </div>
                    </form>
                  </Card>
                )}

                {filteredNews.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-gray-200">
                          <th className="text-left py-3 px-4 font-semibold text-sm">Заголовок</th>
                          <th className="text-left py-3 px-4 font-semibold text-sm">Дата</th>
                          <th className="text-left py-3 px-4 font-semibold text-sm">Категория</th>
                          <th className="text-right py-3 px-4 font-semibold text-sm">Действия</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredNews.map((news) => (
                          <tr key={news.id} className="border-b border-gray-100 hover:bg-gray-50">
                            <td className="py-3 px-4">
                              <div className="flex items-center">
                                <div className="h-10 w-10 mr-3 bg-gray-100 rounded overflow-hidden">
                                  <img 
                                    src={news.image} 
                                    alt={news.title} 
                                    className="h-full w-full object-cover"
                                  />
                                </div>
                                <span className="truncate max-w-md">{news.title}</span>
                              </div>
                            </td>
                            <td className="py-3 px-4">{news.date}</td>
                            <td className="py-3 px-4">
                              <span className="px-2 py-1 bg-gray-100 rounded text-xs">{news.category}</span>
                            </td>
                            <td className="py-3 px-4 text-right">
                              <div className="flex justify-end gap-2">
                                <Button 
                                  size="sm" 
                                  variant="outline"
                                  onClick={() => handleEditNews(news)}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button 
                                  size="sm" 
                                  variant="outline" 
                                  className="text-red-500 hover:text-red-700"
                                  onClick={() => handleDelete(news.id, "news")}
                                >
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
                  <div className="text-center py-12">
                    <p className="text-gray-500">Новости не найдены.</p>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>
          
          {/* Services Tab */}
          <TabsContent value="services" className="mt-0">
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
              <div className="p-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                  <div className="relative w-full md:w-auto flex-grow md:max-w-md">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
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
                    }}
                    className="bg-brand-blue hover:bg-blue-700 w-full md:w-auto"
                  >
                    <Plus className="mr-2 h-4 w-4" /> Добавить услугу
                  </Button>
                </div>

                {showServiceForm && (
                  <Card className="p-6 mb-6 border border-gray-200">
                    <h3 className="text-lg font-semibold mb-4">
                      {serviceForm.id ? "Редактировать услугу" : "Добавить услугу"}
                    </h3>
                    <form onSubmit={handleServiceSubmit}>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div className="md:col-span-2">
                          <label htmlFor="service-name" className="block text-sm font-medium text-gray-700 mb-1">
                            Наименование услуги*
                          </label>
                          <Input
                            id="service-name"
                            name="name"
                            value={serviceForm.name}
                            onChange={handleServiceFormChange}
                            placeholder="Наименование услуги"
                            required
                          />
                        </div>
                        <div>
                          <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
                            Цена (сум)*
                          </label>
                          <Input
                            id="price"
                            name="price"
                            type="number"
                            value={serviceForm.price}
                            onChange={handleServiceFormChange}
                            placeholder="100000"
                            required
                            min="0"
                          />
                        </div>
                        <div className="md:col-span-3">
                          <label htmlFor="service-category" className="block text-sm font-medium text-gray-700 mb-1">
                            Категория*
                          </label>
                          <Input
                            id="service-category"
                            name="category"
                            value={serviceForm.category}
                            onChange={handleServiceFormChange}
                            placeholder="Категория услуги"
                            required
                          />
                        </div>
                      </div>
                      <div className="flex justify-end gap-2">
                        <Button 
                          type="button" 
                          variant="outline" 
                          onClick={resetServiceForm}
                        >
                          Отмена
                        </Button>
                        <Button 
                          type="submit"
                          className="bg-brand-blue hover:bg-blue-700"
                        >
                          {serviceForm.id ? "Сохранить изменения" : "Добавить услугу"}
                        </Button>
                      </div>
                    </form>
                  </Card>
                )}

                {filteredServices.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-gray-200">
                          <th className="text-left py-3 px-4 font-semibold text-sm">Наименование услуги</th>
                          <th className="text-left py-3 px-4 font-semibold text-sm">Категория</th>
                          <th className="text-right py-3 px-4 font-semibold text-sm">Цена (сум)</th>
                          <th className="text-right py-3 px-4 font-semibold text-sm">Действия</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredServices.map((service) => (
                          <tr key={service.id} className="border-b border-gray-100 hover:bg-gray-50">
                            <td className="py-3 px-4">{service.name}</td>
                            <td className="py-3 px-4">
                              <span className="px-2 py-1 bg-gray-100 rounded text-xs">{service.category}</span>
                            </td>
                            <td className="py-3 px-4 text-right font-medium">{service.price.toLocaleString()}</td>
                            <td className="py-3 px-4 text-right">
                              <div className="flex justify-end gap-2">
                                <Button 
                                  size="sm" 
                                  variant="outline"
                                  onClick={() => handleEditService(service)}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button 
                                  size="sm" 
                                  variant="outline" 
                                  className="text-re
                                  d-500 hover:text-red-700"
                                  onClick={() => handleDelete(service.id, "service")}
                                >
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
                  <div className="text-center py-12">
                    <p className="text-gray-500">Услуги не найдены.</p>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminPage;