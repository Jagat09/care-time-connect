
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { Button } from "@/components/ui/button";
import { UserIcon, LogIn, LogOut, Plus, Calendar, User, Pills, Package, ShoppingCart } from "lucide-react";

const Navigation: React.FC = () => {
  const { user, profile, logout, isAdmin, isPatient } = useAuth();
  const { itemCount } = useCart();
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
            <Link to="/medicines" className="text-gray-700 hover:text-medical-500">Medicines</Link>
            {user && isPatient() && (
              <>
                <Link to="/my-appointments" className="text-gray-700 hover:text-medical-500">My Appointments</Link>
                <Link to="/my-orders" className="text-gray-700 hover:text-medical-500">My Orders</Link>
              </>
            )}
            {user && isAdmin() && (
              <>
                <Link to="/admin/doctors" className="text-gray-700 hover:text-medical-500">Manage Doctors</Link>
                <Link to="/admin/appointments" className="text-gray-700 hover:text-medical-500">Appointments</Link>
                <Link to="/admin/medicines" className="text-gray-700 hover:text-medical-500">Manage Medicines</Link>
                <Link to="/admin/medicine-orders" className="text-gray-700 hover:text-medical-500">Medicine Orders</Link>
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
                {isPatient() && (
                  <Button 
                    variant="outline" 
                    className="relative" 
                    onClick={() => navigate("/cart")}
                  >
                    <ShoppingCart className="h-5 w-5" />
                    {itemCount > 0 && (
                      <span className="absolute -top-2 -right-2 bg-medical-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                        {itemCount}
                      </span>
                    )}
                  </Button>
                )}
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
              <Link to="/medicines" className="flex flex-col items-center p-2 text-gray-700">
                <Pills className="h-5 w-5" />
                <span className="text-xs mt-1">Medicines</span>
              </Link>
              {isPatient() && (
                <>
                  <Link to="/my-appointments" className="flex flex-col items-center p-2 text-gray-700">
                    <Calendar className="h-5 w-5" />
                    <span className="text-xs mt-1">Appointments</span>
                  </Link>
                  <Link to="/cart" className="flex flex-col items-center p-2 text-gray-700">
                    <ShoppingCart className="h-5 w-5" />
                    <span className="text-xs mt-1">Cart</span>
                  </Link>
                </>
              )}
              {isAdmin() && (
                <>
                  <Link to="/admin/medicines" className="flex flex-col items-center p-2 text-gray-700">
                    <Pills className="h-5 w-5" />
                    <span className="text-xs mt-1">Medicines</span>
                  </Link>
                  <Link to="/admin/medicine-orders" className="flex flex-col items-center p-2 text-gray-700">
                    <Package className="h-5 w-5" />
                    <span className="text-xs mt-1">Orders</span>
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
