"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import {
  signInWithEmail,
  signInWithGoogle,
  signUpWithEmail,
} from "@/lib/auth/auth";
import { Logo } from "@/components/general/Logo";

type Mode = "signin" | "signup";

const ERROR_MESSAGES: Record<string, string> = {
  "auth/invalid-email": "Enter a valid email address.",
  "auth/invalid-credential": "Incorrect email or password.",
  "auth/user-not-found": "Incorrect email or password.",
  "auth/wrong-password": "Incorrect email or password.",
  "auth/email-already-in-use": "An account with this email already exists.",
  "auth/weak-password": "Password must be at least 6 characters.",
  "auth/too-many-requests": "Too many attempts. Try again later.",
  "auth/network-request-failed": "Network error. Check your connection.",
  "auth/popup-blocked": "Your browser blocked the sign-in popup.",
  "auth/account-exists-with-different-credential":
    "This email is registered with a different sign-in method.",
};

const SILENT_CODES = [
  "auth/popup-closed-by-user",
  "auth/cancelled-popup-request",
];

const getErrorMessage = (error: unknown) => {
  const code = (error as { code?: string })?.code ?? "";
  if (SILENT_CODES.includes(code)) return "";
  return ERROR_MESSAGES[code] ?? "Something went wrong. Please try again.";
};

const GoogleIcon = () => (
  <svg width="16" height="16" viewBox="0 0 48 48" aria-hidden="true">
    <path
      fill="#EA4335"
      d="M24 9.5c3.5 0 6.6 1.2 9.1 3.6l6.8-6.8C35.8 2.4 30.3 0 24 0 14.6 0 6.5 5.4 2.6 13.2l7.9 6.1C12.4 13.6 17.7 9.5 24 9.5z"
    />
    <path
      fill="#4285F4"
      d="M46.5 24.5c0-1.6-.1-3.1-.4-4.5H24v9h12.7c-.6 3-2.3 5.5-4.8 7.2l7.5 5.8c4.4-4.1 7.1-10.1 7.1-17.5z"
    />
    <path
      fill="#FBBC05"
      d="M10.5 28.7c-.5-1.5-.8-3.1-.8-4.7s.3-3.2.8-4.7l-7.9-6.1C.9 16.4 0 20.1 0 24s.9 7.6 2.6 10.8l7.9-6.1z"
    />
    <path
      fill="#34A853"
      d="M24 48c6.5 0 11.9-2.1 15.9-5.8l-7.5-5.8c-2.1 1.4-4.9 2.3-8.4 2.3-6.3 0-11.6-4.1-13.5-9.8l-7.9 6.1C6.5 42.6 14.6 48 24 48z"
    />
  </svg>
);

const AuthForm = () => {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState<"email" | "google" | null>(null);
  const isSignUp = mode === "signup";
  const busy = loading !== null;

  const run = async (
    kind: "email" | "google",
    action: () => Promise<unknown>,
  ) => {
    setError("");
    setLoading(kind);
    try {
      await action();
      router.push("/");
    } catch (err) {
      setError(getErrorMessage(err));
      setLoading(null);
    }
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (!email.trim() || !password)
      return setError("Enter your email and password.");
    if (isSignUp && password !== confirm)
      return setError("Passwords do not match.");
    run("email", () =>
      isSignUp
        ? signUpWithEmail(email.trim(), password)
        : signInWithEmail(email.trim(), password),
    );
  };

  const switchMode = () => {
    setMode(isSignUp ? "signin" : "signup");
    setError("");
    setConfirm("");
  };

  return (
    <main className="auth-page">
      <section className="auth-card">
        <div className="auth-logo">
          <Logo dark={false} />
        </div>
        <h1>{isSignUp ? "Create your account" : "Welcome back"}</h1>
        <p className="auth-sub">
          {isSignUp
            ? "Start tracking building analytics with Gleynr."
            : "Sign in to your Gleynr dashboard."}
        </p>

        <button
          type="button"
          className="button secondary auth-wide"
          disabled={busy}
          onClick={() => run("google", signInWithGoogle)}
        >
          {loading === "google" ? (
            <Loader2 size={14} className="auth-spin" />
          ) : (
            <GoogleIcon />
          )}
          Continue with Google
        </button>

        <div className="auth-divider">
          <span>or</span>
        </div>

        <form className="form-stack" onSubmit={handleSubmit} noValidate>
          <label>
            Email address
            <input
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@company.com"
              disabled={busy}
            />
          </label>
          <label>
            Password
            <input
              type="password"
              autoComplete={isSignUp ? "new-password" : "current-password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={busy}
            />
          </label>
          {isSignUp && (
            <label>
              Confirm password
              <input
                type="password"
                autoComplete="new-password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                disabled={busy}
              />
            </label>
          )}
          {error && (
            <div className="form-error" role="alert">
              {error}
            </div>
          )}
          <button
            type="submit"
            className="button primary auth-wide"
            disabled={busy}
          >
            {loading === "email" && <Loader2 size={14} className="auth-spin" />}
            {isSignUp ? "Create account" : "Sign in"}
          </button>
        </form>

        <p className="auth-switch">
          {isSignUp ? "Already have an account?" : "New to Gleynr?"}{" "}
          <button type="button" onClick={switchMode} disabled={busy}>
            {isSignUp ? "Sign in" : "Create an account"}
          </button>
        </p>
      </section>
    </main>
  );
};

export default AuthForm;
