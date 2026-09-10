export type Role = "customer" | "owner";
export type RequestStatus = "new" | "reviewed" | "fulfilled";

export interface Profile {
  id: string;
  full_name: string;
  phone: string;
  role: Role;
  created_at: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  sku: string;
  price: number;
  category: string;
  image_url: string | null;
  is_active: boolean;
  created_at: string;
}

export interface Request {
  id: string;
  customer_id: string;
  status: RequestStatus;
  notes: string;
  created_at: string;
}

export interface RequestItem {
  id: string;
  request_id: string;
  product_id: string | null;
  product_name_snapshot: string;
  unit_price_snapshot: number;
  quantity: number;
}

export interface RequestWithItems extends Request {
  request_items: RequestItem[];
  profiles?: Pick<Profile, "full_name" | "phone">;
}
