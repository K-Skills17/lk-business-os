"use server";

import { db } from "@/lib/db";
import { tasks, docs, phases, modules, packages } from "@/lib/db/schema";
import { PHASES, TASKS_BY_PHASE, MODULES, PACKAGES } from "@/lib/seed-data";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function toggleTask(taskId: number, completed: boolean) {
  await db.update(tasks).set({ completed, updatedAt: new Date() }).where(eq(tasks.id, taskId));
  revalidatePath("/", "layout");
}

export async function updateTaskNotes(taskId: number, notes: string) {
  await db.update(tasks).set({ notes, updatedAt: new Date() }).where(eq(tasks.id, taskId));
  revalidatePath("/", "layout");
}

export async function createDoc(data: { section: string; title: string; content: string }) {
  await db.insert(docs).values(data);
  revalidatePath("/docs");
}

export async function updateDoc(docId: number, data: { title?: string; content?: string; section?: string }) {
  await db.update(docs).set({ ...data, updatedAt: new Date() }).where(eq(docs.id, docId));
  revalidatePath("/docs");
}

export async function deleteDoc(docId: number) {
  await db.delete(docs).where(eq(docs.id, docId));
  revalidatePath("/docs");
}

export async function seedDatabase() {
  // Check if already seeded
  const existingPhases = await db.select().from(phases).limit(1);
  if (existingPhases.length > 0) {
    return { success: false, message: "Database already seeded." };
  }

  // Insert phases
  const insertedPhases = await db.insert(phases).values(PHASES).returning();

  // Insert tasks for each phase
  for (const phase of insertedPhases) {
    const phaseTasks = TASKS_BY_PHASE[phase.slug];
    if (phaseTasks && phaseTasks.length > 0) {
      await db.insert(tasks).values(
        phaseTasks.map((t, i) => ({
          phaseId: phase.id,
          text: t.text,
          category: t.category,
          completed: false,
          sortOrder: i,
        }))
      );
    }
  }

  // Insert modules
  await db.insert(modules).values(MODULES);

  // Insert packages
  await db.insert(packages).values(PACKAGES);

  revalidatePath("/", "layout");
  return { success: true, message: "Database seeded successfully." };
}
