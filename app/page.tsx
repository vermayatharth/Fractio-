import { ArrowUpRight, Building2, ShieldCheck, Sparkles } from "lucide-react";
import { Sidebar } from "@/components/sidebar";
import { PortfolioSummaryCards } from "@/components/portfolio-summary-cards";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { holdings, portfolioSummary } from "@/lib/mock-data";
import { formatINR, formatPercent } from "@/lib/format";

export default function Home() {
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
                <a
                  href="/portfolio"
                  className="rounded-full border border-border bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
                >
                  View portfolio
                </a>
              </div>
            </div>
          </section>

          <PortfolioSummaryCards data={portfolioSummary} />

          <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
            <Card className="border-border/70 shadow-sm">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Your Holdings</CardTitle>
                    <CardDescription>Live allocation across your fractional assets</CardDescription>
                  </div>
                  <div className="rounded-full bg-slate-100 p-2 text-slate-600">
                    <Building2 className="h-4 w-4" />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {holdings.map((holding) => (
                    <div key={holding.id} className="rounded-2xl border border-border/70 bg-card/70 p-4">
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                          <p className="font-semibold text-foreground">{holding.propertyName}</p>
                          <p className="text-sm text-muted-foreground">{holding.schemeName}</p>
                        </div>
                        <div className="rounded-full bg-emerald-50 px-3 py-1 text-sm font-medium text-emerald-700">
                          {formatPercent(holding.plPct)}
                        </div>
                      </div>
                      <div className="mt-3 grid gap-3 text-sm text-muted-foreground sm:grid-cols-3">
                        <div>
                          <p className="text-xs uppercase tracking-wide">City</p>
                          <p className="mt-1 font-medium text-foreground">{holding.city}</p>
                        </div>
                        <div>
                          <p className="text-xs uppercase tracking-wide">Units</p>
                          <p className="mt-1 font-medium text-foreground">{holding.unitsHeld}</p>
                        </div>
                        <div>
                          <p className="text-xs uppercase tracking-wide">Value</p>
                          <p className="mt-1 font-medium text-foreground">{formatINR(holding.currentPrice * holding.unitsHeld)}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
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
                    <CardDescription>What’s performing well right now</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="rounded-2xl bg-slate-950 p-5 text-white">
                  <p className="text-sm text-slate-300">Net position</p>
                  <p className="mt-2 text-3xl font-semibold">{formatINR(portfolioSummary.currentValue)}</p>
                  <p className="mt-2 text-sm text-emerald-300">Up {formatPercent(portfolioSummary.unrealisedGainPct)} from your average cost</p>
                </div>

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
        </div>
      </main>
    </div>
  );
}
