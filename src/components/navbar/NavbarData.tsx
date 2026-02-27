import NavbarClient from "./NavbarClient";
import { getSession } from "@/lib/session";
import { GetNavbarCategories } from "@/app/actions/getCategories";
import { NavLink } from "@/types/navbar";

const generateNavLinks = (
  categories: { id: number; name: string }[],
): NavLink[] => {
  const categoryLinks = categories.map((cat) => ({
    label: cat.name,

    href: `/category/${cat.name.toLowerCase().replace(/\s+/g, "-")}`,
  }));

  return [
    { label: "Shop", href: "/shop" },
    { label: "On Sale", href: "/on-sale" },
    { label: "New Arrivals", href: "/new-arrivals" },
    {
      label: "Category",
      href: "#",
      submenu: categoryLinks,
    },
  ];
};

export default async function NavbarData() {
  const session = await getSession();
  const categories = await GetNavbarCategories();
  const links = generateNavLinks(categories);

  return <NavbarClient session={session} links={links} />;
}
