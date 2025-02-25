import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@clerk/clerk-react";
import { hc } from "hono/client";
import { AppType } from "@dsa/api/src/index";

const client = hc<AppType>(import.meta.env.VITE_HONO_URL);

export const useTest = () => {
  const { getToken } = useAuth();

  return useQuery({
    queryKey: ["test"],
    queryFn: async () => {
      const token = await getToken();
      const response = await client.index.$get({
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      console.log(response);
      const data = await response.json();
      return data;
    },
  });
};
