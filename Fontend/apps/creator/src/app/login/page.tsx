"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LeftPanel } from "@ep/ui/components/auth/left-panel";
import { RoleSelectStep } from "@ep/ui/components/auth/role-select-step";
import { RegisterStep } from "@ep/ui/components/auth/register-step";
import { OtpStep } from "@ep/ui/components/auth/otp-step";
import { LoginStep } from "@ep/ui/components/auth/login-step";
import { ForgotStep } from "@ep/ui/components/auth/forgot-step";
import { ResetPasswordStep } from "@ep/ui/components/auth/reset-password-step";
import type { OnboardingStep, UserRole, AuthFormState } from "@ep/ui/components/auth/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export default function LoginPage() {
  const router = useRouter();
  const [step, setStep] = useState<OnboardingStep>("role-select");
  const [role, setRole] = useState<UserRole>("creator");
  const [postOtpTarget, setPostOtpTarget] = useState<"dashboard" | "reset-password">("dashboard");

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

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const setField = <K extends keyof AuthFormState>(key: K, value: AuthFormState[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleOtpChange = (index: number, value: string) => {
    const numericVal = value.replace(/\D/g, "").slice(-1);
    const newOtp = [...form.otpValues];
    newOtp[index] = numericVal;
    setField("otpValues", newOtp);
  };

  const handleRoleContinue = () => {
    if (role === "creator") {
      setStep("register");
    } else {
      alert("Brand flows are on the brand dashboard. Redirecting...");
      window.location.href = "http://localhost:3002/login";
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.agreed) return;
    setError("");
    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.businessName || form.email.split("@")[0],
          email: form.email,
          password: form.password,
          role: "creator",
          username: form.email.split("@")[0],
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Registration failed");

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      setPostOtpTarget("dashboard");
      setStep("otp");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (postOtpTarget === "reset-password") {
      setStep("reset-password");
    } else {
      router.push("/");
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: form.email, password: form.password }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Login failed");

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      router.push("/");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Reset code sent successfully to ${form.email}`);
    setPostOtpTarget("reset-password");
    setStep("otp");
  };

  const handleResetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) return;
    alert("Password reset successful!");
    setStep("login");
  };

  const actions = { setField, goToStep: setStep };

  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-12 overflow-hidden bg-white">
      <LeftPanel
        title="Claim campaign slots and earn from real views"
        description="EasilyPromote connects creators with brands. Claim slots, deliver content, and get paid for verified views."
      />

      <div className="col-span-1 md:col-span-7 flex items-center justify-center p-8 md:p-16 overflow-y-auto h-screen bg-white">
        {error && (
          <div className="fixed top-4 right-4 bg-red-50 border border-red-200 text-red-700 text-sm rounded-md p-3 z-50">
            {error}
          </div>
        )}

        {step === "role-select" && (
          <RoleSelectStep role={role} onSelectRole={setRole} onContinue={handleRoleContinue} />
        )}

        {step === "register" && (
          <RegisterStep form={form} actions={actions} onSubmit={handleRegister} />
        )}

        {step === "otp" && (
          <OtpStep
            email={form.email}
            otpValues={form.otpValues}
            onOtpChange={handleOtpChange}
            onSubmit={handleVerifyOtp}
          />
        )}

        {step === "login" && (
          <LoginStep form={form} actions={actions} onSubmit={handleLogin} />
        )}

        {step === "forgot" && (
          <ForgotStep
            email={form.email}
            setEmail={(v) => setField("email", v)}
            onSubmit={handleForgotPassword}
            actions={actions}
          />
        )}

        {step === "reset-password" && (
          <ResetPasswordStep
            newPassword={newPassword}
            confirmPassword={confirmPassword}
            showPassword={form.showPassword}
            setNewPassword={setNewPassword}
            setConfirmPassword={setConfirmPassword}
            setShowPassword={(v) => setField("showPassword", v)}
            onSubmit={handleResetPassword}
            actions={actions}
          />
        )}

        {loading && (
          <div className="fixed inset-0 bg-white/60 backdrop-blur-sm flex items-center justify-center z-50">
            <span className="text-sm font-semibold text-stone-500">Loading...</span>
          </div>
        )}
      </div>
    </div>
  );
}
