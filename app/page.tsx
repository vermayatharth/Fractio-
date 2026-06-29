"use client";

import { useEffect, useState } from "react";
import { ArrowUpRight, Building2, ShieldCheck, Sparkles, Loader2 } from "lucide-react";
import { Sidebar } from "@/components/sidebar";
import { PortfolioSummaryCards } from "@/components/portfolio-summary-cards";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { formatINR, formatPercent, plColor } from "@/lib/format";
import type { PortfolioSummary } from "@/lib/mock-data";
import type { InvestmentRecord } from "@/lib/auth-db";

export default function Home() {
  const [summary, setSummary] = useState<PortfolioSummary | null>(null);
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
    return () => { active = false; };
  }, []);

  const displaySummary: PortfolioSummary = summary ?? {
    totalInvested: 0,
    currentValue: 0,
    unrealisedGainPct: 0,
    quarterlyYield: 0,
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.12),_transparent_34%),linear-gradient(135deg,_#f8fafc_0%,_#f1f5f9_100%)]">
      <Sidebar />

      <main className="ml-0 lg:ml-[240px] p-4 sm:p-6 lg:p-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-6">
          <section className="rounded-3xl border border-border/70 bg-background/80 p-6 shadow-sm backdrop-blur sm:p-8">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-2xl">
                <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-sm font-medium text-emerald-700">
                  <ShieldCheck className="h-4 w-4" />
                  SEBI SM REIT compliant access
                </div>
                <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
                  Own premium commercial real estate with Fractio.
                </h1>
                <p className="mt-3 text-base leading-7 text-muted-foreground sm:text-lg">
                  Track your portfolio, discover new opportunities, and invest in Grade A assets with transparent pricing and institutional-grade reporting.
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <a
                  href="/marketplace"
                  className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
                >
                  Explore marketplace
                  <ArrowUpRight className="h-4 w-4" />
                </a>
              </div>
            </div>
          </section>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-primary/50" />
            </div>
          ) : (
            <>
              <PortfolioSummaryCards data={displaySummary} />

              <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
                <Card className="border-border/70 shadow-sm">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>Your Holdings</CardTitle>
                        <CardDescription>
                          {investments.length > 0
                            ? "Live allocation across your fractional assets"
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
                      <div className="rounded-2xl border border-dashed border-border/70 bg-muted/30 p-8 text-center">
                        <Building2 className="h-10 w-10 text-muted-foreground/30 mx-auto mb-3" />
                        <p className="text-sm text-muted-foreground">
                          Your portfolio is empty. Visit the{" "}
                          <a href="/marketplace" className="text-primary font-medium hover:underline">
                            marketplace
                          </a>{" "}
                          to start investing.
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {investments.map((inv) => {
                          const returnsPct = inv.returns_pct;
                          return (
                            <div key={inv.id} className="rounded-2xl border border-border/70 bg-card/70 p-4 transition-shadow hover:shadow-md">
                              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                                <div>
                                  <p className="font-semibold text-foreground">{inv.asset_name}</p>
                                  <p className="text-sm text-muted-foreground">{inv.city}</p>
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
                              <div className="mt-3 grid gap-3 text-sm text-muted-foreground sm:grid-cols-3">
                                <div>
                                  <p className="text-xs uppercase tracking-wide">Invested</p>
                                  <p className="mt-1 font-medium text-foreground">{formatINR(inv.invested_amount)}</p>
                                </div>
                                <div>
                                  <p className="text-xs uppercase tracking-wide">Units</p>
                                  <p className="mt-1 font-medium text-foreground">{inv.units_held}</p>
                                </div>
                                <div>
                                  <p className="text-xs uppercase tracking-wide">Current Value</p>
                                  <p className={`mt-1 font-medium ${plColor(returnsPct)}`}>
                                    {formatINR(inv.current_value)}
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

                <Card className="border-border/70 shadow-sm">
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <div className="rounded-full bg-primary/10 p-2 text-primary">
                        <Sparkles className="h-4 w-4" />
                      </div>
                      <div>
                        <CardTitle>Portfolio Insight</CardTitle>
                        <CardDescription>What&apos;s performing well right now</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="rounded-2xl bg-slate-950 p-5 text-white">
                      <p className="text-sm text-slate-300">Net position</p>
                      <p className="mt-2 text-3xl font-semibold">{formatINR(displaySummary.currentValue)}</p>
                      <p className={`mt-2 text-sm ${displaySummary.unrealisedGainPct >= 0 ? "text-emerald-300" : "text-rose-300"}`}>
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

                    <div className="rounded-2xl border border-border/70 bg-background/70 p-4">
                      <p className="text-sm font-medium text-foreground">Why investors choose Fractio</p>
                      <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                        <li>• Fractional access to institutional-grade commercial property</li>
                        <li>• Transparent pricing and quarterly distributions</li>
                        <li>• Fully digital onboarding and portfolio tracking</li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
