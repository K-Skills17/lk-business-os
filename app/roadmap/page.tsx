export const dynamic = "force-dynamic";

import { db } from "@/lib/db";
import { phases, tasks } from "@/lib/db/schema";
import Link from "next/link";

export default async function RoadmapPage() {
  const allPhases = await db.select().from(phases).orderBy(phases.order).catch(() => []);
  const allTasks = await db.select().from(tasks).catch(() => []);

  const phaseData = allPhases.map((phase) => {
    const pt = allTasks.filter((t) => t.phaseId === phase.id);
    return { ...phase, total: pt.length, done: pt.filter((t) => t.completed).length };
  });

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="mb-8">
        <div className="text-xs font-medium mb-1 uppercase tracking-widest" style={{ color: "var(--primary)" }}>Build Roadmap</div>
        <h1 className="text-2xl font-semibold">All Phases</h1>
        <p className="text-sm mt-1" style={{ color: "var(--muted-foreground)" }}>
          Click a phase to see and check off individual tasks.
        </p>
      </div>

      <div className="flex flex-col gap-3">
        {phaseData.map((phase) => {
          const pct = phase.total > 0 ? Math.round((phase.done / phase.total) * 100) : 0;
          const status = pct === 100 ? "done" : pct > 0 ? "active" : "pending";
          return (
            <Link key={phase.id} href={`/roadmap/${phase.slug}`}>
              <div
                className="p-5 rounded-lg border hover:border-[#c5a368]/40 transition-all cursor-pointer"
                style={{ background: "var(--card)", borderColor: status === "active" ? "rgba(197,163,104,0.25)" : "var(--border)" }}
              >
                <div className="flex items-start gap-4">
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center text-sm font-bold shrink-0"
                    style={{
                      background: status === "done" ? "rgba(197,163,104,0.2)" : status === "active" ? "rgba(197,163,104,0.1)" : "rgba(255,255,255,0.05)",
                      color: status === "done" || status === "active" ? "var(--primary)" : "var(--muted-foreground)",
                    }}
                  >
                    {phase.order}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1">
                      <span className="text-sm font-semibold">{phase.name}</span>
                      <span
                        className="text-[10px] px-2 py-0.5 rounded shrink-0"
                        style={{
                          background: status === "done" ? "rgba(197,163,104,0.15)" : status === "active" ? "rgba(197,163,104,0.08)" : "rgba(255,255,255,0.05)",
                          color: status === "done" ? "var(--primary)" : status === "active" ? "rgba(197,163,104,0.9)" : "var(--muted-foreground)",
                        }}
                      >
                        {status === "done" ? "Complete" : status === "active" ? "In Progress" : "Pending"}
                      </span>
                    </div>
                    {phase.objective && (
                      <p className="text-xs mb-3 leading-relaxed" style={{ color: "var(--muted-foreground)" }}>{phase.objective}</p>
                    )}
                    <div className="flex items-center gap-3">
                      <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.08)" }}>
                        <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: pct === 100 ? "var(--primary)" : "rgba(197,163,104,0.6)" }} />
                      </div>
                      <span className="text-xs font-medium shrink-0" style={{ color: pct === 100 ? "var(--primary)" : "var(--muted-foreground)" }}>
                        {phase.done}/{phase.total} ({pct}%)
                      </span>
                    </div>
                  </div>
                  <div className="text-xs opacity-30 shrink-0 mt-1">→</div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
