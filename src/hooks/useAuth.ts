import { useMutation } from "@tanstack/react-query";
import { signin, signup } from "@/services/auth";

export function useAuth() {
  const signupMutation = useMutation({
    mutationFn: signup,
  });

  const signinMutation = useMutation({
    mutationFn: signin,
  });

  return {
    signupMutation,
    signinMutation,
  };
}
