export default function NewArrivalsSkeleton() {
  return (
    <section className="bg-gray-50 py-16 px-6 md:px-12">
      <div className="max-w-7xl mx-auto text-center">
        <div className="h-8 w-48 bg-gray-200 mx-auto rounded animate-pulse" />

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 mt-10">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="animate-pulse bg-gray-200 h-56 rounded-xl"
            />
          ))}
        </div>
      </div>
    </section>
  );
}
