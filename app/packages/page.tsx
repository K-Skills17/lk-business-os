export const dynamic = "force-dynamic";

import { db } from "@/lib/db";
import { packages } from "@/lib/db/schema";

export default async function PackagesPage() {
  const allPackages = await db.select().from(packages).orderBy(packages.order).catch(() => []);

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="mb-8">
        <div className="text-xs font-medium mb-1 uppercase tracking-widest" style={{ color: "var(--primary)" }}>Commercial Model</div>
        <h1 className="text-2xl font-semibold">Service Packages</h1>
        <p className="text-sm mt-1" style={{ color: "var(--muted-foreground)" }}>
          Three tiers. All include the LK Dentista OS — the difference is implementation depth and ongoing management.
        </p>
      </div>

      <div className="grid grid-cols-3 gap-5 mb-10">
        {allPackages.map((pkg) => {
          const features = pkg.features as string[];
          return (
            <div
              key={pkg.id}
              className="rounded-lg border flex flex-col"
              style={{
                background: "var(--card)",
                borderColor: pkg.isFlagship ? "rgba(197,163,104,0.4)" : "var(--border)",
                position: "relative",
              }}
            >
              {pkg.isFlagship && (
                <div
                  className="absolute -top-px left-1/2 -translate-x-1/2 text-[10px] px-3 py-0.5 font-medium"
                  style={{ background: "var(--primary)", color: "var(--primary-foreground)", borderRadius: "0 0 6px 6px" }}
                >
                  Flagship
                </div>
              )}
              <div className="p-5 border-b" style={{ borderColor: "var(--border)" }}>
                <div className="text-xs font-medium mb-2" style={{ color: "var(--muted-foreground)" }}>{pkg.name}</div>
                <div className="text-2xl font-bold mb-0.5" style={{ color: "var(--primary)" }}>
                  R$ {pkg.priceMin?.toLocaleString("pt-BR")}
                </div>
                <div className="text-xs mb-3" style={{ color: "var(--muted-foreground)" }}>
                  — R$ {pkg.priceMax?.toLocaleString("pt-BR")} / mês
                </div>
                <p className="text-xs leading-relaxed" style={{ color: "var(--muted-foreground)" }}>
                  {pkg.description}
                </p>
              </div>
              <div className="p-5 flex-1">
                <div className="text-[10px] font-semibold uppercase tracking-wider mb-3" style={{ color: "var(--muted-foreground)" }}>
                  Includes
                </div>
                <ul className="flex flex-col gap-2">
                  {features.map((f, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs" style={{ color: "var(--foreground)" }}>
                      <span className="shrink-0 mt-0.5" style={{ color: "var(--primary)" }}>✓</span>
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          );
        })}
      </div>

      {/* Setup fees note */}
      <div className="p-5 rounded-lg border mb-6" style={{ background: "var(--card)", borderColor: "var(--border)" }}>
        <div className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: "var(--muted-foreground)" }}>Setup Fee</div>
        <p className="text-sm leading-relaxed" style={{ color: "var(--muted-foreground)" }}>
          A separate implementation fee applies when initial setup requires significant work — tracking setup, landing page development, CRM configuration, automation setup, integrations, and testing. The exact fee depends on complexity.
          Advertising expenditure and third-party software costs are always clearly separated from LK Digital&apos;s service fee.
        </p>
      </div>

      {/* Revenue scenarios */}
      <div>
        <h2 className="text-xs font-semibold mb-4 uppercase tracking-wider" style={{ color: "var(--muted-foreground)" }}>Revenue Scenarios</h2>
        <div className="rounded-lg border overflow-hidden" style={{ borderColor: "var(--border)" }}>
          <table className="w-full text-sm">
            <thead>
              <tr style={{ background: "var(--muted)", borderBottom: "1px solid var(--border)" }}>
                {["Clients", "Avg / Month", "MRR", "ARR"].map((h) => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-medium uppercase tracking-wider" style={{ color: "var(--muted-foreground)" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                { clients: 5, avg: 6000, mrr: 30000 },
                { clients: 10, avg: 6500, mrr: 65000 },
                { clients: 15, avg: 7000, mrr: 105000 },
                { clients: 20, avg: 7000, mrr: 140000 },
                { clients: 30, avg: 7000, mrr: 210000 },
              ].map((row, i, arr) => (
                <tr key={i} style={{ borderBottom: i < arr.length - 1 ? "1px solid var(--border)" : "none" }}>
                  <td className="px-4 py-3 font-medium">{row.clients}</td>
                  <td className="px-4 py-3" style={{ color: "var(--muted-foreground)" }}>R$ {row.avg.toLocaleString("pt-BR")}</td>
                  <td className="px-4 py-3 font-semibold" style={{ color: "var(--primary)" }}>R$ {row.mrr.toLocaleString("pt-BR")}</td>
                  <td className="px-4 py-3 text-xs" style={{ color: "var(--muted-foreground)" }}>R$ {(row.mrr * 12).toLocaleString("pt-BR")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
