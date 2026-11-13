"use client";

import { useState, type ReactNode } from "react";
import { Controller, useForm, useWatch, type Control, type FieldPath } from "react-hook-form";
import { Field } from "@base-ui/react/field";
import { UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import SignUpCall, { type SignUpValues } from "./signUpCall";

const inputClass = "h-11 rounded-md bg-white px-3";

export default function SignUpForm() {
  const [pending, setPending] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [termsError, setTermsError] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [statusOk, setStatusOk] = useState(false);

  const { handleSubmit, control } = useForm<SignUpValues>({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      rePassword: "",
      phone: "",
    },
  });
  const password = useWatch({ control, name: "password" });
  const strength = passwordStrength(password);

  async function onSubmit(data: SignUpValues) {
    if (!agreed) {
      setTermsError("Please agree to the Terms of Service and Privacy Policy.");
      return;
    }
    setTermsError(null);
    setStatus(null);
    setPending(true);
    const result = await SignUpCall(data);
    setPending(false);
    setStatusOk(result.ok);
    setStatus(result.message);
  }

  return (
    <div className="min-w-0 rounded-2xl border border-line bg-white p-5 shadow-sm sm:p-8">
      <div className="text-center">
        <h2 className="text-2xl font-semibold tracking-tight text-navy">Create Your Account</h2>
        <p className="mt-1 text-sm text-copy">Start your fresh journey with us today</p>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
        <SocialButton label="Google" mark="G" markClass="text-rose-500" />
        <SocialButton label="Facebook" mark="f" markClass="text-sky-600" />
      </div>

      <div className="my-5 flex items-center gap-3 text-xs text-copy">
        <span className="h-px flex-1 bg-line" />
        or
        <span className="h-px flex-1 bg-line" />
      </div>

      <form
        className="flex flex-col gap-4"
        noValidate
        onSubmit={(event) => {
          event.preventDefault();
          void handleSubmit(onSubmit)(event);
        }}
      >
        <SignupField
          control={control}
          name="name"
          label="Name"
          placeholder="Ali"
          autoComplete="name"
          rules={{ required: "Enter your name." }}
        />
        <SignupField
          control={control}
          name="email"
          label="Email"
          type="email"
          placeholder="ali@example.com"
          autoComplete="email"
          rules={{
            required: "Enter your email.",
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: "Enter a valid email address.",
            },
          }}
        />
        <SignupField
          control={control}
          name="password"
          label="Password"
          type="password"
          placeholder="create a strong password"
          autoComplete="new-password"
          rules={{
            required: "Enter a password.",
            minLength: { value: 8, message: "Use at least 8 characters." },
            validate: (value) =>
              (/\d/.test(value) && /[^A-Za-z0-9]/.test(value)) ||
              "Include a number and a symbol.",
          }}
          hint={
            <div>
              <div className="mt-2 flex items-center gap-3">
                <span className="h-1 flex-1 overflow-hidden rounded-full bg-zinc-100">
                  <span
                    className={cn("block h-full rounded-full", strength.bar)}
                    style={{ width: strength.width }}
                  />
                </span>
                {strength.label ? (
                  <span className={cn("text-xs font-medium", strength.tone)}>{strength.label}</span>
                ) : null}
              </div>
              <p className="mt-1.5 text-xs text-copy">
                Must be at least 8 characters with numbers and symbols.
              </p>
            </div>
          }
        />
        <SignupField
          control={control}
          name="rePassword"
          label="Confirm Password"
          type="password"
          placeholder="confirm your password"
          autoComplete="new-password"
          rules={{
            required: "Confirm your password.",
            validate: (value, values) =>
              value === values.password || "Passwords do not match.",
          }}
        />
        <SignupField
          control={control}
          name="phone"
          label="Phone Number"
          type="tel"
          placeholder="01012345678"
          autoComplete="tel"
          rules={{
            required: "Enter your phone number.",
            pattern: {
              value: /^01[0125]\d{8}$/,
              message: "Enter an Egyptian mobile number, like 01012345678.",
            },
          }}
        />

        <label className="flex items-start gap-2 text-sm text-navy">
          <input
            type="checkbox"
            className="mt-0.5 size-4 accent-fresh"
            checked={agreed}
            onChange={(event) => {
              setAgreed(event.target.checked);
              if (event.target.checked) setTermsError(null);
            }}
          />
          <span>
            I agree to the <span className="font-medium text-fresh">Terms of Service</span> and{" "}
            <span className="font-medium text-fresh">Privacy Policy</span>{" "}
            <span className="text-rose-600">*</span>
          </span>
        </label>
        {termsError ? <p className="text-sm text-rose-700">{termsError}</p> : null}

        {status ? (
          <p
            role="status"
            className={cn("text-sm", statusOk ? "text-fresh-dark" : "text-rose-700")}
          >
            {status}
          </p>
        ) : null}

        <Button
          type="button"
          disabled={pending}
          className="h-11 w-full rounded-md text-sm font-semibold"
          onClick={() => {
            setStatus(null);
            void handleSubmit(onSubmit)();
          }}
        >
          <UserPlus aria-hidden="true" />
          {pending ? "Creating account..." : "Create My Account"}
        </Button>
      </form>

      <p className="mt-4 text-center text-sm text-copy">
        Already have an account? <span className="font-semibold text-fresh">Sign In</span>
      </p>
    </div>
  );
}

