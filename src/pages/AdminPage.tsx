import React, { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Search, Plus, Edit, Trash, Image as ImageIcon } from "lucide-react";
import { adminService, Doctor, NewsItem, GeneralService, DoctorConsultationSlot } from "@/services/adminService";

const PLACEHOLDER_IMAGE = "/placeholder.svg";

const LabelInput = ({ label, id, ...props }: React.InputHTMLAttributes<HTMLInputElement> & { label: string }) => (
  <div>
    <label htmlFor={id || props.name} className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
    <Input id={id || props.name} {...props} />
  </div>
);
const LabelTextarea = ({ label, id, ...props }: React.TextareaHTMLAttributes<HTMLTextAreaElement> & { label: string }) => (
  <div>
    <label htmlFor={id || props.name} className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
    <Textarea id={id || props.name} {...props} />
  </div>
);

const AdminPage = () => {
  const { toast } = useToast();
  const [searchQueryServices, setSearchQueryServices] = useState("");
  const [searchQueryDoctors, setSearchQueryDoctors] = useState("");
  const [searchQueryNews, setSearchQueryNews] = useState("");
  const [activeMainTab, setActiveMainTab] = useState("doctors");
  const [activeServiceSubTab, setActiveServiceSubTab] = useState("doctorConsultations");

  const [showDoctorProfileForm, setShowDoctorProfileForm] = useState(false);
  const [showNewsForm, setShowNewsForm] = useState(false);
  const [showGeneralServiceForm, setShowGeneralServiceForm] = useState(false);
  const [showDoctorSlotForm, setShowDoctorSlotForm] = useState(false);

  const [loadingDoctors, setLoadingDoctors] = useState(true);
  const [loadingNews, setLoadingNews] = useState(true);
  const [loadingGeneralServices, setLoadingGeneralServices] = useState(true);
  const [loadingDoctorSlots, setLoadingDoctorSlots] = useState(true);

  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [news, setNews] = useState<NewsItem[]>([]);
  const [generalServices, setGeneralServices] = useState<GeneralService[]>([]);
  const [doctorSlots, setDoctorSlots] = useState<DoctorConsultationSlot[]>([]);

  const initialDoctorProfileFormState: Omit<Doctor, 'id'> = { name: "", specialization: "", experience: "", education: "", description: "", image: null };
  const initialNewsFormState: Omit<NewsItem, 'id'> = { title: "", category: "", content: "", image: null, date: "" };
  const initialGeneralServiceFormState: Omit<GeneralService, 'id'> = { name: "", price: 0 };
  const initialDoctorSlotFormState: Omit<DoctorConsultationSlot, 'id'> = { specialization: "", doctor_fio: "", reception_days: "", reception_hours: "", price: 0 };

  const [doctorProfileForm, setDoctorProfileForm] = useState(initialDoctorProfileFormState);
  const [newsForm, setNewsForm] = useState(initialNewsFormState);
  const [generalServiceForm, setGeneralServiceForm] = useState(initialGeneralServiceFormState);
  const [doctorSlotForm, setDoctorSlotForm] = useState(initialDoctorSlotFormState);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingEntityType, setEditingEntityType] = useState<"doctorProfile" | "news" | "generalService" | "doctorSlot" | null>(null);

  useEffect(() => {
    loadAllData();
    const unsubs = [
      adminService.subscribeDoctors(setDoctors), adminService.subscribeNews(setNews),
      adminService.subscribeGeneralServices(setGeneralServices), adminService.subscribeDoctorConsultationSlots(setDoctorSlots)
    ];
    return () => unsubs.forEach(unsub => unsub());
  }, []);

  useEffect(() => {
    setSearchQueryServices("");
    setSearchQueryDoctors("");
    setSearchQueryNews("");
  }, [activeMainTab]);

  const loadAllData = async () => {
    setLoadingDoctors(true); setLoadingNews(true); setLoadingGeneralServices(true); setLoadingDoctorSlots(true);
    try {
      await Promise.all([
        adminService.getDoctors().then(setDoctors),
        adminService.getNews().then(setNews),
        adminService.getGeneralServices().then(setGeneralServices),
        adminService.getDoctorConsultationSlots().then(setDoctorSlots),
      ]);
    } catch (e) { 
        console.error("Ошибка при загрузке всех данных в AdminPage:", e); 
        toast({ title: "Ошибка загрузки данных", description: (e instanceof Error ? e.message : String(e)), variant: "destructive" }); 
    }
    finally { 
        setLoadingDoctors(false); 
        setLoadingNews(false); 
        setLoadingGeneralServices(false); 
        setLoadingDoctorSlots(false); 
    }
  };

  const filteredDoctors = doctors.filter(d => !searchQueryDoctors || d.name.toLowerCase().includes(searchQueryDoctors.toLowerCase()) || d.specialization.toLowerCase().includes(searchQueryDoctors.toLowerCase()));
  const filteredNews = news.filter(n => !searchQueryNews || n.title.toLowerCase().includes(searchQueryNews.toLowerCase()) || (n.category?.toLowerCase().includes(searchQueryNews.toLowerCase())));
  
  const filteredGeneralServices = generalServices.filter(s => !searchQueryServices || s.name.toLowerCase().includes(searchQueryServices.toLowerCase()));
  const filteredDoctorSlots = doctorSlots.filter(s => !searchQueryServices || s.specialization.toLowerCase().includes(searchQueryServices.toLowerCase()) || s.doctor_fio.toLowerCase().includes(searchQueryServices.toLowerCase()));

  const handleInputChange = (setter: React.Dispatch<React.SetStateAction<any>>, e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setter(prev => ({ ...prev, [name]: name === "price" ? (value === "" ? 0 : Number(value)) : value }));
  };
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, formType: "doctorProfile" | "news") => {
    const file = e.target.files?.[0]; if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      const imageUrl = reader.result as string;
      if (formType === "doctorProfile") setDoctorProfileForm(prev => ({ ...prev, image: imageUrl }));
      else setNewsForm(prev => ({ ...prev, image: imageUrl }));
    };
    reader.readAsDataURL(file); e.target.value = "";
  };

  const resetAllForms = () => {
    setDoctorProfileForm(initialDoctorProfileFormState); setShowDoctorProfileForm(false);
    setNewsForm(initialNewsFormState); setShowNewsForm(false);
    setGeneralServiceForm(initialGeneralServiceFormState); setShowGeneralServiceForm(false);
    setDoctorSlotForm(initialDoctorSlotFormState); setShowDoctorSlotForm(false);
    setEditingId(null); setEditingEntityType(null);
  };

  const commonSubmitHandler = async (action: () => Promise<any>, entityName: string) => {
    try { await action(); toast({title: `${entityName} ${editingId ? 'обновлен(а)' : 'добавлен(а)'}`}); resetAllForms(); await loadAllData(); }
    catch (e) { console.error(e); toast({title: 'Ошибка', description: `Не удалось сохранить ${entityName.toLowerCase()}`, variant: 'destructive'});}
  };

  const handleDoctorProfileSubmit = (e: React.FormEvent<HTMLFormElement>) => { e.preventDefault(); commonSubmitHandler(editingId ? () => adminService.updateDoctor(editingId, doctorProfileForm) : () => adminService.addDoctor(doctorProfileForm), "Профиль врача"); };
  const handleNewsSubmit = (e: React.FormEvent<HTMLFormElement>) => { e.preventDefault(); const newsData = {...newsForm, date: newsForm.date || new Date().toISOString().split('T')[0]}; commonSubmitHandler(editingId ? () => adminService.updateNews({...newsData, id: editingId}) : () => adminService.addNews(newsData), "Новость");};
  const handleGeneralServiceSubmit = (e: React.FormEvent<HTMLFormElement>) => { e.preventDefault(); commonSubmitHandler(editingId ? () => adminService.updateGeneralService(editingId, generalServiceForm) : () => adminService.addGeneralService(generalServiceForm), "Услуга");};
  const handleDoctorSlotSubmit = (e: React.FormEvent<HTMLFormElement>) => { e.preventDefault(); commonSubmitHandler(editingId ? () => adminService.updateDoctorConsultationSlot(editingId, doctorSlotForm) : () => adminService.addDoctorConsultationSlot(doctorSlotForm), "Консультация врача");};

  const commonDeleteHandler = async (id: string, type: "doctor"|"news"|"generalService"|"doctorSlot", name?: string) => {
    if(!window.confirm(`Удалить ${name || 'элемент'}?`)) return;
    try{
      let success = false;
      if(type==='doctor') success = await adminService.deleteDoctor(id);
      else if(type==='news') success = await adminService.deleteNews(id);
      else if(type==='generalService') success = await adminService.deleteGeneralService(id);
      else if(type==='doctorSlot') success = await adminService.deleteDoctorConsultationSlot(id);
      if(success) {toast({title:'Удалено'}); await loadAllData();} else toast({title:'Ошибка удаления', variant:'destructive'});
    }catch(e){console.error(e); toast({title:'Ошибка удаления', variant:'destructive'});}
  };

  const openEditForm = (item: any, type: "doctorProfile"|"news"|"generalService"|"doctorSlot") => {
    resetAllForms();
    setEditingId(item.id);
    setEditingEntityType(type);
    if(type==='doctorProfile'){ setDoctorProfileForm(item); setShowDoctorProfileForm(true); }
    else if(type==='news'){ setNewsForm(item.date ? item : {...item, date: new Date().toISOString().split('T')[0]}); setShowNewsForm(true); }
    else if(type==='generalService'){ setGeneralServiceForm(item); setShowGeneralServiceForm(true); }
    else if(type==='doctorSlot'){ setDoctorSlotForm(item); setShowDoctorSlotForm(true); } 
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const renderLoading = <div className="text-center py-12 text-gray-500">Загрузка...</div>;
  const renderEmpty = (entityName: string, query?: string) => <div className="text-center py-12 text-gray-500">{query ? `${entityName} не найдены.` : `Список ${entityName.toLowerCase()} пуст.`}</div>;
  
  return (
    <Tabs value={activeMainTab} onValueChange={setActiveMainTab} className="w-full">
      <div className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">Панель администратора</h1>
          </div>

          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="doctors">Врачи</TabsTrigger>
            <TabsTrigger value="news">Новости</TabsTrigger>
            <TabsTrigger value="servicesAndSlots">Услуги и Цены</TabsTrigger>
          </TabsList>

          <TabsContent value="doctors" className="mt-0">
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
              <div className="p-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                  <div className="relative w-full md:w-auto flex-grow md:max-w-md">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input type="text" placeholder="Поиск врачей (профили)..." value={searchQueryDoctors} onChange={(e) => setSearchQueryDoctors(e.target.value)} className="pl-10"/>
                  </div>
                  <Button onClick={() => { resetAllForms(); setShowDoctorProfileForm(true); }} className="bg-blue-600 hover:bg-blue-700 text-white w-full md:w-auto">
                    <Plus className="mr-2 h-4 w-4" /> Добавить профиль врача
                  </Button>
                </div>
                {showDoctorProfileForm && ( 
                  <Card className="p-6 mb-6 border border-gray-200">
                    <h3 className="text-lg font-semibold mb-4">{editingId && editingEntityType === 'doctorProfile' ? "Редактировать профиль врача" : "Добавить профиль врача"}</h3>
                    <form onSubmit={handleDoctorProfileSubmit} className="space-y-4">
                      <LabelTextarea label="ФИО*" name="name" value={doctorProfileForm.name} onChange={e => handleInputChange(setDoctorProfileForm, e)} required />
                      <LabelTextarea label="Специализация*" name="specialization" value={doctorProfileForm.specialization} onChange={e => handleInputChange(setDoctorProfileForm, e)} required />
                      <LabelTextarea label="Опыт работы" name="experience" value={doctorProfileForm.experience} onChange={e => handleInputChange(setDoctorProfileForm, e)} />
                      <LabelTextarea label="Образование" name="education" value={doctorProfileForm.education ?? ''} onChange={e => handleInputChange(setDoctorProfileForm, e)} />
                      <LabelTextarea label="Описание" name="description" value={doctorProfileForm.description ?? ''} onChange={e => handleInputChange(setDoctorProfileForm, e)} />
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Фото</label>
                        <div className="flex items-center gap-4">
                          {doctorProfileForm.image && (<img src={doctorProfileForm.image} alt="Предпросмотр" className="h-20 w-20 rounded object-cover"/>)}
                          <label className="cursor-pointer bg-gray-100 hover:bg-gray-200 text-gray-600 px-4 py-2 rounded flex items-center">
                            <ImageIcon className="h-4 w-4 mr-2" />{doctorProfileForm.image ? "Изменить" : "Загрузить"}
                            <input type="file" accept="image/*" className="hidden" onChange={e => handleImageUpload(e, "doctorProfile")} />
                          </label>
                          {doctorProfileForm.image && (<Button size="sm" variant="ghost" onClick={() => setDoctorProfileForm(p => ({ ...p, image: null }))} className="text-red-500">Удалить</Button>)}
                        </div>
                      </div>
                      <div className="flex justify-end gap-2">
                        <Button type="button" variant="outline" onClick={resetAllForms}>Отмена</Button>
                        <Button type="submit">{editingId && editingEntityType === 'doctorProfile' ? "Сохранить" : "Добавить"}</Button>
                      </div>
                    </form>
                  </Card>
                )}
                {loadingDoctors ? renderLoading : filteredDoctors.length === 0 ? renderEmpty("Профили врачей", searchQueryDoctors) : 
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredDoctors.map(d => ( 
                      <Card key={d.id} className="overflow-hidden flex flex-col h-full">
                        <div className="aspect-[3/4] w-full flex-shrink-0">
                            <img src={d.image || PLACEHOLDER_IMAGE} alt={d.name} className="w-full h-full object-cover"/>
                        </div>
                        <div className="p-4 flex flex-col flex-grow">
                          <div className="flex-grow">
                            <h3 className="font-semibold whitespace-pre-wrap text-lg mb-1">{d.name}</h3>
                            <p className="text-sm text-gray-600 whitespace-pre-wrap mb-1">{d.specialization}</p>
                            {d.experience && (
                                <div className="mb-2 mt-1">
                                    <strong className="text-xs text-gray-700">Опыт работы:</strong>
                                    <p className="text-xs text-gray-500 mt-0.5 whitespace-pre-wrap">{d.experience}</p>
                                </div>
                            )}
                            {d.education && (
                                <div className="mb-2">
                                    <strong className="text-xs text-gray-700">Образование:</strong>
                                    <p className="text-xs text-gray-500 mt-0.5 whitespace-pre-wrap">{d.education}</p>
                                </div>
                            )}
                            {d.description && (
                                <div>
                                    <strong className="text-xs text-gray-700">Описание:</strong>
                                    <p className="text-sm text-gray-600 mt-0.5 whitespace-pre-wrap">{d.description}</p>
                                </div>
                            )}
                          </div>
                          <div className="pt-3 flex justify-end gap-2 flex-shrink-0">
                            <Button size="sm" variant="outline" onClick={() => openEditForm(d, 'doctorProfile')}><Edit className="h-4 w-4"/></Button>
                            <Button size="sm" variant="destructive" onClick={() => commonDeleteHandler(d.id, 'doctor', d.name)}><Trash className="h-4 w-4"/></Button>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                }
              </div>
            </div>
          </TabsContent>

          <TabsContent value="news" className="mt-0">
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
              <div className="p-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                    <div className="relative w-full md:w-auto flex-grow md:max-w-md">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                        <Input type="text" placeholder="Поиск новостей..." value={searchQueryNews} onChange={(e) => setSearchQueryNews(e.target.value)} className="pl-10"/>
                    </div>
                    <Button onClick={() => { resetAllForms(); setShowNewsForm(true); }} className="bg-blue-600 hover:bg-blue-700 text-white w-full md:w-auto">
                        <Plus className="mr-2 h-4 w-4" /> Добавить новость
                    </Button>
                </div>
                {showNewsForm && ( 
                  <Card className="p-6 mb-6 border border-gray-200">
                    <h3 className="text-lg font-semibold mb-4">{editingId && editingEntityType === 'news' ? "Редактировать новость" : "Добавить новость"}</h3>
                    <form onSubmit={handleNewsSubmit} className="space-y-4">
                      <LabelTextarea label="Заголовок*" name="title" value={newsForm.title} onChange={e=>handleInputChange(setNewsForm,e)} required />
                      <LabelTextarea label="Категория*" name="category" value={newsForm.category} onChange={e=>handleInputChange(setNewsForm,e)} required />
                      <LabelInput label="Дата (ГГГГ-ММ-ДД)" name="date" type="date" value={newsForm.date} onChange={e=>handleInputChange(setNewsForm,e)} />
                      <LabelTextarea label="Содержание*" name="content" value={newsForm.content} onChange={e=>handleInputChange(setNewsForm,e)} required />
                      <div>
                        <label className="block text-sm font-medium">Изображение</label>
                        <div className="flex items-center gap-4 mt-1">
                          {newsForm.image && (<img src={newsForm.image} alt="preview" className="h-20 w-20 rounded object-cover"/>)}
                          <label className="cursor-pointer bg-gray-100 hover:bg-gray-200 text-gray-600 px-4 py-2 rounded flex items-center">
                            <ImageIcon className="h-4 w-4 mr-2" />{newsForm.image?"Изменить":"Загрузить"}
                            <input type="file" className="hidden" accept="image/*" onChange={e=>handleImageUpload(e,'news')}/>
                          </label>
                          {newsForm.image && <Button size="sm" variant="ghost" onClick={()=>setNewsForm(p=>({...p,image:null}))} className="text-red-500">Удалить</Button>}
                        </div>
                      </div>
                      <div className="flex justify-end gap-2">
                        <Button type="button" variant="outline" onClick={resetAllForms}>Отмена</Button>
                        <Button type="submit">{editingId && editingEntityType === 'news'?"Сохранить":"Добавить"}</Button>
                      </div>
                    </form>
                  </Card>
                )}
                {loadingNews?renderLoading:filteredNews.length===0?renderEmpty("Новости", searchQueryNews):
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b bg-gray-50">
                          <th className="p-3 text-left font-semibold">Заголовок</th>
                          <th className="p-3 text-left font-semibold">Категория</th>
                          <th className="p-3 text-left font-semibold">Дата</th>
                          <th className="p-3 text-left font-semibold">Содержание</th>
                          <th className="p-3 text-right font-semibold">Действия</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredNews.map(n=>(
                          <tr key={n.id} className="border-b hover:bg-gray-50">
                            <td className="p-3">
                                <div className="flex items-center">
                                    {n.image && <img src={n.image} alt="" className="h-12 w-12 object-cover rounded mr-3 flex-shrink-0"/>}
                                    <span className="whitespace-pre-wrap">{n.title}</span>
                                </div>
                            </td>
                            <td className="p-3 whitespace-pre-wrap">{n.category}</td>
                            <td className="p-3">{new Date(n.date).toLocaleDateString()}</td>
                            <td className="p-3 whitespace-pre-wrap min-w-[200px] max-w-xs">{n.content}</td>
                            <td className="p-3 text-right">
                              <Button size="sm" variant="outline" className="mr-2" onClick={()=>openEditForm(n,'news')}><Edit className="h-4 w-4"/></Button>
                              <Button size="sm" variant="destructive" onClick={()=>commonDeleteHandler(n.id,'news',n.title)}><Trash className="h-4 w-4"/></Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                }
              </div>
            </div>
        </TabsContent>

        <TabsContent value="servicesAndSlots" className="mt-0">
          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <div className="p-6">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                 <div className="relative w-full md:w-auto flex-grow md:max-w-md">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input type="text" placeholder="Поиск по услугам/консультациям..." value={searchQueryServices} onChange={(e) => setSearchQueryServices(e.target.value)} className="pl-10"/>
                  </div>
              </div>

              <Tabs value={activeServiceSubTab} onValueChange={setActiveServiceSubTab} className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-6">
                  <TabsTrigger value="doctorConsultations">Консультации врачей (Прайс)</TabsTrigger>
                  <TabsTrigger value="generalDiagnostics">Диагностика и другие услуги</TabsTrigger>
                </TabsList>

                <TabsContent value="doctorConsultations">
                  <div className="flex justify-end mb-4">
                    <Button onClick={() => { resetAllForms(); setShowDoctorSlotForm(true); }} className="bg-blue-600 hover:bg-blue-700 text-white">
                        <Plus className="mr-2 h-4 w-4" /> Добавить консультацию
                    </Button>
                  </div>
                  {showDoctorSlotForm && (
                    <Card className="p-6 mb-6 border border-gray-200">
                      <h3 className="text-lg font-semibold mb-4">{editingId && editingEntityType === 'doctorSlot' ? "Редактировать консультацию" : "Добавить консультацию"}</h3>
                      <form onSubmit={handleDoctorSlotSubmit} className="space-y-4">
                          <LabelTextarea label="Специализация врача (напр. Терапевт)*" name="specialization" value={doctorSlotForm.specialization} onChange={e=>handleInputChange(setDoctorSlotForm, e)} required />
                          <LabelTextarea label="ФИО врача*" name="doctor_fio" value={doctorSlotForm.doctor_fio} onChange={e=>handleInputChange(setDoctorSlotForm, e)} required />
                          <LabelTextarea label="Дни приёма" name="reception_days" value={doctorSlotForm.reception_days ?? ''} onChange={e=>handleInputChange(setDoctorSlotForm, e)} />
                          <LabelTextarea label="Часы приёма" name="reception_hours" value={doctorSlotForm.reception_hours ?? ''} onChange={e=>handleInputChange(setDoctorSlotForm, e)} />
                          <LabelInput label="Цена*" type="number" name="price" value={doctorSlotForm.price.toString()} onChange={e=>handleInputChange(setDoctorSlotForm, e)} placeholder="0" required min="0"/>
                          <div className="flex justify-end gap-2"><Button type="button" variant="outline" onClick={resetAllForms}>Отмена</Button><Button type="submit">{editingId && editingEntityType === 'doctorSlot'?"Сохранить":"Добавить"}</Button></div>
                      </form>
                    </Card>
                  )}
                  {loadingDoctorSlots ? renderLoading : filteredDoctorSlots.length === 0 ? renderEmpty("Консультации врачей", searchQueryServices) : 
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b bg-gray-50">
                            <th className="p-3 text-left font-semibold">Врач (Специализация)</th>
                            <th className="p-3 text-left font-semibold">Ф.И.О.</th>
                            <th className="p-3 text-left font-semibold">Дни приёма</th>
                            <th className="p-3 text-left font-semibold">Часы приёма</th>
                            <th className="p-3 text-right font-semibold">Цена</th>
                            <th className="p-3 text-right font-semibold">Действия</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredDoctorSlots.map(s=>(
                            <tr key={s.id} className="border-b hover:bg-gray-50">
                              <td className="p-3 whitespace-pre-wrap">{s.specialization}</td>
                              <td className="p-3 whitespace-pre-wrap">{s.doctor_fio}</td>
                              <td className="p-3 whitespace-pre-wrap">{s.reception_days}</td>
                              <td className="p-3 whitespace-pre-wrap">{s.reception_hours}</td>
                              <td className="p-3 text-right">{s.price.toLocaleString('uz-UZ')}</td>
                              <td className="p-3 text-right">
                                <Button size="sm" variant="outline" className="mr-2" onClick={()=>openEditForm(s,'doctorSlot')}><Edit className="h-4 w-4"/></Button>
                                <Button size="sm" variant="destructive" onClick={()=>commonDeleteHandler(s.id,'doctorSlot',`${s.specialization} - ${s.doctor_fio}`)}><Trash className="h-4 w-4"/></Button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  }
                </TabsContent>

                <TabsContent value="generalDiagnostics">
                  <div className="flex justify-end mb-4">
                    <Button onClick={() => { resetAllForms(); setShowGeneralServiceForm(true); }} className="bg-blue-600 hover:bg-blue-700 text-white">
                        <Plus className="mr-2 h-4 w-4" /> Добавить общую услугу
                    </Button>
                  </div>
                  {showGeneralServiceForm && (
                    <Card className="p-6 mb-6 border border-gray-200">
                      <h3 className="text-lg font-semibold mb-4">{editingId && editingEntityType === 'generalService' ? "Редактировать услугу" : "Добавить общую услугу"}</h3>
                      <form onSubmit={handleGeneralServiceSubmit} className="space-y-4">
                          <LabelTextarea label="Наименование услуги*" name="name" value={generalServiceForm.name} onChange={e=>handleInputChange(setGeneralServiceForm, e)} required />
                          <LabelInput label="Цена*" type="number" name="price" value={generalServiceForm.price.toString()} onChange={e=>handleInputChange(setGeneralServiceForm, e)} placeholder="0" required min="0"/>
                          <div className="flex justify-end gap-2"><Button type="button" variant="outline" onClick={resetAllForms}>Отмена</Button><Button type="submit">{editingId && editingEntityType === 'generalService'?"Сохранить":"Добавить"}</Button></div>
                      </form>
                    </Card>
                  )}
                  {loadingGeneralServices?renderLoading:filteredGeneralServices.length===0?renderEmpty("Общие услуги", searchQueryServices):
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b bg-gray-50">
                            <th className="p-3 text-left font-semibold">Наименование услуги</th>
                            <th className="p-3 text-right font-semibold">Цена</th>
                            <th className="p-3 text-right font-semibold">Действия</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredGeneralServices.map(s=>(
                            <tr key={s.id} className="border-b hover:bg-gray-50">
                              <td className="p-3 whitespace-pre-wrap">{s.name}</td>
                              <td className="p-3 text-right">{s.price.toLocaleString('uz-UZ')}</td>
                              <td className="p-3 text-right">
                                <Button size="sm" variant="outline" className="mr-2" onClick={()=>openEditForm(s,'generalService')}><Edit className="h-4 w-4"/></Button>
                                <Button size="sm" variant="destructive" onClick={()=>commonDeleteHandler(s.id,'generalService',s.name)}><Trash className="h-4 w-4"/></Button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  }
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </TabsContent>
      </div></div>
    </Tabs>
  );
};
export default AdminPage;