import { Suspense } from "react";
import { getCachedSearch } from "@/lib/dal/search";
import SearchView from "./_components/searchView";

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; page?: string }>;
}) {
  const params = await searchParams;
  const query = params.q || "";
  const page = Number(params.page) || 1;

  const data = await getCachedSearch(query, page);

  return (
    <Suspense key={`${query}-${page}`} fallback={<SearchLoadingSkeleton />}>
      <SearchView
        query={query}
        initialProducts={data.products}
        totalPages={data.totalPages}
        currentPage={page}
      />
    </Suspense>
  );
}

function SearchLoadingSkeleton() {
  return (
    <div className="max-w-7xl mx-auto p-10 animate-pulse">
      <div className="h-10 bg-gray-200 w-1/3 mx-auto mb-10 rounded" />
      <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
        {[...Array(10)].map((_, i) => (
          <div key={i} className="flex flex-col gap-3">
            <div className="aspect-square bg-gray-100 rounded-2xl" />
            <div className="h-4 bg-gray-100 rounded w-3/4" />
          </div>
        ))}
      </div>
    </div>
  );
}
