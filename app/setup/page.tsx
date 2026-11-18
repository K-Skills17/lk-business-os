"use client";

import { useState } from "react";
import { seedDatabase } from "@/lib/actions";

export default function SetupPage() {
  const [seeding, setSeeding] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);

  async function handleSeed() {
    setSeeding(true);
    try {
      const res = await seedDatabase();
      setResult(res);
    } catch (e) {
      setResult({ success: false, message: `Error: ${e instanceof Error ? e.message : "Unknown error"}` });
    }
    setSeeding(false);
  }

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <div className="mb-8">
        <div className="text-xs font-medium mb-1 uppercase tracking-widest" style={{ color: "var(--primary)" }}>Configuration</div>
        <h1 className="text-2xl font-semibold">Setup</h1>
        <p className="text-sm mt-1" style={{ color: "var(--muted-foreground)" }}>
          Connect your Neon database and seed all blueprint data.
        </p>
      </div>

      {/* Step 1 — Neon */}
      <div className="mb-6 p-5 rounded-lg border" style={{ background: "var(--card)", borderColor: "var(--border)" }}>
        <div className="flex items-center gap-2 mb-3">
          <span className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold shrink-0" style={{ background: "var(--primary)", color: "var(--primary-foreground)" }}>1</span>
          <h2 className="text-sm font-semibold">Create a Neon database</h2>
        </div>
        <ol className="text-xs space-y-1.5" style={{ color: "var(--muted-foreground)" }}>
          <li>1. Go to <strong style={{ color: "var(--foreground)" }}>neon.tech</strong> and sign up (free tier available)</li>
          <li>2. Create a new project (any name, e.g. &quot;lk-business-os&quot;)</li>
          <li>3. Copy the <strong style={{ color: "var(--foreground)" }}>connection string</strong> from the dashboard</li>
        </ol>
      </div>

      {/* Step 2 — .env.local */}
      <div className="mb-6 p-5 rounded-lg border" style={{ background: "var(--card)", borderColor: "var(--border)" }}>
        <div className="flex items-center gap-2 mb-3">
          <span className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold shrink-0" style={{ background: "var(--primary)", color: "var(--primary-foreground)" }}>2</span>
          <h2 className="text-sm font-semibold">Add to .env.local</h2>
        </div>
        <p className="text-xs mb-2" style={{ color: "var(--muted-foreground)" }}>
          Create a file called <code className="px-1 py-0.5 rounded text-[11px]" style={{ background: "rgba(255,255,255,0.08)" }}>.env.local</code> in the project root with:
        </p>
        <div className="p-3 rounded font-mono text-xs" style={{ background: "rgba(0,0,0,0.3)", border: "1px solid var(--border)", color: "#e8c88a" }}>
          DATABASE_URL=&quot;postgresql://...your-neon-connection-string...&quot;
        </div>
      </div>

      {/* Step 3 — Run migrations */}
      <div className="mb-6 p-5 rounded-lg border" style={{ background: "var(--card)", borderColor: "var(--border)" }}>
        <div className="flex items-center gap-2 mb-3">
          <span className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold shrink-0" style={{ background: "var(--primary)", color: "var(--primary-foreground)" }}>3</span>
          <h2 className="text-sm font-semibold">Run database migrations</h2>
        </div>
        <p className="text-xs mb-2" style={{ color: "var(--muted-foreground)" }}>
          Run this command in the project directory to create the tables:
        </p>
        <div className="p-3 rounded font-mono text-xs" style={{ background: "rgba(0,0,0,0.3)", border: "1px solid var(--border)", color: "#e8c88a" }}>
          pnpm drizzle-kit push
        </div>
      </div>

      {/* Step 4 — Seed */}
      <div className="mb-6 p-5 rounded-lg border" style={{ background: "var(--card)", borderColor: "var(--border)" }}>
        <div className="flex items-center gap-2 mb-3">
          <span className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold shrink-0" style={{ background: "var(--primary)", color: "var(--primary-foreground)" }}>4</span>
          <h2 className="text-sm font-semibold">Seed the database</h2>
        </div>
        <p className="text-xs mb-4" style={{ color: "var(--muted-foreground)" }}>
          This will populate all 9 phases, 220+ tasks, 7 OS modules, and 3 service packages from the LK Dentista OS blueprint.
        </p>

        {result && (
          <div
            className="mb-4 px-4 py-3 rounded text-xs"
            style={{
              background: result.success ? "rgba(197,163,104,0.1)" : "rgba(239,68,68,0.1)",
              border: `1px solid ${result.success ? "rgba(197,163,104,0.3)" : "rgba(239,68,68,0.3)"}`,
              color: result.success ? "var(--primary)" : "rgb(239,68,68)",
            }}
          >
            {result.message}
          </div>
        )}

        <button
          onClick={handleSeed}
          disabled={seeding || result?.success}
          className="px-5 py-2.5 rounded text-sm font-medium transition-opacity"
          style={{ background: "var(--primary)", color: "var(--primary-foreground)", opacity: seeding || result?.success ? 0.5 : 1 }}
        >
          {seeding ? "Seeding..." : result?.success ? "Database seeded" : "Seed Database"}
        </button>
      </div>

      {/* Desktop launcher reminder */}
      <div className="p-5 rounded-lg border" style={{ background: "rgba(197,163,104,0.04)", borderColor: "rgba(197,163,104,0.15)" }}>
        <div className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: "var(--primary)" }}>Desktop Launcher</div>
        <p className="text-xs leading-relaxed" style={{ color: "var(--muted-foreground)" }}>
          A <code className="px-1 py-0.5 rounded text-[11px]" style={{ background: "rgba(255,255,255,0.08)" }}>start.bat</code> file has been created in your project root.
          Double-click it (or pin it to your taskbar) to start the app and open it in your browser with one click.
        </p>
      </div>
    </div>
  );
}
