"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { LeftPanel } from "../../components/auth/left-panel";
import { LoginStep } from "../../components/auth/login-step";
import type { AuthFormState } from "../../components/auth/types";
import { saveAuth, getUser } from "../../lib/auth";
import { useReveal } from "../../hooks/use-reveal";

export default function LoginPage() {
  const router = useRouter();

  useReveal();

  const [form, setForm] = useState<AuthFormState>({
    businessName: "",
    industry: "Technology",
    email: "",
    phone: "",
    password: "",
    showPassword: false,
    agreed: true,
    otpValues: ["", "", "", "", "", ""],
  });

  const setField = <K extends keyof AuthFormState>(key: K, value: AuthFormState[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const actions = { setField, goToStep: () => {} };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const existing = getUser();
    saveAuth("dummy-jwt-token", existing ?? {
      id: "1",
      name: "Acme Inc.",
      email: form.email,
      role: "business",
    });
    router.push("/?state=active");
  };

  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-12 overflow-hidden bg-white">
      <LeftPanel />

      <div className="col-span-1 md:col-span-7 flex items-center justify-center p-10 overflow-y-auto h-screen bg-stone-100">
        <LoginStep
          form={form}
          actions={actions}
          onSubmit={handleLogin}
          onForgotPassword={() => router.push("/forgot-password")}
          onCreateAccount={() => router.push("/create-account")}
        />
      </div>
    </div>
  );
}
