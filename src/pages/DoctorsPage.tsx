import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { adminService } from "@/services/adminService";
import { Skeleton } from "@/components/ui/skeleton";

interface Doctor {
  id: string; // Изменено с number на string для согласованности с adminService
  name: string;
  specialization: string;
  image: string;
  experience: string;
}

const DoctorsPage = () => {
  const [doctors, setDoctors] = useState<Doctor[]>([]); // Initially empty array
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSpecialization, setSelectedSpecialization] = useState("Все специализации");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDoctors = async () => {
      setLoading(true);
      try {
        // Try to use cached data first for immediate display
        const cachedDoctors = localStorage.getItem('cached_doctors');
        if (cachedDoctors) {
          setDoctors(JSON.parse(cachedDoctors));
          setLoading(false);
        }

        // Fetch fresh data
        const fetchedDoctors = await adminService.getDoctors();
        setDoctors(fetchedDoctors);
        localStorage.setItem('cached_doctors', JSON.stringify(fetchedDoctors));
        setLoading(false);
      } catch (error) {
        console.error("Ошибка загрузки врачей:", error);
        setLoading(false);
      }
    };

    fetchDoctors();

    const unsubscribe = adminService.subscribeDoctors((updatedDoctors) => {
      setDoctors(updatedDoctors);
      localStorage.setItem('cached_doctors', JSON.stringify(updatedDoctors));
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const filteredDoctors = doctors.filter((doctor) => {
    const matchesSearch = doctor.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSpecialization =
      selectedSpecialization === "Все специализации" || doctor.specialization === selectedSpecialization;
    return matchesSearch && matchesSpecialization;
  });

  const renderDoctorSkeletons = () => (
    <>
      {Array(8).fill(0).map((_, index) => (
        <div key={index} className="bg-white rounded-lg overflow-hidden shadow-md">
          <Skeleton className="h-64 w-full" />
          <div className="p-6">
            <Skeleton className="h-5 w-3/4 mb-2" />
            <Skeleton className="h-4 w-1/2 mb-2" />
            <Skeleton className="h-3 w-1/3 mb-4" />
            <Skeleton className="h-10 w-full" />
          </div>
        </div>
      ))}
    </>
  );

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
        </div>

        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {renderDoctorSkeletons()}
          </div>
        ) : filteredDoctors.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredDoctors.map((doctor) => (
              <div
                key={doctor.id}
                className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-all duration-300"
              >
                <Link to={`/doctors/${doctor.id}`} className="block">
                  <div className="h-64 overflow-hidden">
                    <img
                      src={doctor.image}
                      alt={doctor.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="font-semibold text-lg mb-1">{doctor.name}</h3>
                    <p className="text-brand-blue font-medium">{doctor.specialization}</p>
                    <p className="text-gray-500 text-sm mt-1">{doctor.experience}</p>
                  </div>
                </Link>
                <div className="mt-4">
                  <Link to={`/doctors/${doctor.id}`} className="block bg-brand-red hover:bg-red-700 text-white text-center py-2 px-4 rounded">
                    Подробнее
                  </Link>
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
      </div>
    </div>
  );
};

export default DoctorsPage;
