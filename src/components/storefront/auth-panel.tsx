"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { apiRequest } from "@/lib/api";
import { useStore } from "./store-provider";
import { FormField, Notice, StorePage, formButtonClass } from "./store-components";
import type { StoreUser } from "@/types/catalog";

type AuthMode = "login" | "register" | "forgot" | "reset" | "change";

const headings: Record<AuthMode, { title: string; description: string }> = {
  login: { title: "Welcome back", description: "Sign in to manage your account and orders." },
  register: { title: "Create your account", description: "Join FreshCart to save your cart and wishlist." },
  forgot: { title: "Reset your password", description: "We will send a reset code to your email address." },
  reset: { title: "Choose a new password", description: "Enter the code sent to your email and your new password." },
  change: { title: "Change password", description: "Update the password for your account." },
};

function record(value: unknown): Record<string, unknown> | null {
  return typeof value === "object" && value !== null ? value as Record<string, unknown> : null;
}

function claimsFromToken(token: string): Record<string, unknown> | null {
  try {
    const encoded = token.split(".")[1];
    if (!encoded) return null;
    const normalized = encoded.replace(/-/g, "+").replace(/_/g, "/");
    const payload = window.atob(normalized.padEnd(Math.ceil(normalized.length / 4) * 4, "="));
    return record(JSON.parse(payload));
  } catch {
    return null;
  }
}

function userFrom(
  value: unknown,
  claims: Record<string, unknown> | null,
  fallbackEmail: unknown,
): StoreUser | null {
  const user = record(value);
  const id = user?._id ?? user?.id ?? claims?._id ?? claims?.id;
  const email = user?.email ?? claims?.email ?? fallbackEmail;
  const name = user?.name ?? claims?.name ?? email;
  if (typeof id !== "string" || typeof email !== "string" || typeof name !== "string") return null;
  return {
    _id: id,
    name,
    email,
    phone: typeof user?.phone === "string" ? user.phone : undefined,
  };
}

