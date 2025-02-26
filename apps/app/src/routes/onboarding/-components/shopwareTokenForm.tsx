"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Button } from "@/components/shad-ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/shad-ui/form";
import { Input } from "@/components/shad-ui/input";
import { useAddShopwareToken } from "@/api-client/onboarding";

const FormSchema = z.object({
  token: z.string().min(2, {
    message: "Token must be at least 2 characters.",
  }),
});

export function InputForm() {
  const queryClient = useQueryClient();
  const { mutate: addShopwareToken, isPending } = useAddShopwareToken();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      token: "",
    },
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    addShopwareToken(data.token, {
      onSuccess: ({ shopWareTokenPassedValidation }) => {
        if (shopWareTokenPassedValidation) {
          queryClient.invalidateQueries({ queryKey: ["onboarding"] });
          toast.success("Shopware token added");
        } else {
          toast.error("Invalid shopware token. Please try again.");
        }
      },
      onError: (error) => {
        toast.error(
          `Failed to add shopware token. Error: ${error.message}. Please try again.`
        );
      },
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-2/3 space-y-6">
        <FormField
          control={form.control}
          name="token"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Shopware Remember Token</FormLabel>
              <FormControl>
                <Input placeholder="Enter your token" {...field} />
              </FormControl>
              <FormDescription>
                <div className="text-lg py-2">
                  <ul className="list-disc pl-5">
                    <li>Go to ShopWare</li>
                    <li>Open chrome devtools</li>
                    <li>Click on "Application"</li>
                    <li>Click on "Cookies"</li>
                    <li>
                      Click on https://dealer-service-alternative.shop-ware.com/
                    </li>
                    <li>Find the "_cookie_remember_token" cookie</li>
                    <li>Copy and paste the "Value" of that cookie</li>
                  </ul>
                </div>
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isPending}>
          {isPending ? "Submitting..." : "Submit"}
        </Button>
      </form>
    </Form>
  );
}
