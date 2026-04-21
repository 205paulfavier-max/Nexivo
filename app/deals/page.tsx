"use client";

import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, Calendar, Euro } from "lucide-react";
import { useCrm } from "@/lib/store";
import { DEAL_STAGES, type Deal, type DealStage } from "@/lib/types";
import { PageHeader } from "../components/PageHeader";
import { Modal } from "../components/Modal";
import { EmptyState } from "../components/EmptyState";
import { formatCurrency, formatDateShort, daysUntil } from "@/lib/format";

const STAGE_ACCENT: Record<DealStage, string> = {
  nouveau: "border-t-nexivo-blue-light",
  qualifie: "border-t-nexivo-blue",
  proposition: "border-t-nexivo-blue-dark",
  negociation: "border-t-nexivo-red",
  gagne: "border-t-green-600",
  perdu: "border-t-nexivo-gray",
};

export default function DealsPage() {
  const { state, addDeal, updateDeal, deleteDeal } = useCrm();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Deal | null>(null);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [dragOverStage, setDragOverStage] = useState<DealStage | null>(null);

  function openCreate(stage?: DealStage) {
    setEditing(
      stage
        ? ({
            id: "",
            title: "",
            amount: 0,
            currency: "EUR",
            stage,
            probability: 20,
            createdAt: "",
            updatedAt: "",
          } as Deal)
        : null
    );
    setOpen(true);
  }

  function openEdit(deal: Deal) {
    setEditing(deal);
    setOpen(true);
  }

  function onDropToStage(stage: DealStage) {
    if (!draggingId) return;
    const deal = state.deals.find((d) => d.id === draggingId);
    if (deal && deal.stage !== stage) {
      const patch: Partial<Deal> = { stage };
      if (stage === "gagne") patch.probability = 100;
      if (stage === "perdu") patch.probability = 0;
      updateDeal(draggingId, patch);
    }
    setDraggingId(null);
    setDragOverStage(null);
  }

  const totalPipeline = state.deals
    .filter((d) => d.stage !== "gagne" && d.stage !== "perdu")
    .reduce((s, d) => s + d.amount, 0);

  return (
    <div>
      <PageHeader
        title="Pipeline commercial"
        subtitle={`${state.deals.length} deal(s) — ${formatCurrency(
          totalPipeline
        )} en pipeline ouvert.`}
        actions={
          <button className="btn-primary" onClick={() => openCreate()}>
            <Plus className="h-4 w-4" /> Nouveau deal
          </button>
        }
      />

      {state.deals.length === 0 ? (
        <EmptyState
          title="Aucun deal"
          description="Créez votre premier deal pour commencer à suivre votre pipeline."
          action={
            <button className="btn-primary" onClick={() => openCreate()}>
              <Plus className="h-4 w-4" /> Créer un deal
            </button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-6">
          {DEAL_STAGES.map((stage) => {
            const deals = state.deals.filter((d) => d.stage === stage.id);
            const total = deals.reduce((s, d) => s + d.amount, 0);
            const isDragOver = dragOverStage === stage.id;
            return (
              <div
                key={stage.id}
                className={
                  "flex min-h-[240px] flex-col rounded-xl border-t-4 bg-nexivo-surface p-3 transition-colors " +
                  STAGE_ACCENT[stage.id] +
                  (isDragOver ? " ring-2 ring-nexivo-blue/40" : "")
                }
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragOverStage(stage.id);
                }}
                onDragLeave={() => setDragOverStage(null)}
                onDrop={() => onDropToStage(stage.id)}
              >
                <div className="mb-3 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-nexivo-ink">
                      {stage.label}
                    </p>
                    <p className="text-xs text-nexivo-gray">
                      {deals.length} · {formatCurrency(total)}
                    </p>
                  </div>
                  <button
                    className="rounded-md p-1 text-nexivo-gray hover:bg-white hover:text-nexivo-blue"
                    onClick={() => openCreate(stage.id)}
                    aria-label={`Ajouter dans ${stage.label}`}
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
                <div className="flex flex-1 flex-col gap-2">
                  {deals.map((d) => {
                    const company = state.companies.find(
                      (c) => c.id === d.companyId
                    );
                    const contact = state.contacts.find(
                      (c) => c.id === d.contactId
                    );
                    const due = daysUntil(d.closeDate);
                    return (
                      <div
                        key={d.id}
                        draggable
                        onDragStart={() => setDraggingId(d.id)}
                        onDragEnd={() => {
                          setDraggingId(null);
                          setDragOverStage(null);
                        }}
                        className="group cursor-grab rounded-lg border border-nexivo-border bg-white p-3 shadow-sm hover:border-nexivo-blue/50"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <p className="text-sm font-medium text-nexivo-ink">
                            {d.title}
                          </p>
                          <div className="flex opacity-0 transition-opacity group-hover:opacity-100">
                            <button
                              onClick={() => openEdit(d)}
                              className="rounded p-1 text-nexivo-gray hover:text-nexivo-blue"
                              aria-label="Modifier"
                            >
                              <Pencil className="h-3.5 w-3.5" />
                            </button>
                            <button
                              onClick={() => {
                                if (confirm(`Supprimer "${d.title}" ?`)) {
                                  deleteDeal(d.id);
                                }
                              }}
                              className="rounded p-1 text-nexivo-gray hover:text-nexivo-red"
                              aria-label="Supprimer"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </div>
                        <p className="mt-2 flex items-center gap-1 text-sm font-semibold text-nexivo-ink">
                          <Euro className="h-3.5 w-3.5 text-nexivo-blue" />
                          {formatCurrency(d.amount, d.currency)}
                        </p>
                        <p className="mt-1 truncate text-xs text-nexivo-gray">
                          {company?.name ?? "Sans société"}
                          {contact ? ` · ${contact.firstName} ${contact.lastName}` : ""}
                        </p>
                        <div className="mt-2 flex items-center justify-between text-[11px] text-nexivo-gray">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {formatDateShort(d.closeDate)}
                            {due !== null && due < 0 && d.stage !== "gagne" && d.stage !== "perdu" && (
                              <span className="ml-1 rounded bg-nexivo-red/10 px-1 text-nexivo-red">
                                en retard
                              </span>
                            )}
                          </span>
                          <span className="font-medium text-nexivo-ink">
                            {d.probability}%
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}

      <DealFormModal
        open={open}
        onClose={() => setOpen(false)}
        deal={editing}
        onSave={(data) => {
          if (editing && editing.id) {
            updateDeal(editing.id, data);
          } else {
            addDeal(data);
          }
          setOpen(false);
        }}
      />
    </div>
  );
}

function DealFormModal({
  open,
  onClose,
  deal,
  onSave,
}: {
  open: boolean;
  onClose: () => void;
  deal: Deal | null;
  onSave: (data: Omit<Deal, "id" | "createdAt" | "updatedAt">) => void;
}) {
  const { state } = useCrm();
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState(0);
  const [currency, setCurrency] = useState<"EUR" | "USD">("EUR");
  const [stage, setStage] = useState<DealStage>("nouveau");
  const [probability, setProbability] = useState(20);
  const [companyId, setCompanyId] = useState("");
  const [contactId, setContactId] = useState("");
  const [closeDate, setCloseDate] = useState("");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    if (open) {
      setTitle(deal?.title ?? "");
      setAmount(deal?.amount ?? 0);
      setCurrency(deal?.currency ?? "EUR");
      setStage(deal?.stage ?? "nouveau");
      setProbability(deal?.probability ?? 20);
      setCompanyId(deal?.companyId ?? "");
      setContactId(deal?.contactId ?? "");
      setCloseDate(deal?.closeDate ? deal.closeDate.slice(0, 10) : "");
      setNotes(deal?.notes ?? "");
    }
  }, [open, deal]);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;
    onSave({
      title: title.trim(),
      amount: Number(amount) || 0,
      currency,
      stage,
      probability: Math.min(100, Math.max(0, Number(probability) || 0)),
      companyId: companyId || undefined,
      contactId: contactId || undefined,
      closeDate: closeDate ? new Date(closeDate).toISOString() : undefined,
      notes: notes.trim() || undefined,
    });
  }

  // filter contacts by selected company
  const eligibleContacts = companyId
    ? state.contacts.filter((c) => c.companyId === companyId)
    : state.contacts;

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={deal?.id ? "Modifier le deal" : "Nouveau deal"}
      footer={
        <>
          <button type="button" className="btn-outline" onClick={onClose}>
            Annuler
          </button>
          <button type="submit" form="deal-form" className="btn-primary">
            Enregistrer
          </button>
        </>
      }
    >
      <form id="deal-form" onSubmit={submit} className="space-y-4">
        <div>
          <label className="label">Intitulé *</label>
          <input
            required
            className="input"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Ex : Pack Pro - Société X"
          />
        </div>
        <div className="grid grid-cols-3 gap-3">
          <div className="col-span-2">
            <label className="label">Montant *</label>
            <input
              type="number"
              min={0}
              className="input"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
            />
          </div>
          <div>
            <label className="label">Devise</label>
            <select
              className="input"
              value={currency}
              onChange={(e) => setCurrency(e.target.value as "EUR" | "USD")}
            >
              <option value="EUR">EUR</option>
              <option value="USD">USD</option>
            </select>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="label">Étape</label>
            <select
              className="input"
              value={stage}
              onChange={(e) => setStage(e.target.value as DealStage)}
            >
              {DEAL_STAGES.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="label">Probabilité (%)</label>
            <input
              type="number"
              min={0}
              max={100}
              className="input"
              value={probability}
              onChange={(e) => setProbability(Number(e.target.value))}
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="label">Société</label>
            <select
              className="input"
              value={companyId}
              onChange={(e) => {
                setCompanyId(e.target.value);
                setContactId("");
              }}
            >
              <option value="">— Aucune —</option>
              {state.companies.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="label">Contact</label>
            <select
              className="input"
              value={contactId}
              onChange={(e) => setContactId(e.target.value)}
            >
              <option value="">— Aucun —</option>
              {eligibleContacts.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.firstName} {c.lastName}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div>
          <label className="label">Date de clôture prévue</label>
          <input
            type="date"
            className="input"
            value={closeDate}
            onChange={(e) => setCloseDate(e.target.value)}
          />
        </div>
        <div>
          <label className="label">Notes</label>
          <textarea
            className="input min-h-[80px]"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </div>
      </form>
    </Modal>
  );
}
