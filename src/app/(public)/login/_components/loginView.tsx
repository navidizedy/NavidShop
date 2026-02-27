"use client";

import { useCallback, memo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import toast, { Toaster } from "react-hot-toast";

import { signinSchema } from "@/lib/zodSchemas/signinSchema";
import { useAuth } from "@/hooks/useAuth";
import { Mail, Lock, LogIn, Loader2 } from "lucide-react";

type SigninFormValues = z.infer<typeof signinSchema>;

const LoginView = () => {
  const router = useRouter();
  const { signinMutation } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SigninFormValues>({
    resolver: zodResolver(signinSchema),
  });

  const onSubmit = useCallback(
    (data: SigninFormValues) => {
      toast.dismiss();
      signinMutation.mutate(data, {
        onSuccess: (res: { message: string }) => {
          toast.success(res.message || "Login successful!");
          router.push("/");
          router.refresh();
        },
        onError: (err: any) => {
          toast.error(err.message || "Invalid credentials");
        },
      });
    },
    [router, signinMutation],
  );

  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />

      <section className="flex items-start justify-center min-h-screen pt-32 pb-20 bg-gradient-to-br from-gray-50 to-gray-100 px-4">
        <div className="w-full max-w-md bg-white shadow-2xl rounded-3xl p-8 border border-gray-100">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-black text-gray-900 tracking-tight">
              Welcome Back 👋
            </h1>
            <p className="text-gray-500 mt-2 text-sm">
              Login to your account to continue shopping
            </p>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1 ml-1">
                Email Address
              </label>
              <div className="relative">
                <Mail
                  className="absolute left-3 top-3 text-gray-400"
                  size={18}
                />
                <input
                  type="email"
                  {...register("email")}
                  placeholder="name@example.com"
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all"
                />
              </div>
              {errors.email && (
                <p className="text-red-500 text-xs mt-1 ml-1 font-medium italic">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1 ml-1">
                Password
              </label>
              <div className="relative">
                <Lock
                  className="absolute left-3 top-3 text-gray-400"
                  size={18}
                />
                <input
                  type="password"
                  {...register("password")}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all"
                />
              </div>
              {errors.password && (
                <p className="text-red-500 text-xs mt-1 ml-1 font-medium italic">
                  {errors.password.message}
                </p>
              )}
            </div>

            <div className="text-right">
              <Link
                href="/forgot-password"
                className="text-xs font-semibold text-gray-500 hover:text-black transition-colors"
              >
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={signinMutation.isPending}
              className={`w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl text-white font-bold transition-all transform active:scale-[0.98] ${
                signinMutation.isPending
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-black hover:bg-gray-800 shadow-lg shadow-black/10"
              }`}
            >
              {signinMutation.isPending ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  Verifying...
                </>
              ) : (
                <>
                  <LogIn size={20} /> Sign In
                </>
              )}
            </button>
          </form>

          <div className="flex items-center my-8 text-gray-300">
            <div className="flex-grow border-t border-gray-200"></div>
            <span className="mx-4 text-xs font-bold uppercase tracking-widest text-gray-400">
              or
            </span>
            <div className="flex-grow border-t border-gray-200"></div>
          </div>

          <button className="w-full py-3 border border-gray-200 bg-white rounded-2xl flex items-center justify-center gap-3 font-semibold text-gray-700 hover:bg-gray-50 transition-colors border-b-4 active:border-b-0 active:translate-y-1">
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Continue with Google
          </button>

          <p className="text-center text-sm text-gray-500 mt-8">
            Don’t have an account?{" "}
            <Link
              href="/signup"
              className="text-black font-bold hover:underline"
            >
              Create one now
            </Link>
          </p>
        </div>
      </section>
    </>
  );
};

export default memo(LoginView);
