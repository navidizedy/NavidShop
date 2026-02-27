import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";

const email = process.env.DEFAULT_ADMIN_EMAIL;
const password = process.env.DEFAULT_ADMIN_PASSWORD;

export async function staticAdmin() {
  try {
    if (!email || !password) {
      console.error(
        "❌ Missing DEFAULT_ADMIN_EMAIL or DEFAULT_ADMIN_PASSWORD in environment variables.",
      );
      return;
    }

    const existingAdmin = await prisma.user.findUnique({
      where: { email },
    });

    if (existingAdmin) {
      console.log("✅ Default admin already exists:", existingAdmin.email);
      return existingAdmin;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newAdmin = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        role: "ADMIN",
        name: "Navid",
      },
    });

    console.log("✅ Default admin created successfully:", newAdmin.email);
    return newAdmin;
  } catch (error) {
    console.error("❌ Error creating default admin:", error);
    throw error;
  }
}
