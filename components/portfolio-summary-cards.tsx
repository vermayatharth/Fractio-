"use client";

import {
  TrendingUp,
  TrendingDown,
  Wallet,
  BarChart3,
  IndianRupee,
  CalendarDays,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { formatINR, formatPercent, plColor } from "@/lib/format";
import type { PortfolioSummary } from "@/lib/mock-data";

interface PortfolioSummaryCardsProps {
  data: PortfolioSummary;
}

const cards = [
  {
    key: "totalInvested" as const,
    label: "Total Invested",
    icon: Wallet,
    format: formatINR,
    iconBg: "bg-indigo-50",
    iconColor: "text-indigo-600",
  },
  {
    key: "currentValue" as const,
    label: "Current Value",
    icon: BarChart3,
    format: formatINR,
    iconBg: "bg-blue-50",
    iconColor: "text-blue-600",
  },
  {
    key: "unrealisedGainPct" as const,
    label: "Unrealised Gain",
    icon: null,
    format: formatPercent,
    iconBg: "",
    iconColor: "",
  },
  {
    key: "quarterlyYield" as const,
    label: "Quarterly Yield (Q1 FY27)",
    icon: CalendarDays,
    format: formatINR,
    iconBg: "bg-teal-50",
    iconColor: "text-teal-600",
  },
];

export function PortfolioSummaryCards({ data }: PortfolioSummaryCardsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => {
        const value = data[card.key];
        const isGain = card.key === "unrealisedGainPct";
        const GainIcon = value >= 0 ? TrendingUp : TrendingDown;

        return (
          <Card
            key={card.key}
            className="relative overflow-hidden border-border/60 shadow-sm hover:shadow-md transition-shadow"
          >
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div className="flex flex-col gap-1.5">
                  <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    {card.label}
                  </span>
                  <span
                    className={`text-2xl font-bold tracking-tight ${
                      isGain ? plColor(value) : "text-foreground"
                    }`}
                  >
                    {card.format(value)}
                  </span>
                </div>
                {isGain ? (
                  <div
                    className={`flex items-center justify-center w-9 h-9 rounded-lg ${
                      value >= 0
                        ? "bg-emerald-50 text-emerald-600"
                        : "bg-rose-50 text-rose-600"
                    }`}
                  >
                    <GainIcon className="h-4 w-4" />
                  </div>
                ) : card.icon ? (
                  <div
                    className={`flex items-center justify-center w-9 h-9 rounded-lg ${card.iconBg} ${card.iconColor}`}
                  >
                    <card.icon className="h-4 w-4" />
                  </div>
                ) : null}
              </div>

              {isGain && (
                <div className="mt-2 flex items-center gap-1.5">
                  <IndianRupee className="h-3 w-3 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">
                    {formatINR(data.currentValue - data.totalInvested)} absolute
                  </span>
                </div>
              )}
            </CardContent>

            {/* Subtle accent gradient at top */}
            <div
              className={`absolute top-0 left-0 right-0 h-[2px] ${
                isGain
                  ? value >= 0
                    ? "bg-gradient-to-r from-emerald-400 to-emerald-600"
                    : "bg-gradient-to-r from-rose-400 to-rose-600"
                  : "bg-gradient-to-r from-primary/60 to-primary"
              }`}
            />
          </Card>
        );
      })}
    </div>
  );
}
