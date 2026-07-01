"use client";

import { useEffect, useState } from "react";
import { Newspaper, TrendingUp, Building2, Landmark, ArrowUpRight } from "lucide-react";

interface NewsItem {
  id: string;
  headline: string;
  source: string;
  time: string;
  tag: string;
  tagColor: string;
  icon: typeof Newspaper;
}

const newsItems: NewsItem[] = [
  {
    id: "n1",
    headline: "SEBI approves 3 new SM REIT schemes worth ₹1,200 Cr for Q3 FY27 listing",
    source: "Economic Times",
    time: "2 hours ago",
    tag: "Regulatory",
    tagColor: "bg-blue-50 text-blue-700 border-blue-200",
    icon: Landmark,
  },
  {
    id: "n2",
    headline: "Embassy Group acquires 2.5M sq ft tech park in Whitefield for ₹890 Cr — SPV filing imminent",
    source: "LiveMint",
    time: "4 hours ago",
    tag: "Acquisition",
    tagColor: "bg-emerald-50 text-emerald-700 border-emerald-200",
    icon: Building2,
  },
  {
    id: "n3",
    headline: "Brookfield India REIT Q1 FY27 results: NOI up 12%, occupancy at 93% across 30M sq ft portfolio",
    source: "Moneycontrol",
    time: "6 hours ago",
    tag: "Earnings",
    tagColor: "bg-amber-50 text-amber-700 border-amber-200",
    icon: TrendingUp,
  },
  {
    id: "n4",
    headline: "DLF launches ₹500 Cr fractional ownership scheme for Cyber City Phase 3 — minimum ticket ₹10L",
    source: "Business Standard",
    time: "8 hours ago",
    tag: "New Listing",
    tagColor: "bg-violet-50 text-violet-700 border-violet-200",
    icon: Building2,
  },
  {
    id: "n5",
    headline: "Mindspace REIT declares ₹5.47/unit quarterly distribution — 9.1% annualized yield",
    source: "Financial Express",
    time: "12 hours ago",
    tag: "Dividend",
    tagColor: "bg-teal-50 text-teal-700 border-teal-200",
    icon: TrendingUp,
  },
  {
    id: "n6",
    headline: "Prestige Group raises ₹4,000 Cr through office REIT IPO — oversubscribed 3.8x",
    source: "NDTV Profit",
    time: "1 day ago",
    tag: "IPO",
    tagColor: "bg-rose-50 text-rose-700 border-rose-200",
    icon: Landmark,
  },
  {
    id: "n7",
    headline: "RMZ Corp plans SM REIT listing for Ecoworld campus — ₹128 Cr property value, 9.2% yield",
    source: "Reuters India",
    time: "1 day ago",
    tag: "New Listing",
    tagColor: "bg-violet-50 text-violet-700 border-violet-200",
    icon: Building2,
  },
  {
    id: "n8",
    headline: "India commercial real estate demand hits record 72M sq ft in FY26 — Bangalore leads with 28%",
    source: "JLL India Report",
    time: "2 days ago",
    tag: "Market",
    tagColor: "bg-sky-50 text-sky-700 border-sky-200",
    icon: TrendingUp,
  },
];

export function RealEstateNews() {
  const [activeIndex, setActiveIndex] = useState(0);
  const visibleCount = 4;

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % newsItems.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const getVisibleItems = () => {
    const items: NewsItem[] = [];
    for (let i = 0; i < visibleCount; i++) {
      items.push(newsItems[(activeIndex + i) % newsItems.length]);
    }
    return items;
  };

  return (
    <div className="rounded-2xl border border-border/70 bg-background/80 p-5 shadow-sm backdrop-blur">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-rose-50 text-rose-600">
            <Newspaper className="h-4 w-4" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-foreground">Top Real Estate News</h2>
            <p className="text-[11px] text-muted-foreground">Latest from India&apos;s commercial property market</p>
          </div>
        </div>
        <div className="flex gap-1">
          {newsItems.map((_, i) => (
            <button
              key={i}
              onClick={() => setActiveIndex(i)}
              className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                i >= activeIndex && i < activeIndex + visibleCount
                  ? "bg-indigo-500 w-3"
                  : "bg-slate-300"
              }`}
            />
          ))}
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {getVisibleItems().map((item) => (
          <div
            key={item.id}
            className="group flex gap-3 rounded-xl border border-border/60 bg-card/70 p-3.5 transition-all duration-200 hover:shadow-md hover:border-indigo-200/60 cursor-pointer"
          >
            <div className="flex-shrink-0 mt-0.5">
              <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                <item.icon className="h-4 w-4" />
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground leading-snug line-clamp-2 group-hover:text-indigo-700 transition-colors">
                {item.headline}
              </p>
              <div className="mt-2 flex items-center gap-2 flex-wrap">
                <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-semibold ${item.tagColor}`}>
                  {item.tag}
                </span>
                <span className="text-[11px] text-muted-foreground">{item.source}</span>
                <span className="text-[11px] text-muted-foreground/50">·</span>
                <span className="text-[11px] text-muted-foreground">{item.time}</span>
              </div>
            </div>
            <ArrowUpRight className="h-3.5 w-3.5 text-muted-foreground/40 group-hover:text-indigo-500 transition-colors flex-shrink-0 mt-1" />
          </div>
        ))}
      </div>
    </div>
  );
}
