"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Sidebar } from "@/components/sidebar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatINR, formatPercent, plColor } from "@/lib/format";
import type { InvestmentRecord } from "@/lib/auth-db";
import {
  PieChart,
  Wallet,
  TrendingUp,
  TrendingDown,
  BarChart3,
  Building2,
  MapPin,
  ArrowUpRight,
  Loader2,
  Store,
  IndianRupee,
  CalendarDays,
  Sparkles,
  ShieldCheck,
} from "lucide-react";

interface PortfolioSummaryData {
  totalInvested: number;
  currentValue: number;
  unrealisedGainPct: number;
  quarterlyYield: number;
  totalHoldings: number;
}

export default function PortfolioPage() {
  const [summary, setSummary] = useState<PortfolioSummaryData | null>(null);
  const [investments, setInvestments] = useState<InvestmentRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    async function loadData() {
      try {
        const [summaryRes, investmentsRes] = await Promise.all([
          fetch("/api/investments/summary", { cache: "no-store" }),
          fetch("/api/investments", { cache: "no-store" }),
        ]);

        const summaryData = await summaryRes.json();
        const investmentsData = await investmentsRes.json();

        if (active) {
          if (summaryData.summary) {
            setSummary(summaryData.summary);
          }
          if (investmentsData.investments) {
            setInvestments(investmentsData.investments);
          }
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    loadData();
    return () => {
      active = false;
    };
  }, []);

  const displaySummary: PortfolioSummaryData = summary ?? {
    totalInvested: 0,
    currentValue: 0,
    unrealisedGainPct: 0,
    quarterlyYield: 0,
    totalHoldings: 0,
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.12),_transparent_34%),linear-gradient(135deg,_#f8fafc_0%,_#f1f5f9_100%)]">
      <Sidebar />

      <main className="ml-0 lg:ml-[240px] p-4 sm:p-6 lg:p-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-6">
          {/* ───── Header ───── */}
          <section className="rounded-3xl border border-border/70 bg-background/80 p-6 shadow-sm backdrop-blur sm:p-8">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-2xl">
                <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-violet-200 bg-violet-50 px-3 py-1 text-sm font-medium text-violet-700">
                  <PieChart className="h-4 w-4" />
                  Portfolio
                </div>
                <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
                  Your investment portfolio
                </h1>
                <p className="mt-3 text-base leading-7 text-muted-foreground sm:text-lg">
                  Track your fractional real estate holdings, returns, and growth across all investments.
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Link
                  href="/marketplace"
                  className="inline-flex items-center gap-2 rounded-full bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-700"
                >
                  <Store className="h-4 w-4" />
                  Buy More Assets
                </Link>
              </div>
            </div>
          </section>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-primary/50" />
            </div>
          ) : (
            <>
              {/* ───── Summary Cards ───── */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Total Invested */}
                <Card className="relative overflow-hidden border-border/60 shadow-sm hover:shadow-md transition-shadow">
                  <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-indigo-400 to-indigo-600" />
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between">
                      <div className="flex flex-col gap-1.5">
                        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                          Total Invested
                        </span>
                        <span className="text-2xl font-bold tracking-tight text-foreground">
                          {formatINR(displaySummary.totalInvested)}
                        </span>
                      </div>
                      <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-indigo-50 text-indigo-600">
                        <Wallet className="h-4 w-4" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Current Value */}
                <Card className="relative overflow-hidden border-border/60 shadow-sm hover:shadow-md transition-shadow">
                  <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-blue-400 to-blue-600" />
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between">
                      <div className="flex flex-col gap-1.5">
                        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                          Current Value
                        </span>
                        <span className="text-2xl font-bold tracking-tight text-foreground">
                          {formatINR(displaySummary.currentValue)}
                        </span>
                      </div>
                      <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-blue-50 text-blue-600">
                        <BarChart3 className="h-4 w-4" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Unrealised Gain */}
                <Card className="relative overflow-hidden border-border/60 shadow-sm hover:shadow-md transition-shadow">
                  <div
                    className={`absolute top-0 left-0 right-0 h-[2px] ${
                      displaySummary.unrealisedGainPct >= 0
                        ? "bg-gradient-to-r from-emerald-400 to-emerald-600"
                        : "bg-gradient-to-r from-rose-400 to-rose-600"
                    }`}
                  />
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between">
                      <div className="flex flex-col gap-1.5">
                        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                          Unrealised Gain
                        </span>
                        <span className={`text-2xl font-bold tracking-tight ${plColor(displaySummary.unrealisedGainPct)}`}>
                          {formatPercent(displaySummary.unrealisedGainPct)}
                        </span>
                      </div>
                      <div
                        className={`flex items-center justify-center w-9 h-9 rounded-lg ${
                          displaySummary.unrealisedGainPct >= 0
                            ? "bg-emerald-50 text-emerald-600"
                            : "bg-rose-50 text-rose-600"
                        }`}
                      >
                        {displaySummary.unrealisedGainPct >= 0 ? (
                          <TrendingUp className="h-4 w-4" />
                        ) : (
                          <TrendingDown className="h-4 w-4" />
                        )}
                      </div>
                    </div>
                    <div className="mt-2 flex items-center gap-1.5">
                      <IndianRupee className="h-3 w-3 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">
                        {formatINR(displaySummary.currentValue - displaySummary.totalInvested)} absolute
                      </span>
                    </div>
                  </CardContent>
                </Card>

                {/* Total Holdings */}
                <Card className="relative overflow-hidden border-border/60 shadow-sm hover:shadow-md transition-shadow">
                  <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-violet-400 to-violet-600" />
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between">
                      <div className="flex flex-col gap-1.5">
                        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                          Properties Owned
                        </span>
                        <span className="text-2xl font-bold tracking-tight text-foreground">
                          {displaySummary.totalHoldings}
                        </span>
                      </div>
                      <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-violet-50 text-violet-600">
                        <Building2 className="h-4 w-4" />
                      </div>
                    </div>
                    <div className="mt-2 flex items-center gap-1.5">
                      <CalendarDays className="h-3 w-3 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">
                        Est. quarterly yield: {formatINR(displaySummary.quarterlyYield)}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* ───── Holdings Section ───── */}
              <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
                {/* Holdings List */}
                <Card className="border-border/70 shadow-sm">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>Your Holdings</CardTitle>
                        <CardDescription>
                          {investments.length > 0
                            ? `${investments.length} propert${investments.length === 1 ? "y" : "ies"} in your portfolio`
                            : "You haven't made any investments yet"}
                        </CardDescription>
                      </div>
                      <div className="rounded-full bg-slate-100 p-2 text-slate-600">
                        <Building2 className="h-4 w-4" />
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {investments.length === 0 ? (
                      /* ── Empty State ── */
                      <div className="rounded-2xl border border-dashed border-border/70 bg-gradient-to-br from-violet-50/50 via-background to-indigo-50/50 p-10 text-center">
                        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-100 to-violet-100">
                          <Building2 className="h-8 w-8 text-indigo-500" />
                        </div>
                        <h3 className="text-lg font-semibold text-foreground">
                          Start building your portfolio
                        </h3>
                        <p className="mt-2 text-sm text-muted-foreground max-w-sm mx-auto">
                          Your portfolio is empty. Browse the marketplace to discover premium commercial real estate opportunities and make your first investment.
                        </p>
                        <Link
                          href="/marketplace"
                          className="mt-5 inline-flex items-center gap-2 rounded-full bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition-all hover:bg-indigo-700 hover:shadow-lg hover:shadow-indigo-500/25 active:scale-[0.98]"
                        >
                          <Store className="h-4 w-4" />
                          Explore Marketplace
                          <ArrowUpRight className="h-4 w-4" />
                        </Link>
                      </div>
                    ) : (
                      /* ── Holdings List ── */
                      <div className="space-y-4">
                        {investments.map((inv, idx) => {
                          const returnsPct = inv.returns_pct;
                          return (
                            <div
                              key={inv.id}
                              className="rounded-2xl border border-border/70 bg-card/70 p-4 transition-all duration-300 hover:shadow-md hover:border-indigo-200/60"
                              style={{ animationDelay: `${idx * 50}ms` }}
                            >
                              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                                <div className="flex items-start gap-3">
                                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-100 to-violet-100 text-indigo-600">
                                    <Building2 className="h-5 w-5" />
                                  </div>
                                  <div>
                                    <p className="font-semibold text-foreground">{inv.asset_name}</p>
                                    <div className="flex items-center gap-1.5 mt-0.5">
                                      <MapPin className="h-3 w-3 text-muted-foreground" />
                                      <p className="text-sm text-muted-foreground">{inv.city}</p>
                                    </div>
                                  </div>
                                </div>
                                <div
                                  className={`rounded-full px-3 py-1 text-sm font-medium ${
                                    returnsPct >= 0
                                      ? "bg-emerald-50 text-emerald-700"
                                      : "bg-rose-50 text-rose-700"
                                  }`}
                                >
                                  {formatPercent(returnsPct)}
                                </div>
                              </div>
                              <div className="mt-3 grid gap-3 text-sm text-muted-foreground sm:grid-cols-4">
                                <div>
                                  <p className="text-xs uppercase tracking-wide">Invested</p>
                                  <p className="mt-1 font-medium text-foreground">{formatINR(inv.invested_amount)}</p>
                                </div>
                                <div>
                                  <p className="text-xs uppercase tracking-wide">Current Value</p>
                                  <p className={`mt-1 font-medium ${plColor(returnsPct)}`}>
                                    {formatINR(inv.current_value)}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-xs uppercase tracking-wide">Units</p>
                                  <p className="mt-1 font-medium text-foreground">{inv.units_held}</p>
                                </div>
                                <div>
                                  <p className="text-xs uppercase tracking-wide">Purchased</p>
                                  <p className="mt-1 font-medium text-foreground">
                                    {new Date(inv.invested_at).toLocaleDateString("en-IN", {
                                      day: "numeric",
                                      month: "short",
                                      year: "numeric",
                                    })}
                                  </p>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* ── Insights Panel ── */}
                <div className="flex flex-col gap-6">
                  {/* Portfolio Summary Card */}
                  <Card className="border-border/70 shadow-sm">
                    <CardHeader>
                      <div className="flex items-center gap-2">
                        <div className="rounded-full bg-primary/10 p-2 text-primary">
                          <Sparkles className="h-4 w-4" />
                        </div>
                        <div>
                          <CardTitle>Portfolio Insight</CardTitle>
                          <CardDescription>Your investment at a glance</CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="rounded-2xl bg-slate-950 p-5 text-white">
                        <p className="text-sm text-slate-300">Net position</p>
                        <p className="mt-2 text-3xl font-semibold">{formatINR(displaySummary.currentValue)}</p>
                        <p
                          className={`mt-2 text-sm ${
                            displaySummary.unrealisedGainPct >= 0 ? "text-emerald-300" : "text-rose-300"
                          }`}
                        >
                          {displaySummary.unrealisedGainPct >= 0 ? "Up" : "Down"}{" "}
                          {formatPercent(Math.abs(displaySummary.unrealisedGainPct))} from your average cost
                        </p>
                      </div>

                      {/* Top performer */}
                      {investments.length > 0 && (
                        <div className="rounded-2xl border border-emerald-200/60 bg-emerald-50/40 p-4">
                          <p className="text-xs font-semibold text-emerald-700 uppercase tracking-wide mb-2">
                            🏆 Top performer
                          </p>
                          {(() => {
                            const best = [...investments].sort((a, b) => b.returns_pct - a.returns_pct)[0];
                            return (
                              <div>
                                <p className="text-sm font-medium text-foreground">{best.asset_name}</p>
                                <p className="text-xs text-muted-foreground mt-0.5">{best.city}</p>
                                <p className="text-lg font-bold text-emerald-700 mt-1">
                                  {formatPercent(best.returns_pct)} return
                                </p>
                              </div>
                            );
                          })()}
                        </div>
                      )}

                      {/* SEBI badge */}
                      <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 flex items-center gap-3">
                        <ShieldCheck className="h-5 w-5 text-emerald-600 shrink-0" />
                        <div>
                          <p className="text-sm font-medium text-emerald-800">SEBI Compliant Investments</p>
                          <p className="text-xs text-emerald-600 mt-0.5">
                            All holdings are SM REIT registered and regulated
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Transaction History Card */}
                  {investments.length > 0 && (
                    <Card className="border-border/70 shadow-sm">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <CalendarDays className="h-4 w-4" />
                          Recent Transactions
                        </CardTitle>
                        <CardDescription>Your purchase history</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {investments.slice(0, 5).map((inv) => (
                            <div
                              key={`txn-${inv.id}`}
                              className="flex items-center justify-between rounded-xl border border-border/50 bg-background/50 p-3 text-sm"
                            >
                              <div className="flex items-center gap-3">
                                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                                  <ArrowUpRight className="h-4 w-4" />
                                </div>
                                <div>
                                  <p className="font-medium text-foreground truncate max-w-[180px]">
                                    {inv.asset_name}
                                  </p>
                                  <p className="text-xs text-muted-foreground">
                                    {new Date(inv.invested_at).toLocaleDateString("en-IN", {
                                      day: "numeric",
                                      month: "short",
                                      year: "numeric",
                                    })}
                                  </p>
                                </div>
                              </div>
                              <div className="text-right">
                                <p className="font-semibold text-foreground">{formatINR(inv.invested_amount)}</p>
                                <Badge
                                  variant="outline"
                                  className="text-[9px] px-1 py-0 h-3.5 font-medium text-emerald-600 border-emerald-300 bg-emerald-50"
                                >
                                  {inv.units_held} units
                                </Badge>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
