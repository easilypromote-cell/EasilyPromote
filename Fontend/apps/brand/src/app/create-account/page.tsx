"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { LeftPanel } from "../../components/auth/left-panel";
import { RoleSelectStep } from "../../components/auth/role-select-step";
import { RegisterStep } from "../../components/auth/register-step";
import { OtpStep } from "../../components/auth/otp-step";
import type { UserRole, AuthFormState } from "../../components/auth/types";
import { saveAuth } from "../../lib/auth";
import { useReveal } from "../../hooks/use-reveal";

type CreateAccountStep = "role-select" | "register" | "otp";

export default function CreateAccountPage() {
  const router = useRouter();
  const [step, setStep] = useState<CreateAccountStep>("role-select");
  const [role, setRole] = useState<UserRole>("business");

  useReveal(step);

  useEffect(() => {
    const handlePopState = () => {
      setStep((prev) => (prev === "register" ? "role-select" : prev));
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

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

  const handleOtpChange = (index: number, value: string) => {
    const numericVal = value.replace(/\D/g, "").slice(-1);
    const newOtp = [...form.otpValues];
    newOtp[index] = numericVal;
    setField("otpValues", newOtp);
  };

  const handleRoleContinue = () => {
    if (role === "business") {
      setStep("register");
      window.history.pushState({}, "");
    } else {
      alert("Creator flows are currently in beta. Redirecting to Business Registration...");
      setStep("register");
      window.history.pushState({}, "");
    }
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.agreed) return;
    setStep("otp");
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    saveAuth("dummy-jwt-token", {
      id: crypto.randomUUID(),
      name: form.businessName || "Acme Inc.",
      email: form.email,
      role: "business",
      industry: form.industry,
      phone: form.phone,
    });
    router.push("/?state=active");
  };

  const actions = { setField, goToStep: () => {} };

  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-12 overflow-hidden bg-white">
      <LeftPanel />

      <div className="col-span-1 md:col-span-7 flex items-center justify-center p-10 h-screen overflow-y-auto bg-stone-100">
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

        {step !== "otp" && (
          <div className="absolute bottom-8 left-0 right-0 text-center md:hidden">
            <span className="text-sm font-semibold text-stone-400 font-rethink">
              Already have an account?{" "}
              <Link href="/login" className="text-stone-900 hover:underline font-bold">
                Sign in
              </Link>
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
