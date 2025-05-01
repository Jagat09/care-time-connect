
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getDoctorById } from "../services/dataService";
import { Doctor } from "../types";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useToast } from "@/components/ui/use-toast";

const DoctorDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    const loadDoctor = async () => {
      if (!id) return;
      
      try {
        const data = await getDoctorById(id);
        if (data) {
          setDoctor(data);
        } else {
          toast({
            variant: "destructive",
            title: "Doctor not found",
            description: "The requested doctor could not be found.",
          });
          navigate("/doctors");
        }
      } catch (error) {
        console.error("Error loading doctor:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load doctor information.",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadDoctor();
  }, [id, navigate, toast]);

  const handleBookAppointment = () => {
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please log in to book appointments.",
      });
      navigate("/login");
      return;
    }
    
    navigate(`/book-appointment/${id}`);
  };

  const getAvailabilityDays = () => {
    if (!doctor) return [];
    
    return Object.entries(doctor.availability)
      .filter(([_, value]) => value.available)
      .map(([day, _]) => day);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-12 text-center">
        <p className="text-lg">Loading doctor information...</p>
      </div>
    );
  }

  if (!doctor) {
    return (
      <div className="container mx-auto py-12 text-center">
        <p className="text-lg text-red-500">Doctor not found.</p>
        <Button onClick={() => navigate("/doctors")} className="mt-4">
          Return to Doctors List
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="md:w-1/3">
            <div className="aspect-square w-full bg-gray-100 rounded-lg overflow-hidden">
              <img 
                src={doctor.image} 
                alt={doctor.name} 
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          
          <div className="md:w-2/3">
            <h1 className="text-3xl font-bold mb-2">{doctor.name}</h1>
            <p className="text-lg text-medical-600 mb-4">{doctor.specialty}</p>
            
            <div className="prose max-w-none mb-6">
              <p>{doctor.bio}</p>
            </div>
            
            <Card className="mb-6">
              <CardContent className="pt-6">
                <h3 className="text-lg font-medium mb-2">Availability</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {getAvailabilityDays().map((day) => (
                    <div key={day} className="px-3 py-2 bg-medical-50 rounded-md text-center">
                      {day}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            <Button onClick={handleBookAppointment} size="lg">
              <Calendar className="mr-2 h-5 w-5" />
              Book Appointment
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorDetails;
