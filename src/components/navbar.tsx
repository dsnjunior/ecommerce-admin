import { UserButton, auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";

import { StoreSwitcher } from "@/components/store-switcher";
import { db } from "@/lib/db";
import { MainNav } from "@/components/main-nav";

export const Navbar = async () => {
  const { userId } = auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const stores = await db.store.findMany({
    where: {
      userId,
    },
  });

  const collaboratorStores = await db.store.findMany({
    where: {
      collaborators: {
        some: {
          userId,
        },
      },
    },
  });

  return (
    <div className="flex items-center border-b p-4">
      <StoreSwitcher items={stores} collaboratorItems={collaboratorStores} />
      <MainNav
        className="mx-6"
        collaboratorStores={collaboratorStores.map((store) => store.id)}
      />
      <div className="ml-auto flex items-center space-x-4">
        <UserButton afterSignOutUrl="/" />
      </div>
    </div>
  );
};
