interface SignupInput {
  name: string;
  email: string;
  password: string;
}

interface SignupResponse {
  message: string;
  userId?: string;
}

interface SigninInput {
  email: string;
  password: string;
}
interface SigninResponse {
  message: string;
  userId?: string;
}

export async function signup(user: SignupInput): Promise<SignupResponse> {
  const res = await fetch("/api/auth/signup", {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(user),
  });

  let data: SignupResponse;
  try {
    data = await res.json();
  } catch {
    throw new Error("Server did not return valid JSON");
  }

  if (!res.ok) {
    throw new Error(data.message || "Signup failed");
  }

  return data;
}

export async function signin(user: SigninInput): Promise<SigninResponse> {
  const res = await fetch("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(user),
  });
  let data: SigninResponse;
  try {
    data = await res.json();
  } catch (error) {
    throw new Error("Server did not return valid JSON");
  }
  if (!res.ok) {
    throw new Error(data.message || "Signin failed");
  }
  return data;
}
