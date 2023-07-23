"use client";

import { ColumnDef } from "@tanstack/react-table";

export type ProductColumn = {
  id: string;
  name: string;
  price: string;
  category: string;
  size: string;
  color: {
    name: string;
    value: string;
  };
  createdAt: string;
  quantity: number;
};

export const columns: ColumnDef<ProductColumn>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "price",
    header: "Price",
  },
  {
    accessorKey: "quantity",
    header: "Quantity",
  },
  {
    accessorKey: "category",
    header: "Category",
  },
  {
    accessorKey: "size",
    header: "Size",
  },
  {
    accessorKey: "color",
    header: "Color",
    cell: ({ row }) => (
      <div className="flex items-center gap-x-2">
        {row.original.color.name}
        <div
          className="h-6 w-6 rounded-full border"
          style={{ backgroundColor: row.original.color.value }}
        />
      </div>
    ),
  },
];
