import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";

import { EmailSettingsForm } from "./components/email-settings-form";

interface EmailSettingsPageProps {
  params: {
    storeId: string;
  };
}

const EmailSettingsPage = async ({ params }: EmailSettingsPageProps) => {
  const { userId } = auth();

  if (!userId) {
    redirect("/sign-up");
  }

  const emailSettings = await db.emailSettings.findFirst({
    where: {
      storeId: params.storeId,
    },
  });

  if (!emailSettings) {
    redirect("/");
  }

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <EmailSettingsForm initialData={emailSettings} />
      </div>
    </div>
  );
};

export default EmailSettingsPage;
