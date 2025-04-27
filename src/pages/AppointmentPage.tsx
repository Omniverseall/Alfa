import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import { Calendar as CalendarIcon, Clock, User, Phone, FileText } from "lucide-react";
import { cn } from "@/lib/utils";
import { sendTelegramMessage, formatAppointmentMessage } from "@/services/telegramService";

// Конфигурация Telegram бота с реальными данными
const TELEGRAM_BOT_TOKEN = "8072578120:AAFmsIhF_bz4ItzolhUEMZUTD_xpFIouycY";
const TELEGRAM_CHAT_ID = "9776992";

// Mock data for doctors and services
const doctorOptions = [
  { id: 1, name: "Иванов Иван Иванович", specialization: "Кардиолог" },
  { id: 2, name: "Петрова Мария Сергеевна", specialization: "Терапевт" },
  { id: 3, name: "Сидоров Алексей Петрович", specialization: "Невролог" },
  { id: 4, name: "Козлова Анна Владимировна", specialization: "Эндокринолог" },
  { id: 5, name: "Соколов Дмитрий Андреевич", specialization: "Хирург" },
  { id: 6, name: "Новикова Елена Александровна", specialization: "Гастроэнтеролог" },
];

const serviceOptions = [
  { id: 1, name: "Консультация" },
  { id: 2, name: "Диагностика" },
  { id: 3, name: "УЗИ" },
  { id: 4, name: "ЭКГ" },
  { id: 5, name: "Анализы" },
  { id: 6, name: "Осмотр" },
];

const timeSlots = [
  "09:00", "09:30", "10:00", "10:30", "11:00", "11:30", 
  "12:00", "12:30", "13:00", "13:30", "14:00", "14:30", 
  "15:00", "15:30", "16:00", "16:30", "17:00", "17:30",
  "18:00", "18:30", "19:00"
];

// Define proper types for the form data and errors
interface FormData {
  firstName: string;
  lastName: string;
  phone: string;
  doctor: string;
  service: string;
  date: Date | null;
  time: string;
  comment: string;
}

interface FormErrors {
  firstName?: string;
  lastName?: string;
  phone?: string;
  doctor?: string;
  service?: string;
  date?: string;
  time?: string;
  comment?: string;
}

