
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Button } from "@/components/ui/button";
import { UserIcon, LogIn, LogOut, Plus, Calendar, User } from "lucide-react";

const Navigation: React.FC = () => {
  const { user, profile, logout, isAdmin, isPatient } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <header className="bg-white border-b shadow-sm">
      <div className="container mx-auto p-4">
        <div className="flex justify-between items-center">
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-medical-500">MediNest</span>
          </Link>

          <nav className="hidden md:flex space-x-6">
            <Link to="/" className="text-gray-700 hover:text-medical-500">Home</Link>
            <Link to="/doctors" className="text-gray-700 hover:text-medical-500">Doctors</Link>
            {user && isPatient() && (
              <Link to="/my-appointments" className="text-gray-700 hover:text-medical-500">My Appointments</Link>
            )}
            {user && isAdmin() && (
              <>
                <Link to="/admin/doctors" className="text-gray-700 hover:text-medical-500">Manage Doctors</Link>
                <Link to="/admin/appointments" className="text-gray-700 hover:text-medical-500">All Appointments</Link>
              </>
            )}
          </nav>

          <div className="flex items-center space-x-3">
            {!user ? (
              <div className="flex space-x-2">
                <Button variant="outline" onClick={() => navigate("/login")}>
                  <LogIn className="mr-2 h-4 w-4" />
                  Log In
                </Button>
                <Button onClick={() => navigate("/register")}>
                  <User className="mr-2 h-4 w-4" />
                  Register
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <div className="hidden md:block">
                  <div className="text-sm font-medium">{profile?.name}</div>
                  <div className="text-xs text-gray-500 capitalize">{profile?.role}</div>
                </div>
                <Button variant="outline" onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Log Out
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {user && (
          <div className="md:hidden border-t mt-4 pt-2">
            <div className="flex justify-around">
              <Link to="/" className="flex flex-col items-center p-2 text-gray-700">
                <UserIcon className="h-5 w-5" />
                <span className="text-xs mt-1">Home</span>
              </Link>
              <Link to="/doctors" className="flex flex-col items-center p-2 text-gray-700">
                <User className="h-5 w-5" />
                <span className="text-xs mt-1">Doctors</span>
              </Link>
              {isPatient() && (
                <Link to="/my-appointments" className="flex flex-col items-center p-2 text-gray-700">
                  <Calendar className="h-5 w-5" />
                  <span className="text-xs mt-1">Appointments</span>
                </Link>
              )}
              {isAdmin() && (
                <>
                  <Link to="/admin/doctors" className="flex flex-col items-center p-2 text-gray-700">
                    <Plus className="h-5 w-5" />
                    <span className="text-xs mt-1">Add Doctors</span>
                  </Link>
                  <Link to="/admin/appointments" className="flex flex-col items-center p-2 text-gray-700">
                    <Calendar className="h-5 w-5" />
                    <span className="text-xs mt-1">All Appointments</span>
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navigation;
