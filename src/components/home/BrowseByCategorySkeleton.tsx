export default function BrowseByCategorySkeleton() {
  return (
    <section className="bg-gray-50 py-16 px-6 md:px-12">
      <div className="max-w-7xl mx-auto text-center">
        <div className="h-8 w-56 mx-auto bg-gray-200 animate-pulse rounded-md mb-6" />

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-10">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="animate-pulse bg-gray-300 dark:bg-gray-700 rounded-xl aspect-[4/5] min-h-[150px]"
            />
          ))}
        </div>
      </div>
    </section>
  );
}
