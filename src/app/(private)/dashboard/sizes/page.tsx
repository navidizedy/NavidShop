import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import AddSizeView from "./_components/addSizeView";

export default async function SizePage() {
  const session = await getSession();

  if (!session || session.role !== "ADMIN") {
    redirect("/dashboard");
  }

  const sizes = await prisma.size.findMany({
    orderBy: { id: "asc" },
  });

  return <AddSizeView initialSizes={JSON.parse(JSON.stringify(sizes))} />;
}
