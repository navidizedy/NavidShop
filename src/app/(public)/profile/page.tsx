import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import ProfileForm from "./_components/ProfileForm";
import DeleteAccount from "./_components/DeleteAccount";
import { redirect } from "next/navigation";

export default async function ProfilePage() {
  const session = await getSession();

  if (!session || !session.id || session.role === "ADMIN") {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: { id: Number(session.id) },
    select: {
      name: true,
      email: true,
    },
  });

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-32 pb-20 px-4">
      <div className="max-w-xl mx-auto space-y-8">
        <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-gray-200/50 border border-gray-100 overflow-hidden">
          <div className="bg-black p-10 text-white relative overflow-hidden">
            <div className="relative z-10">
              <h1 className="text-3xl font-black uppercase tracking-tighter italic">
                Account Settings
              </h1>
              <p className="text-gray-400 text-sm mt-1 font-medium">
                Manage your profile and security preferences
              </p>
            </div>

            <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/5 rounded-full blur-3xl"></div>
          </div>

          <ProfileForm
            initialName={user.name || ""}
            initialEmail={user.email || ""}
          />
        </div>

        <div className="animate-in fade-in duration-700 slide-in-from-bottom-4">
          <DeleteAccount />
        </div>

        <p className="text-center text-gray-400 text-xs font-medium uppercase tracking-widest">
          Online Shop — Secure Account Management
        </p>
      </div>
    </div>
  );
}
