
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { addDoctor } from "../../services/dataService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "@/components/ui/use-toast";

const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

const AddDoctor: React.FC = () => {
  const [name, setName] = useState("");
  const [specialty, setSpecialty] = useState("");
  const [bio, setBio] = useState("");
  const [image, setImage] = useState("/placeholder.svg");
  const [availability, setAvailability] = useState<Record<string, { start: string; end: string; available: boolean }>>({
    Monday: { start: "09:00", end: "17:00", available: true },
    Tuesday: { start: "09:00", end: "17:00", available: true },
    Wednesday: { start: "09:00", end: "17:00", available: true },
    Thursday: { start: "09:00", end: "17:00", available: true },
    Friday: { start: "09:00", end: "17:00", available: true },
    Saturday: { start: "09:00", end: "13:00", available: false },
    Sunday: { start: "09:00", end: "13:00", available: false },
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const navigate = useNavigate();
  const { user, isAdmin } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (!user || !isAdmin()) {
      toast({
        variant: "destructive",
        title: "Access Denied",
        description: "Only administrators can access this page.",
      });
      navigate("/");
    }
  }, [user, isAdmin, navigate, toast]);

  const handleAvailabilityChange = (day: string, field: keyof { start: string; end: string; available: boolean }, value: string | boolean) => {
    setAvailability(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        [field]: value
      }
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const doctorData = {
        name,
        specialty,
        bio,
        image,
        availability
      };

      await addDoctor(doctorData);
      toast({
        title: "Doctor Added",
        description: `${name} has been successfully added to the system.`,
      });
      navigate("/admin/doctors");
    } catch (error) {
      console.error("Error adding doctor:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to add doctor. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Add New Doctor</h1>
        
        <form onSubmit={handleSubmit}>
          <Card>
            <CardHeader>
              <CardTitle>Doctor Information</CardTitle>
              <CardDescription>Enter the details of the new doctor</CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="specialty">Specialty</Label>
                  <Input
                    id="specialty"
                    value={specialty}
                    onChange={(e) => setSpecialty(e.target.value)}
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="bio">Bio / Description</Label>
                <Textarea
                  id="bio"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  required
                  rows={4}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="image">Image URL</Label>
                <Input
                  id="image"
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  placeholder="/placeholder.svg"
                />
              </div>
              
              <div className="space-y-4">
                <Label>Availability</Label>
                
                {daysOfWeek.map((day) => (
                  <div key={day} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-4">
                    <div className="flex items-center space-x-4">
                      <Switch
                        checked={availability[day].available}
                        onCheckedChange={(checked) => handleAvailabilityChange(day, "available", checked)}
                      />
                      <Label>{day}</Label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <div className="space-y-1">
                        <Label htmlFor={`${day}-start`} className="text-xs">Start Time</Label>
                        <Input
                          id={`${day}-start`}
                          type="time"
                          value={availability[day].start}
                          onChange={(e) => handleAvailabilityChange(day, "start", e.target.value)}
                          disabled={!availability[day].available}
                          className="w-32"
                        />
                      </div>
                      
                      <div className="space-y-1">
                        <Label htmlFor={`${day}-end`} className="text-xs">End Time</Label>
                        <Input
                          id={`${day}-end`}
                          type="time"
                          value={availability[day].end}
                          onChange={(e) => handleAvailabilityChange(day, "end", e.target.value)}
                          disabled={!availability[day].available}
                          className="w-32"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
            
            <CardFooter className="flex justify-between">
              <Button type="button" variant="outline" onClick={() => navigate("/admin/doctors")}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Adding..." : "Add Doctor"}
              </Button>
            </CardFooter>
          </Card>
        </form>
      </div>
    </div>
  );
};

export default AddDoctor;
