
-- Function to decrement medicine stock when an order is placed
CREATE OR REPLACE FUNCTION public.decrement_medicine_stock(medicine_id UUID, quantity INTEGER)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE public.medicines
  SET stock = stock - quantity
  WHERE id = medicine_id AND stock >= quantity;
END;
$$;
