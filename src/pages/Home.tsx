
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "../context/AuthContext";
import { Calendar, User, Clock, CheckCircle } from "lucide-react";

const features = [
  {
    icon: <User className="h-6 w-6 text-medical-500" />,
    title: "Qualified Specialists",
    description: "Our platform connects you with highly qualified medical specialists across various disciplines."
  },
  {
    icon: <Calendar className="h-6 w-6 text-medical-500" />,
    title: "Easy Scheduling",
    description: "Book appointments with just a few clicks. Choose the date and time that works best for you."
  },
  {
    icon: <Clock className="h-6 w-6 text-medical-500" />,
    title: "Save Time",
    description: "No more waiting on the phone. Schedule and manage your appointments online anytime."
  },
  {
    icon: <CheckCircle className="h-6 w-6 text-medical-500" />,
    title: "Patient-Centered Care",
    description: "Our doctors are committed to providing personalized care focused on your well-being."
  }
];

const Home: React.FC = () => {
  const navigate = useNavigate();
  const { user, isPatient, isAdmin } = useAuth();

  const handleCTA = () => {
    if (!user) {
      navigate("/register");
    } else if (isAdmin()) {
      navigate("/admin/doctors");
    } else {
      navigate("/doctors");
    }
  };

  return (
    <div className="mx-auto">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-medical-100 to-medical-50 py-16 px-4 sm:py-24">
        <div className="container mx-auto max-w-5xl flex flex-col md:flex-row items-center justify-between">
          <div className="md:w-1/2 mb-10 md:mb-0">
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6 leading-tight">
              Quality Healthcare at Your Fingertips
            </h1>
            <p className="text-lg text-gray-700 mb-8">
              Schedule appointments with top-rated doctors in your area. Fast, easy, and convenient online booking system.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button onClick={handleCTA} size="lg" className="bg-medical-500 hover:bg-medical-600">
                {!user ? "Get Started" : isAdmin() ? "Manage Doctors" : "Find a Doctor"}
              </Button>
              {!user && (
                <Button variant="outline" onClick={() => navigate("/login")} size="lg">
                  Login
                </Button>
              )}
            </div>
          </div>
          
          <div className="md:w-1/2 flex justify-center">
            <div className="relative w-full max-w-md">
              <div className="bg-white rounded-lg shadow-xl overflow-hidden">
                <img 
                  src="/placeholder.svg" 
                  alt="Doctor with patient" 
                  className="w-full"
                />
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2">Virtual & In-Person Care</h3>
                  <p className="text-gray-600">
                    Book appointments that fit your schedule and preferences
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Features Section */}
      <div className="py-16 px-4 container mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Why Choose MediBook</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Our platform makes healthcare accessible and convenient by connecting patients with qualified healthcare providers.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="border-none shadow-md hover:shadow-lg transition-shadow">
              <CardHeader className="flex items-center pb-2">
                <div className="p-2 bg-medical-50 rounded-full mb-4">
                  {feature.icon}
                </div>
                <CardTitle className="text-xl text-center">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-center text-gray-600">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
      
      {/* CTA Section */}
      <div className="bg-medical-600 py-16 px-4 text-white">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Get Started?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join thousands of patients who have simplified their healthcare journey with MediBook.
          </p>
          <Button 
            onClick={handleCTA} 
            size="lg" 
            variant="secondary" 
            className="bg-white text-medical-600 hover:bg-gray-100"
          >
            {!user ? "Sign Up Now" : isAdmin() ? "Go to Dashboard" : "Book Your Appointment"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Home;
