import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@clerk/clerk-react";
import { hc } from "hono/client";
import { AppType } from "@dsa/api/src/index";

export const useOnboarding = () => {
  const { getToken } = useAuth();

  return useQuery({
    queryKey: ["test"],
    queryFn: async () => {
      const token = await getToken();
      const client = hc<AppType>(`${import.meta.env.VITE_HONO_URL}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const response = await client.onboarding.$get({
        input: {},
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      return data;
    },
  });
};
