
import { Doctor, Appointment, TimeSlot } from "../types";

// Mock data for doctors
const doctors: Doctor[] = [
  {
    id: "1",
    name: "Dr. Jane Smith",
    specialty: "Cardiologist",
    image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
    bio: "Dr. Smith is a board-certified cardiologist with over 15 years of experience in treating heart conditions. She specializes in preventative cardiology and heart disease management.",
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
    image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
    bio: "Dr. Chen specializes in treating skin conditions and has a special interest in pediatric dermatology. With his expertise in advanced dermatological procedures, he provides comprehensive care for patients of all ages.",
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
    image: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
    bio: "Dr. Garcia has been practicing pediatric medicine for 10 years and is passionate about child healthcare. She focuses on developmental pediatrics and preventative care to ensure children grow up healthy and strong.",
    availability: {
      "Monday": { start: "09:00", end: "17:00", available: true },
      "Tuesday": { start: "09:00", end: "17:00", available: true },
      "Wednesday": { start: "09:00", end: "17:00", available: true },
      "Thursday": { start: "09:00", end: "17:00", available: false },
      "Friday": { start: "09:00", end: "17:00", available: true },
      "Saturday": { start: "09:00", end: "13:00", available: false },
      "Sunday": { start: "00:00", end: "00:00", available: false },
    }
  },
  {
    id: "4",
    name: "Dr. James Wilson",
    specialty: "Neurologist",
    image: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
    bio: "Dr. Wilson is a neurologist with extensive experience in diagnosing and treating conditions affecting the nervous system. He specializes in headache management and neurological disorders.",
    availability: {
      "Monday": { start: "09:00", end: "17:00", available: true },
      "Tuesday": { start: "09:00", end: "17:00", available: true },
      "Wednesday": { start: "09:00", end: "17:00", available: false },
      "Thursday": { start: "09:00", end: "17:00", available: true },
      "Friday": { start: "09:00", end: "17:00", available: true },
      "Saturday": { start: "00:00", end: "00:00", available: false },
      "Sunday": { start: "00:00", end: "00:00", available: false },
    }
  },
  {
    id: "5",
    name: "Dr. Sarah Johnson",
    specialty: "Orthopedic Surgeon",
    image: "https://images.unsplash.com/photo-1527613426441-4da17471b66d?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
    bio: "Dr. Johnson is an orthopedic surgeon specializing in sports medicine and joint replacement surgery. Her approach combines the latest surgical techniques with comprehensive rehabilitation plans.",
    availability: {
      "Monday": { start: "08:00", end: "16:00", available: true },
      "Tuesday": { start: "08:00", end: "16:00", available: true },
      "Wednesday": { start: "08:00", end: "16:00", available: true },
      "Thursday": { start: "08:00", end: "16:00", available: false },
      "Friday": { start: "08:00", end: "16:00", available: true },
      "Saturday": { start: "09:00", end: "12:00", available: true },
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
