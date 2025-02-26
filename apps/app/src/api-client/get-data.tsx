import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@clerk/clerk-react";
import { hc } from "hono/client";
import { AppType } from "@dsa/api/src/index";

export const useChatStaff = () => {
  const { getToken } = useAuth();

  return useQuery({
    queryKey: ["data"],
    queryFn: async () => {
      const token = await getToken();
      const client = hc<AppType>(`${import.meta.env.VITE_HONO_URL}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const response = await client.data["chat-staff"].$get();

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      return data;
    },
  });
};

export const useWorkOrders = () => {
  const { getToken } = useAuth();

  return useQuery({
    queryKey: ["data"],
    queryFn: async () => {
      const token = await getToken();
      const client = hc<AppType>(`${import.meta.env.VITE_HONO_URL}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const response = await client.data["work-orders"].$get();

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      return data;
    },
  });
};
