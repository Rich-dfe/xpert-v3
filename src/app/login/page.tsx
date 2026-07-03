"use client";

import { signIn } from "next-auth/react";

export default function LoginPage() {
  return (
    <div className="flex h-screen items-center justify-center">
      <button
        onClick={() =>
          signIn("cognito", { callbackUrl: "/dashboard" })
        }
        className="bg-green-500 px-4 py-2"
      >
        Sign in
      </button>
    </div>
  );
}