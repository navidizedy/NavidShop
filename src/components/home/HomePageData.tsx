import { Suspense } from "react";

import OnSale from "./OnSale";
import OnSaleSkeleton from "./OnSaleSkeleton";

import NewArrivals from "./NewArrivals";
import NewArrivalsSkeleton from "./NewArrivalsSkeleton";

import BrowseByCategory from "./BrowseByCategory";
import BrowseByCategorySkeleton from "./BrowseByCategorySkeleton";

export default function HomePageData() {
  return (
    <>
      <Suspense fallback={<OnSaleSkeleton />}>
        <OnSale />
      </Suspense>

      <Suspense fallback={<NewArrivalsSkeleton />}>
        <NewArrivals />
      </Suspense>

      <Suspense fallback={<BrowseByCategorySkeleton />}>
        <BrowseByCategory />
      </Suspense>
    </>
  );
}
