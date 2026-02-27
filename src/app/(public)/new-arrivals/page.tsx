import { getNewArrivals } from "@/app/actions/getNewArrivals";
import NewArrivalsClient from "./_components/NewArrivalsClient";
import type { NewArrivalProduct } from "@/app/actions/getNewArrivals";

export default async function NewArrivalsPage() {
  let products: NewArrivalProduct[] = [];
  let error: string | null = null;

  try {
    products = await getNewArrivals(10);
  } catch (e) {
    console.error("Error fetching new arrivals:", e);
    error = "Failed to load new arrivals. Please try again later.";
  }

  return <NewArrivalsClient products={products} error={error} />;
}
