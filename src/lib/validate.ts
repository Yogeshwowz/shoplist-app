import { z } from 'zod';

export const OrderItemSchema = z.object({
  id: z.string(),
  category: z.string(),
  description: z.string(),
  packaging: z.string(),
  quantity: z.number().int().min(0).max(99999),
  chefComment: z.string().max(500).optional(),
  shopperComment: z.string().max(500).optional(),
});

export const CustomerDetailsSchema = z.object({
  boatName: z.string().min(1, 'Boat Name is required'),
  orderDate: z.string().min(1, 'Order Date is required'),
  deliverBy: z.string().min(1, 'Deliver By is required'),
  orderName: z.string().min(1, 'Order Name is required'),
});

export const OrderPayloadSchema = z.object({
  customer: CustomerDetailsSchema,
  items: z.array(OrderItemSchema).min(1, 'At least one item is required'),
});