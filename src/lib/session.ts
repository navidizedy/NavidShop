"use server";

import { jwtVerify, SignJWT } from "jose";
import { cookies } from "next/headers";

export type Session = {
  id?: string;
  name?: string;
  email?: string;
  role?: string;
};

const secretKey = process.env.JWT_SECRET!;
const encodedKey = new TextEncoder().encode(secretKey);

export async function createSession(payload: Session) {
  const session = await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("1h")
    .sign(encodedKey);

  const oneHourInMs = 60 * 60 * 1000;
  const expiredAt = new Date(Date.now() + oneHourInMs);

  const cookieStore = await cookies();
  cookieStore.set("token", session, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    expires: expiredAt,
    sameSite: "strict",
    path: "/",
  });
}

export async function updateSession(newData: Partial<Session>) {
  const currentSession = await getSession();
  if (!currentSession) return;

  const updatedPayload = { ...currentSession, ...newData };

  await createSession(updatedPayload);
}

export async function getSession() {
  const cookieStore = await cookies();
  const cookie = cookieStore.get("token")?.value;
  if (!cookie) return null;

  try {
    const { payload } = await jwtVerify(cookie, encodedKey, {
      algorithms: ["HS256"],
    });
    return payload as Session;
  } catch (err) {
    console.error("Failed to verify the session: ", err);
    return null;
  }
}

export async function deleteSession() {
  const cookieStore = await cookies();
  cookieStore.delete("token");
}
