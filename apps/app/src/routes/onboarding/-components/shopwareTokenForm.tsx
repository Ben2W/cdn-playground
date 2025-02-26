"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

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

const FormSchema = z.object({
  token: z.string().min(2, {
    message: "Token must be at least 2 characters.",
  }),
});

export function InputForm() {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      token: "",
    },
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    console.log(data);
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
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}
