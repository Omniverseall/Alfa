import React, { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import { adminService } from "@/services/adminService";
import { sendTelegramMessage, formatAppointmentMessage } from "@/services/telegramService";

const TELEGRAM_BOT_TOKEN = "8072578120:AAFmsIhF_bz4ItzolhUEMZUTD_xpFIouycY";
const TELEGRAM_CHAT_ID = "7688360043";

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
}

interface Doctor {
  id: number;
  name: string;
  specialization: string;
}

interface Service {
  id: number;
  name: string;
}

const AppointmentPage = () => {
  const { toast } = useToast();
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [services, setServices] = useState<Service[]>([]);
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const doctorsData = await adminService.getDoctors();
        const servicesData = await adminService.getServices();
        setDoctors(doctorsData);
        setServices(servicesData);
      } catch (error) {
        console.error("Ошибка при загрузке данных:", error);
      }
    };

    fetchData();

    const unsubscribeDoctors = adminService.subscribeDoctors(async () => {
      const updatedDoctors = await adminService.getDoctors();
      setDoctors(updatedDoctors);
    });

    const unsubscribeServices = adminService.subscribeServices(async () => {
      const updatedServices = await adminService.getServices();
      setServices(updatedServices);
    });

    return () => {
      unsubscribeDoctors();
      unsubscribeServices();
    };
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleDateChange = (date: Date | null) => {
    setFormData({ ...formData, date });
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    if (!formData.firstName.trim()) newErrors.firstName = "Введите имя";
    if (!formData.lastName.trim()) newErrors.lastName = "Введите фамилию";
    if (!formData.phone.trim()) newErrors.phone = "Введите номер телефона";
    if (!formData.doctor) newErrors.doctor = "Выберите врача";
    if (!formData.service) newErrors.service = "Выберите услугу";
    if (!formData.date) newErrors.date = "Выберите дату";
    if (!formData.time) newErrors.time = "Выберите время";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (validateForm()) {
      setIsSubmitting(true);

      try {
        const selectedDoctor = doctors.find((d) => d.id.toString() === formData.doctor);
        const selectedService = services.find((s) => s.id.toString() === formData.service);

        const telegramData = {
          ...formData,
          doctorName: selectedDoctor ? `${selectedDoctor.name} (${selectedDoctor.specialization})` : "Не выбран",
          serviceName: selectedService ? selectedService.name : "Не выбрана",
          formattedDate: formData.date ? format(formData.date, "dd.MM.yyyy", { locale: ru }) : "Не выбрана",
        };

        const message = formatAppointmentMessage(telegramData);
        const success = await sendTelegramMessage(TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID, message);

        if (success) {
          toast({
            title: "Запись отправлена",
            description: "Мы свяжемся с вами в ближайшее время для подтверждения записи",
            variant: "default",
          });

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
        title: "Ошибка при заполнении",
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

                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">Имя</label>
                    <Input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className={errors.firstName ? "border-red-500" : ""}
                    />
                    {errors.firstName && <p className="text-red-500 text-sm">{errors.firstName}</p>}
                  </div>

                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">Фамилия</label>
                    <Input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className={errors.lastName ? "border-red-500" : ""}
                    />
                    {errors.lastName && <p className="text-red-500 text-sm">{errors.lastName}</p>}
                  </div>

                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">Телефон</label>
                    <Input
                      type="text"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className={errors.phone ? "border-red-500" : ""}
                    />
                    {errors.phone && <p className="text-red-500 text-sm">{errors.phone}</p>}
                  </div>

                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">Выбор врача</label>
                    <select
                      name="doctor"
                      value={formData.doctor}
                      onChange={handleInputChange}
                      className={`w-full p-2 border rounded ${errors.doctor ? "border-red-500" : ""}`}
                    >
                      <option value="">Выберите врача</option>
                      {doctors.map((doctor) => (
                        <option key={doctor.id} value={doctor.id}>
                          {doctor.name} ({doctor.specialization})
                        </option>
                      ))}
                    </select>
                    {errors.doctor && <p className="text-red-500 text-sm">{errors.doctor}</p>}
                  </div>

                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">Выбор услуги</label>
                    <select
                      name="service"
                      value={formData.service}
                      onChange={handleInputChange}
                      className={`w-full p-2 border rounded ${errors.service ? "border-red-500" : ""}`}
                    >
                      <option value="">Выберите услугу</option>
                      {services.map((service) => (
                        <option key={service.id} value={service.id}>
                          {service.name}
                        </option>
                      ))}
                    </select>
                    {errors.service && <p className="text-red-500 text-sm">{errors.service}</p>}
                  </div>

                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">Дата приёма</label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={`w-full justify-start text-left font-normal ${
                            !formData.date && "text-muted-foreground"
                          } ${errors.date ? "border-red-500" : ""}`}
                        >
                          {formData.date ? format(formData.date, "PPP", { locale: ru }) : "Выберите дату"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent align="start" className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={formData.date ?? undefined}
                          onSelect={handleDateChange}
                          locale={ru}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    {errors.date && <p className="text-red-500 text-sm">{errors.date}</p>}
                  </div>

                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">Время приёма</label>
                    <Input
                      type="time"
                      name="time"
                      value={formData.time}
                      onChange={handleInputChange}
                      className={errors.time ? "border-red-500" : ""}
                    />
                    {errors.time && <p className="text-red-500 text-sm">{errors.time}</p>}
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-gray-700 font-semibold mb-2">Комментарий</label>
                    <Textarea
                      name="comment"
                      value={formData.comment}
                      onChange={handleInputChange}
                      rows={4}
                      placeholder="Ваши пожелания или дополнительные детали..."
                    />
                  </div>

                </div>

                <div className="mt-6">
                  <Button type="submit" className="w-full bg-brand-red hover:bg-red-700" disabled={isSubmitting}>
                    {isSubmitting ? "Отправка..." : "Записаться на приём"}
                  </Button>
                </div>

              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppointmentPage;
