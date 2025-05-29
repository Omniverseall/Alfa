// src/pages/AdminPage.tsx
import React, { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Search, Plus, Edit, Trash, Image as ImageIcon, Smartphone, AlertTriangle } from "lucide-react"; // Добавлены иконки
import { adminService, Doctor, NewsItem, GeneralService, DoctorConsultationSlot } from "@/services/adminService";

const PLACEHOLDER_IMAGE = "/placeholder.svg";

// Функция для примерной проверки, является ли устройство телефоном
const isLikelyMobilePhone = (): boolean => {
  if (typeof window !== 'undefined') {
    // Проверка по User Agent (менее надежно, но может помочь отсечь некоторые случаи)
    const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera;
    if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|rim)|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(userAgent) ||
        /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1|)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(userAgent.substr(0, 4))) {
      return true;
    }
    // Дополнительная проверка по ширине экрана для современных телефонов, которые могут не попадать под User Agent
    if (window.innerWidth < 768) { // Пороговое значение можно настроить
        // Это может также захватить планшеты в портретном режиме или маленькие окна на десктопе
        // Можно добавить более сложную логику, если нужно точнее
        if (window.innerHeight > window.innerWidth) { // Обычно у телефонов высота больше ширины в портрете
             // Проверим еще раз User Agent на наличие "Mobile", чтобы уменьшить ложные срабатывания на планшетах
            if (/Mobile/i.test(userAgent)) {
                 return true;
            }
        }
    }
  }
  return false;
};


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
  const [isMobileDevice, setIsMobileDevice] = useState(false); // Состояние для определения мобильного устройства

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
    setIsMobileDevice(isLikelyMobilePhone()); // Проверяем при монтировании
    
    const handleResize = () => {
        setIsMobileDevice(isLikelyMobilePhone()); // И при изменении размера окна
    };

    window.addEventListener('resize', handleResize);

    if (!isLikelyMobilePhone()) { // Загружаем данные, только если это не телефон
        loadAllData();
        const unsubs = [
          adminService.subscribeDoctors(setDoctors), adminService.subscribeNews(setNews),
          adminService.subscribeGeneralServices(setGeneralServices), adminService.subscribeDoctorConsultationSlots(setDoctorSlots)
        ];
        return () => {
            unsubs.forEach(unsub => unsub());
            window.removeEventListener('resize', handleResize);
        };
    } else {
         // Если это телефон, очищаем слушателя resize, чтобы не было лишних вызовов
        return () => window.removeEventListener('resize', handleResize);
    }
  }, []); // Пустой массив зависимостей, чтобы выполнилось один раз при монтировании

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
  
  // Если это мобильное устройство, показываем сообщение о недоступности
  if (isMobileDevice) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-100 p-6">
        <div className="bg-white p-8 rounded-lg shadow-xl text-center">
          <AlertTriangle className="h-16 w-16 text-yellow-500 mx-auto mb-6" />
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Доступ ограничен</h1>
          <p className="text-gray-600 text-lg mb-2">
            Административная панель недоступна для просмотра на мобильных устройствах.
          </p>
          <p className="text-gray-500 text-sm">
            Пожалуйста, используйте компьютер или планшет для доступа к этой странице.
          </p>
        </div>
      </div>
    );
  }
  
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
                          {doctorProfileForm.image && (
                            <div className="h-20 w-20 rounded overflow-hidden bg-gray-100 flex items-center justify-center p-1">
                                <img src={doctorProfileForm.image} alt="Предпросмотр" className="max-h-full max-w-full object-contain"/>
                            </div>
                          )}
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
                        <div className="w-full aspect-[3/4] flex-shrink-0 overflow-hidden relative bg-gray-100">
                            {d.image && d.image !== PLACEHOLDER_IMAGE && (
                                <img 
                                    src={d.image} 
                                    alt=""
                                    aria-hidden="true"
                                    className="absolute inset-0 w-full h-full object-cover blur-lg scale-110"
                                />
                            )}
                            {d.image && d.image !== PLACEHOLDER_IMAGE && <div className="absolute inset-0 bg-black/10"></div>}
                            
                            <img 
                                src={d.image || PLACEHOLDER_IMAGE} 
                                alt={d.name} 
                                className="relative z-10 w-full h-full object-contain"
                            />
                            {(!d.image || d.image === PLACEHOLDER_IMAGE) && (
                                 <div className="absolute inset-0 flex items-center justify-center z-0">
                                    <img src={PLACEHOLDER_IMAGE} alt={d.name} className="w-1/2 h-1/2 object-contain opacity-30" />
                                 </div>
                            )}
                        </div>
                        <div className="p-4 flex flex-col flex-grow">
                          <div className="flex-grow mb-3">
                            <h3 className="font-semibold whitespace-pre-wrap text-lg mb-1">{d.name}</h3>
                            <p className="text-sm text-gray-600 whitespace-pre-wrap mb-1">{d.specialization}</p>
                            {d.experience && d.experience.trim() !== "" && (
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
                          <div className="mt-auto pt-3 flex justify-end gap-2 flex-shrink-0">
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
                          {newsForm.image && (
                            <div className="h-20 w-20 rounded overflow-hidden bg-gray-100 flex items-center justify-center p-1">
                                <img src={newsForm.image} alt="preview" className="max-h-full max-w-full object-contain"/>
                            </div>
                            )}
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
                                    {n.image && 
                                        <div className="w-12 h-12 bg-gray-100 flex items-center justify-center rounded mr-3 flex-shrink-0 overflow-hidden">
                                            <img src={n.image} alt="" className="max-w-full max-h-full object-contain"/>
                                        </div>
                                    }
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