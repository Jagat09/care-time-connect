
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getMedicines, deleteMedicine } from '@/services/medicineService';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/components/ui/use-toast';
import { Search, Plus, Pencil, Trash2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';

const ManageMedicines: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [medicineToDelete, setMedicineToDelete] = useState<string | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  
  // Fetch medicines
  const { data: medicines, isLoading, error } = useQuery({
    queryKey: ['medicines'],
    queryFn: getMedicines,
  });
  
  // Delete medicine mutation
  const deleteMutation = useMutation({
    mutationFn: deleteMedicine,
    onSuccess: () => {
      toast({
        title: 'Medicine deleted',
        description: 'Medicine has been deleted successfully.',
      });
      queryClient.invalidateQueries({ queryKey: ['medicines'] });
    },
    onError: (error) => {
      toast({
        variant: 'destructive',
        title: 'Failed to delete medicine',
        description: error instanceof Error ? error.message : 'An unknown error occurred',
      });
    },
    onSettled: () => {
      setMedicineToDelete(null);
    },
  });
  
  // Filter medicines based on search
  const filteredMedicines = medicines?.filter(medicine =>
    medicine.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Handle delete confirmation
  const handleDeleteClick = (id: string) => {
    setMedicineToDelete(id);
  };
  
  const confirmDelete = () => {
    if (medicineToDelete) {
      deleteMutation.mutate(medicineToDelete);
    }
  };
  
  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
          <p className="text-red-700">Failed to load medicines. Please try again later.</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
        <h1 className="text-3xl font-bold text-gray-900">Manage Medicines</h1>
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <Input
              className="pl-10 w-full sm:w-64"
              placeholder="Search medicines..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button onClick={() => navigate('/admin/add-medicine')}>
            <Plus className="mr-2 h-4 w-4" />
            Add Medicine
          </Button>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead className="hidden sm:table-cell">Price</TableHead>
              <TableHead className="hidden md:table-cell">Stock</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              [...Array(5)].map((_, i) => (
                <TableRow key={i}>
                  <TableCell>
                    <div className="h-6 bg-gray-200 rounded animate-pulse"></div>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">
                    <div className="h-6 bg-gray-200 rounded w-16 animate-pulse"></div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <div className="h-6 bg-gray-200 rounded w-12 animate-pulse"></div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="h-9 bg-gray-200 rounded w-20 ml-auto animate-pulse"></div>
                  </TableCell>
                </TableRow>
              ))
            ) : filteredMedicines && filteredMedicines.length > 0 ? (
              filteredMedicines.map((medicine) => (
                <TableRow key={medicine.id}>
                  <TableCell className="font-medium">
                    <Link
                      to={`/medicines/${medicine.id}`}
                      className="hover:text-medical-500 transition-colors"
                    >
                      {medicine.name}
                    </Link>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">
                    ${medicine.price.toFixed(2)}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {medicine.stock}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigate(`/admin/edit-medicine/${medicine.id}`)}
                      >
                        <Pencil className="h-4 w-4" />
                        <span className="sr-only">Edit</span>
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-red-500 border-red-200 hover:bg-red-50"
                        onClick={() => handleDeleteClick(medicine.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Delete</span>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-8">
                  {searchTerm ? (
                    <p className="text-gray-500">No medicines match your search criteria</p>
                  ) : (
                    <p className="text-gray-500">No medicines found in the system</p>
                  )}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      
      {/* Delete Confirmation Dialog */}
      <Dialog open={!!medicineToDelete} onOpenChange={(open) => !open && setMedicineToDelete(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this medicine? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button
              variant="destructive"
              onClick={confirmDelete}
            >
              Delete Medicine
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ManageMedicines;
