"use client";

import { useEffect, useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Icon } from "../icon";
import { Money, PageHeader, StatBar } from "../shared";
import { Loader2 } from "lucide-react";

type Account = {
  id: string;
  name: string;
  type: string;
  balance: number;
  icon: string;
  color: string;
};

export function AccountsPage() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchAccounts() {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch("/api/accounts");
        if (!res.ok) throw new Error("Impossible de charger les comptes");
        const data = await res.json();
        if (!Array.isArray(data)) throw new Error("Réponse serveur invalide");
        setAccounts(data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Une erreur est survenue",
        );
      } finally {
        setLoading(false);
      }
    }

    fetchAccounts();
  }, []);

  const totalBalance = useMemo(
    () =>
      accounts.reduce((sum, account) => sum + Number(account.balance || 0), 0),
    [accounts],
  );

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Comptes" subtitle="Tous tes comptes en un endroit" />

      {error ? (
        <Card className="border-negative/20 bg-negative/5 backdrop-blur-xl">
          <CardContent className="pt-6">
            <p className="text-sm text-negative">{error}</p>
          </CardContent>
        </Card>
      ) : null}

      <Card className="overflow-hidden border-0 bg-linear-to-br from-primary/20 via-card to-teal/10 backdrop-blur-xl ring-1 ring-neon/20">
        <CardContent className="flex flex-col gap-1">
          <span className="text-xs font-medium text-muted-foreground">
            Solde total
          </span>
          <Money
            value={totalBalance}
            className="text-3xl font-extrabold sm:text-4xl"
          />
          <p className="mt-2 text-xs text-muted-foreground">
            {accounts.length} compte{accounts.length > 1 ? "s" : ""} connecté
            {accounts.length > 1 ? "s" : ""}
          </p>
        </CardContent>
      </Card>

      {loading ? (
        <div className="flex h-48 items-center justify-center">
          <Loader2 className="size-8 animate-spin text-neon" />
        </div>
      ) : accounts.length === 0 ? (
        <div className="flex h-48 items-center justify-center text-sm text-muted-foreground">
          Aucun compte pour l&apos;instant.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {accounts.map((account) => {
            const share =
              totalBalance > 0
                ? Math.round((account.balance / totalBalance) * 100)
                : 0;

            return (
              <Card key={account.id} className="backdrop-blur-xl">
                <CardContent className="flex flex-col gap-4">
                  <div className="flex items-center gap-3">
                    <span
                      className="flex size-11 items-center justify-center rounded-xl"
                      style={{
                        backgroundColor: `color-mix(in srgb, ${account.color} 15%, transparent)`,
                        color: account.color,
                      }}
                    >
                      <Icon name={account.icon} className="size-5" />
                    </span>
                    <div className="flex-1">
                      <p className="font-semibold">{account.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {account.type} · {share}% du total
                      </p>
                    </div>
                  </div>
                  <Money
                    value={account.balance}
                    className="text-xl font-extrabold"
                    suffix={false}
                  />
                  <StatBar percent={share} color={account.color} />
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
