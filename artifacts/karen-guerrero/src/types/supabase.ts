export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      products: {
        Row: {
          id: number;
          name: string;
          description: string;
          price: number;
          sale_price: number | null;
          category_id: number;
          images: string[];
          sizes: string[];
          featured: boolean;
          is_new: boolean;
          stock_quantity: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: number;
          name: string;
          description: string;
          price: number;
          sale_price?: number | null;
          category_id: number;
          images?: string[];
          sizes?: string[];
          featured?: boolean;
          is_new?: boolean;
          stock_quantity?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: number;
          name?: string;
          description?: string;
          price?: number;
          sale_price?: number | null;
          category_id?: number;
          images?: string[];
          sizes?: string[];
          featured?: boolean;
          is_new?: boolean;
          stock_quantity?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      categories: {
        Row: {
          id: number;
          name: string;
          slug: string;
          image: string | null;
          description: string | null;
          created_at: string;
        };
        Insert: {
          id?: number;
          name: string;
          slug: string;
          image?: string | null;
          description?: string | null;
          created_at?: string;
        };
        Update: {
          id?: number;
          name?: string;
          slug?: string;
          image?: string | null;
          description?: string | null;
          created_at?: string;
        };
      };
      testimonials: {
        Row: {
          id: number;
          name: string;
          comment: string;
          rating: number;
          avatar: string | null;
          is_active: boolean;
          created_at: string;
        };
        Insert: {
          id?: number;
          name: string;
          comment: string;
          rating: number;
          avatar?: string | null;
          is_active?: boolean;
          created_at?: string;
        };
        Update: {
          id?: number;
          name?: string;
          comment?: string;
          rating?: number;
          avatar?: string | null;
          is_active?: boolean;
          created_at?: string;
        };
      };
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          phone: string | null;
          avatar_url: string | null;
          role: "user" | "admin";
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name?: string | null;
          phone?: string | null;
          avatar_url?: string | null;
          role?: "user" | "admin";
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string | null;
          phone?: string | null;
          avatar_url?: string | null;
          role?: "user" | "admin";
          created_at?: string;
          updated_at?: string;
        };
      };
      addresses: {
        Row: {
          id: number;
          user_id: string;
          full_name: string;
          phone: string;
          street: string;
          city: string;
          state: string;
          zip_code: string;
          country: string;
          is_default: boolean;
          created_at: string;
        };
        Insert: {
          id?: number;
          user_id: string;
          full_name: string;
          phone: string;
          street: string;
          city: string;
          state: string;
          zip_code: string;
          country?: string;
          is_default?: boolean;
          created_at?: string;
        };
        Update: {
          id?: number;
          user_id?: string;
          full_name?: string;
          phone?: string;
          street?: string;
          city?: string;
          state?: string;
          zip_code?: string;
          country?: string;
          is_default?: boolean;
          created_at?: string;
        };
      };
      orders: {
        Row: {
          id: number;
          user_id: string;
          status:
            | "pending"
            | "processing"
            | "shipped"
            | "delivered"
            | "cancelled";
          total_amount: number;
          shipping_address: Json;
          payment_status: "pending" | "completed" | "failed";
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: number;
          user_id: string;
          status?:
            | "pending"
            | "processing"
            | "shipped"
            | "delivered"
            | "cancelled";
          total_amount: number;
          shipping_address: Json;
          payment_status?: "pending" | "completed" | "failed";
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: number;
          user_id?: string;
          status?:
            | "pending"
            | "processing"
            | "shipped"
            | "delivered"
            | "cancelled";
          total_amount?: number;
          shipping_address?: Json;
          payment_status?: "pending" | "completed" | "failed";
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      order_items: {
        Row: {
          id: number;
          order_id: number;
          product_id: number;
          product_name: string;
          product_image: string;
          size: string;
          quantity: number;
          unit_price: number;
          total_price: number;
        };
        Insert: {
          id?: number;
          order_id: number;
          product_id: number;
          product_name: string;
          product_image: string;
          size: string;
          quantity: number;
          unit_price: number;
          total_price: number;
        };
        Update: {
          id?: number;
          order_id?: number;
          product_id?: number;
          product_name?: string;
          product_image?: string;
          size?: string;
          quantity?: number;
          unit_price?: number;
          total_price?: number;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      order_status:
        | "pending"
        | "processing"
        | "shipped"
        | "delivered"
        | "cancelled";
      payment_status: "pending" | "completed" | "failed";
      user_role: "user" | "admin";
    };
  };
}

type Tables = Database["public"]["Tables"];

export type Product = Tables["products"]["Row"];
export type Category = Tables["categories"]["Row"];
export type Testimonial = Tables["testimonials"]["Row"];
export type Profile = Tables["profiles"]["Row"];
export type Address = Tables["addresses"]["Row"];
export type Order = Tables["orders"]["Row"];
export type OrderItem = Tables["order_items"]["Row"];

export type TablesInsert = {
  products: Tables["products"]["Insert"];
  categories: Tables["categories"]["Insert"];
  testimonials: Tables["testimonials"]["Insert"];
  profiles: Tables["profiles"]["Insert"];
  addresses: Tables["addresses"]["Insert"];
  orders: Tables["orders"]["Insert"];
  order_items: Tables["order_items"]["Insert"];
};

export type TablesUpdate = {
  products: Tables["products"]["Update"];
  categories: Tables["categories"]["Update"];
  testimonials: Tables["testimonials"]["Update"];
  profiles: Tables["profiles"]["Update"];
  addresses: Tables["addresses"]["Update"];
  orders: Tables["orders"]["Update"];
  order_items: Tables["order_items"]["Update"];
};
