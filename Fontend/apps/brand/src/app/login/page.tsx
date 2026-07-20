"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LeftPanel } from "../../components/auth/left-panel";
import { RoleSelectStep } from "../../components/auth/role-select-step";
import { RegisterStep } from "../../components/auth/register-step";
import { OtpStep } from "../../components/auth/otp-step";
import { LoginStep } from "../../components/auth/login-step";
import { ForgotStep } from "../../components/auth/forgot-step";
import { ResetPasswordStep } from "../../components/auth/reset-password-step";
import type { OnboardingStep, UserRole, AuthFormState } from "../../components/auth/types";

export default function LoginPage() {
  const router = useRouter();
  const [step, setStep] = useState<OnboardingStep>("role-select");
  const [role, setRole] = useState<UserRole>("business");
  const [postOtpTarget, setPostOtpTarget] = useState<"dashboard" | "reset-password">("dashboard");

  const [form, setForm] = useState<AuthFormState>({
    businessName: "",
    industry: "Technology",
    email: "",
    phone: "",
    password: "",
    showPassword: false,
    agreed: true,
    otpValues: ["1", "2", "2", "2", "5", ""],
  });

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

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
    if (role === "business") {
      setStep("register");
    } else {
      alert("Creator flows are currently in beta. Redirecting to Business Registration...");
      setStep("register");
    }
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.agreed) return;
    setPostOtpTarget("dashboard");
    setStep("otp");
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (postOtpTarget === "reset-password") {
      setStep("reset-password");
    } else {
      localStorage.setItem("user_authenticated", "true");
      localStorage.setItem("user_business_name", form.businessName || "Acme Inc.");
      router.push("/?state=active");
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem("user_authenticated", "true");
    localStorage.setItem("user_business_name", "Acme Inc.");
    router.push("/?state=active");
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
      <LeftPanel />

      <div className="col-span-1 md:col-span-7 flex items-center justify-center p-8 md:p-16 overflow-y-auto h-screen bg-white">
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
      </div>
    </div>
  );
}
