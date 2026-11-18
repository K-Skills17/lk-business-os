"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const nav = [
  { href: "/", label: "Dashboard", icon: "◈" },
  { href: "/roadmap", label: "Roadmap", icon: "◎" },
  { href: "/os", label: "LK Dentista OS", icon: "⬡" },
  { href: "/packages", label: "Packages", icon: "◇" },
  { href: "/docs", label: "Docs", icon: "◻" },
  { href: "/setup", label: "Setup", icon: "⚙" },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside
      className="w-56 h-full flex flex-col shrink-0 border-r"
      style={{
        background: "var(--sidebar)",
        borderColor: "var(--sidebar-border)",
      }}
    >
      {/* Logo */}
      <div className="px-5 py-5 border-b" style={{ borderColor: "var(--sidebar-border)" }}>
        <div className="flex items-center gap-2.5">
          <span
            className="w-7 h-7 rounded flex items-center justify-center text-xs font-bold shrink-0"
            style={{ background: "var(--primary)", color: "var(--primary-foreground)" }}
          >
            LK
          </span>
          <div>
            <div className="text-sm font-semibold leading-none" style={{ color: "var(--primary)" }}>
              LK Digital
            </div>
            <div className="text-[10px] mt-0.5" style={{ color: "var(--muted-foreground)" }}>
              Business OS
            </div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 flex flex-col gap-0.5">
        {nav.map((item) => {
          const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 px-3 py-2 rounded text-sm transition-all"
              style={{
                background: active ? "var(--sidebar-accent)" : "transparent",
                color: active ? "var(--sidebar-primary)" : "var(--sidebar-foreground)",
                opacity: active ? 1 : 0.65,
              }}
            >
              <span className="text-base w-4 text-center leading-none">{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-5 py-4 border-t" style={{ borderColor: "var(--sidebar-border)" }}>
        <div className="text-[10px]" style={{ color: "var(--muted-foreground)" }}>
          LK Digital © 2026
        </div>
      </div>
    </aside>
  );
}
