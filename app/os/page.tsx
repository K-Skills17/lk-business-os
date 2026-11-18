export const dynamic = "force-dynamic";

import { db } from "@/lib/db";
import { modules } from "@/lib/db/schema";

export default async function OSPage() {
  const allModules = await db.select().from(modules).orderBy(modules.order).catch(() => []);

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="mb-8">
        <div className="text-xs font-medium mb-1 uppercase tracking-widest" style={{ color: "var(--primary)" }}>Architecture</div>
        <h1 className="text-2xl font-semibold">LK Dentista OS</h1>
        <p className="text-sm mt-2 leading-relaxed max-w-2xl" style={{ color: "var(--muted-foreground)" }}>
          The operating system for predictable, scalable patient acquisition for high-value dental clinics.
          Seven interconnected modules that form one complete growth system.
        </p>
      </div>

      {/* Module flow */}
      <div className="flex items-center gap-1 mb-8 overflow-x-auto pb-2">
        {allModules.map((mod, i) => (
          <div key={mod.id} className="flex items-center gap-1 shrink-0">
            <div
              className="text-[10px] px-2.5 py-1.5 rounded font-medium whitespace-nowrap"
              style={{ background: "rgba(197,163,104,0.1)", color: "var(--primary)", border: "1px solid rgba(197,163,104,0.2)" }}
            >
              {mod.order}. {mod.name.split(" ")[0]}
            </div>
            {i < allModules.length - 1 && <span style={{ color: "var(--muted-foreground)", opacity: 0.4 }}>→</span>}
          </div>
        ))}
      </div>

      {/* Modules */}
      <div className="flex flex-col gap-4">
        {allModules.map((mod) => {
          const components = mod.components as string[];
          const metrics = mod.metrics as string[];
          return (
            <div key={mod.id} className="rounded-lg border overflow-hidden" style={{ background: "var(--card)", borderColor: "var(--border)" }}>
              <div className="px-5 py-4 border-b flex items-center gap-3" style={{ borderColor: "var(--border)" }}>
                <div
                  className="w-8 h-8 rounded flex items-center justify-center text-xs font-bold shrink-0"
                  style={{ background: "rgba(197,163,104,0.15)", color: "var(--primary)" }}
                >
                  {mod.order}
                </div>
                <div>
                  <div className="text-sm font-semibold">{mod.name}</div>
                  <div className="text-xs mt-0.5" style={{ color: "var(--muted-foreground)" }}>{mod.purpose}</div>
                </div>
              </div>
              <div className="grid grid-cols-2 divide-x" style={{ borderColor: "var(--border)" }}>
                <div className="p-4">
                  <div className="text-[10px] font-semibold uppercase tracking-wider mb-2.5" style={{ color: "var(--muted-foreground)" }}>
                    Components
                  </div>
                  <ul className="flex flex-col gap-1.5">
                    {components.map((c, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs" style={{ color: "var(--foreground)" }}>
                        <span style={{ color: "var(--primary)", opacity: 0.6, marginTop: "1px" }}>·</span>
                        {c}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="p-4">
                  <div className="text-[10px] font-semibold uppercase tracking-wider mb-2.5" style={{ color: "var(--muted-foreground)" }}>
                    Metrics
                  </div>
                  <ul className="flex flex-col gap-1.5">
                    {metrics.map((m, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs" style={{ color: "var(--muted-foreground)" }}>
                        <span style={{ color: "var(--primary)", opacity: 0.6, marginTop: "1px" }}>◈</span>
                        {m}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Principle box */}
      <div className="mt-8 p-5 rounded-lg border" style={{ background: "rgba(197,163,104,0.04)", borderColor: "rgba(197,163,104,0.2)" }}>
        <div className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: "var(--primary)" }}>Core Principle</div>
        <p className="text-sm leading-relaxed" style={{ color: "var(--muted-foreground)" }}>
          The competitive advantage is not the chatbot, landing page, CRM, or AI model individually.
          It is LK Digital&apos;s ability to connect all of them into one operating system, operate it consistently,
          and demonstrate what is improving in the client&apos;s business.
        </p>
      </div>
    </div>
  );
}
