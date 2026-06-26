import {
  Bell,
  CreditCard,
  FileText,
  KeyRound,
  Landmark,
  LifeBuoy,
  Lock,
  ShieldCheck,
  Sparkles,
  UserCircle2,
} from "lucide-react";
import Link from "next/link";
import { Sidebar } from "@/components/sidebar";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const accountOptions = [
  {
    title: "Sign in",
    description: "Access your dashboard, portfolio, and payouts.",
    icon: Lock,
    action: "Continue",
  },
  {
    title: "Sign up",
    description: "Create an account to start investing in SM REIT assets.",
    icon: Sparkles,
    action: "Create account",
  },
];

const settingsSections = [
  {
    title: "Profile",
    description: "Update your personal details and KYC profile.",
    icon: UserCircle2,
    bullets: ["Name and contact details", "PAN and Aadhaar verification", "Investor type"],
  },
  {
    title: "Notifications",
    description: "Choose how you receive updates on opportunities and distributions.",
    icon: Bell,
    bullets: ["Deal alerts", "Dividend updates", "Portfolio performance summaries"],
  },
  {
    title: "Security",
    description: "Protect your account with secure sign-in and recovery options.",
    icon: KeyRound,
    bullets: ["Password reset", "Two-factor authentication", "Biometric login"],
  },
  {
    title: "Payments & withdrawals",
    description: "Manage bank accounts and your funding flow.",
    icon: CreditCard,
    bullets: ["Linked bank accounts", "Auto-invest settings", "Withdrawal preferences"],
  },
  {
    title: "Compliance & documents",
    description: "Keep your documents and regulatory records organized.",
    icon: FileText,
    bullets: ["KYC documents", "Tax statements", "Annual disclosures"],
  },
  {
    title: "Support",
    description: "Get help from the Fractio support team.",
    icon: LifeBuoy,
    bullets: ["Live chat", "FAQ", "Escalation request"],
  },
];

export default function SettingsPage() {
  return (
    <div className="min-h-screen bg-[linear-gradient(135deg,_#f8fafc_0%,_#f1f5f9_100%)]">
      <Sidebar />

      <main className="ml-0 lg:ml-[240px] p-4 sm:p-6 lg:p-8">
        <div className="mx-auto flex max-w-6xl flex-col gap-6">
          <section className="rounded-3xl border border-border/70 bg-background/85 p-6 shadow-sm backdrop-blur sm:p-8">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-sm font-medium text-emerald-700">
                  <ShieldCheck className="h-4 w-4" />
                  Account settings
                </div>
                <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
                  Manage your Fractio account
                </h1>
                <p className="mt-3 max-w-2xl text-base leading-7 text-muted-foreground">
                  Sign in or create an account, update your investor profile, and control the settings that matter for your real estate portfolio.
                </p>
              </div>
              <Badge variant="outline" className="w-fit border-emerald-200 bg-emerald-50 text-emerald-700">
                KYC Tier 2 verified
              </Badge>
            </div>
          </section>

          <section className="grid gap-4 lg:grid-cols-2">
            {accountOptions.map((option) => {
              const Icon = option.icon;
              return (
                <Card key={option.title} className="border-border/70 shadow-sm">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="rounded-full bg-primary/10 p-2 text-primary">
                        <Icon className="h-4 w-4" />
                      </div>
                      <div>
                        <CardTitle>{option.title}</CardTitle>
                        <CardDescription>{option.description}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Link
                      href={option.title === "Sign up" ? "/signup" : "/signin"}
                      className="inline-flex w-full items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 sm:w-auto"
                    >
                      {option.action}
                    </Link>
                  </CardContent>
                </Card>
              );
            })}
          </section>

          <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {settingsSections.map((section) => {
              const Icon = section.icon;
              return (
                <Card key={section.title} className="border-border/70 shadow-sm">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="rounded-full bg-slate-100 p-2 text-slate-600">
                        <Icon className="h-4 w-4" />
                      </div>
                      <div>
                        <CardTitle>{section.title}</CardTitle>
                        <CardDescription>{section.description}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      {section.bullets.map((item) => (
                        <li key={item} className="flex items-start gap-2">
                          <Landmark className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              );
            })}
          </section>

          <Card className="border-border/70 shadow-sm">
            <CardHeader>
              <CardTitle>Need help with your account?</CardTitle>
              <CardDescription>
                Our investor support team can help with onboarding, compliance, and portfolio questions.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-muted-foreground">
                Contact support for assistance with your digital wallet, documents, or plan changes.
              </p>
              <Link
                href="/support"
                className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground"
              >
                Contact support
              </Link>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
