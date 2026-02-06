import * as React from "react";
import { useBillingCurrent } from "@/hooks/use-billing";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Loader2, ShieldCheck } from "lucide-react";

function clampPct(used: number, limit: number) {
  if (!limit) return 0;
  return Math.min(100, Math.round((used / limit) * 100));
}

export default function BillingPage() {
  const q = useBillingCurrent();

  return (
    <div className="max-w-5xl mx-auto px-3 sm:px-4 lg:px-8 py-6 rise-in" data-testid="page-billing">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl">Billing</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Current plan + usage bars. Designed to feel calm and premium.
          </p>
        </div>
        <Button variant="outline" className="rounded-xl" onClick={() => q.refetch()} data-testid="billing-refresh">
          Refresh
        </Button>
      </div>

      <div className="mt-5">
        {q.isLoading ? (
          <Card className="surface-glass rounded-2xl p-8 text-sm text-muted-foreground" data-testid="billing-loading">
            <Loader2 className="inline-block h-4 w-4 animate-spin mr-2" />
            Loading billing…
          </Card>
        ) : q.isError ? (
          <Card className="surface-glass rounded-2xl p-8 text-sm text-destructive" data-testid="billing-error">
            Failed to load billing. ({String((q.error as any)?.message || q.error)})
          </Card>
        ) : !q.data ? (
          <Card className="surface-glass rounded-2xl p-8 text-sm text-muted-foreground" data-testid="billing-empty">
            No billing data.
          </Card>
        ) : (
          <Card className="surface-glass rounded-2xl overflow-hidden">
            <div className="p-5 border-b border-card-border bg-gradient-to-br from-primary/12 to-accent/10">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="text-xs font-semibold text-muted-foreground">Current plan</div>
                  <div className="mt-2 text-2xl font-bold tracking-tight" data-testid="billing-plan">
                    {q.data.planName}
                  </div>
                  <div className="mt-1 text-sm text-muted-foreground" data-testid="billing-price">
                    ${q.data.priceMonthly}/month
                  </div>
                </div>

                <div className="rounded-2xl border border-card-border bg-card/70 px-4 py-3 shadow-sm">
                  <div className="flex items-center gap-2 text-sm font-semibold">
                    <ShieldCheck className="h-4 w-4 text-primary" />
                    Usage
                  </div>
                  <div className="mt-1 text-xs text-muted-foreground">
                    Soft limits for MVP. Backend may enforce hard quotas.
                  </div>
                </div>
              </div>
            </div>

            <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="rounded-2xl border border-card-border bg-background/40 p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-semibold">Contacts</div>
                    <div className="text-xs text-muted-foreground" data-testid="billing-contacts-label">
                      {q.data.contactsUsed} of {q.data.contactsLimit}
                    </div>
                  </div>
                  <div className="text-sm font-semibold text-primary" data-testid="billing-contacts-pct">
                    {clampPct(q.data.contactsUsed, q.data.contactsLimit)}%
                  </div>
                </div>
                <Progress
                  value={clampPct(q.data.contactsUsed, q.data.contactsLimit)}
                  className="mt-3 h-2"
                  data-testid="billing-contacts-progress"
                />
              </div>

              <div className="rounded-2xl border border-card-border bg-background/40 p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-semibold">Messages</div>
                    <div className="text-xs text-muted-foreground" data-testid="billing-messages-label">
                      {q.data.messagesUsed} of {q.data.messagesLimit}
                    </div>
                  </div>
                  <div className="text-sm font-semibold text-primary" data-testid="billing-messages-pct">
                    {clampPct(q.data.messagesUsed, q.data.messagesLimit)}%
                  </div>
                </div>
                <Progress
                  value={clampPct(q.data.messagesUsed, q.data.messagesLimit)}
                  className="mt-3 h-2"
                  data-testid="billing-messages-progress"
                />
              </div>
            </div>

            <div className="px-5 pb-5">
              <div className="rounded-2xl border border-card-border bg-card/60 p-4">
                <div className="text-sm font-semibold">Manage plan</div>
                <div className="mt-1 text-sm text-muted-foreground">
                  This MVP shows current status. Upgrade/downgrade flows can be added later.
                </div>
                <div className="mt-4 flex flex-col sm:flex-row gap-2">
                  <Button
                    className="rounded-xl bg-gradient-to-br from-primary to-primary/85 shadow-md shadow-primary/20 hover:shadow-lg hover:shadow-primary/25 hover:-translate-y-0.5 transition-all"
                    onClick={() => window.open("https://replit.com", "_blank")}
                    data-testid="billing-upgrade"
                  >
                    Upgrade plan
                  </Button>
                  <Button
                    variant="outline"
                    className="rounded-xl"
                    onClick={() => window.open("https://replit.com", "_blank")}
                    data-testid="billing-view-invoices"
                  >
                    View invoices
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
