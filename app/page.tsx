"use client";

import Link from "next/link";
import {
  TrendingUp,
  Users,
  Handshake,
  CheckSquare,
  Clock,
  ArrowRight,
} from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useCrm } from "@/lib/store";
import { DEAL_STAGES } from "@/lib/types";
import { formatCurrency, formatDateShort } from "@/lib/format";
import { PageHeader } from "./components/PageHeader";

const STAGE_COLORS: Record<string, string> = {
  nouveau: "#3B82F6",
  qualifie: "#1D4ED8",
  proposition: "#0B2A7A",
  negociation: "#DC2626",
  gagne: "#16A34A",
  perdu: "#6B7280",
};

export default function DashboardPage() {
  const { state } = useCrm();

  const openDeals = state.deals.filter(
    (d) => d.stage !== "gagne" && d.stage !== "perdu"
  );
  const wonDeals = state.deals.filter((d) => d.stage === "gagne");
  const pipelineValue = openDeals.reduce((s, d) => s + d.amount, 0);
  const weightedValue = openDeals.reduce(
    (s, d) => s + (d.amount * d.probability) / 100,
    0
  );
  const wonValue = wonDeals.reduce((s, d) => s + d.amount, 0);
  const openTasks = state.tasks.filter((t) => t.status !== "termine");

  const pipelineByStage = DEAL_STAGES.filter(
    (s) => s.id !== "gagne" && s.id !== "perdu"
  ).map((s) => {
    const deals = state.deals.filter((d) => d.stage === s.id);
    return {
      stage: s.label,
      value: deals.reduce((sum, d) => sum + d.amount, 0),
      count: deals.length,
      fill: STAGE_COLORS[s.id],
    };
  });

  const stageBreakdown = DEAL_STAGES.map((s) => ({
    name: s.label,
    value: state.deals.filter((d) => d.stage === s.id).length,
    fill: STAGE_COLORS[s.id],
  })).filter((d) => d.value > 0);

  const upcomingTasks = [...openTasks]
    .sort((a, b) => (a.dueDate ?? "").localeCompare(b.dueDate ?? ""))
    .slice(0, 5);

  const recentDeals = [...state.deals]
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
    .slice(0, 5);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Tableau de bord"
        subtitle="Vue d'ensemble du pipeline commercial Nexivo."
      />

      {/* KPIs */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard
          icon={<TrendingUp className="h-5 w-5" />}
          label="Pipeline ouvert"
          value={formatCurrency(pipelineValue)}
          accent="blue"
          sub={`${openDeals.length} deal(s) en cours`}
        />
        <KpiCard
          icon={<Handshake className="h-5 w-5" />}
          label="Prévision pondérée"
          value={formatCurrency(weightedValue)}
          accent="ink"
          sub="Montant × probabilité"
        />
        <KpiCard
          icon={<CheckSquare className="h-5 w-5" />}
          label="Affaires gagnées"
          value={formatCurrency(wonValue)}
          accent="red"
          sub={`${wonDeals.length} deal(s) signé(s)`}
        />
        <KpiCard
          icon={<Users className="h-5 w-5" />}
          label="Contacts actifs"
          value={String(state.contacts.length)}
          accent="blueDark"
          sub={`${state.companies.length} sociétés`}
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <div className="card p-5 xl:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-nexivo-ink">
                Pipeline par étape
              </h3>
              <p className="text-xs text-nexivo-gray">
                Valeur cumulée des deals ouverts.
              </p>
            </div>
            <Link
              href="/deals"
              className="inline-flex items-center gap-1 text-xs font-medium text-nexivo-blue hover:text-nexivo-blue-dark"
            >
              Voir le pipeline <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={pipelineByStage}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis
                  dataKey="stage"
                  stroke="#6B7280"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="#6B7280"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`}
                />
                <Tooltip
                  formatter={(v: number) => formatCurrency(v)}
                  contentStyle={{
                    borderRadius: 8,
                    border: "1px solid #E5E7EB",
                  }}
                />
                <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                  {pipelineByStage.map((entry, i) => (
                    <Cell key={i} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card p-5">
          <h3 className="text-sm font-semibold text-nexivo-ink">
            Répartition des deals
          </h3>
          <p className="text-xs text-nexivo-gray">Toutes étapes confondues.</p>
          <div className="mt-4 h-64">
            {stageBreakdown.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Tooltip
                    contentStyle={{
                      borderRadius: 8,
                      border: "1px solid #E5E7EB",
                    }}
                  />
                  <Legend
                    verticalAlign="bottom"
                    height={36}
                    iconType="circle"
                    wrapperStyle={{ fontSize: 12 }}
                  />
                  <Pie
                    data={stageBreakdown}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={50}
                    outerRadius={85}
                    paddingAngle={2}
                  >
                    {stageBreakdown.map((entry, i) => (
                      <Cell key={i} fill={entry.fill} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-sm text-nexivo-gray">Aucun deal.</p>
            )}
          </div>
        </div>
      </div>

      {/* Lists */}
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        <div className="card p-5">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-nexivo-ink">
              Tâches à venir
            </h3>
            <Link
              href="/tasks"
              className="inline-flex items-center gap-1 text-xs font-medium text-nexivo-blue hover:text-nexivo-blue-dark"
            >
              Tout voir <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          {upcomingTasks.length === 0 ? (
            <p className="text-sm text-nexivo-gray">Aucune tâche en attente.</p>
          ) : (
            <ul className="divide-y divide-nexivo-border">
              {upcomingTasks.map((t) => (
                <li key={t.id} className="flex items-center gap-3 py-3">
                  <span
                    className={
                      "h-2.5 w-2.5 flex-shrink-0 rounded-full " +
                      (t.priority === "haute"
                        ? "bg-nexivo-red"
                        : t.priority === "moyenne"
                        ? "bg-nexivo-blue"
                        : "bg-nexivo-gray")
                    }
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-nexivo-ink">
                      {t.title}
                    </p>
                    <p className="text-xs text-nexivo-gray">
                      Priorité {t.priority}
                    </p>
                  </div>
                  <span className="flex items-center gap-1 text-xs text-nexivo-gray">
                    <Clock className="h-3 w-3" />
                    {formatDateShort(t.dueDate)}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="card p-5">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-nexivo-ink">
              Deals récents
            </h3>
            <Link
              href="/deals"
              className="inline-flex items-center gap-1 text-xs font-medium text-nexivo-blue hover:text-nexivo-blue-dark"
            >
              Pipeline <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          {recentDeals.length === 0 ? (
            <p className="text-sm text-nexivo-gray">Aucun deal enregistré.</p>
          ) : (
            <ul className="divide-y divide-nexivo-border">
              {recentDeals.map((d) => {
                const company = state.companies.find((c) => c.id === d.companyId);
                return (
                  <li
                    key={d.id}
                    className="flex items-center gap-3 py-3"
                  >
                    <div
                      className="h-2 w-2 flex-shrink-0 rounded-full"
                      style={{ backgroundColor: STAGE_COLORS[d.stage] }}
                    />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-nexivo-ink">
                        {d.title}
                      </p>
                      <p className="truncate text-xs text-nexivo-gray">
                        {company?.name ?? "Sans société"} ·{" "}
                        {DEAL_STAGES.find((s) => s.id === d.stage)?.label}
                      </p>
                    </div>
                    <span className="text-sm font-semibold text-nexivo-ink">
                      {formatCurrency(d.amount, d.currency)}
                    </span>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

function KpiCard({
  icon,
  label,
  value,
  sub,
  accent,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  sub?: string;
  accent: "blue" | "red" | "ink" | "blueDark";
}) {
  const accents = {
    blue: "bg-nexivo-blue/10 text-nexivo-blue",
    red: "bg-nexivo-red/10 text-nexivo-red",
    ink: "bg-nexivo-ink/10 text-nexivo-ink",
    blueDark: "bg-nexivo-blue-dark/10 text-nexivo-blue-dark",
  } as const;
  return (
    <div className="card relative overflow-hidden p-5">
      <span className="absolute inset-x-0 top-0 h-1 bg-nexivo-stripe" />
      <div className="flex items-center gap-3">
        <div
          className={`flex h-10 w-10 items-center justify-center rounded-lg ${accents[accent]}`}
        >
          {icon}
        </div>
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-nexivo-gray">
            {label}
          </p>
          <p className="text-xl font-bold text-nexivo-ink">{value}</p>
        </div>
      </div>
      {sub && <p className="mt-3 text-xs text-nexivo-gray">{sub}</p>}
    </div>
  );
}
