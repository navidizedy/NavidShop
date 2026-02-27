import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import AdminsView from "./_components/adminsView";

export default async function ManageAdminsPage() {
  const session = await getSession();
  const MAIN_ADMIN_EMAIL = process.env.DEFAULT_ADMIN_EMAIL;

  if (!session || session.role !== "ADMIN") {
    redirect("/dashboard");
  }

  const admins = await prisma.user.findMany({
    where: { role: "ADMIN" },
    orderBy: { id: "desc" },
  });

  return (
    <AdminsView
      initialAdmins={JSON.parse(JSON.stringify(admins))}
      mainAdminEmail={MAIN_ADMIN_EMAIL!}
      currentUserId={(session as any).id}
    />
  );
}
