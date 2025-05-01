
import React from "react";
import { TimeSlot } from "../types";
import { Button } from "@/components/ui/button";

interface TimeSlotSelectorProps {
  timeSlots: TimeSlot[];
  selectedTime: string | null;
  onSelectTimeSlot: (time: string) => void;
}

const TimeSlotSelector: React.FC<TimeSlotSelectorProps> = ({ 
  timeSlots, 
  selectedTime,
  onSelectTimeSlot
}) => {
  if (timeSlots.length === 0) {
    return (
      <div className="p-4 text-center bg-gray-50 rounded-lg">
        <p className="text-gray-500">No available time slots for the selected date.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
      {timeSlots.map((slot) => (
        <Button
          key={slot.time}
          variant={selectedTime === slot.time ? "default" : "outline"}
          disabled={!slot.available}
          className={`${
            !slot.available 
              ? "opacity-50 cursor-not-allowed" 
              : "hover:bg-medical-100"
          }`}
          onClick={() => slot.available && onSelectTimeSlot(slot.time)}
        >
          {slot.time}
        </Button>
      ))}
    </div>
  );
};

export default TimeSlotSelector;
