"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useTransition } from "react";
import BreadCrumbGlobal from "@/components/BreadCrumbGlobal";
import FiltersSidebar from "./FiltersSidebar";
import ProductGridClient from "./ProductGrid";

export default function ShopView({
  categories,
  colors,
  sizes,
  initialProducts,
  totalProducts,
}: any) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleFilterUpdate = (key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams.toString());

    if (!value || value === "" || value === "All") {
      params.delete(key);
    } else {
      params.set(key, value);
    }

    if (key !== "page") {
      params.delete("page");
    } else if (value === "1") {
      params.delete("page");
    }

    const queryString = params.toString();
    const target = queryString ? `/shop?${queryString}` : "/shop";

    startTransition(() => {
      router.push(target, { scroll: false });
    });
  };

  const selectedCategories =
    searchParams.get("c")?.split(",").filter(Boolean) || [];
  const selectedColors =
    searchParams.get("co")?.split(",").filter(Boolean) || [];
  const selectedSizes = searchParams.get("s")?.split(",").filter(Boolean) || [];
  const sort = searchParams.get("sort") || "All";
  const page = Number(searchParams.get("page") || 1);

  return (
    <>
      <BreadCrumbGlobal />
      <section className="px-4 md:px-12 max-w-7xl mx-auto py-10">
        <div className="flex flex-col md:flex-row gap-12">
          <aside className="w-full md:w-1/4">
            <FiltersSidebar
              categories={categories}
              colors={colors}
              sizes={sizes}
              selectedCategories={selectedCategories}
              selectedColors={selectedColors}
              selectedSizes={selectedSizes}
              setSelectedCategories={(v: any) =>
                handleFilterUpdate("c", v.join(","))
              }
              setSelectedColors={(v: any) =>
                handleFilterUpdate("co", v.join(","))
              }
              setSelectedSizes={(v: any) =>
                handleFilterUpdate("s", v.join(","))
              }
              hasFilters={
                selectedCategories.length > 0 ||
                selectedColors.length > 0 ||
                selectedSizes.length > 0
              }
              clearAll={() => router.push("/shop")}
            />
          </aside>
          <main className="w-full md:w-3/4">
            <ProductGridClient
              products={initialProducts}
              total={totalProducts}
              isLoading={isPending}
              sort={sort}
              setSort={(s: string) => handleFilterUpdate("sort", s)}
              page={page}
              setPage={(p: number) => handleFilterUpdate("page", p.toString())}
              clearAll={() => router.push("/shop")}
            />
          </main>
        </div>
      </section>
    </>
  );
}
