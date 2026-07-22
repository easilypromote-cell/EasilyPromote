"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { LeftPanel } from "../../components/auth/left-panel";
import { ForgotStep } from "../../components/auth/forgot-step";
import { OtpStep } from "../../components/auth/otp-step";
import { ResetPasswordStep } from "../../components/auth/reset-password-step";
import type { AuthFormState } from "../../components/auth/types";
import { useReveal } from "../../hooks/use-reveal";

type ForgotPasswordStep = "forgot" | "otp" | "reset-password";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [step, setStep] = useState<ForgotPasswordStep>("forgot");

  useReveal(step);

  const [email, setEmail] = useState("");
  const [otpValues, setOtpValues] = useState<string[]>(["", "", "", "", "", ""]);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleOtpChange = (index: number, value: string) => {
    const numericVal = value.replace(/\D/g, "").slice(-1);
    const newOtp = [...otpValues];
    newOtp[index] = numericVal;
    setOtpValues(newOtp);
  };

  const handleSendCode = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Reset code sent successfully to ${email}`);
    setStep("otp");
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setStep("reset-password");
  };

  const handleResetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) return;
    alert("Password reset successful!");
    router.push("/login");
  };

  const actions = { setField: () => {}, goToStep: () => {} };

  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-12 overflow-hidden bg-white">
      <LeftPanel />

      <div className="col-span-1 md:col-span-7 flex items-center justify-center p-10 overflow-y-auto h-screen bg-stone-100">
        {step === "forgot" && (
          <ForgotStep
            email={email}
            setEmail={setEmail}
            onSubmit={handleSendCode}
            actions={actions}
            onBackToLogin={() => router.push("/login")}
          />
        )}

        {step === "otp" && (
          <OtpStep
            email={email}
            otpValues={otpValues}
            onOtpChange={handleOtpChange}
            onSubmit={handleVerifyOtp}
          />
        )}

        {step === "reset-password" && (
          <ResetPasswordStep
            newPassword={newPassword}
            confirmPassword={confirmPassword}
            showPassword={showPassword}
            setNewPassword={setNewPassword}
            setConfirmPassword={setConfirmPassword}
            setShowPassword={setShowPassword}
            onSubmit={handleResetPassword}
            actions={actions}
            onBackToLogin={() => router.push("/login")}
          />
        )}
      </div>
    </div>
  );
}
