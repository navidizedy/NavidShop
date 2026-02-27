import { getSession } from "@/lib/session";
import Navbar from "./Navbar";

const NavbarWrapper = async () => {
  const session = await getSession();

  if (!session) return null;

  return (
    <div>
      <Navbar session={session} />
    </div>
  );
};
export default NavbarWrapper;
