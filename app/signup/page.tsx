"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, ShieldCheck } from "lucide-react";
import { Sidebar } from "@/components/sidebar";

export default function SignUpPage() {
  const router = useRouter();
  const [form, setForm] = useState({ fullName: "", email: "", password: "" });
  const [message, setMessage] = useState<{ type: "error" | "success"; text: string } | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setMessage(null);

    const response = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const data = await response.json();
    if (!response.ok) {
      setMessage({ type: "error", text: data.error || "Unable to create account." });
      setLoading(false);
      return;
    }

    setMessage({ type: "success", text: `Welcome aboard, ${data.user.fullName}!` });
    router.push("/settings");
  };

  return (
    <div className="min-h-screen bg-[linear-gradient(135deg,_#f8fafc_0%,_#f1f5f9_100%)]">
      <Sidebar />
      <main className="ml-0 lg:ml-[240px] flex min-h-screen items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-xl rounded-3xl border border-border/70 bg-background/90 p-6 shadow-sm backdrop-blur sm:p-8">
          <div className="mb-6 flex items-center gap-2 text-emerald-700">
            <ShieldCheck className="h-5 w-5" />
            <span className="text-sm font-medium">Fractio investor onboarding</span>
          </div>

          <h1 className="text-3xl font-semibold tracking-tight text-foreground">Create your account</h1>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            Sign up to track fractional real estate assets, manage your KYC status, and invest with confidence.
          </p>

          <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="mb-2 block text-sm font-medium text-foreground" htmlFor="fullName">
                Full name
              </label>
              <input
                id="fullName"
                type="text"
                required
                value={form.fullName}
                onChange={(event) => setForm({ ...form, fullName: event.target.value })}
                className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm outline-none ring-0"
                placeholder="Rajesh Kumar"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-foreground" htmlFor="email">
                Email address
              </label>
              <input
                id="email"
                type="email"
                required
                value={form.email}
                onChange={(event) => setForm({ ...form, email: event.target.value })}
                className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm outline-none ring-0"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-foreground" htmlFor="password">
                Password
              </label>
              <input
                id="password"
                type="password"
                required
                minLength={6}
                value={form.password}
                onChange={(event) => setForm({ ...form, password: event.target.value })}
                className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm outline-none ring-0"
                placeholder="At least 6 characters"
              />
            </div>

            {message ? (
              <div className={`rounded-xl border px-3 py-2 text-sm ${message.type === "error" ? "border-rose-200 bg-rose-50 text-rose-700" : "border-emerald-200 bg-emerald-50 text-emerald-700"}`}>
                {message.text}
              </div>
            ) : null}

            <button
              type="submit"
              disabled={loading}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Creating account..." : "Create account"}
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>

          <p className="mt-6 text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link href="/signin" className="font-medium text-primary">
              Sign in
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}
