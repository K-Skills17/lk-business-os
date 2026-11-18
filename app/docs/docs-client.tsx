"use client";

import { useState } from "react";
import { createDoc, updateDoc, deleteDoc } from "@/lib/actions";

interface Doc {
  id: number;
  section: string;
  title: string;
  content: string;
  createdAt: Date | null;
  updatedAt: Date | null;
}

const SECTIONS = ["Strategy", "SOPs", "Templates", "Research", "Clients", "Other"];

export function DocsClient({ initialDocs }: { initialDocs: Doc[] }) {
  const [docs, setDocs] = useState(initialDocs);
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [selectedDoc, setSelectedDoc] = useState<Doc | null>(null);
  const [creating, setCreating] = useState(false);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ section: "Strategy", title: "", content: "" });
  const [saving, setSaving] = useState(false);

  const sections = SECTIONS;
  const filtered = activeSection ? docs.filter((d) => d.section === activeSection) : docs;

  async function handleCreate() {
    if (!form.title.trim()) return;
    setSaving(true);
    await createDoc(form);
    // Optimistic: reload
    window.location.reload();
  }

  async function handleUpdate() {
    if (!selectedDoc) return;
    setSaving(true);
    await updateDoc(selectedDoc.id, { title: form.title, content: form.content, section: form.section });
    window.location.reload();
  }

  async function handleDelete(id: number) {
    if (!confirm("Delete this document?")) return;
    await deleteDoc(id);
    setSelectedDoc(null);
    setDocs((prev) => prev.filter((d) => d.id !== id));
  }

  function startEdit(doc: Doc) {
    setSelectedDoc(doc);
    setForm({ section: doc.section, title: doc.title, content: doc.content });
    setEditing(true);
    setCreating(false);
  }

  function startCreate() {
    setCreating(true);
    setEditing(false);
    setSelectedDoc(null);
    setForm({ section: activeSection ?? "Strategy", title: "", content: "" });
  }

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="mb-6 flex items-start justify-between">
        <div>
          <div className="text-xs font-medium mb-1 uppercase tracking-widest" style={{ color: "var(--primary)" }}>Knowledge Base</div>
          <h1 className="text-2xl font-semibold">Docs</h1>
          <p className="text-sm mt-1" style={{ color: "var(--muted-foreground)" }}>
            Add and manage documentation as LK Digital grows.
          </p>
        </div>
        <button
          onClick={startCreate}
          className="px-4 py-2 rounded text-sm font-medium transition-opacity hover:opacity-90"
          style={{ background: "var(--primary)", color: "var(--primary-foreground)" }}
        >
          + New Doc
        </button>
      </div>

      <div className="flex gap-6">
        {/* Sidebar */}
        <div className="w-48 shrink-0">
          <div className="mb-2">
            <button
              onClick={() => setActiveSection(null)}
              className="w-full text-left px-3 py-2 rounded text-xs transition-all"
              style={{ background: !activeSection ? "var(--accent)" : "transparent", color: !activeSection ? "var(--primary)" : "var(--muted-foreground)" }}
            >
              All ({docs.length})
            </button>
          </div>
          {sections.map((s) => {
            const count = docs.filter((d) => d.section === s).length;
            return (
              <button
                key={s}
                onClick={() => setActiveSection(s)}
                className="w-full text-left px-3 py-2 rounded text-xs transition-all"
                style={{ background: activeSection === s ? "var(--accent)" : "transparent", color: activeSection === s ? "var(--primary)" : "var(--muted-foreground)" }}
              >
                {s} ({count})
              </button>
            );
          })}
        </div>

        {/* Doc list + content */}
        <div className="flex-1 min-w-0">
          {creating || editing ? (
            <div className="p-5 rounded-lg border" style={{ background: "var(--card)", borderColor: "var(--border)" }}>
              <h2 className="text-sm font-semibold mb-4">{creating ? "New Document" : "Edit Document"}</h2>
              <div className="flex flex-col gap-3">
                <div className="flex gap-3">
                  <div className="flex-1">
                    <label className="text-xs mb-1 block" style={{ color: "var(--muted-foreground)" }}>Title</label>
                    <input
                      value={form.title}
                      onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                      placeholder="Document title..."
                      className="w-full px-3 py-2 rounded text-sm outline-none"
                      style={{ background: "var(--input)", border: "1px solid var(--border)", color: "var(--foreground)" }}
                    />
                  </div>
                  <div className="w-36">
                    <label className="text-xs mb-1 block" style={{ color: "var(--muted-foreground)" }}>Section</label>
                    <select
                      value={form.section}
                      onChange={(e) => setForm((f) => ({ ...f, section: e.target.value }))}
                      className="w-full px-3 py-2 rounded text-sm outline-none"
                      style={{ background: "var(--input)", border: "1px solid var(--border)", color: "var(--foreground)" }}
                    >
                      {sections.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="text-xs mb-1 block" style={{ color: "var(--muted-foreground)" }}>Content</label>
                  <textarea
                    value={form.content}
                    onChange={(e) => setForm((f) => ({ ...f, content: e.target.value }))}
                    placeholder="Write your documentation here..."
                    rows={16}
                    className="w-full px-3 py-2 rounded text-sm outline-none resize-none font-mono"
                    style={{ background: "var(--input)", border: "1px solid var(--border)", color: "var(--foreground)" }}
                  />
                </div>
                <div className="flex gap-2 justify-end">
                  <button
                    onClick={() => { setCreating(false); setEditing(false); }}
                    className="px-4 py-2 rounded text-xs"
                    style={{ color: "var(--muted-foreground)", background: "var(--muted)" }}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={creating ? handleCreate : handleUpdate}
                    disabled={saving}
                    className="px-4 py-2 rounded text-xs font-medium"
                    style={{ background: "var(--primary)", color: "var(--primary-foreground)", opacity: saving ? 0.6 : 1 }}
                  >
                    {saving ? "Saving..." : "Save"}
                  </button>
                </div>
              </div>
            </div>
          ) : selectedDoc ? (
            <div>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <span className="text-xs px-2 py-0.5 rounded mb-2 inline-block" style={{ background: "rgba(197,163,104,0.1)", color: "var(--primary)" }}>
                    {selectedDoc.section}
                  </span>
                  <h2 className="text-lg font-semibold">{selectedDoc.title}</h2>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => startEdit(selectedDoc)} className="text-xs px-3 py-1.5 rounded" style={{ background: "var(--muted)", color: "var(--muted-foreground)" }}>
                    Edit
                  </button>
                  <button onClick={() => handleDelete(selectedDoc.id)} className="text-xs px-3 py-1.5 rounded" style={{ background: "rgba(239,68,68,0.1)", color: "rgb(239,68,68)" }}>
                    Delete
                  </button>
                </div>
              </div>
              <div
                className="p-5 rounded-lg border text-sm leading-relaxed whitespace-pre-wrap"
                style={{ background: "var(--card)", borderColor: "var(--border)", color: "var(--foreground)", fontFamily: "var(--font-geist-mono, monospace)", fontSize: "0.8rem" }}
              >
                {selectedDoc.content}
              </div>
              <button onClick={() => setSelectedDoc(null)} className="mt-4 text-xs" style={{ color: "var(--muted-foreground)" }}>
                ← Back to list
              </button>
            </div>
          ) : (
            <div>
              {filtered.length === 0 ? (
                <div className="text-center py-16" style={{ color: "var(--muted-foreground)" }}>
                  <div className="text-3xl mb-3 opacity-20">◻</div>
                  <div className="text-sm">No documents yet.</div>
                  <button onClick={startCreate} className="mt-3 text-xs hover:opacity-80" style={{ color: "var(--primary)" }}>
                    Create your first doc →
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  {filtered.map((doc) => (
                    <button
                      key={doc.id}
                      onClick={() => setSelectedDoc(doc)}
                      className="w-full text-left p-4 rounded-lg border hover:border-[#c5a368]/30 transition-all"
                      style={{ background: "var(--card)", borderColor: "var(--border)" }}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="min-w-0">
                          <div className="text-xs mb-1" style={{ color: "var(--primary)", opacity: 0.8 }}>{doc.section}</div>
                          <div className="text-sm font-medium">{doc.title}</div>
                          <div className="text-xs mt-1 truncate" style={{ color: "var(--muted-foreground)" }}>
                            {doc.content.slice(0, 80)}...
                          </div>
                        </div>
                        <span className="text-xs shrink-0 opacity-30">→</span>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
