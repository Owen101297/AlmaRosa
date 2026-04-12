import { useState, useCallback, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import type { Address } from "@/types/supabase";
import { useAuth } from "./useAuth";

export function useAddresses() {
  const { user } = useAuth();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchAddresses = useCallback(async () => {
    if (!user) return;
    setIsLoading(true);

    const { data, error } = await supabase
      .from("addresses")
      .select("*")
      .eq("user_id", user.id)
      .order("is_default", { ascending: false });

    if (!error && data) {
      setAddresses(data);
    }
    setIsLoading(false);
  }, [user]);

  useEffect(() => {
    fetchAddresses();
  }, [fetchAddresses]);

  const addAddress = useCallback(
    async (address: Omit<Address, "id" | "user_id" | "created_at">) => {
      if (!user) return { error: new Error("Debes iniciar sesión") };

      let addressToInsert = { ...address };

      if (address.is_default) {
        await supabase
          .from("addresses")
          .update({ is_default: false })
          .eq("user_id", user.id);
      }

      const { data, error } = await supabase
        .from("addresses")
        .insert({ ...addressToInsert, user_id: user.id })
        .select()
        .single();

      if (!error && data) {
        await fetchAddresses();
      }
      return { address: data, error };
    },
    [user, fetchAddresses],
  );

  const updateAddress = useCallback(
    async (id: number, address: Partial<Address>) => {
      if (!user) return { error: new Error("Debes iniciar sesión") };

      let updateData = { ...address };

      if (address.is_default) {
        await supabase
          .from("addresses")
          .update({ is_default: false })
          .eq("user_id", user.id)
          .neq("id", id);
      }

      const { error } = await supabase
        .from("addresses")
        .update(updateData)
        .eq("id", id)
        .eq("user_id", user.id);

      if (!error) {
        await fetchAddresses();
      }
      return { error };
    },
    [user, fetchAddresses],
  );

  const deleteAddress = useCallback(
    async (id: number) => {
      if (!user) return { error: new Error("Debes iniciar sesión") };

      const { error } = await supabase
        .from("addresses")
        .delete()
        .eq("id", id)
        .eq("user_id", user.id);

      if (!error) {
        await fetchAddresses();
      }
      return { error };
    },
    [user, fetchAddresses],
  );

  const getDefaultAddress = useCallback(() => {
    return addresses.find((a) => a.is_default) || addresses[0] || null;
  }, [addresses]);

  return {
    addresses,
    isLoading,
    fetchAddresses,
    addAddress,
    updateAddress,
    deleteAddress,
    getDefaultAddress,
  };
}
