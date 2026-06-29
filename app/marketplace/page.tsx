"use client";

import { Sidebar } from "@/components/sidebar";
import { RealEstateNews } from "@/components/real-estate-news";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { marketplaceProperties } from "@/lib/mock-data";
import { formatINR, formatCrore, formatPercent } from "@/lib/format";
import {
  Store,
  Building2,
  TrendingUp,
  MapPin,
  ArrowUpRight,
  ShieldCheck,
  IndianRupee,
  BarChart3,
  CalendarDays,
} from "lucide-react";

export default function MarketplacePage() {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.12),_transparent_34%),linear-gradient(135deg,_#f8fafc_0%,_#f1f5f9_100%)]">
      <Sidebar />

      <main className="ml-0 lg:ml-[240px] p-4 sm:p-6 lg:p-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-6">
          {/* Header */}
          <section className="rounded-3xl border border-border/70 bg-background/80 p-6 shadow-sm backdrop-blur sm:p-8">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-2xl">
                <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-sm font-medium text-indigo-700">
                  <Store className="h-4 w-4" />
                  Marketplace
                </div>
                <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
                  Discover fractional real estate opportunities
                </h1>
                <p className="mt-3 text-base leading-7 text-muted-foreground sm:text-lg">
                  Browse SEBI-compliant SM REIT schemes across India&apos;s top commercial properties. Minimum investment ₹10 Lakhs.
                </p>
              </div>
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <ShieldCheck className="h-4 w-4 text-emerald-600" />
                <span>{marketplaceProperties.length} active listings</span>
              </div>
            </div>
          </section>

          {/* Real Estate News */}
          <RealEstateNews />

          {/* Property Listings Grid */}
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {marketplaceProperties.map((property) => (
              <Card
                key={property.id}
                className="group relative overflow-hidden border-border/60 shadow-sm transition-all duration-300 hover:shadow-lg hover:shadow-indigo-500/5 hover:border-indigo-200/60"
              >
                {/* Top gradient accent */}
                <div className="h-1.5 bg-gradient-to-r from-indigo-500 via-blue-500 to-emerald-500" />

                <CardContent className="p-5">
                  {/* Grade badge */}
                  <div className="flex items-center justify-between mb-3">
                    <Badge
                      variant="outline"
                      className={`text-[10px] font-semibold ${
                        property.assetGrade.includes("+")
                          ? "border-emerald-300 bg-emerald-50 text-emerald-700"
                          : "border-blue-300 bg-blue-50 text-blue-700"
                      }`}
                    >
                      {property.assetGrade}
                    </Badge>
                    <ArrowUpRight className="h-4 w-4 text-muted-foreground/30 group-hover:text-indigo-500 transition-colors" />
                  </div>

                  {/* Property info */}
                  <h3 className="text-base font-semibold text-foreground leading-snug group-hover:text-indigo-700 transition-colors">
                    {property.propertyName}
                  </h3>
                  <p className="mt-1 text-xs text-muted-foreground">{property.schemeName}</p>

                  <div className="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground">
                    <MapPin className="h-3 w-3" />
                    <span>{property.city}, {property.state}</span>
                  </div>

                  {/* Valuation */}
                  <div className="mt-4 rounded-xl bg-slate-950 p-3.5 text-white">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-[10px] text-slate-400 uppercase tracking-wide">Total Value</p>
                        <p className="text-lg font-bold">{formatCrore(property.totalValue)}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] text-slate-400 uppercase tracking-wide">Min. Investment</p>
                        <p className="text-lg font-bold">{formatINR(property.minInvestment)}</p>
                      </div>
                    </div>
                  </div>

                  {/* Key metrics */}
                  <div className="mt-4 grid grid-cols-3 gap-3">
                    <div className="rounded-lg bg-emerald-50/80 border border-emerald-100 p-2.5 text-center">
                      <TrendingUp className="h-3.5 w-3.5 text-emerald-600 mx-auto mb-1" />
                      <p className="text-[10px] text-emerald-600/80 uppercase">IRR</p>
                      <p className="text-sm font-bold text-emerald-700">{formatPercent(property.projectedIRR)}</p>
                    </div>
                    <div className="rounded-lg bg-blue-50/80 border border-blue-100 p-2.5 text-center">
                      <IndianRupee className="h-3.5 w-3.5 text-blue-600 mx-auto mb-1" />
                      <p className="text-[10px] text-blue-600/80 uppercase">Yield</p>
                      <p className="text-sm font-bold text-blue-700">{property.dividendYield.toFixed(1)}%</p>
                    </div>
                    <div className="rounded-lg bg-violet-50/80 border border-violet-100 p-2.5 text-center">
                      <BarChart3 className="h-3.5 w-3.5 text-violet-600 mx-auto mb-1" />
                      <p className="text-[10px] text-violet-600/80 uppercase">Occ.</p>
                      <p className="text-sm font-bold text-violet-700">{property.occupancyPct}%</p>
                    </div>
                  </div>

                  {/* Bottom stats */}
                  <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground border-t border-border/50 pt-3">
                    <div className="flex items-center gap-1">
                      <CalendarDays className="h-3 w-3" />
                      <span>WALE: {property.waleYears} yrs</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Building2 className="h-3 w-3" />
                      <span>{property.publicFloatUnits.toLocaleString("en-IN")} units</span>
                    </div>
                  </div>

                  {/* CTA */}
                  <button className="mt-4 w-full rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition-all hover:bg-indigo-700 hover:shadow-lg hover:shadow-indigo-500/25 active:scale-[0.98]">
                    View Details
                  </button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
