import { getSession } from "@/lib/session";
import { GetNavbarCategories } from "@/app/actions/getCategories";
import NavbarClient from "./NavbarClient";
import { NavLink } from "@/types/navbar";

const generateNavLinks = (
  categories: { id: number; name: string }[],
): NavLink[] => {
  const hasCategories = categories && categories.length > 0;

  const categoryLinks = hasCategories
    ? categories.map((cat) => ({
        label: cat.name,
        href: `/category/${cat.name.toLowerCase().replace(/\s+/g, "-")}`,
      }))
    : [
        {
          label: "No categories",
          href: "#",
        },
      ];

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

export default async function Navbar() {
  const session = await getSession();
  const categories = await GetNavbarCategories();
  const links = generateNavLinks(categories);

  return <NavbarClient session={session} links={links} />;
}
