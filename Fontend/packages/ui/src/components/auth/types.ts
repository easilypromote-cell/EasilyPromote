export type OnboardingStep = "role-select" | "register" | "otp" | "login" | "forgot" | "reset-password";
export type UserRole = "business" | "creator";

export interface AuthFormState {
  businessName: string;
  industry: string;
  firstName: string;
  lastName: string;
  nickname: string;
  email: string;
  phone: string;
  password: string;
  showPassword: boolean;
  agreed: boolean;
  otpValues: string[];
}

export interface AuthFormActions {
  setField: <K extends keyof AuthFormState>(key: K, value: AuthFormState[K]) => void;
  goToStep: (step: OnboardingStep) => void;
}
