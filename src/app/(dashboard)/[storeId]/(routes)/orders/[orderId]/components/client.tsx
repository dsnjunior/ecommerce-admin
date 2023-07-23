"use client";

import { DataTable } from "@/components/ui/data-table";

import { columns, ProductColumn } from "./columns";
import { SubHeading } from "@/components/ui/sub-heading";

interface ProductClientProps {
  data: ProductColumn[];
}

export const ProductClient = ({ data }: ProductClientProps) => {
  return (
    <>
      <SubHeading
        title={`Products (${data.length})`}
        description="Products on this order"
      />
      <DataTable searchKey="label" columns={columns} data={data} />
    </>
  );
};
