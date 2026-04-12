import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import type { Product, Category } from "@/types/supabase";

export function useProducts(options?: {
  categoryId?: number;
  featured?: boolean;
  isNew?: boolean;
}) {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchProducts = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      let query = supabase.from("products").select("*");

      if (options?.categoryId) {
        query = query.eq("category_id", options.categoryId);
      }
      if (options?.featured) {
        query = query.eq("featured", true);
      }
      if (options?.isNew) {
        query = query.eq("is_new", true);
      }

      const { data, error: fetchError } = await query.order("created_at", {
        ascending: false,
      });

      if (fetchError) throw fetchError;
      setProducts(data || []);
    } catch (err) {
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  }, [options?.categoryId, options?.featured, options?.isNew]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return { products, isLoading, error, refetch: fetchProducts };
}

export function useProduct(id: number) {
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      setIsLoading(true);
      try {
        const { data, error: fetchError } = await supabase
          .from("products")
          .select("*")
          .eq("id", id)
          .single();

        if (fetchError) throw fetchError;
        setProduct(data);
      } catch (err) {
        setError(err as Error);
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id]);

  return { product, isLoading, error };
}

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      setIsLoading(true);
      try {
        const { data, error: fetchError } = await supabase
          .from("categories")
          .select("*")
          .order("name");

        if (fetchError) throw fetchError;
        setCategories(data || []);
      } catch (err) {
        setError(err as Error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return { categories, isLoading, error };
}

export function useOnSaleProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchOnSale = async () => {
      setIsLoading(true);
      try {
        const { data, error: fetchError } = await supabase
          .from("products")
          .select("*")
          .not("sale_price", "is", null)
          .order("created_at", { ascending: false });

        if (fetchError) throw fetchError;
        setProducts(data || []);
      } catch (err) {
        setError(err as Error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOnSale();
  }, []);

  return { products, isLoading, error };
}

export function useFeaturedProducts(limit = 4) {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchFeatured = async () => {
      setIsLoading(true);
      try {
        const { data, error: fetchError } = await supabase
          .from("products")
          .select("*")
          .eq("featured", true)
          .limit(limit);

        if (fetchError) throw fetchError;
        setProducts(data || []);
      } catch (err) {
        setError(err as Error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFeatured();
  }, [limit]);

  return { products, isLoading, error };
}
