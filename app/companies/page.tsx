"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Plus,
  Pencil,
  Trash2,
  Search,
  Building2,
  Globe,
  Phone,
  MapPin,
} from "lucide-react";
import { useCrm } from "@/lib/store";
import type { Company } from "@/lib/types";
import { PageHeader } from "../components/PageHeader";
import { Modal } from "../components/Modal";
import { EmptyState } from "../components/EmptyState";
import { formatCurrency } from "@/lib/format";

export default function CompaniesPage() {
  const { state, addCompany, updateCompany, deleteCompany } = useCrm();
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Company | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return state.companies;
    return state.companies.filter((c) =>
      [c.name, c.industry, c.website, c.phone, c.address]
        .filter(Boolean)
        .some((s) => s!.toLowerCase().includes(q))
    );
  }, [state.companies, query]);

  function openCreate() {
    setEditing(null);
    setOpen(true);
  }

  return (
    <div>
      <PageHeader
        title="Sociétés"
        subtitle={`${state.companies.length} société(s) suivie(s).`}
        actions={
          <button className="btn-primary" onClick={openCreate}>
            <Plus className="h-4 w-4" /> Nouvelle société
          </button>
        }
      />

      <div className="card mb-4 flex items-center gap-3 p-3">
        <Search className="h-4 w-4 text-nexivo-gray" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Rechercher une société…"
          className="flex-1 border-none bg-transparent text-sm outline-none"
        />
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          title="Aucune société"
          description={
            query
              ? "Aucune société ne correspond à la recherche."
              : "Créez votre première société cliente."
          }
          action={
            !query && (
              <button className="btn-primary" onClick={openCreate}>
                <Plus className="h-4 w-4" /> Créer une société
              </button>
            )
          }
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((c) => {
            const contactsCount = state.contacts.filter(
              (p) => p.companyId === c.id
            ).length;
            const dealsOfCompany = state.deals.filter(
              (d) => d.companyId === c.id
            );
            const openValue = dealsOfCompany
              .filter((d) => d.stage !== "gagne" && d.stage !== "perdu")
              .reduce((s, d) => s + d.amount, 0);
            return (
              <div key={c.id} className="card p-5">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-nexivo-black text-white">
                    <Building2 className="h-5 w-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="font-semibold text-nexivo-ink">
                          {c.name}
                        </p>
                        {c.industry && (
                          <p className="text-xs text-nexivo-gray">
                            {c.industry}
                          </p>
                        )}
                      </div>
                      <div className="flex gap-1">
                        <button
                          className="btn-ghost"
                          onClick={() => {
                            setEditing(c);
                            setOpen(true);
                          }}
                          aria-label="Modifier"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button
                          className="btn-ghost text-nexivo-red hover:bg-nexivo-red/10"
                          onClick={() => {
                            if (confirm(`Supprimer "${c.name}" ?`)) {
                              deleteCompany(c.id);
                            }
                          }}
                          aria-label="Supprimer"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>

                    <div className="mt-3 space-y-1 text-xs text-nexivo-gray">
                      {c.website && (
                        <a
                          href={c.website}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center gap-1 hover:text-nexivo-blue"
                        >
                          <Globe className="h-3 w-3" /> {c.website}
                        </a>
                      )}
                      {c.phone && (
                        <p className="flex items-center gap-1">
                          <Phone className="h-3 w-3" /> {c.phone}
                        </p>
                      )}
                      {c.address && (
                        <p className="flex items-start gap-1">
                          <MapPin className="mt-0.5 h-3 w-3" /> {c.address}
                        </p>
                      )}
                    </div>

                    <div className="mt-4 flex items-center gap-4 border-t border-nexivo-border pt-3 text-xs">
                      <div>
                        <p className="text-nexivo-gray">Contacts</p>
                        <p className="font-semibold text-nexivo-ink">
                          {contactsCount}
                        </p>
                      </div>
                      <div>
                        <p className="text-nexivo-gray">Deals ouverts</p>
                        <p className="font-semibold text-nexivo-ink">
                          {dealsOfCompany.filter(
                            (d) => d.stage !== "gagne" && d.stage !== "perdu"
                          ).length}
                        </p>
                      </div>
                      <div>
                        <p className="text-nexivo-gray">Pipeline</p>
                        <p className="font-semibold text-nexivo-blue">
                          {formatCurrency(openValue)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <CompanyFormModal
        open={open}
        onClose={() => setOpen(false)}
        company={editing}
        onSave={(data) => {
          if (editing) {
            updateCompany(editing.id, data);
          } else {
            addCompany(data);
          }
          setOpen(false);
        }}
      />
    </div>
  );
}

function CompanyFormModal({
  open,
  onClose,
  company,
  onSave,
}: {
  open: boolean;
  onClose: () => void;
  company: Company | null;
  onSave: (data: Omit<Company, "id" | "createdAt">) => void;
}) {
  const [name, setName] = useState("");
  const [industry, setIndustry] = useState("");
  const [website, setWebsite] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    if (open) {
      setName(company?.name ?? "");
      setIndustry(company?.industry ?? "");
      setWebsite(company?.website ?? "");
      setPhone(company?.phone ?? "");
      setAddress(company?.address ?? "");
      setNotes(company?.notes ?? "");
    }
  }, [open, company]);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    onSave({
      name: name.trim(),
      industry: industry.trim() || undefined,
      website: website.trim() || undefined,
      phone: phone.trim() || undefined,
      address: address.trim() || undefined,
      notes: notes.trim() || undefined,
    });
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={company ? "Modifier la société" : "Nouvelle société"}
      footer={
        <>
          <button type="button" className="btn-outline" onClick={onClose}>
            Annuler
          </button>
          <button type="submit" form="company-form" className="btn-primary">
            Enregistrer
          </button>
        </>
      }
    >
      <form id="company-form" onSubmit={submit} className="space-y-4">
        <div>
          <label className="label">Nom *</label>
          <input
            required
            className="input"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="label">Secteur</label>
            <input
              className="input"
              value={industry}
              onChange={(e) => setIndustry(e.target.value)}
            />
          </div>
          <div>
            <label className="label">Téléphone</label>
            <input
              className="input"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>
        </div>
        <div>
          <label className="label">Site web</label>
          <input
            className="input"
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
            placeholder="https://…"
          />
        </div>
        <div>
          <label className="label">Adresse</label>
          <input
            className="input"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
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
