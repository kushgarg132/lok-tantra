"use client";

import { useState, useEffect } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

export default function SignInPage() {
  const router       = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl  = searchParams.get("callbackUrl") ?? "/";
  const errorParam   = searchParams.get("error");

  const [tab,      setTab]      = useState<"signin" | "register">("signin");
  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [name,     setName]     = useState("");
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState<string | null>(null);
  const [success,  setSuccess]  = useState<string | null>(null);

  useEffect(() => {
    if (errorParam === "CredentialsSignin") setError("Invalid email or password.");
    else if (errorParam) setError("Sign-in failed. Please try again.");
  }, [errorParam]);

  async function handleSignIn(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true); setError(null);

    const result = await signIn("credentials", {
      email, password, redirect: false, callbackUrl,
    });

    if (result?.error) {
      setError("Invalid email or password.");
    } else {
      router.push(callbackUrl);
    }
    setLoading(false);
  }

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true); setError(null); setSuccess(null);

    const res = await fetch("/api/auth/register", {
      method:  "POST",
      headers: { "content-type": "application/json" },
      body:    JSON.stringify({ name, email, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.error ?? "Registration failed.");
    } else {
      setSuccess("Account created! Signing you in…");
      await signIn("credentials", { email, password, redirect: false });
      router.push(callbackUrl);
    }
    setLoading(false);
  }

  const googleEnabled = typeof window !== "undefined"; // always show, server checks env

  return (
    <main className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="text-3xl font-bold text-orange-500 mb-1">⚖ LokTantra</div>
          <p className="text-slate-400 text-sm">Indian Democracy Platform</p>
        </div>

        {/* Card */}
        <div className="rounded-2xl border border-slate-700 bg-slate-900 p-6 shadow-2xl">
          {/* Tabs */}
          <div className="flex rounded-lg bg-slate-800 p-1 mb-6">
            {(["signin", "register"] as const).map((t) => (
              <button
                key={t}
                onClick={() => { setTab(t); setError(null); setSuccess(null); }}
                className={`flex-1 py-1.5 text-sm rounded-md font-medium transition-colors ${
                  tab === t ? "bg-slate-700 text-slate-100" : "text-slate-400 hover:text-slate-300"
                }`}
              >
                {t === "signin" ? "Sign in" : "Create account"}
              </button>
            ))}
          </div>

          {error   && <div className="mb-4 px-3 py-2 rounded-lg bg-red-950/50 border border-red-800 text-red-300 text-sm">{error}</div>}
          {success && <div className="mb-4 px-3 py-2 rounded-lg bg-emerald-950/50 border border-emerald-800 text-emerald-300 text-sm">{success}</div>}

          {/* Sign-in form */}
          {tab === "signin" && (
            <form onSubmit={handleSignIn} className="space-y-4">
              <Field label="Email" type="email" value={email} onChange={setEmail} required />
              <Field label="Password" type="password" value={password} onChange={setPassword} required />
              <SubmitButton loading={loading} label="Sign in" />
            </form>
          )}

          {/* Register form */}
          {tab === "register" && (
            <form onSubmit={handleRegister} className="space-y-4">
              <Field label="Full name (optional)" type="text" value={name} onChange={setName} />
              <Field label="Email" type="email" value={email} onChange={setEmail} required />
              <Field label="Password (min. 8 characters)" type="password" value={password} onChange={setPassword} required />
              <SubmitButton loading={loading} label="Create account" />
            </form>
          )}

          {/* Google OAuth divider */}
          {googleEnabled && (
            <>
              <div className="flex items-center gap-3 my-5">
                <div className="flex-1 h-px bg-slate-700" />
                <span className="text-xs text-slate-600">or</span>
                <div className="flex-1 h-px bg-slate-700" />
              </div>
              <button
                onClick={() => signIn("google", { callbackUrl })}
                className="w-full flex items-center justify-center gap-3 px-4 py-2.5 rounded-lg border border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-medium transition-colors"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Continue with Google
              </button>
            </>
          )}
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-slate-600 mt-6">
          LokTantra is a politically neutral civic information platform.{" "}
          <Link href="/" className="text-slate-500 hover:text-slate-400">Back to home</Link>
        </p>
      </div>
    </main>
  );
}

function Field({ label, type, value, onChange, required }: {
  label: string; type: string; value: string;
  onChange: (v: string) => void; required?: boolean;
}) {
  return (
    <div>
      <label className="block text-xs font-medium text-slate-400 mb-1.5">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        className="w-full px-3 py-2.5 rounded-lg bg-slate-800 border border-slate-700 text-slate-100 text-sm placeholder:text-slate-600 focus:outline-none focus:border-orange-500 transition-colors"
      />
    </div>
  );
}

function SubmitButton({ loading, label }: { loading: boolean; label: string }) {
  return (
    <button
      type="submit"
      disabled={loading}
      className="w-full py-2.5 rounded-lg bg-orange-600 hover:bg-orange-500 disabled:opacity-60 text-white font-semibold text-sm transition-colors"
    >
      {loading ? "Please wait…" : label}
    </button>
  );
}
