export const dynamic = "force-dynamic";

import { db } from "@/lib/db";
import { phases, tasks } from "@/lib/db/schema";
import Link from "next/link";

async function getData() {
  try {
    const allPhases = await db.select().from(phases).orderBy(phases.order);
    const allTasks = await db.select().from(tasks);
    const phaseProgress = allPhases.map((phase) => {
      const pt = allTasks.filter((t) => t.phaseId === phase.id);
      return { ...phase, total: pt.length, done: pt.filter((t) => t.completed).length };
    });
    return { phases: phaseProgress, totalTasks: allTasks.length, completedTasks: allTasks.filter((t) => t.completed).length, error: null };
  } catch {
    return { phases: [], totalTasks: 0, completedTasks: 0, error: "db_not_configured" };
  }
}

const MRR_TARGETS = [
  { clients: 5, avg: 6000, mrr: 30000 },
  { clients: 10, avg: 6500, mrr: 65000 },
  { clients: 15, avg: 7000, mrr: 105000 },
  { clients: 20, avg: 7000, mrr: 140000 },
  { clients: 30, avg: 7000, mrr: 210000 },
];

export default async function DashboardPage() {
  const { phases, totalTasks, completedTasks, error } = await getData();
  const overallPct = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  if (error === "db_not_configured") {
    return (
      <div className="flex items-center justify-center h-full min-h-screen">
        <div className="text-center max-w-sm p-8">
          <div className="text-5xl mb-4" style={{ color: "var(--primary)" }}>⚙</div>
          <h2 className="text-lg font-semibold mb-2">Database not configured</h2>
          <p className="text-sm mb-6" style={{ color: "var(--muted-foreground)" }}>
            Connect your Neon database to get started. It only takes 2 minutes.
          </p>
          <Link href="/setup" className="inline-flex items-center gap-2 px-5 py-2.5 rounded text-sm font-medium" style={{ background: "var(--primary)", color: "var(--primary-foreground)" }}>
            Go to Setup →
          </Link>
        </div>
      </div>
    );
  }

  const activePhase = phases.find((p) => p.done < p.total && p.total > 0);

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="mb-8">
        <div className="text-xs font-medium mb-1 uppercase tracking-widest" style={{ color: "var(--primary)" }}>LK Digital</div>
        <h1 className="text-2xl font-semibold">Business OS</h1>
        <p className="text-sm mt-1" style={{ color: "var(--muted-foreground)" }}>
          Your growth system command center. Track progress, manage the roadmap, document everything.
        </p>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-8">
        <StatCard label="Overall Progress" value={`${overallPct}%`} sub={`${completedTasks} / ${totalTasks} tasks`} accent />
        <StatCard label="Phases" value={`${phases.length}`} sub="Total phases" />
        <StatCard label="Active Phase" value={activePhase ? `Phase ${activePhase.order}` : "All done"} sub={activePhase ? activePhase.name.split("—")[1]?.trim() ?? "" : "Complete"} />
        <StatCard label="Tasks Remaining" value={`${totalTasks - completedTasks}`} sub="To complete" />
      </div>

      <div className="mb-8 p-5 rounded-lg border" style={{ background: "var(--card)", borderColor: "var(--border)" }}>
        <div className="flex justify-between items-center mb-3">
          <span className="text-sm font-medium">Build Roadmap Progress</span>
          <span className="text-sm font-semibold" style={{ color: "var(--primary)" }}>{overallPct}%</span>
        </div>
        <div className="h-2 rounded-full overflow-hidden" style={{ background: "var(--input)" }}>
          <div className="h-full rounded-full transition-all" style={{ width: `${overallPct}%`, background: "linear-gradient(90deg, #c5a368, #e8c88a)" }} />
        </div>
        <div className="flex gap-1 mt-3 flex-wrap">
          {phases.map((phase) => {
            const pct = phase.total > 0 ? (phase.done / phase.total) * 100 : 0;
            return (
              <Link key={phase.id} href={`/roadmap/${phase.slug}`} title={`${phase.name}: ${Math.round(pct)}%`}>
                <div className="h-1.5 rounded-full transition-all hover:opacity-80" style={{ width: "32px", background: pct === 100 ? "var(--primary)" : pct > 0 ? "rgba(197,163,104,0.5)" : "rgba(255,255,255,0.1)" }} />
              </Link>
            );
          })}
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-xs font-semibold mb-4 uppercase tracking-wider" style={{ color: "var(--muted-foreground)" }}>Build Roadmap</h2>
        <div className="grid grid-cols-3 gap-3">
          {phases.map((phase) => {
            const pct = phase.total > 0 ? Math.round((phase.done / phase.total) * 100) : 0;
            const status = pct === 100 ? "done" : pct > 0 ? "active" : "pending";
            return (
              <Link key={phase.id} href={`/roadmap/${phase.slug}`}>
                <div className="p-4 rounded-lg border cursor-pointer hover:border-[#c5a368]/30 transition-all" style={{ background: "var(--card)", borderColor: status === "active" ? "rgba(197,163,104,0.3)" : "var(--border)" }}>
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-xs font-medium uppercase tracking-wider" style={{ color: "var(--muted-foreground)" }}>Phase {phase.order}</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded" style={{ background: status === "done" ? "rgba(197,163,104,0.15)" : status === "active" ? "rgba(197,163,104,0.08)" : "rgba(255,255,255,0.05)", color: status === "done" ? "var(--primary)" : status === "active" ? "rgba(197,163,104,0.9)" : "var(--muted-foreground)" }}>
                      {status === "done" ? "Complete" : status === "active" ? "In Progress" : "Pending"}
                    </span>
                  </div>
                  <div className="text-sm font-medium mb-2 leading-snug">{phase.name.split("—")[1]?.trim() ?? phase.name}</div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-1 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.08)" }}>
                      <div className="h-full rounded-full" style={{ width: `${pct}%`, background: pct === 100 ? "var(--primary)" : "rgba(197,163,104,0.6)" }} />
                    </div>
                    <span className="text-xs shrink-0" style={{ color: "var(--muted-foreground)" }}>{phase.done}/{phase.total}</span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      <div>
        <h2 className="text-xs font-semibold mb-4 uppercase tracking-wider" style={{ color: "var(--muted-foreground)" }}>MRR Targets</h2>
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
              {MRR_TARGETS.map((row, i) => (
                <tr key={i} style={{ borderBottom: i < MRR_TARGETS.length - 1 ? "1px solid var(--border)" : "none" }}>
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

function StatCard({ label, value, sub, accent }: { label: string; value: string; sub: string; accent?: boolean }) {
  return (
    <div className="p-4 rounded-lg border" style={{ background: "var(--card)", borderColor: accent ? "rgba(197,163,104,0.3)" : "var(--border)" }}>
      <div className="text-xs mb-1" style={{ color: "var(--muted-foreground)" }}>{label}</div>
      <div className="text-2xl font-bold" style={{ color: accent ? "var(--primary)" : "var(--foreground)" }}>{value}</div>
      <div className="text-xs mt-0.5" style={{ color: "var(--muted-foreground)" }}>{sub}</div>
    </div>
  );
}
