import { useQuery } from "@tanstack/react-query";

type Session = { id: string } | null;

const fetchSession = async (): Promise<Session> => {
  const res = await fetch("/api/session");
  if (!res.ok) return null;
  try {
    const data = await res.json();

    return data.id ? { id: String(data.id) } : null;
  } catch {
    return null;
  }
};

export const useSession = () => {
  return useQuery<Session>({
    queryKey: ["session"],
    queryFn: fetchSession,
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });
};