function SocialButton({
  label,
  mark,
  markClass,
}: {
  label: string;
  mark: string;
  markClass: string;
}) {
  return (
    <button
      type="button"
      className="inline-flex h-11 items-center justify-center gap-2 rounded-md border border-line bg-white text-sm font-medium text-navy"
    >
      <span className={cn("text-base font-bold", markClass)} aria-hidden="true">
        {mark}
      </span>
      {label}
    </button>
  );
}

function SignupField({
  control,
  name,
  label,
  type = "text",
  placeholder,
  autoComplete,
  rules,
  hint,
}: {
  control: Control<SignUpValues>;
  name: FieldPath<SignUpValues>;
  label: string;
  type?: string;
  placeholder: string;
  autoComplete: string;
  rules: NonNullable<Parameters<typeof Controller<SignUpValues>>[0]["rules"]>;
  hint?: ReactNode;
}) {
  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field, fieldState }) => (
        <Field.Root invalid={fieldState.invalid} className="flex flex-col gap-1.5">
          <Field.Label className="text-sm font-medium text-navy">
            {label}
            <span className="text-rose-600"> *</span>
          </Field.Label>
          <Input
            name={field.name}
            value={field.value}
            ref={field.ref}
            onBlur={field.onBlur}
            onValueChange={field.onChange}
            type={type}
            placeholder={placeholder}
            autoComplete={autoComplete}
            aria-invalid={fieldState.invalid}
            className={inputClass}
          />
          {hint}
          <Field.Error match={fieldState.invalid} className="text-sm text-rose-700">
            {fieldState.error?.message}
          </Field.Error>
        </Field.Root>
      )}
    />
  );
}

function passwordStrength(password: string) {
  if (!password) {
    return { width: "0%", bar: "bg-transparent", label: "", tone: "" };
  }
  let score = 0;
  if (password.length >= 8) score += 1;
  if (/\d/.test(password)) score += 1;
  if (/[^A-Za-z0-9]/.test(password)) score += 1;

  if (score <= 1) {
    return { width: "33%", bar: "bg-rose-500", label: "Weak", tone: "text-rose-600" };
  }
  if (score === 2) {
    return { width: "66%", bar: "bg-amber-500", label: "Fair", tone: "text-amber-600" };
  }
  return { width: "100%", bar: "bg-fresh", label: "Strong", tone: "text-fresh" };
}
