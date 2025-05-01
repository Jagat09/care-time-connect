
import React from "react";
import { useNavigate } from "react-router-dom";
import { Doctor } from "../types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "lucide-react";

interface DoctorCardProps {
  doctor: Doctor;
}

const DoctorCard: React.FC<DoctorCardProps> = ({ doctor }) => {
  const navigate = useNavigate();
  
  const handleBookAppointment = () => {
    navigate(`/book-appointment/${doctor.id}`);
  };
  
  const handleViewProfile = () => {
    navigate(`/doctor/${doctor.id}`);
  };

  return (
    <Card className="overflow-hidden flex flex-col h-full transition-all hover:shadow-md">
      <div className="aspect-square w-full bg-gray-100 flex items-center justify-center overflow-hidden">
        <img 
          src={doctor.image} 
          alt={doctor.name} 
          className="w-full h-full object-cover"
        />
      </div>
      
      <CardHeader className="pb-2">
        <CardTitle className="text-xl">{doctor.name}</CardTitle>
        <CardDescription>{doctor.specialty}</CardDescription>
      </CardHeader>
      
      <CardContent className="pb-2 flex-grow">
        <p className="text-sm text-gray-600 line-clamp-3">
          {doctor.bio}
        </p>
      </CardContent>
      
      <CardFooter className="flex flex-col space-y-2 pt-0">
        <Button 
          variant="outline" 
          onClick={handleViewProfile}
          className="w-full"
        >
          View Profile
        </Button>
        <Button 
          onClick={handleBookAppointment}
          className="w-full"
        >
          <Calendar className="mr-2 h-4 w-4" />
          Book Appointment
        </Button>
      </CardFooter>
    </Card>
  );
};

export default DoctorCard;
