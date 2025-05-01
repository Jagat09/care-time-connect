
import { Doctor, Appointment, TimeSlot } from "../types";

// Mock data for doctors
const doctors: Doctor[] = [
  {
    id: "1",
    name: "Dr. Jane Smith",
    specialty: "Cardiologist",
    image: "/placeholder.svg",
    bio: "Dr. Smith is a board-certified cardiologist with over 15 years of experience in treating heart conditions.",
    availability: {
      "Monday": { start: "09:00", end: "17:00", available: true },
      "Tuesday": { start: "09:00", end: "17:00", available: true },
      "Wednesday": { start: "09:00", end: "17:00", available: true },
      "Thursday": { start: "09:00", end: "17:00", available: true },
      "Friday": { start: "09:00", end: "15:00", available: true },
      "Saturday": { start: "10:00", end: "14:00", available: false },
      "Sunday": { start: "00:00", end: "00:00", available: false },
    }
  },
  {
    id: "2",
    name: "Dr. Robert Chen",
    specialty: "Dermatologist",
    image: "/placeholder.svg",
    bio: "Dr. Chen specializes in treating skin conditions and has a special interest in pediatric dermatology.",
    availability: {
      "Monday": { start: "08:00", end: "16:00", available: true },
      "Tuesday": { start: "08:00", end: "16:00", available: true },
      "Wednesday": { start: "08:00", end: "16:00", available: false },
      "Thursday": { start: "08:00", end: "16:00", available: true },
      "Friday": { start: "08:00", end: "16:00", available: true },
      "Saturday": { start: "09:00", end: "13:00", available: true },
      "Sunday": { start: "00:00", end: "00:00", available: false },
    }
  },
  {
    id: "3",
    name: "Dr. Maria Garcia",
    specialty: "Pediatrician",
    image: "/placeholder.svg",
    bio: "Dr. Garcia has been practicing pediatric medicine for 10 years and is passionate about child healthcare.",
    availability: {
      "Monday": { start: "09:00", end: "17:00", available: true },
      "Tuesday": { start: "09:00", end: "17:00", available: true },
      "Wednesday": { start: "09:00", end: "17:00", available: true },
      "Thursday": { start: "09:00", end: "17:00", available: false },
      "Friday": { start: "09:00", end: "17:00", available: true },
      "Saturday": { start: "09:00", end: "13:00", available: false },
      "Sunday": { start: "00:00", end: "00:00", available: false },
    }
  }
];

// Mock appointments data
let appointments: Appointment[] = [
  {
    id: "1",
    doctorId: "1",
    patientId: "2",
    patientName: "Patient User",
    doctorName: "Dr. Jane Smith",
    date: "2025-05-05",
    time: "10:00",
    status: "scheduled"
  }
];

// Get all doctors
export const getDoctors = (): Promise<Doctor[]> => {
  return Promise.resolve([...doctors]);
};

// Get a specific doctor by ID
export const getDoctorById = (id: string): Promise<Doctor | undefined> => {
  return Promise.resolve(doctors.find(doctor => doctor.id === id));
};

// Add a new doctor (admin only)
export const addDoctor = (doctor: Omit<Doctor, "id">): Promise<Doctor> => {
  const newDoctor = {
    ...doctor,
    id: Math.random().toString(36).substr(2, 9)
  };
  
  doctors.push(newDoctor);
  return Promise.resolve(newDoctor);
};

// Get appointments for a specific patient
export const getPatientAppointments = (patientId: string): Promise<Appointment[]> => {
  return Promise.resolve(appointments.filter(appointment => appointment.patientId === patientId));
};

// Get appointments for a specific doctor
export const getDoctorAppointments = (doctorId: string): Promise<Appointment[]> => {
  return Promise.resolve(appointments.filter(appointment => appointment.doctorId === doctorId));
};

// Get all appointments (admin only)
export const getAllAppointments = (): Promise<Appointment[]> => {
  return Promise.resolve([...appointments]);
};

// Book a new appointment
export const bookAppointment = (appointment: Omit<Appointment, "id">): Promise<Appointment> => {
  const newAppointment = {
    ...appointment,
    id: Math.random().toString(36).substr(2, 9)
  };
  
  appointments.push(newAppointment);
  return Promise.resolve(newAppointment);
};

// Cancel an appointment
export const cancelAppointment = (id: string): Promise<void> => {
  const appointmentIndex = appointments.findIndex(appointment => appointment.id === id);
  
  if (appointmentIndex !== -1) {
    appointments[appointmentIndex].status = "cancelled";
  }
  
  return Promise.resolve();
};

// Get available time slots for a specific doctor and date
export const getAvailableTimeSlots = (doctorId: string, date: string): Promise<TimeSlot[]> => {
  // Convert the date to a day of the week
  const dayOfWeek = new Date(date).toLocaleDateString('en-US', { weekday: 'long' });
  
  // Find the doctor
  const doctor = doctors.find(d => d.id === doctorId);
  
  if (!doctor || !doctor.availability[dayOfWeek].available) {
    return Promise.resolve([]);
  }
  
  // Generate time slots based on doctor's availability for that day
  const { start, end } = doctor.availability[dayOfWeek];
  const timeSlots: TimeSlot[] = [];
  
  // Convert start and end times to hours
  const startHour = parseInt(start.split(':')[0]);
  const endHour = parseInt(end.split(':')[0]);
  
  // Create 1-hour slots
  for (let hour = startHour; hour < endHour; hour++) {
    const timeString = `${hour.toString().padStart(2, '0')}:00`;
    
    // Check if slot is already booked
    const isBooked = appointments.some(
      appointment => 
        appointment.doctorId === doctorId && 
        appointment.date === date && 
        appointment.time === timeString &&
        appointment.status !== "cancelled"
    );
    
    timeSlots.push({
      time: timeString,
      available: !isBooked
    });
  }
  
  return Promise.resolve(timeSlots);
};
