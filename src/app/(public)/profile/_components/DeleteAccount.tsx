"use client";

import { useState, useActionState } from "react";
import { deleteAccount } from "@/app/actions/deleteUser";
import { Trash2, AlertTriangle, Loader2 } from "lucide-react";

export default function DeleteAccount() {
  const [showConfirm, setShowConfirm] = useState(false);

  const [state, formAction, isPending] = useActionState(deleteAccount, null);

  return (
    <div className="mt-10 p-8 bg-red-50 rounded-[2.5rem] border border-red-100">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-red-100 text-red-600 rounded-lg">
          <Trash2 size={20} />
        </div>
        <div>
          <h3 className="text-lg font-black uppercase tracking-tight text-red-900">
            Danger Zone
          </h3>
          <p className="text-sm text-red-700 font-medium">
            Permanently delete your account and all data.
          </p>
        </div>
      </div>

      {!showConfirm ? (
        <button
          onClick={() => setShowConfirm(true)}
          className="text-sm font-bold text-red-600 hover:text-red-800 transition-colors"
        >
          I want to delete my account
        </button>
      ) : (
        <form
          action={formAction}
          className="space-y-4 animate-in fade-in slide-in-from-top-2"
        >
          <div className="flex items-start gap-3 p-4 bg-white/50 rounded-2xl border border-red-200">
            <AlertTriangle className="text-red-600 shrink-0" size={18} />
            <p className="text-xs text-red-800 leading-relaxed">
              This action is <strong>irreversible</strong>. Enter your password
              to confirm.
            </p>
          </div>

          <input
            type="password"
            name="confirmPassword"
            placeholder="Enter your password"
            required
            disabled={isPending}
            className="w-full px-6 py-4 bg-white border border-red-200 rounded-2xl focus:ring-2 focus:ring-red-500 outline-none transition-all font-medium disabled:opacity-50"
          />

          {state?.error && (
            <p className="text-red-600 text-xs font-bold ml-2 animate-pulse">
              {state.error}
            </p>
          )}

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={isPending}
              className="flex-1 bg-red-600 text-white py-4 rounded-2xl font-black uppercase tracking-widest hover:bg-red-700 transition-all flex justify-center items-center gap-2 disabled:bg-red-400 disabled:cursor-not-allowed shadow-lg active:scale-95"
            >
              {isPending ? (
                <>
                  <Loader2 className="animate-spin" size={18} />
                  Deleting...
                </>
              ) : (
                "Confirm Delete"
              )}
            </button>
            <button
              type="button"
              disabled={isPending}
              onClick={() => setShowConfirm(false)}
              className="px-6 py-4 bg-white text-gray-600 rounded-2xl font-bold border border-gray-200 hover:bg-gray-50 transition-all disabled:opacity-50"
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
