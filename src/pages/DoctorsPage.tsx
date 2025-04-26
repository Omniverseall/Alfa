
import { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

// Mock data for doctors
const doctorsData = [
  {
    id: 1,
    name: "Иванов Иван Иванович",
    specialization: "Кардиолог",
    experience: "15 лет опыта",
    education: "Ташкентская медицинская академия",
    description: "Специалист высшей категории по диагностике и лечению сердечно-сосудистых заболеваний. Регулярно проходит стажировки в ведущих клиниках России и Европы.",
    image: "/placeholder.svg",
  },
  {
    id: 2,
    name: "Петрова Мария Сергеевна",
    specialization: "Терапевт",
    experience: "10 лет опыта",
    education: "Самаркандский государственный медицинский институт",
    description: "Опытный терапевт с обширной практикой. Специализируется на диагностике и лечении заболеваний внутренних органов, а также проведении профилактических осмотров.",
    image: "/placeholder.svg",
  },
  {
    id: 3,
    name: "Сидоров Алексей Петрович",
    specialization: "Невролог",
    experience: "12 лет опыта",
    education: "Ташкентская медицинская академия",
    description: "Невролог высшей категории. Занимается диагностикой и лечением заболеваний центральной и периферической нервной системы, включая головные боли, невралгии и нейропатии.",
    image: "/placeholder.svg",
  },
  {
    id: 4,
    name: "Козлова Анна Владимировна",
    specialization: "Эндокринолог",
    experience: "8 лет опыта",
    education: "Московский государственный медицинский университет",
    description: "Специализируется на диагностике и лечении заболеваний эндокринной системы, включая сахарный диабет, заболевания щитовидной железы и надпочечников.",
    image: "/placeholder.svg",
  },
  {
    id: 5,
    name: "Соколов Дмитрий Андреевич",
    specialization: "Хирург",
    experience: "18 лет опыта",
    education: "Санкт-Петербургский медицинский университет",
    description: "Хирург высшей категории. Проводит общие хирургические вмешательства, имеет опыт работы в экстренной хирургии и травматологии.",
    image: "/placeholder.svg",
  },
  {
    id: 6,
    name: "Новикова Елена Александровна",
    specialization: "Гастроэнтеролог",
    experience: "9 лет опыта",
    education: "Ташкентская медицинская академия",
    description: "Специализируется на диагностике и лечении заболеваний желудочно-кишечного тракта. Проводит эндоскопические исследования.",
    image: "/placeholder.svg",
  },
  {
    id: 7,
    name: "Белов Сергей Викторович",
    specialization: "Уролог",
    experience: "14 лет опыта",
    education: "Ташкентская медицинская академия",
    description: "Занимается диагностикой и лечением урологических заболеваний. Владеет современными методиками малоинвазивной хирургии.",
    image: "/placeholder.svg",
  },
  {
    id: 8,
    name: "Морозова Ольга Игоревна",
    specialization: "Дерматолог",
    experience: "7 лет опыта",
    education: "Самаркандский государственный медицинский институт",
    description: "Специализируется на диагностике и лечении кожных заболеваний, включая аллергические реакции, дерматиты и грибковые инфекции.",
    image: "/placeholder.svg",
  },
];

// List of specializations for filtering
const specializations = [
  "Все специализации",
  "Кардиолог",
  "Терапевт",
  "Невролог",
  "Эндокринолог",
  "Хирург",
  "Гастроэнтеролог",
  "Уролог",
  "Дерматолог",
];

const DoctorsPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSpecialization, setSelectedSpecialization] = useState("Все специализации");
  const [selectedDoctor, setSelectedDoctor] = useState<number | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  // Filter doctors based on search query and selected specialization
  const filteredDoctors = doctorsData.filter((doctor) => {
    const matchesSearch = doctor.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSpecialization =
      selectedSpecialization === "Все специализации" || doctor.specialization === selectedSpecialization;
    return matchesSearch && matchesSpecialization;
  });

  // Selected doctor details
  const doctorDetails = selectedDoctor !== null
    ? doctorsData.find(doctor => doctor.id === selectedDoctor)
    : null;

  // Close modal when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        setSelectedDoctor(null);
      }
    };

    if (selectedDoctor !== null) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [selectedDoctor]);

  return (
    <div className="py-12 md:py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Наши врачи</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Команда высококвалифицированных специалистов с многолетним опытом работы
          </p>
        </div>

        <div className="mb-8 flex flex-col md:flex-row gap-4">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              type="text"
              placeholder="Поиск врача по имени..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <div className="md:w-64">
            <select
              value={selectedSpecialization}
              onChange={(e) => setSelectedSpecialization(e.target.value)}
              className="w-full h-10 px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-transparent"
            >
              {specializations.map((specialization) => (
                <option key={specialization} value={specialization}>
                  {specialization}
                </option>
              ))}
            </select>
          </div>
        </div>

        {filteredDoctors.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredDoctors.map((doctor) => (
              <div 
                key={doctor.id} 
                className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 group cursor-pointer hover-scale"
                onClick={() => setSelectedDoctor(doctor.id)}
              >
                <div className="h-64 overflow-hidden">
                  <img 
                    src={doctor.image} 
                    alt={doctor.name} 
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <div className="p-6">
                  <h3 className="font-semibold text-lg mb-1">{doctor.name}</h3>
                  <p className="text-brand-blue font-medium">{doctor.specialization}</p>
                  <p className="text-gray-500 text-sm mt-1">{doctor.experience}</p>
                  <button 
                    className="mt-4 text-brand-blue hover:text-brand-red transition-colors font-medium"
                  >
                    Подробнее
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <p className="text-gray-500">
              Врачи не найдены. Пожалуйста, измените параметры поиска.
            </p>
          </div>
        )}

        {/* Doctor details modal */}
        {selectedDoctor !== null && doctorDetails && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div 
              ref={modalRef}
              className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto animate-fade-in"
            >
              <div className="relative">
                <button 
                  className="absolute top-4 right-4 bg-white/80 backdrop-blur-sm p-2 rounded-full"
                  onClick={() => setSelectedDoctor(null)}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
                
                <div className="md:flex">
                  <div className="md:w-1/3">
                    <img 
                      src={doctorDetails.image} 
                      alt={doctorDetails.name} 
                      className="w-full h-64 md:h-full object-cover"
                    />
                  </div>
                  
                  <div className="p-6 md:w-2/3">
                    <h2 className="text-2xl font-bold mb-2">{doctorDetails.name}</h2>
                    <p className="text-brand-blue font-medium text-lg mb-4">{doctorDetails.specialization}</p>
                    
                    <div className="space-y-4">
                      <div>
                        <h3 className="font-medium text-gray-800">Опыт работы:</h3>
                        <p>{doctorDetails.experience}</p>
                      </div>
                      
                      <div>
                        <h3 className="font-medium text-gray-800">Образование:</h3>
                        <p>{doctorDetails.education}</p>
                      </div>
                      
                      <div>
                        <h3 className="font-medium text-gray-800">О враче:</h3>
                        <p>{doctorDetails.description}</p>
                      </div>
                    </div>
                    
                    <div className="mt-6">
                      <Button asChild className="bg-brand-red hover:bg-red-700 w-full md:w-auto">
                        <a href="/appointment">Записаться на приём</a>
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DoctorsPage;
