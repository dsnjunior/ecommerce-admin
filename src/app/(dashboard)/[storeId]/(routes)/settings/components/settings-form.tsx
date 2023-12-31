"use client";

import { useState } from "react";

import * as z from "zod";
import ky from "ky";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Trash } from "lucide-react";
import { Collaborator, Store, User, UserEmailAddress } from "@prisma/client";
import { useParams, useRouter } from "next/navigation";

import { toast } from "@/lib/toast";
import { Input } from "@/components/ui/input";
import { useOrigin } from "@/hooks/use-origin";
import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { ApiAlert } from "@/components/ui/api-alert";
import { Separator } from "@/components/ui/separator";
import { AlertModal } from "@/components/modals/alert-modal";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";

import { CollaboratorsRow } from "./collaborators-row";

const currencies = ["USD", "EUR", "BRL"] as const;

const formSchema = z.object({
  name: z.string().min(2),
  zipCode: z.string().min(8).max(8),
  currency: z.enum(currencies),
  storeUrl: z.string().url().nonempty(),
  storeSuccessSaleUrl: z.string().url().nonempty(),
  storeCancelledSaleUrl: z.string().url().nonempty(),
  contentUpdateWebhook: z.string().url().or(z.string().max(0)),
  collaboratorsToInvite: z.string().optional(),
});

type SettingsFormValues = z.infer<typeof formSchema>;

interface SettingsFormProps {
  initialData: Store & {
    collaborators: (Collaborator & {
      user: User & { emailAddresses: UserEmailAddress[] };
    })[];
  };
}

export const SettingsForm = ({ initialData }: SettingsFormProps) => {
  const params = useParams();
  const router = useRouter();
  const origin = useOrigin();

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [currentCollaborators, setCurrentCollaborators] = useState(
    initialData.collaborators
  );

  const form = useForm<SettingsFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData,
  });

  const onSubmit = async (data: SettingsFormValues) => {
    try {
      setLoading(true);

      const { collaboratorsToInvite, ...toSubmit } = data;

      const keepCollaborators = currentCollaborators.flatMap((collaborator) =>
        collaborator.user.emailAddresses.map(
          (emailAddress) => emailAddress.email
        )
      );

      const newCollaborators = collaboratorsToInvite
        ? collaboratorsToInvite
            .split(",")
            .map((collaborator) => collaborator.trim())
        : [];

      const collaborators = [...keepCollaborators, ...newCollaborators];

      const json = { ...toSubmit, collaborators };

      await ky.patch(`/api/stores/${params.storeId}`, { json });
      router.refresh();
      toast.success("Store updated.");
      form.setValue("collaboratorsToInvite", "");
    } catch (error: any) {
      toast.error("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const onDelete = async () => {
    try {
      setLoading(true);
      await ky.delete(`/api/stores/${params.storeId}`);
      router.refresh();
      router.push("/");
      toast.success("Store deleted.");
    } catch (error: any) {
      toast.error("Something went wrong.");
    } finally {
      setLoading(false);
      setOpen(false);
    }
  };

  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onDelete}
        loading={loading}
      />
      <div className="flex items-center justify-between">
        <Heading
          title="Store settings"
          description="Manage store preferences"
        />
        <Button
          disabled={loading}
          variant="destructive"
          size="sm"
          onClick={() => setOpen(true)}
        >
          <Trash className="h-4 w-4" />
        </Button>
      </div>
      <Separator />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full space-y-8"
        >
          <div className="grid grid-cols-3 gap-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="Store name"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="grid grid-cols-3 gap-8">
            <FormField
              control={form.control}
              name="zipCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Zip code</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="Zip code"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                  <FormDescription>Only numbers.</FormDescription>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="currency"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Currency</FormLabel>
                  <Select
                    disabled={loading}
                    // @ts-ignore
                    onValueChange={field.onChange}
                    value={field.value}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue
                          defaultValue={field.value}
                          placeholder="Select a currency"
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {currencies.map((currency) => (
                        <SelectItem key={currency} value={currency}>
                          {currency}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="grid grid-cols-2 gap-8">
            <FormField
              control={form.control}
              name="storeUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Store URL</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="Store URL"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                  <FormDescription>
                    Eg.: <code>https://store.com</code>
                  </FormDescription>
                </FormItem>
              )}
            />
          </div>
          <div className="grid grid-cols-2 gap-8">
            <FormField
              control={form.control}
              name="storeSuccessSaleUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Store success sale URL</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="Store success sale URL"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                  <FormDescription>
                    Store URL to be redirected when buyer finishes buying.{" "}
                    <br />
                    Eg.: <code>https://store.com/checkout/success</code>
                  </FormDescription>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="storeCancelledSaleUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Store cancelled sale URL</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="Store success sale URL"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                  <FormDescription>
                    Store URL to be redirected when buyer cancel buying. <br />
                    Eg.: <code>https://store.com/checkout/cancelled</code>
                  </FormDescription>
                </FormItem>
              )}
            />
          </div>

          <Button disabled={loading} className="ml-auto" type="submit">
            Save changes
          </Button>

          <Separator />
          <SubHeading
            title="Collaborators"
            description="Manage who can access and edit this store"
          />

          <div>
            <FormField
              control={form.control}
              name="collaboratorsToInvite"
              render={({ field }) => (
                <>
                  <FormItem>
                    <FormLabel>Add user email</FormLabel>
                    <FormControl>
                      <Input
                        disabled={loading}
                        placeholder="Add user email"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                    <FormDescription>
                      Add multiple users by separating them with a comma.
                    </FormDescription>
                  </FormItem>
                  <Alert variant="warn" className="mt-4">
                    <AlertDescription>
                      You can only invite users who have an account on our site.
                    </AlertDescription>
                  </Alert>
                  {!!currentCollaborators.length && (
                    <CollaboratorsRow
                      data={currentCollaborators}
                      onRemove={(collaboratorId) => {
                        setCurrentCollaborators((current) =>
                          current.filter(
                            (collaborator) => collaborator.id !== collaboratorId
                          )
                        );
                      }}
                    />
                  )}
                </>
              )}
            />
          </div>

          <Button disabled={loading} className="ml-auto" type="submit">
            Save changes
          </Button>

          <Separator />
          <SubHeading
            title="Technical settings"
            description="Manage store technical preferences"
          />

          <div className="grid grid-cols-2 gap-8">
            <FormField
              control={form.control}
              name="contentUpdateWebhook"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Store update webhook URL</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="Store update webhook URL"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                  <FormDescription>
                    The webhook URL which triggers the store deploy to be called
                    when data is updated.
                  </FormDescription>
                </FormItem>
              )}
            />
          </div>

          <Button disabled={loading} className="ml-auto" type="submit">
            Save changes
          </Button>
        </form>
      </Form>
      <Separator />
      <ApiAlert
        title="NEXT_PUBLIC_API_URL"
        variant="public"
        description={`${origin}/v1/api/${params.storeId}`}
      />
      <ApiAlert
        title="GET"
        variant="public"
        description={`${origin}/v1/api/${params.storeId}/calculate-shipping`}
      />
    </>
  );
};
