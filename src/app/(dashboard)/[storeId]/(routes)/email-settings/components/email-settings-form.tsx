"use client";

import { useState } from "react";

import * as z from "zod";
import ky from "ky";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { EmailSettings } from "@prisma/client";
import { useParams, useRouter } from "next/navigation";

import { toast } from "@/lib/toast";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { SubHeading } from "@/components/ui/sub-heading";
import { Textarea } from "@/components/ui/textarea";

const formSchema = z.object({
  from: z.string().nonempty(),
  replyTo: z.string().nonempty(),

  name: z.string().nonempty(),
  officialName: z.string().nonempty(),
  address: z.string().nonempty(),
  logoUrl: z.string().url().nonempty(),

  orderConfirmationSubject: z.string(),
  orderConfirmationTitle: z.string(),
  orderConfirmationSubtitle: z.string(),
  orderConfirmationDescription: z.string(),

  paymentConfirmationSubject: z.string(),
  paymentConfirmationTitle: z.string(),
  paymentConfirmationSubtitle: z.string(),
  paymentConfirmationDescription: z.string(),

  shippingConfirmationSubject: z.string(),
  shippingConfirmationTitle: z.string(),
  shippingConfirmationSubtitle: z.string(),
  shippingConfirmationDescription: z.string(),

  deliveryConfirmationSubject: z.string(),
  deliveryConfirmationTitle: z.string(),
  deliveryConfirmationSubtitle: z.string(),
  deliveryConfirmationDescription: z.string(),
});

type SettingsFormValues = z.infer<typeof formSchema>;

interface EmailSettingsFormProps {
  initialData: EmailSettings;
}

export const EmailSettingsForm = ({ initialData }: EmailSettingsFormProps) => {
  const params = useParams();
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  const form = useForm<SettingsFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData,
  });

  const onSubmit = async (data: SettingsFormValues) => {
    try {
      setLoading(true);
      await ky.patch(`/api/${params.storeId}/email-settings`, { json: data });
      router.refresh();
      toast.success("Email settings updated.");
    } catch (error: any) {
      toast.error("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Heading
        title="Email settings"
        description="Manage store email settings."
      />
      <Separator />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full space-y-8"
        >
          <div className="grid grid-cols-2 gap-8">
            <FormField
              control={form.control}
              name="from"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>From</FormLabel>
                  <FormControl>
                    <Input disabled={loading} placeholder="From" {...field} />
                  </FormControl>
                  <FormMessage />
                  <FormDescription>
                    The email address which will submit the emails for the
                    customers.
                    <br /> Eg.:{" "}
                    <code>My Store {"<orders@updates.my.store>"}</code>
                    <br /> Needs to be configured on resend
                  </FormDescription>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="replyTo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Reply To</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="Reply To"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                  <FormDescription>
                    The email address which will receive the replies from the
                    customers
                    <br /> Eg.:{" "}
                    <code>Customer Support {"<contact@cs.my.store>"}</code>
                  </FormDescription>
                </FormItem>
              )}
            />
          </div>
          <Separator />
          <div className="grid grid-cols-2 gap-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input disabled={loading} placeholder="Name" {...field} />
                  </FormControl>
                  <FormMessage />
                  <FormDescription>
                    The store name which will be displayed on the emails
                  </FormDescription>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="officialName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Official Name</FormLabel>
                  <FormControl>
                    <Input disabled={loading} placeholder="Name" {...field} />
                  </FormControl>
                  <FormMessage />
                  <FormDescription>
                    The store official name which will be displayed on the
                    emails (on the footer)
                  </FormDescription>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address</FormLabel>
                  <FormControl>
                    <Input disabled={loading} placeholder="Name" {...field} />
                  </FormControl>
                  <FormMessage />
                  <FormDescription>
                    The store address which will be displayed on the emails (on
                    the footer)
                  </FormDescription>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="logoUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Logo URL</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="Logo URL"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                  <FormDescription>
                    Eg.: `https://my.store/images/logo-email.png`
                  </FormDescription>
                </FormItem>
              )}
            />
          </div>

          <Separator />
          <SubHeading
            title="Order confirmation"
            description="Customize the order confirmation email."
          />
          <div className="grid grid-cols-2 gap-8">
            <FormField
              control={form.control}
              name="orderConfirmationSubject"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Subject</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="Subject"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="orderConfirmationTitle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input disabled={loading} placeholder="Title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="orderConfirmationSubtitle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Subtitle</FormLabel>
                  <FormControl>
                    <Textarea
                      disabled={loading}
                      placeholder="Subtitle"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="orderConfirmationDescription"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description (optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      disabled={loading}
                      placeholder="Description (optional)"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <Separator />
          <SubHeading
            title="Payment confirmation"
            description="Customize the payment confirmation email."
          />
          <div className="grid grid-cols-2 gap-8">
            <FormField
              control={form.control}
              name="paymentConfirmationSubject"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Subject</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="Subject"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="paymentConfirmationTitle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input disabled={loading} placeholder="Title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="paymentConfirmationSubtitle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Subtitle</FormLabel>
                  <FormControl>
                    <Textarea
                      disabled={loading}
                      placeholder="Subtitle"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="paymentConfirmationDescription"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description (optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      disabled={loading}
                      placeholder="Description (optional)"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <Separator />
          <SubHeading
            title="Shipping confirmation"
            description="Customize the shipping confirmation email."
          />
          <div className="grid grid-cols-2 gap-8">
            <FormField
              control={form.control}
              name="shippingConfirmationSubject"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Subject</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="Subject"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="shippingConfirmationTitle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input disabled={loading} placeholder="Title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="shippingConfirmationSubtitle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Subtitle</FormLabel>
                  <FormControl>
                    <Textarea
                      disabled={loading}
                      placeholder="Subtitle"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="shippingConfirmationDescription"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description (optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      disabled={loading}
                      placeholder="Description (optional)"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <Separator />
          <SubHeading
            title="Delivery confirmation"
            description="Customize the delivery confirmation email."
          />
          <div className="grid grid-cols-2 gap-8">
            <FormField
              control={form.control}
              name="deliveryConfirmationSubject"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Subject</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="Subject"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="deliveryConfirmationTitle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input disabled={loading} placeholder="Title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="deliveryConfirmationSubtitle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Subtitle</FormLabel>
                  <FormControl>
                    <Textarea
                      disabled={loading}
                      placeholder="Subtitle"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="deliveryConfirmationDescription"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description (optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      disabled={loading}
                      placeholder="Description (optional)"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button disabled={loading} className="ml-auto" type="submit">
            Save changes
          </Button>
        </form>
      </Form>
    </>
  );
};
