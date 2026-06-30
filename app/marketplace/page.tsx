"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Sidebar } from "@/components/sidebar";
import { RealEstateNews } from "@/components/real-estate-news";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { marketplaceProperties, type MarketplaceProperty } from "@/lib/mock-data";
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
  Minus,
  Plus,
  CheckCircle2,
  AlertCircle,
  Loader2,
  PieChart,
} from "lucide-react";

export default function MarketplacePage() {
  const router = useRouter();
  const [selectedProperty, setSelectedProperty] = useState<MarketplaceProperty | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [units, setUnits] = useState(1);
  const [buying, setBuying] = useState(false);
  const [buyResult, setBuyResult] = useState<{ success: boolean; message: string } | null>(null);

  function openBuyDialog(property: MarketplaceProperty) {
    setSelectedProperty(property);
    setUnits(1);
    setBuyResult(null);
    setDialogOpen(true);
  }

  async function handleBuy() {
    if (!selectedProperty || buying) return;

    setBuying(true);
    setBuyResult(null);

    try {
      const totalAmount = units * selectedProperty.pricePerUnit;
      const res = await fetch("/api/investments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          assetName: selectedProperty.propertyName,
          city: selectedProperty.city,
          investedAmount: totalAmount,
          currentValue: totalAmount,
          returnsPct: 0,
          unitsHeld: units,
        }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setBuyResult({
          success: true,
          message: `Successfully purchased ${units} unit${units > 1 ? "s" : ""} of ${selectedProperty.propertyName}!`,
        });
      } else {
        setBuyResult({
          success: false,
          message: data.error || "Purchase failed. Please try again.",
        });
      }
    } catch {
      setBuyResult({
        success: false,
        message: "Network error. Please check your connection.",
      });
    } finally {
      setBuying(false);
    }
  }

  const totalCost = selectedProperty ? units * selectedProperty.pricePerUnit : 0;

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
                        <p className="text-[10px] text-slate-400 uppercase tracking-wide">Per Unit</p>
                        <p className="text-lg font-bold">{formatINR(property.pricePerUnit)}</p>
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
                  <button
                    onClick={() => openBuyDialog(property)}
                    className="mt-4 w-full rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition-all hover:bg-indigo-700 hover:shadow-lg hover:shadow-indigo-500/25 active:scale-[0.98]"
                  >
                    Buy Units
                  </button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>

      {/* ───── Buy Dialog ───── */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          {buyResult?.success ? (
            /* ── Success State ── */
            <div className="flex flex-col items-center gap-4 py-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50">
                <CheckCircle2 className="h-8 w-8 text-emerald-600" />
              </div>
              <div className="text-center">
                <h3 className="text-lg font-semibold text-foreground">Purchase Successful!</h3>
                <p className="mt-2 text-sm text-muted-foreground">{buyResult.message}</p>
              </div>
              <div className="flex w-full gap-3 mt-2">
                <DialogClose
                  render={
                    <Button variant="outline" className="flex-1" />
                  }
                >
                  Continue Browsing
                </DialogClose>
                <Button
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700"
                  onClick={() => {
                    setDialogOpen(false);
                    router.push("/portfolio");
                  }}
                >
                  <PieChart className="h-4 w-4 mr-1.5" />
                  View Portfolio
                </Button>
              </div>
            </div>
          ) : (
            /* ── Buy Form ── */
            <>
              <DialogHeader>
                <DialogTitle>Purchase Units</DialogTitle>
                <DialogDescription>
                  {selectedProperty?.propertyName} — {selectedProperty?.city}, {selectedProperty?.state}
                </DialogDescription>
              </DialogHeader>

              {/* Property Summary */}
              <div className="rounded-xl bg-slate-950 p-4 text-white">
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-[10px] text-slate-400 uppercase tracking-wide">Price per Unit</p>
                    <p className="text-lg font-bold mt-0.5">{formatINR(selectedProperty?.pricePerUnit ?? 0)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] text-slate-400 uppercase tracking-wide">Projected IRR</p>
                    <p className="text-lg font-bold text-emerald-400 mt-0.5">
                      {formatPercent(selectedProperty?.projectedIRR ?? 0)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Units Selector */}
              <div className="space-y-3">
                <label className="text-sm font-medium text-foreground">Select Units</label>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setUnits(Math.max(1, units - 1))}
                    disabled={units <= 1}
                    className="flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-background text-foreground transition-colors hover:bg-accent disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <div className="flex-1">
                    <input
                      type="number"
                      min={1}
                      max={selectedProperty?.publicFloatUnits ?? 100}
                      value={units}
                      onChange={(e) => {
                        const v = parseInt(e.target.value, 10);
                        if (!isNaN(v) && v >= 1) {
                          setUnits(Math.min(v, selectedProperty?.publicFloatUnits ?? 100));
                        }
                      }}
                      className="w-full rounded-lg border border-border bg-background px-4 py-2 text-center text-lg font-bold text-foreground outline-none focus:ring-2 focus:ring-primary/50"
                    />
                  </div>
                  <button
                    onClick={() => setUnits(Math.min(units + 1, selectedProperty?.publicFloatUnits ?? 100))}
                    disabled={units >= (selectedProperty?.publicFloatUnits ?? 100)}
                    className="flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-background text-foreground transition-colors hover:bg-accent disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>

                {/* Quick select buttons */}
                <div className="flex gap-2">
                  {[5, 10, 25, 50].map((qty) => (
                    <button
                      key={qty}
                      onClick={() => setUnits(Math.min(qty, selectedProperty?.publicFloatUnits ?? 100))}
                      className={`flex-1 rounded-lg border px-2 py-1.5 text-xs font-medium transition-colors ${
                        units === qty
                          ? "border-indigo-300 bg-indigo-50 text-indigo-700"
                          : "border-border bg-background text-muted-foreground hover:bg-accent"
                      }`}
                    >
                      {qty} units
                    </button>
                  ))}
                </div>
              </div>

              {/* Cost Summary */}
              <div className="rounded-xl border border-border/70 bg-muted/30 p-4 space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Units</span>
                  <span className="font-medium text-foreground">{units}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Price per unit</span>
                  <span className="font-medium text-foreground">{formatINR(selectedProperty?.pricePerUnit ?? 0)}</span>
                </div>
                <div className="border-t border-border/50 pt-2 flex items-center justify-between">
                  <span className="text-sm font-semibold text-foreground">Total Investment</span>
                  <span className="text-lg font-bold text-indigo-700">{formatINR(totalCost)}</span>
                </div>
              </div>

              {/* Error message */}
              {buyResult && !buyResult.success && (
                <div className="flex items-center gap-2 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  {buyResult.message}
                </div>
              )}

              <DialogFooter>
                <DialogClose render={<Button variant="outline" />}>
                  Cancel
                </DialogClose>
                <Button
                  onClick={handleBuy}
                  disabled={buying}
                  className="bg-indigo-600 hover:bg-indigo-700"
                >
                  {buying ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-1.5 animate-spin" />
                      Processing…
                    </>
                  ) : (
                    <>
                      <IndianRupee className="h-4 w-4 mr-1.5" />
                      Confirm Purchase
                    </>
                  )}
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
