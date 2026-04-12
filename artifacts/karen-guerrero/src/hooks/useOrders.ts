import { useState, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import type { Order, OrderItem, Address } from "@/types/supabase";
import { useAuth } from "./useAuth";

export function useOrders() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchOrders = useCallback(async () => {
    if (!user) return;
    setIsLoading(true);

    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (!error && data) {
      setOrders(data);
    }
    setIsLoading(false);
  }, [user]);

  const fetchOrder = useCallback(async (orderId: number) => {
    setIsLoading(true);

    const { data: order, error: orderError } = await supabase
      .from("orders")
      .select("*")
      .eq("id", orderId)
      .single();

    if (orderError || !order) {
      setIsLoading(false);
      return null;
    }

    const { data: items, error: itemsError } = await supabase
      .from("order_items")
      .select("*")
      .eq("order_id", orderId);

    if (!itemsError && items) {
      setOrderItems(items);
    }

    setCurrentOrder(order);
    setIsLoading(false);
    return order;
  }, []);

  const createOrder = useCallback(
    async (
      totalAmount: number,
      shippingAddress: Address,
      items: Array<{
        productId: number;
        productName: string;
        productImage: string;
        size: string;
        quantity: number;
        unitPrice: number;
      }>,
    ) => {
      if (!user) return { error: new Error("Debes iniciar sesión") };

      setIsLoading(true);

      const { data: order, error: orderError } = await supabase
        .from("orders")
        .insert({
          user_id: user.id,
          total_amount: totalAmount,
          shipping_address: shippingAddress,
        })
        .select()
        .single();

      if (orderError) {
        setIsLoading(false);
        return { error: orderError };
      }

      const orderItemsToInsert = items.map((item) => ({
        order_id: order.id,
        product_id: item.productId,
        product_name: item.productName,
        product_image: item.productImage,
        size: item.size,
        quantity: item.quantity,
        unit_price: item.unitPrice,
        total_price: item.unitPrice * item.quantity,
      }));

      const { error: itemsError } = await supabase
        .from("order_items")
        .insert(orderItemsToInsert);

      if (itemsError) {
        await supabase.from("orders").delete().eq("id", order.id);
        setIsLoading(false);
        return { error: itemsError };
      }

      setCurrentOrder(order);
      setIsLoading(false);
      return { order, error: null };
    },
    [user],
  );

  const updateOrderStatus = useCallback(
    async (orderId: number, status: Order["status"]) => {
      const { error } = await supabase
        .from("orders")
        .update({ status })
        .eq("id", orderId);

      return { error };
    },
    [],
  );

  return {
    orders,
    currentOrder,
    orderItems,
    isLoading,
    fetchOrders,
    fetchOrder,
    createOrder,
    updateOrderStatus,
  };
}
