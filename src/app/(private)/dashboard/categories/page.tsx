import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import AddCategoryView from "./_components/addCategoryView";

export default async function CategoriesPage() {
  const session = await getSession();

  if (!session || session.role !== "ADMIN") {
    redirect("/dashboard");
  }

  const categories = await prisma.category.findMany({
    orderBy: { id: "desc" },
  });

  return (
    <AddCategoryView
      initialCategories={JSON.parse(JSON.stringify(categories))}
    />
  );
}
