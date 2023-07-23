"use client";

import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";

export type OrderColumn = {
  id: string;
  phone: string;
  destination: string;
  isPaid: boolean;
  totalPrice: string;
  products: string;
  createdAt: string;
};

export const columns: ColumnDef<OrderColumn>[] = [
  {
    accessorKey: "products",
    header: "Products",
    cell: ({ row }) => (
      <Link href={`orders/${row.original.id}`}>{row.original.products}</Link>
    ),
  },
  {
    accessorKey: "phone",
    header: "Phone",
  },
  {
    accessorKey: "destination",
    header: "Destination",
  },
  {
    accessorKey: "totalPrice",
    header: "Total Price",
  },
  {
    accessorKey: "isPaid",
    header: "Is Paid",
  },
  {
    accessorKey: "createdAt",
    header: "Date",
  },
];
