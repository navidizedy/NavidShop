import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import AddColorView from "./_components/addColorView";

export default async function ColorsPage() {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") redirect("/dashboard");

  const colors = await prisma.color.findMany({ orderBy: { id: "desc" } });

  return <AddColorView initialColors={JSON.parse(JSON.stringify(colors))} />;
}
