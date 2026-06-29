"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, ShieldCheck, Building2, TrendingUp, Lock } from "lucide-react";

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
    setTimeout(() => router.push("/"), 600);
  };

  return (
    <div className="min-h-screen flex">
      {/* Left — Branding Panel */}
      <div className="hidden lg:flex lg:w-[480px] xl:w-[540px] flex-col justify-between bg-slate-950 text-white p-10 relative overflow-hidden">
        {/* Decorative gradient orbs */}
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-indigo-600/20 blur-3xl" />
        <div className="absolute bottom-0 right-0 w-72 h-72 rounded-full bg-emerald-500/10 blur-3xl" />

        <div className="relative z-10">
          <div className="flex items-center gap-2.5 mb-2">
            <div className="w-9 h-9 rounded-lg bg-indigo-600 flex items-center justify-center font-bold text-sm">F</div>
            <span className="text-xl font-semibold tracking-tight">Fractio</span>
          </div>
          <p className="text-sm text-slate-400">SM REIT Investment Platform</p>
        </div>

        <div className="relative z-10 space-y-8">
          <h2 className="text-3xl font-semibold leading-tight tracking-tight">
            Own premium commercial<br />real estate, fractionally.
          </h2>
          <div className="space-y-4">
            {[
              { icon: Building2, text: "Grade A+ commercial properties across India" },
              { icon: TrendingUp, text: "8-12% projected IRR with quarterly distributions" },
              { icon: ShieldCheck, text: "SEBI SM REIT compliant & fully regulated" },
              { icon: Lock, text: "Bank-grade security with encrypted transactions" },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                  <item.icon className="h-4 w-4 text-indigo-400" />
                </div>
                <span className="text-sm text-slate-300">{item.text}</span>
              </div>
            ))}
          </div>
        </div>

        <p className="relative z-10 text-xs text-slate-500">
          © 2026 Fractio Technologies Pvt. Ltd. All rights reserved.
        </p>
      </div>

      {/* Right — Sign Up Form */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-10 bg-[radial-gradient(circle_at_top_right,_rgba(99,102,241,0.06),_transparent_50%),linear-gradient(135deg,_#fafbff_0%,_#f1f5f9_100%)]">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-2.5 mb-8">
            <div className="w-9 h-9 rounded-lg bg-indigo-600 flex items-center justify-center font-bold text-sm text-white">F</div>
            <div className="flex flex-col">
              <span className="text-lg font-semibold tracking-tight text-foreground">Fractio</span>
              <span className="text-[10px] text-muted-foreground leading-none">SM REIT Platform</span>
            </div>
          </div>

          <div className="mb-1 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
            <ShieldCheck className="h-3.5 w-3.5" />
            SEBI Compliant Platform
          </div>

          <h1 className="mt-4 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            Create your account
          </h1>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            Start investing in premium commercial real estate with as little as ₹10 Lakhs.
          </p>

          <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground" htmlFor="signup-fullName">
                Full name
              </label>
              <input
                id="signup-fullName"
                type="text"
                required
                value={form.fullName}
                onChange={(event) => setForm({ ...form, fullName: event.target.value })}
                className="w-full rounded-xl border border-border bg-white px-4 py-2.5 text-sm outline-none transition-shadow focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400"
                placeholder="Rajesh Kumar"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground" htmlFor="signup-email">
                Email address
              </label>
              <input
                id="signup-email"
                type="email"
                required
                value={form.email}
                onChange={(event) => setForm({ ...form, email: event.target.value })}
                className="w-full rounded-xl border border-border bg-white px-4 py-2.5 text-sm outline-none transition-shadow focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground" htmlFor="signup-password">
                Password
              </label>
              <input
                id="signup-password"
                type="password"
                required
                minLength={6}
                value={form.password}
                onChange={(event) => setForm({ ...form, password: event.target.value })}
                className="w-full rounded-xl border border-border bg-white px-4 py-2.5 text-sm outline-none transition-shadow focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400"
                placeholder="At least 6 characters"
              />
            </div>

            {message ? (
              <div
                className={`rounded-xl border px-4 py-2.5 text-sm font-medium ${
                  message.type === "error"
                    ? "border-rose-200 bg-rose-50 text-rose-700"
                    : "border-emerald-200 bg-emerald-50 text-emerald-700"
                }`}
              >
                {message.text}
              </div>
            ) : null}

            <button
              type="submit"
              disabled={loading}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white transition-all hover:bg-indigo-700 hover:shadow-lg hover:shadow-indigo-500/25 disabled:cursor-not-allowed disabled:opacity-60 active:scale-[0.98]"
            >
              {loading ? "Creating account..." : "Create account"}
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>

          <p className="mt-8 text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link href="/signin" className="font-semibold text-indigo-600 hover:text-indigo-700">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
