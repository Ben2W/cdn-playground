import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@clerk/clerk-react";
import { chatStaffResponseSchema } from "@dsa/api/src/shop-ware/api-helpers/get-chat-staff-data";
import { workOrdersSchema } from "@dsa/api/src/shop-ware/api-helpers/get-work-data";

export const useChatStaff = () => {
  const { getToken } = useAuth();

  return useQuery({
    queryKey: ["chat-staff"],
    queryFn: async () => {
      const token = await getToken();
      const response = await fetch(
        `${import.meta.env.VITE_HONO_URL}/data/work-orders`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      const parsedData = chatStaffResponseSchema.parse(data);
      return parsedData;
    },
  });
};

export const useWorkOrders = () => {
  const { getToken } = useAuth();

  return useQuery({
    queryKey: ["work-orders"],
    queryFn: async () => {
      const token = await getToken();
      const response = await fetch(
        `${import.meta.env.VITE_HONO_URL}/data/work-orders`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      const parsedData = workOrdersSchema.parse(data);
      return parsedData;
    },
  });
};
