import { CreditCard, DollarSign, Package } from "lucide-react";

import { Separator } from "@/components/ui/separator";
import { Overview } from "@/components/overview";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Heading } from "@/components/ui/heading";
import { cn, currencyFormat } from "@/lib/utils";
import { db } from "@/lib/db";

import getTotalRevenue from "@/actions/get-total-revenue";
import getSalesCount from "@/actions/get-sales-count";
import getGraphRevenue from "@/actions/get-graph-revenue";
import getActiveProducts from "@/actions/get-active-products";

interface DashboardPageProps {
  params: {
    storeId: string;
  };
}

const DashboardPage: React.FC<DashboardPageProps> = async ({ params }) => {
  const totalRevenue = Array.from(
    (await getTotalRevenue(params.storeId)).entries()
  );
  const graphRevenue = await getGraphRevenue(params.storeId);
  const salesCount = await getSalesCount(params.storeId);
  const stockCount = await getActiveProducts(params.storeId);

  const store = await db.store.findFirstOrThrow({
    where: {
      id: params.storeId,
    },
    select: {
      name: true,
    },
  });

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <Heading
          title="Dashboard"
          description={`Overview of ${store?.name} store`}
        />
        <Separator />
        <div className="grid grid-cols-3 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Revenue
              </CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {totalRevenue.map(([key, value], index) => (
                <div
                  key={key}
                  className={cn("text-2xl font-bold", {
                    "text-lg before:content-['+_']": index > 0,
                  })}
                >
                  {currencyFormat(value, key)}
                </div>
              ))}
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Sales</CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">+{salesCount}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Active Products
              </CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stockCount}</div>
            </CardContent>
          </Card>
        </div>
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Overview</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <Overview
              data={graphRevenue}
              currency={totalRevenue?.[0]?.[0] ?? "USD"}
            />
          </CardContent>
          {totalRevenue.length > 1 && (
            <CardFooter>
              <div className="mt-2 text-sm text-muted-foreground">
                * If you have orders paid in multiple currencies, this data is
                likely to be incorrect.
              </div>
            </CardFooter>
          )}
        </Card>
      </div>
    </div>
  );
};

export default DashboardPage;
