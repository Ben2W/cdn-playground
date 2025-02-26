import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@clerk/clerk-react";
import { hc } from "hono/client";
import { AppType } from "@dsa/api/src/index";

export const useTest = () => {
  const { getToken } = useAuth();

  return useQuery({
    queryKey: ["test"],
    queryFn: async () => {
      const token = await getToken();
      const client = hc<AppType>(import.meta.env.VITE_HONO_URL, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log(token);
      const response = await client.index.$get();

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      console.log(response);
      const data = await response.json();
      return data;
    },
  });
};