const AppointmentPage = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    phone: "",
    doctor: "",
    service: "",
    date: null,
    time: "",
    comment: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    // Clear error for this field
    if (errors[name as keyof FormErrors]) {
      setErrors({ ...errors, [name]: undefined });
    }
  };

  const handleDateChange = (date: Date | null) => {
    setFormData({ ...formData, date });
    
    // Clear error for date field
    if (errors.date) {
      setErrors({ ...errors, date: undefined });
    }
  };

  const validateForm = () => {
    const newErrors: FormErrors = {};
    
    if (!formData.firstName.trim()) newErrors.firstName = "Введите имя";
    if (!formData.lastName.trim()) newErrors.lastName = "Введите фамилию";
    if (!formData.phone.trim()) newErrors.phone = "Введите номер телефона";
    if (!formData.doctor) newErrors.doctor = "Выберите врача";
    if (!formData.service) newErrors.service = "Выберите услугу";
    if (!formData.date) newErrors.date = "Выберите дату";
    if (!formData.time) newErrors.time = "Выберите время";
    
    // Simple phone validation
    if (formData.phone && !/^\+?[0-9\s-()]{10,15}$/.test(formData.phone)) {
      newErrors.phone = "Введите корректный номер телефона";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (validateForm()) {
      setIsSubmitting(true);
      
      try {
        // Подготовка данных для отправки в Telegram
        const selectedDoctor = doctorOptions.find(d => d.id.toString() === formData.doctor);
        const selectedService = serviceOptions.find(s => s.id.toString() === formData.service);
        
        const telegramData = {
          ...formData,
          doctorName: selectedDoctor ? `${selectedDoctor.name} (${selectedDoctor.specialization})` : "Не выбран",
          serviceName: selectedService ? selectedService.name : "Не выбрана",
          formattedDate: formData.date ? format(formData.date, "dd.MM.yyyy", { locale: ru }) : "Не выбрана"
        };
        
        // Отправка сообщения в Telegram
        const message = formatAppointmentMessage(telegramData);
        const success = await sendTelegramMessage(TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID, message);
        
        if (success) {
          toast({
            title: "Запись отправлена",
            description: "Мы свяжемся с вами в ближайшее время для подтверждения записи",
            variant: "default",
          });
          
          // Reset form
          setFormData({
            firstName: "",
            lastName: "",
            phone: "",
            doctor: "",
            service: "",
            date: null,
            time: "",
            comment: "",
          });
        } else {
          throw new Error("Не удалось отправить сообщение в Telegram");
        }
      } catch (error) {
        console.error("Ошибка при отправке формы:", error);
        toast({
          title: "Ошибка при отправке",
          description: "Не удалось отправить заявку. Пожалуйста, попробуйте позже или свяжитесь с нами по телефону.",
          variant: "destructive",
        });
      } finally {
        setIsSubmitting(false);
      }
    } else {
      toast({
        title: "Ошибка при отправке",
        description: "Пожалуйста, проверьте правильность заполнения формы",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="py-12 md:py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Запись на приём</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Заполните форму ниже, и мы свяжемся с вами для подтверждения записи на приём
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <div className="p-6 md:p-8">
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Personal Information */}
                  <div className="md:col-span-2">
                    <h2 className="text-xl font-semibold mb-4">Личная информация</h2>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                      Имя*
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <User className="h-5 w-5 text-gray-400" />
                      </div>
                      <Input
                        id="firstName"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        className={cn("pl-10", errors.firstName && "border-red-500")}
                        placeholder="Иван"
                      />
                    </div>
                    {errors.firstName && (
                      <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                      Фамилия*
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <User className="h-5 w-5 text-gray-400" />
                      </div>
                      <Input
                        id="lastName"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        className={cn("pl-10", errors.lastName && "border-red-500")}
                        placeholder="Иванов"
                      />
                    </div>
                    {errors.lastName && (
                      <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                      Телефон*
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <Phone className="h-5 w-5 text-gray-400" />
                      </div>
                      <Input
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className={cn("pl-10", errors.phone && "border-red-500")}
                        placeholder="+998 XX XXX-XX-XX"
                      />
                    </div>
                    {errors.phone && (
                      <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
                    )}
                  </div>

                  {/* Appointment Details */}
                  <div className="md:col-span-2 mt-6">
                    <h2 className="text-xl font-semibold mb-4">Детали приёма</h2>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="doctor" className="block text-sm font-medium text-gray-700">
                      Врач*
                    </label>
                    <select
                      id="doctor"
                      name="doctor"
                      value={formData.doctor}
                      onChange={handleInputChange}
                      className={cn(
                        "w-full h-10 px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-transparent",
                        errors.doctor && "border-red-500"
                      )}
                    >
                      <option value="">Выберите врача</option>
                      {doctorOptions.map((doctor) => (
                        <option key={doctor.id} value={doctor.id}>
                          {doctor.name} ({doctor.specialization})
                        </option>
                      ))}
                    </select>
                    {errors.doctor && (
                      <p className="text-red-500 text-xs mt-1">{errors.doctor}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="service" className="block text-sm font-medium text-gray-700">
                      Услуга*
                    </label>
                    <select
                      id="service"
                      name="service"
                      value={formData.service}
                      onChange={handleInputChange}
                      className={cn(
                        "w-full h-10 px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-transparent",
                        errors.service && "border-red-500"
                      )}
                    >
                      <option value="">Выберите услугу</option>
                      {serviceOptions.map((service) => (
                        <option key={service.id} value={service.id}>
                          {service.name}
                        </option>
                      ))}
                    </select>
                    {errors.service && (
                      <p className="text-red-500 text-xs mt-1">{errors.service}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Дата*
                    </label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <button
                          type="button"
                          className={cn(
                            "w-full flex items-center h-10 px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-left focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-transparent",
                            !formData.date && "text-gray-500",
                            errors.date && "border-red-500"
                          )}
                        >
                          <CalendarIcon className="h-5 w-5 mr-2 text-gray-400" />
                          {formData.date ? (
                            format(formData.date, "PPP", { locale: ru })
                          ) : (
                            "Выберите дату"
                          )}
                        </button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={formData.date}
                          onSelect={handleDateChange}
                          disabled={(date) => {
                            // Disable past dates and weekends
                            const now = new Date();
                            now.setHours(0, 0, 0, 0);
                            const day = date.getDay();
                            return date < now || day === 0; // Sunday is day 0
                          }}
                          initialFocus
                          locale={ru}
                        />
                      </PopoverContent>
                    </Popover>
                    {errors.date && (
                      <p className="text-red-500 text-xs mt-1">{errors.date}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="time" className="block text-sm font-medium text-gray-700">
                      Время*
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <Clock className="h-5 w-5 text-gray-400" />
                      </div>
                      <select
                        id="time"
                        name="time"
                        value={formData.time}
                        onChange={handleInputChange}
                        className={cn(
                          "w-full h-10 pl-10 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-transparent",
                          errors.time && "border-red-500"
                        )}
                        disabled={!formData.date}
                      >
                        <option value="">Выберите время</option>
                        {timeSlots.map((time) => (
                          <option key={time} value={time}>
                            {time}
                          </option>
                        ))}
                      </select>
                    </div>
                    {errors.time && (
                      <p className="text-red-500 text-xs mt-1">{errors.time}</p>
                    )}
                  </div>

                  <div className="md:col-span-2 space-y-2">
                    <label htmlFor="comment" className="block text-sm font-medium text-gray-700">
                      Комментарий
                    </label>
                    <div className="relative">
                      <div className="absolute top-3 left-3 pointer-events-none">
                        <FileText className="h-5 w-5 text-gray-400" />
                      </div>
                      <Textarea
                        id="comment"
                        name="comment"
                        value={formData.comment}
                        onChange={handleInputChange}
                        className="pl-10 resize-none"
                        placeholder="Опишите ваши симптомы или причину обращения"
                        rows={4}
                      />
                    </div>
                  </div>

                  <div className="md:col-span-2 mt-4">
                    <Button 
                      type="submit" 
                      className="w-full md:w-auto bg-brand-red hover:bg-red-700"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Отправка..." : "Записаться на приём"}
                    </Button>
                  </div>

                  <div className="md:col-span-2">
                    <p className="text-xs text-gray-500 mt-2">
                      * Обязательные поля для заполнения
                    </p>
                    <p className="text-xs text-gray-500">
                      Нажимая кнопку "Записаться на приём", вы даете согласие на обработку персональных данных.
                    </p>
                  </div>
                </div>
              </form>
            </div>
          </div>

          <div className="mt-8 bg-gray-50 rounded-lg p-6 shadow-sm">
            <h2 className="text-xl font-semibold mb-4">Контактная информация</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex items-start">
                <Phone className="h-5 w-5 mr-2 mt-0.5 text-brand-red" />
                <div>
                  <p className="font-medium">Телефон:</p>
                  <a href="tel:+998712345678" className="text-gray-600 hover:text-brand-blue">+998 71 234-56-78</a>
                </div>
              </div>
              <div className="flex items-start">
                <Clock className="h-5 w-5 mr-2 mt-0.5 text-brand-red" />
                <div>
                  <p className="font-medium">Режим работы:</p>
                  <p className="text-gray-600">Пн-Сб: 8:00 - 20:00, Вс: 9:00 - 18:00</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppointmentPage;
