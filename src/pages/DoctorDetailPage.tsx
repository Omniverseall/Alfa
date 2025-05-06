import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { adminService, Doctor } from "@/services/adminService";

const DoctorDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDoctor = async () => {
      try {
        // Try to use cached data first
        const cachedDoctors = localStorage.getItem('cached_doctors');
        if (cachedDoctors) {
          const doctors = JSON.parse(cachedDoctors);
          const foundDoctor = doctors.find((d: Doctor) => d.id === id); // Убрано Number(id)
          if (foundDoctor) {
            setDoctor(foundDoctor);
            setLoading(false);
          }
        }

        // Fetch fresh data
        const doctors = await adminService.getDoctors();
        const foundDoctor = doctors.find((d) => d.id === id); // Убрано Number(id)
        
        if (foundDoctor) {
          setDoctor(foundDoctor);
        } else {
          console.error("Doctor not found");
        }
      } catch (error) {
        console.error("Error fetching doctor:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchDoctor();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <Skeleton className="h-8 w-32 mb-8" />
          <div className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-1">
              <Skeleton className="h-80 w-full rounded-lg" />
            </div>
            <div className="md:col-span-2">
              <Skeleton className="h-12 w-3/4 mb-4" />
              <Skeleton className="h-6 w-1/2 mb-8" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-3/4 mb-6" />
              <Skeleton className="h-10 w-40" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!doctor) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl font-semibold text-red-600 mb-4">Врач не найден</h2>
          <p className="text-gray-600 mb-6">К сожалению, запрашиваемый врач не существует или был удален.</p>
          <Button onClick={() => navigate('/doctors')}>Вернуться к списку врачей</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <Button 
          variant="ghost" 
          className="mb-8 text-brand-blue hover:text-brand-red"
          onClick={() => navigate('/doctors')}
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Вернуться к списку врачей
        </Button>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-1">
            <div className="rounded-lg overflow-hidden shadow-md bg-white">
              <img 
                src={doctor.image || '/placeholder.svg'} 
                alt={doctor.name} 
                className="w-full h-auto object-cover"
              />
            </div>
          </div>

          <div className="md:col-span-2">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">{doctor.name}</h1>
            <p className="text-xl text-brand-blue mb-6">{doctor.specialization}</p>

            <Tabs defaultValue="about" className="w-full">
              <TabsList>
                <TabsTrigger value="about">О враче</TabsTrigger>
                <TabsTrigger value="education">Образование</TabsTrigger>
                <TabsTrigger value="experience">Опыт работы</TabsTrigger>
              </TabsList>
              
              <TabsContent value="about" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>О враче</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700">
                      {doctor.description || "Информация о враче пока не добавлена."}
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="education" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Образование</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700">
                      {doctor.education || "Информация об образовании пока не добавлена."}
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="experience" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Опыт работы</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700">
                      {doctor.experience || "Информация об опыте работы пока не добавлена."}
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

            <Button className="mt-8 bg-brand-red hover:bg-red-700">
              <Link to="/appointment">Записаться на приём</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorDetailPage;
