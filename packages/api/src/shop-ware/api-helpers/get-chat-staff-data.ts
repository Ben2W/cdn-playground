import { z } from "zod";

const ChatStaffSchema = z.object({
  id: z.number(),
  first_name: z.string(),
  last_name: z.string(),
  short_name: z.string(),
  full_name: z.string(),
  name: z.string(),
  chat_id: z.string(),
  employee_id: z.null(),
  email: z.string().email(),
  shopware_roles: z.array(z.string()),
});

const ChatStaffResponseSchema = z.array(ChatStaffSchema);

type ChatStaff = z.infer<typeof ChatStaffSchema>;
type Result =
  | { data: ChatStaff[]; error: null }
  | { error: string; data: null };

const makeCookieString = (shopWareToken: string) => {
  return `_cookie_remember_token=${shopWareToken};`;
};

export const getChatStaff = async ({
  shopWareToken,
  shopWareApiUrl,
}: {
  shopWareToken: string;
  shopWareApiUrl: string;
}): Promise<Result> => {
  try {
    const res = await fetch(`${shopWareApiUrl}/api/internal/chat/staff`, {
      method: "GET",
      headers: {
        Cookie: makeCookieString(shopWareToken),
      },
    });

    if (!res.ok) {
      return { error: "Failed to fetch chat staff", data: null };
    }

    const body = await res.json();
    const parsedBody = ChatStaffResponseSchema.parse(body);

    return { data: parsedBody, error: null };
  } catch (error) {
    console.error(error);
    return { error: "Failed to fetch chat staff error: " + error, data: null };
  }
};
