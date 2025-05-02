
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import Navigation from "./components/Navigation";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import DoctorsList from "./pages/DoctorsList";
import DoctorDetails from "./pages/DoctorDetails";
import BookAppointment from "./pages/BookAppointment";
import MyAppointments from "./pages/MyAppointments";
import ManageDoctors from "./pages/admin/ManageDoctors";
import AddDoctor from "./pages/admin/AddDoctor";
import ViewAppointments from "./pages/admin/ViewAppointments";
import Medicines from "./pages/Medicines";
import MedicineDetails from "./pages/MedicineDetails";
import Cart from "./pages/Cart";
import MyOrders from "./pages/MyOrders";
import ManageMedicines from "./pages/admin/ManageMedicines";
import AddEditMedicine from "./pages/admin/AddEditMedicine";
import ManageMedicineOrders from "./pages/admin/ManageMedicineOrders";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Protected route wrapper for patient-only routes
const PatientRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isPatient, isLoading } = useAuth();
  
  if (isLoading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }
  
  if (!user || !isPatient()) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

// Protected route wrapper for admin-only routes
const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isAdmin, isLoading } = useAuth();
  
  if (isLoading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }
  
  if (!user || !isAdmin()) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

const AppRoutes = () => {
  const { isLoading } = useAuth();
  
  if (isLoading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }
  
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      
      {/* Doctor Routes */}
      <Route path="/doctors" element={<DoctorsList />} />
      <Route path="/doctor/:id" element={<DoctorDetails />} />
      <Route path="/book-appointment/:id" element={
        <PatientRoute>
          <BookAppointment />
        </PatientRoute>
      } />
      <Route path="/my-appointments" element={
        <PatientRoute>
          <MyAppointments />
        </PatientRoute>
      } />
      
      {/* Medicine Routes */}
      <Route path="/medicines" element={<Medicines />} />
      <Route path="/medicines/:id" element={<MedicineDetails />} />
      <Route path="/cart" element={<Cart />} />
      <Route path="/my-orders" element={
        <PatientRoute>
          <MyOrders />
        </PatientRoute>
      } />
      
      {/* Admin Routes */}
      <Route path="/admin/doctors" element={
        <AdminRoute>
          <ManageDoctors />
        </AdminRoute>
      } />
      <Route path="/admin/add-doctor" element={
        <AdminRoute>
          <AddDoctor />
        </AdminRoute>
      } />
      <Route path="/admin/appointments" element={
        <AdminRoute>
          <ViewAppointments />
        </AdminRoute>
      } />
      <Route path="/admin/medicines" element={
        <AdminRoute>
          <ManageMedicines />
        </AdminRoute>
      } />
      <Route path="/admin/add-medicine" element={
        <AdminRoute>
          <AddEditMedicine />
        </AdminRoute>
      } />
      <Route path="/admin/edit-medicine/:id" element={
        <AdminRoute>
          <AddEditMedicine />
        </AdminRoute>
      } />
      <Route path="/admin/medicine-orders" element={
        <AdminRoute>
          <ManageMedicineOrders />
        </AdminRoute>
      } />
      
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <CartProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <div className="min-h-screen flex flex-col">
              <Navigation />
              <main className="flex-grow">
                <AppRoutes />
              </main>
              <footer className="bg-gray-50 border-t py-8 mt-auto">
                <div className="container mx-auto px-4">
                  <div className="text-center text-sm text-gray-600">
                    <p>&copy; {new Date().getFullYear()} MediNest. All rights reserved.</p>
                    <p className="mt-2">A professional doctor appointment booking system.</p>
                  </div>
                </div>
              </footer>
            </div>
          </BrowserRouter>
        </CartProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
