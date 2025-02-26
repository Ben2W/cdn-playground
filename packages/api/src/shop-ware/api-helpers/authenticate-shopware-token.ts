import { z } from "zod";

export const authenticateShopwareToken = async ({
  shopWareToken,
  shopWareApiUrl,
}: {
  shopWareToken: string;
  shopWareApiUrl: string;
}) => {
  try {
    const res = await fetch(`${shopWareApiUrl}/api/internal/chat/token`, {
      method: "GET",
      headers: {
        Cookie: `_cookie_remember_token=${shopWareToken};`,
      },
    });

    if (!res.ok) {
      console.log(res);
      return false;
    }

    const body = await res.json();

    z.object({
      chat_token: z.string(),
    }).parse(body);

    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
};
