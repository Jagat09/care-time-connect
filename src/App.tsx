
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
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
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
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
                  <p>&copy; {new Date().getFullYear()} MediBook. All rights reserved.</p>
                  <p className="mt-2">A professional doctor appointment booking system.</p>
                </div>
              </div>
            </footer>
          </div>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
