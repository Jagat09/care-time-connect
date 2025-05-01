
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getPatientAppointments } from "../services/dataService";
import { Appointment } from "../types";
import AppointmentCard from "../components/AppointmentCard";
import { Button } from "@/components/ui/button";
import { useAuth } from "../context/AuthContext";
import { useToast } from "@/components/ui/use-toast";

const MyAppointments: React.FC = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();

  const loadAppointments = async () => {
    if (!user) return;
    
    try {
      const data = await getPatientAppointments(user.id);
      setAppointments(data);
    } catch (error) {
      console.error("Error loading appointments:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load your appointments.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please log in to view your appointments.",
      });
      navigate("/login");
      return;
    }
    
    loadAppointments();
  }, [user, navigate, toast]);

  const handleFindDoctor = () => {
    navigate("/doctors");
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-12 text-center">
        <p className="text-lg">Loading your appointments...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold">My Appointments</h1>
          <p className="text-gray-600 mt-2">
            View and manage your scheduled appointments
          </p>
        </div>
        
        <Button onClick={handleFindDoctor}>
          Find a Doctor
        </Button>
      </div>

      {appointments.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <h2 className="text-xl font-semibold mb-2">No Appointments Found</h2>
          <p className="text-gray-600 mb-6">You don't have any appointments scheduled.</p>
          <Button onClick={handleFindDoctor}>
            Book Your First Appointment
          </Button>
        </div>
      ) : (
        <div className="appointment-grid">
          {appointments.map((appointment) => (
            <AppointmentCard 
              key={appointment.id} 
              appointment={appointment} 
              onCancelSuccess={loadAppointments}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default MyAppointments;
