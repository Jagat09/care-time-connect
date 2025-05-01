
import React, { useState, useEffect } from "react";
import { getDoctors } from "../services/dataService";
import { Doctor } from "../types";
import DoctorCard from "../components/DoctorCard";
import { Input } from "@/components/ui/input";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Plus, Search } from "lucide-react";

const DoctorsList: React.FC = () => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [filteredDoctors, setFilteredDoctors] = useState<Doctor[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const { isAdmin, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const loadDoctors = async () => {
      try {
        const data = await getDoctors();
        setDoctors(data);
        setFilteredDoctors(data);
      } catch (error) {
        console.error("Error loading doctors:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadDoctors();
  }, []);

  useEffect(() => {
    const results = doctors.filter(doctor => 
      doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctor.specialty.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredDoctors(results);
  }, [searchTerm, doctors]);

  const handleAddDoctor = () => {
    navigate("/admin/add-doctor");
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-12 text-center">
        <p className="text-lg">Loading doctors...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold">Our Doctors</h1>
          <p className="text-gray-600 mt-2">
            Book an appointment with one of our professional doctors
          </p>
        </div>
        
        <div className="flex w-full md:w-auto gap-2">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              type="search"
              placeholder="Search doctors..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          {user && isAdmin() && (
            <Button onClick={handleAddDoctor}>
              <Plus className="mr-2 h-4 w-4" />
              Add Doctor
            </Button>
          )}
        </div>
      </div>

      {filteredDoctors.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-xl text-gray-600">No doctors found matching your search.</p>
        </div>
      ) : (
        <div className="appointment-grid">
          {filteredDoctors.map((doctor) => (
            <DoctorCard key={doctor.id} doctor={doctor} />
          ))}
        </div>
      )}
    </div>
  );
};

export default DoctorsList;
