
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getDoctorById, getAvailableTimeSlots, bookAppointment } from "../services/dataService";
import { Doctor, TimeSlot } from "../types";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { format, addDays, isBefore, startOfToday } from "date-fns";
import { useAuth } from "../context/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import { Calendar as CalendarIcon, Clock } from "lucide-react";
import TimeSlotSelector from "../components/TimeSlotSelector";

const BookAppointment: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();

  const today = startOfToday();
  const maxDate = addDays(today, 30); // Allow booking up to 30 days in advance

  useEffect(() => {
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please log in to book appointments.",
      });
      navigate("/login");
      return;
    }
    
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
  }, [id, navigate, toast, user]);

  // When a date is selected, fetch available time slots
  useEffect(() => {
    const loadTimeSlots = async () => {
      if (!selectedDate || !id) return;
      
      try {
        const formattedDate = format(selectedDate, "yyyy-MM-dd");
        const slots = await getAvailableTimeSlots(id, formattedDate);
        setTimeSlots(slots);
        setSelectedTime(null); // Reset selected time when date changes
      } catch (error) {
        console.error("Error loading time slots:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load available time slots.",
        });
      }
    };

    loadTimeSlots();
  }, [selectedDate, id, toast]);

  const handleBookAppointment = async () => {
    if (!user || !doctor || !selectedDate || !selectedTime) {
      toast({
        variant: "destructive",
        title: "Incomplete information",
        description: "Please select date and time to book an appointment.",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const appointment = {
        doctorId: doctor.id,
        patientId: user.id,
        patientName: user.name,
        doctorName: doctor.name,
        date: format(selectedDate, "yyyy-MM-dd"),
        time: selectedTime,
        status: "scheduled" as const,
      };
      
      await bookAppointment(appointment);
      
      toast({
        title: "Appointment Booked",
        description: `Your appointment with ${doctor.name} on ${format(selectedDate, "MMMM d, yyyy")} at ${selectedTime} has been scheduled.`,
      });
      
      navigate("/my-appointments");
    } catch (error) {
      console.error("Error booking appointment:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to book appointment. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Disable dates that are in the past or more than 30 days in the future
  const isDateDisabled = (date: Date) => {
    return isBefore(date, today) || isBefore(maxDate, date);
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
      <h1 className="text-3xl font-bold mb-8 text-center">Book an Appointment</h1>
      
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="md:w-1/3">
            <Card>
              <CardHeader>
                <CardTitle>Doctor Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-100">
                    <img 
                      src={doctor.image} 
                      alt={doctor.name} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium">{doctor.name}</h3>
                    <p className="text-gray-600">{doctor.specialty}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="md:w-2/3">
            <Card>
              <CardHeader>
                <CardTitle>Select Date & Time</CardTitle>
                <CardDescription>Choose your preferred appointment date and time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col space-y-6">
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <CalendarIcon className="h-5 w-5 text-gray-500" />
                      <h3 className="font-medium">Date</h3>
                    </div>
                    <div className="flex justify-center">
                      <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={setSelectedDate}
                        disabled={isDateDisabled}
                        className="p-3 pointer-events-auto border rounded-md"
                        initialFocus
                      />
                    </div>
                  </div>
                  
                  {selectedDate && (
                    <div className="space-y-4">
                      <div className="flex items-center space-x-2">
                        <Clock className="h-5 w-5 text-gray-500" />
                        <h3 className="font-medium">Time</h3>
                      </div>
                      <TimeSlotSelector 
                        timeSlots={timeSlots}
                        selectedTime={selectedTime}
                        onSelectTimeSlot={setSelectedTime}
                      />
                    </div>
                  )}
                  
                  <Button 
                    onClick={handleBookAppointment}
                    disabled={!selectedDate || !selectedTime || isSubmitting}
                    className="w-full mt-4"
                  >
                    {isSubmitting ? "Booking..." : "Book Appointment"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookAppointment;
