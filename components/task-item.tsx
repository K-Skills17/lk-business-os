"use client";

import { useState } from "react";
import { toggleTask, updateTaskNotes } from "@/lib/actions";

interface TaskItemProps {
  id: number;
  text: string;
  completed: boolean;
  category: string;
  notes: string | null;
}

export function TaskItem({ id, text, completed, notes }: TaskItemProps) {
  const [expanded, setExpanded] = useState(false);
  const [noteValue, setNoteValue] = useState(notes ?? "");
  const [saving, setSaving] = useState(false);

  async function handleToggle() {
    await toggleTask(id, !completed);
  }

  async function handleSaveNote() {
    setSaving(true);
    await updateTaskNotes(id, noteValue);
    setSaving(false);
    setExpanded(false);
  }

  return (
    <div
      className="rounded border transition-all"
      style={{
        background: completed ? "rgba(197,163,104,0.04)" : "var(--surface, #131316)",
        borderColor: completed ? "rgba(197,163,104,0.2)" : "var(--border)",
      }}
    >
      <div className="flex items-start gap-3 p-3">
        <button
          onClick={handleToggle}
          className="mt-0.5 w-4 h-4 rounded shrink-0 border flex items-center justify-center transition-all"
          style={{
            background: completed ? "var(--primary)" : "transparent",
            borderColor: completed ? "var(--primary)" : "rgba(255,255,255,0.2)",
          }}
          aria-label="Toggle task"
        >
          {completed && (
            <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
              <path d="M1 4L3.5 6.5L9 1" stroke="#0c0c0e" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
        </button>

        <span
          className="flex-1 text-sm leading-snug cursor-pointer"
          style={{
            color: completed ? "var(--muted-foreground)" : "var(--foreground)",
            textDecoration: completed ? "line-through" : "none",
            opacity: completed ? 0.6 : 1,
          }}
          onClick={() => setExpanded(!expanded)}
        >
          {text}
        </span>

        {notes && !expanded && (
          <span
            className="text-[10px] px-1.5 py-0.5 rounded shrink-0"
            style={{ background: "rgba(197,163,104,0.1)", color: "var(--primary)" }}
          >
            note
          </span>
        )}

        <button
          onClick={() => setExpanded(!expanded)}
          className="text-xs shrink-0 opacity-30 hover:opacity-60 transition-opacity"
          style={{ color: "var(--muted-foreground)" }}
        >
          {expanded ? "▲" : "▼"}
        </button>
      </div>

      {expanded && (
        <div className="px-3 pb-3 flex flex-col gap-2" style={{ borderTop: "1px solid var(--border)" }}>
          <textarea
            value={noteValue}
            onChange={(e) => setNoteValue(e.target.value)}
            placeholder="Add a note..."
            rows={3}
            className="w-full mt-2 text-xs p-2 rounded resize-none outline-none"
            style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid var(--border)",
              color: "var(--foreground)",
            }}
          />
          <div className="flex gap-2 justify-end">
            <button
              onClick={() => setExpanded(false)}
              className="text-xs px-3 py-1 rounded"
              style={{ color: "var(--muted-foreground)", background: "transparent" }}
            >
              Cancel
            </button>
            <button
              onClick={handleSaveNote}
              disabled={saving}
              className="text-xs px-3 py-1 rounded transition-opacity"
              style={{ background: "var(--primary)", color: "var(--primary-foreground)", opacity: saving ? 0.6 : 1 }}
            >
              {saving ? "Saving..." : "Save Note"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
