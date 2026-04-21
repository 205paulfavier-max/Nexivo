"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import {
  LayoutDashboard,
  Users,
  Building2,
  Handshake,
  CheckSquare,
  RotateCcw,
  Bell,
  Search,
} from "lucide-react";
import { Logo } from "./Logo";
import { useCrm } from "@/lib/store";

const NAV = [
  { href: "/", label: "Tableau de bord", icon: LayoutDashboard },
  { href: "/contacts", label: "Contacts", icon: Users },
  { href: "/companies", label: "Sociétés", icon: Building2 },
  { href: "/deals", label: "Pipeline", icon: Handshake },
  { href: "/tasks", label: "Tâches", icon: CheckSquare },
];

export function Shell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { resetDemo, state, loaded } = useCrm();

  const openTasks = state.tasks.filter((t) => t.status !== "termine").length;

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="sticky top-0 hidden h-screen w-64 flex-shrink-0 flex-col bg-nexivo-black text-white md:flex">
        <div className="flex items-center gap-3 px-5 py-6">
          <Logo variant="dark" />
        </div>
        <div className="nexivo-stripe mx-5" />
        <nav className="mt-4 flex-1 space-y-1 px-3">
          {NAV.map((item) => {
            const active =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={clsx("nav-link", active && "nav-link-active")}
              >
                <Icon className="h-4 w-4" />
                <span>{item.label}</span>
                {item.href === "/tasks" && openTasks > 0 && (
                  <span className="ml-auto rounded-full bg-nexivo-red px-2 py-0.5 text-[10px] font-bold">
                    {openTasks}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
        <div className="px-5 py-5 text-xs text-white/50">
          <button
            onClick={() => {
              if (confirm("Réinitialiser les données de démonstration ?")) {
                resetDemo();
              }
            }}
            className="flex items-center gap-2 text-white/60 hover:text-white"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Recharger la démo
          </button>
          <p className="mt-3 text-white/30">
            © {new Date().getFullYear()} Nexivo — CRM interne
          </p>
        </div>
      </aside>

      {/* Main */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Top bar */}
        <header className="sticky top-0 z-20 flex items-center gap-3 border-b border-nexivo-border bg-white/90 px-4 py-3 backdrop-blur md:px-8">
          <div className="md:hidden">
            <Logo variant="light" />
          </div>
          <div className="relative ml-auto hidden max-w-sm flex-1 md:block">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-nexivo-gray" />
            <input
              className="input pl-9"
              placeholder="Rechercher contacts, deals, sociétés…"
              onChange={() => {
                /* TODO: brancher la recherche globale */
              }}
            />
          </div>
          <button className="btn-ghost relative" aria-label="Notifications">
            <Bell className="h-4 w-4" />
            {openTasks > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-nexivo-red px-1 text-[10px] font-bold text-white">
                {openTasks}
              </span>
            )}
          </button>
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-nexivo-blue text-sm font-semibold text-white">
              NX
            </div>
            <div className="hidden text-sm leading-tight md:block">
              <p className="font-semibold text-nexivo-ink">Équipe Nexivo</p>
              <p className="text-xs text-nexivo-gray">Compte administrateur</p>
            </div>
          </div>
        </header>

        <main className="flex-1 px-4 py-6 md:px-8 md:py-8">
          {loaded ? children : (
            <div className="flex h-64 items-center justify-center text-sm text-nexivo-gray">
              Chargement…
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
