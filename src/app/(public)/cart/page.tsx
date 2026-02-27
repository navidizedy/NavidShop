import { getSession } from "@/lib/session";
import CartView from "./_components/cartView";

export default async function CartPage() {
  const session = await getSession();

  return <CartView initialSession={session} />;
}
