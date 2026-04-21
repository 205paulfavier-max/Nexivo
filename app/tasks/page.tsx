"use client";

import { useEffect, useMemo, useState } from "react";
import { Plus, Pencil, Trash2, Calendar } from "lucide-react";
import clsx from "clsx";
import { useCrm } from "@/lib/store";
import type { Task, TaskPriority, TaskStatus } from "@/lib/types";
import { PageHeader } from "../components/PageHeader";
import { Modal } from "../components/Modal";
import { EmptyState } from "../components/EmptyState";
import { daysUntil, formatDateShort } from "@/lib/format";

const STATUS_LABEL: Record<TaskStatus, string> = {
  a_faire: "À faire",
  en_cours: "En cours",
  termine: "Terminé",
};

const PRIORITY_LABEL: Record<TaskPriority, string> = {
  basse: "Basse",
  moyenne: "Moyenne",
  haute: "Haute",
};

const PRIORITY_COLOR: Record<TaskPriority, string> = {
  basse: "bg-nexivo-gray/10 text-nexivo-gray",
  moyenne: "bg-nexivo-blue/10 text-nexivo-blue",
  haute: "bg-nexivo-red/10 text-nexivo-red",
};

export default function TasksPage() {
  const { state, addTask, updateTask, deleteTask } = useCrm();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Task | null>(null);
  const [statusFilter, setStatusFilter] = useState<TaskStatus | "all">("all");

  const filtered = useMemo(() => {
    const list =
      statusFilter === "all"
        ? state.tasks
        : state.tasks.filter((t) => t.status === statusFilter);
    return [...list].sort((a, b) => {
      const ad = a.dueDate ?? "9999";
      const bd = b.dueDate ?? "9999";
      return ad.localeCompare(bd);
    });
  }, [state.tasks, statusFilter]);

  const counts = {
    a_faire: state.tasks.filter((t) => t.status === "a_faire").length,
    en_cours: state.tasks.filter((t) => t.status === "en_cours").length,
    termine: state.tasks.filter((t) => t.status === "termine").length,
  };

  function openCreate() {
    setEditing(null);
    setOpen(true);
  }

  return (
    <div>
      <PageHeader
        title="Tâches"
        subtitle={`${counts.a_faire} à faire · ${counts.en_cours} en cours · ${counts.termine} terminées.`}
        actions={
          <button className="btn-primary" onClick={openCreate}>
            <Plus className="h-4 w-4" /> Nouvelle tâche
          </button>
        }
      />

      <div className="card mb-4 flex flex-wrap items-center gap-2 p-3">
        {(["all", "a_faire", "en_cours", "termine"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setStatusFilter(f)}
            className={clsx(
              "rounded-full px-3 py-1 text-xs font-medium transition-colors",
              statusFilter === f
                ? "bg-nexivo-black text-white"
                : "bg-nexivo-surface text-nexivo-gray hover:bg-nexivo-border"
            )}
          >
            {f === "all" ? "Toutes" : STATUS_LABEL[f]}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          title="Aucune tâche"
          description="Organisez votre travail en créant une tâche."
          action={
            <button className="btn-primary" onClick={openCreate}>
              <Plus className="h-4 w-4" /> Créer une tâche
            </button>
          }
        />
      ) : (
        <div className="card divide-y divide-nexivo-border">
          {filtered.map((t) => {
            const contact = state.contacts.find((c) => c.id === t.contactId);
            const deal = state.deals.find((d) => d.id === t.dealId);
            const due = daysUntil(t.dueDate);
            const isOverdue = due !== null && due < 0 && t.status !== "termine";
            return (
              <div
                key={t.id}
                className="flex items-start gap-3 px-4 py-3 hover:bg-nexivo-surface/50"
              >
                <button
                  onClick={() =>
                    updateTask(t.id, {
                      status: t.status === "termine" ? "a_faire" : "termine",
                    })
                  }
                  className={clsx(
                    "mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full border-2 transition-colors",
                    t.status === "termine"
                      ? "border-nexivo-blue bg-nexivo-blue text-white"
                      : "border-nexivo-border hover:border-nexivo-blue"
                  )}
                  aria-label="Basculer l'état"
                >
                  {t.status === "termine" && (
                    <svg viewBox="0 0 12 12" className="h-3 w-3">
                      <path
                        d="M2 6l3 3 5-5"
                        stroke="currentColor"
                        strokeWidth="2"
                        fill="none"
                        strokeLinecap="round"
                      />
                    </svg>
                  )}
                </button>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p
                      className={clsx(
                        "text-sm font-medium",
                        t.status === "termine"
                          ? "text-nexivo-gray line-through"
                          : "text-nexivo-ink"
                      )}
                    >
                      {t.title}
                    </p>
                    <span
                      className={
                        "badge " + PRIORITY_COLOR[t.priority]
                      }
                    >
                      {PRIORITY_LABEL[t.priority]}
                    </span>
                    <span className="badge bg-nexivo-surface text-nexivo-gray">
                      {STATUS_LABEL[t.status]}
                    </span>
                  </div>
                  {t.description && (
                    <p className="mt-1 text-xs text-nexivo-gray">
                      {t.description}
                    </p>
                  )}
                  <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-nexivo-gray">
                    {t.dueDate && (
                      <span
                        className={clsx(
                          "flex items-center gap-1",
                          isOverdue && "text-nexivo-red"
                        )}
                      >
                        <Calendar className="h-3 w-3" />
                        {formatDateShort(t.dueDate)}
                        {isOverdue && " (retard)"}
                      </span>
                    )}
                    {contact && (
                      <span>
                        👤 {contact.firstName} {contact.lastName}
                      </span>
                    )}
                    {deal && <span>💼 {deal.title}</span>}
                  </div>
                </div>
                <div className="flex gap-1">
                  <button
                    className="btn-ghost"
                    onClick={() => {
                      setEditing(t);
                      setOpen(true);
                    }}
                    aria-label="Modifier"
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button
                    className="btn-ghost text-nexivo-red hover:bg-nexivo-red/10"
                    onClick={() => {
                      if (confirm(`Supprimer la tâche "${t.title}" ?`)) {
                        deleteTask(t.id);
                      }
                    }}
                    aria-label="Supprimer"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <TaskFormModal
        open={open}
        onClose={() => setOpen(false)}
        task={editing}
        onSave={(data) => {
          if (editing) {
            updateTask(editing.id, data);
          } else {
            addTask(data);
          }
          setOpen(false);
        }}
      />
    </div>
  );
}

function TaskFormModal({
  open,
  onClose,
  task,
  onSave,
}: {
  open: boolean;
  onClose: () => void;
  task: Task | null;
  onSave: (data: Omit<Task, "id" | "createdAt">) => void;
}) {
  const { state } = useCrm();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<TaskStatus>("a_faire");
  const [priority, setPriority] = useState<TaskPriority>("moyenne");
  const [dueDate, setDueDate] = useState("");
  const [contactId, setContactId] = useState("");
  const [dealId, setDealId] = useState("");

  useEffect(() => {
    if (open) {
      setTitle(task?.title ?? "");
      setDescription(task?.description ?? "");
      setStatus(task?.status ?? "a_faire");
      setPriority(task?.priority ?? "moyenne");
      setDueDate(task?.dueDate ? task.dueDate.slice(0, 10) : "");
      setContactId(task?.contactId ?? "");
      setDealId(task?.dealId ?? "");
    }
  }, [open, task]);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;
    onSave({
      title: title.trim(),
      description: description.trim() || undefined,
      status,
      priority,
      dueDate: dueDate ? new Date(dueDate).toISOString() : undefined,
      contactId: contactId || undefined,
      dealId: dealId || undefined,
    });
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={task ? "Modifier la tâche" : "Nouvelle tâche"}
      footer={
        <>
          <button type="button" className="btn-outline" onClick={onClose}>
            Annuler
          </button>
          <button type="submit" form="task-form" className="btn-primary">
            Enregistrer
          </button>
        </>
      }
    >
      <form id="task-form" onSubmit={submit} className="space-y-4">
        <div>
          <label className="label">Intitulé *</label>
          <input
            required
            className="input"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div>
          <label className="label">Description</label>
          <textarea
            className="input min-h-[70px]"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="label">Statut</label>
            <select
              className="input"
              value={status}
              onChange={(e) => setStatus(e.target.value as TaskStatus)}
            >
              <option value="a_faire">À faire</option>
              <option value="en_cours">En cours</option>
              <option value="termine">Terminé</option>
            </select>
          </div>
          <div>
            <label className="label">Priorité</label>
            <select
              className="input"
              value={priority}
              onChange={(e) => setPriority(e.target.value as TaskPriority)}
            >
              <option value="basse">Basse</option>
              <option value="moyenne">Moyenne</option>
              <option value="haute">Haute</option>
            </select>
          </div>
          <div>
            <label className="label">Échéance</label>
            <input
              type="date"
              className="input"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="label">Contact lié</label>
            <select
              className="input"
              value={contactId}
              onChange={(e) => setContactId(e.target.value)}
            >
              <option value="">— Aucun —</option>
              {state.contacts.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.firstName} {c.lastName}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="label">Deal lié</label>
            <select
              className="input"
              value={dealId}
              onChange={(e) => setDealId(e.target.value)}
            >
              <option value="">— Aucun —</option>
              {state.deals.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.title}
                </option>
              ))}
            </select>
          </div>
        </div>
      </form>
    </Modal>
  );
}
