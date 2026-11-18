export const dynamic = "force-dynamic";

import { db } from "@/lib/db";
import { phases, tasks } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import Link from "next/link";
import { TaskItem } from "@/components/task-item";

export default async function PhasePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const [phase] = await db.select().from(phases).where(eq(phases.slug, slug)).limit(1);
  if (!phase) notFound();

  const phaseTasks = await db
    .select()
    .from(tasks)
    .where(eq(tasks.phaseId, phase.id))
    .orderBy(tasks.sortOrder);

  const done = phaseTasks.filter((t) => t.completed).length;
  const total = phaseTasks.length;
  const pct = total > 0 ? Math.round((done / total) * 100) : 0;

  // Group by category
  const categories = Array.from(new Set(phaseTasks.map((t) => t.category ?? "General")));

  // Get all phases for prev/next navigation
  const allPhases = await db.select().from(phases).orderBy(phases.order);
  const currentIndex = allPhases.findIndex((p) => p.slug === slug);
  const prevPhase = currentIndex > 0 ? allPhases[currentIndex - 1] : null;
  const nextPhase = currentIndex < allPhases.length - 1 ? allPhases[currentIndex + 1] : null;

  return (
    <div className="p-8 max-w-3xl mx-auto">
      {/* Back */}
      <Link href="/roadmap" className="inline-flex items-center gap-1 text-xs mb-6 hover:opacity-80 transition-opacity" style={{ color: "var(--muted-foreground)" }}>
        ← All Phases
      </Link>

      {/* Header */}
      <div className="mb-6">
        <div className="text-xs font-medium mb-1 uppercase tracking-widest" style={{ color: "var(--primary)" }}>Phase {phase.order}</div>
        <h1 className="text-xl font-semibold mb-2">{phase.name}</h1>
        {phase.objective && (
          <p className="text-sm mb-1 font-medium" style={{ color: "var(--muted-foreground)" }}>{phase.objective}</p>
        )}
        {phase.description && (
          <p className="text-xs leading-relaxed" style={{ color: "var(--muted-foreground)" }}>{phase.description}</p>
        )}
      </div>

      {/* Progress */}
      <div className="p-4 rounded-lg border mb-8 flex items-center gap-4" style={{ background: "var(--card)", borderColor: "var(--border)" }}>
        <div className="flex-1">
          <div className="flex justify-between text-xs mb-2">
            <span style={{ color: "var(--muted-foreground)" }}>Progress</span>
            <span style={{ color: "var(--primary)" }}>{done}/{total} tasks ({pct}%)</span>
          </div>
          <div className="h-2 rounded-full overflow-hidden" style={{ background: "var(--input)" }}>
            <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: "linear-gradient(90deg, #c5a368, #e8c88a)" }} />
          </div>
        </div>
      </div>

      {/* Tasks by category */}
      <div className="flex flex-col gap-6">
        {categories.map((category) => {
          const categoryTasks = phaseTasks.filter((t) => (t.category ?? "General") === category);
          const catDone = categoryTasks.filter((t) => t.completed).length;
          return (
            <div key={category}>
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--muted-foreground)" }}>
                  {category}
                </h2>
                <span className="text-[10px]" style={{ color: "var(--muted-foreground)" }}>
                  {catDone}/{categoryTasks.length}
                </span>
              </div>
              <div className="flex flex-col gap-1.5">
                {categoryTasks.map((task) => (
                  <TaskItem
                    key={task.id}
                    id={task.id}
                    text={task.text}
                    completed={task.completed}
                    category={task.category ?? "General"}
                    notes={task.notes}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Prev / Next */}
      <div className="flex justify-between mt-10 pt-6 border-t" style={{ borderColor: "var(--border)" }}>
        {prevPhase ? (
          <Link href={`/roadmap/${prevPhase.slug}`} className="text-xs hover:opacity-80 transition-opacity" style={{ color: "var(--muted-foreground)" }}>
            ← Phase {prevPhase.order}
          </Link>
        ) : <div />}
        {nextPhase ? (
          <Link href={`/roadmap/${nextPhase.slug}`} className="text-xs hover:opacity-80 transition-opacity" style={{ color: "var(--muted-foreground)" }}>
            Phase {nextPhase.order} →
          </Link>
        ) : <div />}
      </div>
    </div>
  );
}
