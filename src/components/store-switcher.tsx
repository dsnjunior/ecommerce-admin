"use client";

import * as React from "react";
import { Check, ChevronsUpDown, PlusCircle, Store } from "lucide-react";
import { useParams, useRouter } from "next/navigation";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useStoreModal } from "@/hooks/use-store-modal";

type PopoverTriggerProps = React.ComponentPropsWithoutRef<
  typeof PopoverTrigger
>;

interface StoreSwitcherProps extends PopoverTriggerProps {
  items: Record<string, any>[];
  collaboratorItems: Record<string, any>[];
}

export function StoreSwitcher({
  items,
  collaboratorItems,
}: StoreSwitcherProps) {
  const storeModal = useStoreModal();
  const params = useParams();
  const router = useRouter();

  const formattedItems = items.map((item) => ({
    label: item.name,
    value: item.id,
  }));

  const formattedCollabItems = collaboratorItems.map((item) => ({
    label: item.name,
    value: item.id,
  }));

  const currentStore = [...formattedItems, ...formattedCollabItems].find(
    (item) => item.value === params.storeId
  );

  const [open, setOpen] = React.useState(false);

  const onStoreSelect = (store: { value: string; label: string }) => {
    setOpen(false);
    router.push(`/${store.value}`);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
        >
          <Store className="mr-2 h-4 w-4 shrink-0" />
          {currentStore ? currentStore.label : "Select a store"}
          <ChevronsUpDown className="ml-auto h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandList>
            <CommandInput placeholder="Search store..." />
            <CommandEmpty>No store found.</CommandEmpty>
            <CommandGroup>
              {formattedItems.map((item) => (
                <CommandItem
                  key={item.value}
                  onSelect={() => onStoreSelect(item)}
                  className="text-sm"
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      currentStore?.value === item.value
                        ? "opacity-100"
                        : "opacity-0"
                    )}
                  />
                  {item.label}
                </CommandItem>
              ))}
              {!!formattedItems.length && !!formattedCollabItems.length && (
                <CommandSeparator className="my-1" />
              )}
              {formattedCollabItems.map((item) => (
                <CommandItem
                  key={item.value}
                  onSelect={() => onStoreSelect(item)}
                  className="text-sm"
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      currentStore?.value === item.value
                        ? "opacity-100"
                        : "opacity-0"
                    )}
                  />
                  {item.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
          <CommandList>
            <CommandSeparator />
            <CommandList>
              <CommandGroup>
                <CommandItem
                  onSelect={() => {
                    setOpen(false);
                    storeModal.onOpen();
                  }}
                >
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Create Store
                </CommandItem>
              </CommandGroup>
            </CommandList>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
