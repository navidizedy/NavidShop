"use client";

import { useActionState, useState, useEffect, useTransition } from "react";
import { updateProfile } from "@/app/actions/updateUser";
import { profileSchema } from "@/lib/zodSchemas/profileSchema";
import {
  User,
  Lock,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Mail,
} from "lucide-react";

export default function ProfileForm({
  initialName,
  initialEmail,
}: {
  initialName: string;
  initialEmail: string;
}) {
  const [state, formAction] = useActionState(updateProfile, null);
  const [isPending, startTransition] = useTransition();
  const [clientError, setClientError] = useState<{
    message: string;
    field: string;
  } | null>(null);

  const [name, setName] = useState(initialName);
  const [email, setEmail] = useState(initialEmail);
  const [oldPass, setOldPass] = useState("");
  const [newPass, setNewPass] = useState("");

  useEffect(() => {
    if (state?.success) {
      setOldPass("");
      setNewPass("");
      setClientError(null);
    }
  }, [state]);

  const handleClientAction = (formData: FormData) => {
    setClientError(null);
    const data = Object.fromEntries(formData);
    const result = profileSchema.safeParse(data);

    if (!result.success) {
      setClientError({
        message: result.error.issues[0].message,
        field: result.error.issues[0].path[0] as string,
      });
      return;
    }

    startTransition(() => {
      formAction(formData);
    });
  };

  const hasChanged =
    name !== initialName ||
    email !== initialEmail ||
    oldPass.length > 0 ||
    newPass.length > 0;

  const activeError =
    clientError ||
    (state?.error ? { message: state.error, field: state.field } : null);
  const isNameErr = activeError?.field === "name";
  const isEmailErr = activeError?.field === "email";
  const isOldPassErr = activeError?.field === "oldPassword";
  const isNewPassErr = activeError?.field === "newPassword";

  return (
    <form action={handleClientAction} className="p-8 md:p-10 space-y-7">
      {state?.success && (
        <div className="flex items-center gap-3 p-4 bg-green-50 text-green-700 rounded-2xl border border-green-100 animate-in fade-in zoom-in duration-300">
          <CheckCircle2 size={18} />
          <p className="text-sm font-bold">{state.success}</p>
        </div>
      )}

      {activeError && !activeError.field && (
        <div className="flex items-center gap-3 p-4 bg-red-50 text-red-700 rounded-2xl border border-red-100">
          <AlertCircle size={18} />
          <p className="text-sm font-bold">{activeError.message}</p>
        </div>
      )}

      <div className="space-y-4">
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-gray-500 ml-1">
            <User size={14} /> Full Name
          </label>
          <input
            type="text"
            name="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={`w-full px-6 py-4 bg-gray-50 border rounded-2xl outline-none transition-all font-medium focus:ring-2 focus:ring-black ${
              isNameErr
                ? "border-red-500 bg-red-50"
                : "border-gray-100 focus:bg-white"
            }`}
          />
          {isNameErr && (
            <p className="text-red-500 text-xs font-bold mt-1 ml-2">
              {activeError.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <label className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-gray-500 ml-1">
            <Mail size={14} /> Email Address
          </label>
          <input
            type="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={`w-full px-6 py-4 bg-gray-50 border rounded-2xl outline-none transition-all font-medium focus:ring-2 focus:ring-black ${
              isEmailErr
                ? "border-red-500 bg-red-50"
                : "border-gray-100 focus:bg-white"
            }`}
          />
          {isEmailErr && (
            <p className="text-red-500 text-xs font-bold mt-1 ml-2">
              {activeError.message}
            </p>
          )}
        </div>
      </div>

      <div className="h-px bg-gray-100 my-2" />

      <div className="space-y-4">
        <label className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-gray-500 ml-1">
          <Lock size={14} /> Security Update
        </label>
        <div className="space-y-3">
          <div>
            <input
              type="password"
              name="oldPassword"
              placeholder="Current Password"
              value={oldPass}
              onChange={(e) => setOldPass(e.target.value)}
              className={`w-full px-6 py-4 bg-gray-50 border rounded-2xl outline-none transition-all font-medium focus:ring-2 focus:ring-black ${
                isOldPassErr
                  ? "border-red-500 bg-red-50"
                  : "border-gray-100 focus:bg-white"
              }`}
            />
            {isOldPassErr && (
              <p className="text-red-500 text-xs font-bold mt-1 ml-2">
                {activeError.message}
              </p>
            )}
          </div>

          <div>
            <input
              type="password"
              name="newPassword"
              placeholder="New Password (min. 6 chars)"
              value={newPass}
              onChange={(e) => setNewPass(e.target.value)}
              className={`w-full px-6 py-4 bg-gray-50 border rounded-2xl outline-none transition-all font-medium focus:ring-2 focus:ring-black ${
                isNewPassErr
                  ? "border-red-500 bg-red-50"
                  : "border-gray-100 focus:bg-white"
              }`}
            />
            {isNewPassErr && (
              <p className="text-red-500 text-xs font-bold mt-1 ml-2">
                {activeError.message}
              </p>
            )}
          </div>
        </div>
      </div>

      <button
        type="submit"
        disabled={isPending || !hasChanged}
        className="w-full bg-black text-white py-5 rounded-2xl font-black uppercase tracking-widest hover:bg-gray-800 transition-all transform active:scale-[0.97] disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed flex justify-center items-center gap-3 shadow-xl"
      >
        {isPending ? (
          <>
            <Loader2 className="animate-spin" size={20} /> Updating...
          </>
        ) : (
          "Save Changes"
        )}
      </button>
    </form>
  );
}
