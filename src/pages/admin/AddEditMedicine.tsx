
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getMedicineById, createMedicine, updateMedicine } from '@/services/medicineService';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';

const medicineSchema = z.object({
  name: z.string().min(1, 'Medicine name is required'),
  description: z.string().optional(),
  price: z.coerce.number().min(0.01, 'Price must be greater than 0'),
  stock: z.coerce.number().int().min(0, 'Stock cannot be negative'),
  image: z.string().optional(),
});

type MedicineFormData = z.infer<typeof medicineSchema>;

const AddEditMedicine: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const isEditMode = !!id;
  
  const form = useForm<MedicineFormData>({
    resolver: zodResolver(medicineSchema),
    defaultValues: {
      name: '',
      description: '',
      price: 0,
      stock: 0,
      image: '',
    },
  });
  
  // Fetch medicine data if in edit mode
  const { data: medicine, isLoading } = useQuery({
    queryKey: ['medicine', id],
    queryFn: () => getMedicineById(id!),
    enabled: isEditMode,
  });
  
  // Set form values when medicine data is loaded
  useEffect(() => {
    if (medicine) {
      form.reset({
        name: medicine.name,
        description: medicine.description || '',
        price: medicine.price,
        stock: medicine.stock,
        image: medicine.image || '',
      });
    }
  }, [medicine, form]);
  
  // Create medicine mutation
  const createMedicineMutation = useMutation({
    mutationFn: createMedicine,
    onSuccess: () => {
      toast({
        title: 'Medicine created',
        description: 'Medicine has been created successfully.',
      });
      queryClient.invalidateQueries({ queryKey: ['medicines'] });
      navigate('/admin/medicines');
    },
    onError: (error) => {
      toast({
        variant: 'destructive',
        title: 'Failed to create medicine',
        description: error instanceof Error ? error.message : 'An unknown error occurred',
      });
      setIsSubmitting(false);
    },
  });
  
  // Update medicine mutation
  const updateMedicineMutation = useMutation({
    mutationFn: ({ id, medicine }: { id: string; medicine: Partial<MedicineFormData> }) => 
      updateMedicine(id, medicine),
    onSuccess: () => {
      toast({
        title: 'Medicine updated',
        description: 'Medicine has been updated successfully.',
      });
      queryClient.invalidateQueries({ queryKey: ['medicines'] });
      queryClient.invalidateQueries({ queryKey: ['medicine', id] });
      navigate('/admin/medicines');
    },
    onError: (error) => {
      toast({
        variant: 'destructive',
        title: 'Failed to update medicine',
        description: error instanceof Error ? error.message : 'An unknown error occurred',
      });
      setIsSubmitting(false);
    },
  });
  
  const onSubmit = (data: MedicineFormData) => {
    setIsSubmitting(true);
    if (isEditMode && id) {
      updateMedicineMutation.mutate({ id, medicine: data });
    } else {
      createMedicineMutation.mutate(data);
    }
  };
  
  if (isLoading && isEditMode) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <Card className="animate-pulse">
            <CardHeader>
              <div className="h-8 bg-gray-200 rounded w-1/2 mb-4"></div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                    <div className="h-10 bg-gray-200 rounded"></div>
                  </div>
                ))}
                <div className="h-10 bg-gray-200 rounded w-1/3 mt-6"></div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <Button 
        variant="ghost" 
        className="mb-6" 
        onClick={() => navigate("/admin/medicines")}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Medicines
      </Button>
      
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>{isEditMode ? 'Edit Medicine' : 'Add New Medicine'}</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Medicine name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Medicine description" 
                          rows={4}
                          {...field} 
                          value={field.value || ''}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="price"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Price ($)</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            step="0.01" 
                            min="0" 
                            placeholder="0.00" 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="stock"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Stock</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            min="0" 
                            placeholder="0" 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name="image"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Image URL</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="https://example.com/image.jpg" 
                          {...field} 
                          value={field.value || ''}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="flex justify-end">
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Saving...' : isEditMode ? 'Update Medicine' : 'Add Medicine'}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AddEditMedicine;