export function AuthPanel({ mode, initialEmail = "" }: { mode: AuthMode; initialEmail?: string }) {
  const router = useRouter();
  const { setSession, signOut } = useStore();
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState<{ text: string; success: boolean } | null>(null);
  const [email, setEmail] = useState(initialEmail);
  const [codeSent, setCodeSent] = useState(false);
  const [codeVerified, setCodeVerified] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setMessage(null);
    const values = Object.fromEntries(new FormData(event.currentTarget).entries());

    try {
      if (mode === "login") {
        const result = await apiRequest<unknown>("/auth/signin", { method: "POST", body: values });
        const response = record(result);
        const data = record(response?.data);
        const payload = { ...data, ...response };
        const token = payload.token;
        const claims = typeof token === "string" ? claimsFromToken(token) : null;
        const user = userFrom(payload.user ?? data?.user, claims, values.email);
        if (typeof token !== "string" || token.length === 0 || !user) {
          throw new Error("The sign-in response did not include a valid account session.");
        }
        setSession(token, user);
        router.push("/");
        return;
      }

      if (mode === "register") {
        if (values.password !== values.rePassword) {
          setMessage({ text: "Passwords do not match.", success: false });
          return;
        }
        await apiRequest("/auth/signup", { method: "POST", body: values });
        setMessage({ text: "Account created. Sign in to continue.", success: true });
        return;
      }

      if (mode === "forgot") {
        await apiRequest("/auth/forgotPasswords", { method: "POST", body: { email: values.email } });
        setEmail(String(values.email ?? ""));
        setCodeSent(true);
        setMessage({ text: "If the account exists, a reset code has been sent.", success: true });
        return;
      }

      if (mode === "reset") {
        if (!codeVerified) {
          await apiRequest("/auth/verifyResetCode", {
            method: "POST",
            body: { resetCode: values.resetCode },
          });
          setCodeVerified(true);
          setMessage({ text: "Code verified. Enter your new password.", success: true });
          return;
        }
        if (values.newPassword !== values.rePassword) {
          setMessage({ text: "Passwords do not match.", success: false });
          return;
        }
        await apiRequest("/auth/resetPassword", {
          method: "PUT",
          body: { email: values.email, newPassword: values.newPassword },
        });
        setMessage({ text: "Password updated. You can now sign in.", success: true });
        return;
      }

      if (values.password !== values.rePassword) {
        setMessage({ text: "Passwords do not match.", success: false });
        return;
      }
      await apiRequest("/users/changeMyPassword", { method: "PUT", body: values });
      signOut();
      setMessage({ text: "Password changed. Sign in with your new password.", success: true });
    } catch (error) {
      setMessage({
        text: error instanceof Error ? error.message : "The request could not be completed.",
        success: false,
      });
    } finally {
      setPending(false);
    }
  }

  const title = headings[mode];

  return (
    <StorePage eyebrow="FreshCart account" title={title.title} description={title.description}>
      <div className="surface-card mx-auto max-w-lg rounded-[1.75rem] border border-line p-6 shadow-[0_24px_70px_rgba(23,58,53,0.1)] sm:p-9">
        <form className="flex flex-col gap-4" onSubmit={(event) => void submit(event)}>
          {mode === "login" ? (
            <>
              <FormField label="Email" name="email" type="email" autoComplete="email" />
              <FormField label="Password" name="password" type="password" autoComplete="current-password" />
              <div className="-mt-2 text-right">
                <Link className="text-sm font-medium text-fresh hover:underline" href="/forgot-password">
                  Forgot password?
                </Link>
              </div>
            </>
          ) : null}
          {mode === "register" ? (
            <>
              <FormField label="Name" name="name" autoComplete="name" />
              <FormField label="Email" name="email" type="email" autoComplete="email" />
              <FormField label="Password" name="password" type="password" autoComplete="new-password" />
              <FormField label="Confirm password" name="rePassword" type="password" autoComplete="new-password" />
              <FormField label="Phone number" name="phone" type="tel" autoComplete="tel" />
            </>
          ) : null}
          {mode === "forgot" ? (
            <>
              <FormField label="Email" name="email" type="email" autoComplete="email" />
              {codeSent ? (
                <Link className="text-sm font-medium text-fresh hover:underline" href={`/reset-password?email=${encodeURIComponent(email)}`}>
                  Continue to enter your reset code
                </Link>
              ) : null}
            </>
          ) : null}
          {mode === "reset" ? (
            <>
              <label className="flex flex-col gap-1.5 text-sm font-medium text-navy">
                Email
                <input
                  className="h-11 rounded-md border border-line bg-zinc-50 px-3 font-normal outline-none"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                />
              </label>
              <FormField label="Reset code" name="resetCode" required={!codeVerified} />
              {codeVerified ? (
                <>
                  <FormField label="New password" name="newPassword" type="password" autoComplete="new-password" />
                  <FormField label="Confirm new password" name="rePassword" type="password" autoComplete="new-password" />
                </>
              ) : null}
            </>
          ) : null}
          {mode === "change" ? (
            <>
              <FormField label="Current password" name="currentPassword" type="password" autoComplete="current-password" />
              <FormField label="New password" name="password" type="password" autoComplete="new-password" />
              <FormField label="Confirm new password" name="rePassword" type="password" autoComplete="new-password" />
            </>
          ) : null}
          {message ? <Notice tone={message.success ? "success" : "error"}>{message.text}</Notice> : null}
          <button type="submit" className={formButtonClass} disabled={pending}>
            {pending ? "Please wait..." : mode === "login" ? "Sign in" : mode === "register" ? "Create account" : mode === "forgot" ? "Send reset code" : mode === "change" ? "Change password" : codeVerified ? "Reset password" : "Verify code"}
          </button>
        </form>

        <p className="mt-5 text-center text-sm text-copy">
          {mode === "login" ? (
            <>New to FreshCart? <Link href="/signup" className="font-semibold text-fresh hover:underline">Create an account</Link></>
          ) : (
            <>Already have an account? <Link href="/login" className="font-semibold text-fresh hover:underline">Sign in</Link></>
          )}
        </p>
        {mode !== "change" ? null : (
          <p className="mt-3 text-center text-sm">
            <Link href="/orders" className="text-fresh hover:underline">Back to orders</Link>
          </p>
        )}
      </div>
    </StorePage>
  );
}
