
import React from "react";
import { Appointment } from "../types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Clock } from "lucide-react";
import { format } from "date-fns";
import { cancelAppointment } from "../services/dataService";
import { useToast } from "@/components/ui/use-toast";

interface AppointmentCardProps {
  appointment: Appointment;
  onCancelSuccess?: () => void;
}

const AppointmentCard: React.FC<AppointmentCardProps> = ({ appointment, onCancelSuccess }) => {
  const { toast } = useToast();
  const formattedDate = format(new Date(appointment.date), "MMMM d, yyyy");
  
  const handleCancel = async () => {
    try {
      await cancelAppointment(appointment.id);
      toast({
        title: "Appointment Cancelled",
        description: "The appointment has been successfully cancelled."
      });
      if (onCancelSuccess) {
        onCancelSuccess();
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to cancel appointment. Please try again."
      });
    }
  };

  const getStatusColor = () => {
    switch (appointment.status) {
      case "scheduled":
        return "bg-green-100 text-green-800";
      case "completed":
        return "bg-blue-100 text-blue-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <Card className={appointment.status === "cancelled" ? "opacity-60" : ""}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">{appointment.doctorName}</CardTitle>
            <CardDescription>Patient: {appointment.patientName}</CardDescription>
          </div>
          <div className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor()}`}>
            {appointment.status}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pb-2">
        <div className="flex items-center space-x-2 text-sm text-gray-600 mb-1">
          <Calendar className="h-4 w-4" />
          <span>{formattedDate}</span>
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <Clock className="h-4 w-4" />
          <span>{appointment.time}</span>
        </div>
      </CardContent>
      
      {appointment.status === "scheduled" && (
        <CardFooter>
          <Button 
            variant="outline" 
            className="w-full text-red-600 hover:text-red-700 border-red-200 hover:border-red-300 hover:bg-red-50"
            onClick={handleCancel}
          >
            Cancel Appointment
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};

export default AppointmentCard;
