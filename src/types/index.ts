
export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  image: string;
  bio: string;
  availability: {
    [day: string]: {
      start: string;
      end: string;
      available: boolean;
    };
  };
}

export interface Appointment {
  id: string;
  doctorId: string;
  patientId: string;
  patientName: string;
  doctorName: string;
  date: string; // ISO date string
  time: string; // Format: "HH:MM"
  status: "scheduled" | "completed" | "cancelled";
}

export interface TimeSlot {
  time: string;
  available: boolean;
}
