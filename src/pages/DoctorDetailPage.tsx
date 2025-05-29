import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { adminService, Doctor } from "@/services/adminService";

const PLACEHOLDER_IMAGE = "/placeholder.svg";

const LoadingTextIndicator = ({ text }: { text: string }) => (
  <div className="container mx-auto px-4 py-12 text-center text-gray-500">{text}</div>
);

const DoctorDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDoctor = async () => {
      if (!id) {
        setLoading(false);
        navigate('/doctors'); 
        return;
      }
      setLoading(true);
      try {
        const cachedDoctors = localStorage.getItem('cached_doctors');
        let foundDoctorInCache: Doctor | undefined = undefined;

        if (cachedDoctors) {
          const doctors: Doctor[] = JSON.parse(cachedDoctors);
          foundDoctorInCache = doctors.find((d: Doctor) => d.id === id);
          if (foundDoctorInCache) {
            setDoctor(foundDoctorInCache);
          }
        }

        const freshDoctors = await adminService.getDoctors();
        const foundDoctorFresh = freshDoctors.find((d) => d.id === id);
        
        if (foundDoctorFresh) {
          setDoctor(foundDoctorFresh);
        } else if (!foundDoctorInCache) {
          console.error("Doctor not found with ID:", id);
        }
      } catch (error) {
        console.error("Error fetching doctor:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctor();
     const unsubscribe = adminService.subscribeDoctors((updatedDoctors) => {
      if (id) {
        const updatedDoctor = updatedDoctors.find(d => d.id === id);
        if (updatedDoctor) {
          setDoctor(updatedDoctor);
        }
      }
    });
    return () => unsubscribe();
  }, [id, navigate]);

  if (loading) {
    return <LoadingTextIndicator text="Загрузка информации о враче..." />;
  }

  if (!doctor) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-semibold text-red-600 mb-4">Врач не найден</h2>
          <p className="text-gray-600 mb-8 text-lg">К сожалению, информация о данном враче не найдена.</p>
          <Button onClick={() => navigate('/doctors')} size="lg">
            <ArrowLeft className="mr-2 h-5 w-5" /> Вернуться к списку врачей
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <Button 
          variant="outline" 
          className="mb-8 text-brand-blue hover:text-brand-red hover:bg-red-50 border-brand-blue hover:border-brand-red"
          onClick={() => navigate('/doctors')}
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Вернуться к списку врачей
        </Button>

        <div className="grid md:grid-cols-3 gap-x-8 gap-y-6 items-start">
          <div className="md:col-span-1">
            <div className="rounded-lg overflow-hidden shadow-xl bg-white sticky top-24">
              <div className="w-full aspect-[3/4] bg-gray-100 flex items-center justify-center relative overflow-hidden">
                {doctor.image && doctor.image !== PLACEHOLDER_IMAGE && (
                    <img 
                        src={doctor.image} 
                        alt=""
                        aria-hidden="true"
                        className="absolute inset-0 w-full h-full object-cover blur-lg scale-110"
                    />
                )}
                {doctor.image && doctor.image !== PLACEHOLDER_IMAGE && <div className="absolute inset-0 bg-black/10"></div>}
                
                <img 
                  src={doctor.image || PLACEHOLDER_IMAGE} 
                  alt={doctor.name} 
                  className="relative z-10 max-w-full max-h-full object-contain"
                />
                {(!doctor.image || doctor.image === PLACEHOLDER_IMAGE) && (
                     <div className="absolute inset-0 flex items-center justify-center z-0">
                        <img src={PLACEHOLDER_IMAGE} alt={doctor.name} className="w-1/2 h-1/2 object-contain opacity-30" />
                     </div>
                )}
              </div>
            </div>
          </div>

          <div className="md:col-span-2">
            <h1 className="text-4xl font-bold text-gray-800 mb-2 whitespace-pre-wrap">{doctor.name}</h1>
            <p className="text-2xl text-brand-blue mb-8 font-medium whitespace-pre-wrap">{doctor.specialization}</p>

            <Tabs defaultValue="about" className="w-full">
              <TabsList className="grid w-full grid-cols-3 mb-1">
                <TabsTrigger value="about" className="text-base py-3">О враче</TabsTrigger>
                <TabsTrigger value="education" className="text-base py-3">Образование</TabsTrigger>
                <TabsTrigger value="experience" className="text-base py-3">Опыт работы</TabsTrigger>
              </TabsList>
              
              <TabsContent value="about" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-2xl">Общая информация</CardTitle>
                  </CardHeader>
                  <CardContent className="text-gray-700 text-base leading-relaxed whitespace-pre-wrap">
                      {doctor.description || "Информация о враче пока не добавлена."}
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="education" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-2xl">Образование</CardTitle>
                  </CardHeader>
                  <CardContent className="text-gray-700 text-base leading-relaxed whitespace-pre-wrap">
                      {doctor.education || "Информация об образовании пока не добавлена."}
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="experience" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-2xl">Опыт работы</CardTitle>
                  </CardHeader>
                  <CardContent className="text-gray-700 text-base leading-relaxed whitespace-pre-wrap">
                      {doctor.experience || "Информация об опыте работы пока не добавлена."}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorDetailPage;