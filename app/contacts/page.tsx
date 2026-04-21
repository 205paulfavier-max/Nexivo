"use client";

import { useEffect, useMemo, useState } from "react";
import { Plus, Pencil, Trash2, Mail, Phone, Search } from "lucide-react";
import { useCrm } from "@/lib/store";
import type { Contact } from "@/lib/types";
import { PageHeader } from "../components/PageHeader";
import { Modal } from "../components/Modal";
import { Avatar } from "../components/Avatar";
import { EmptyState } from "../components/EmptyState";
import { formatDate } from "@/lib/format";

export default function ContactsPage() {
  const { state, addContact, updateContact, deleteContact } = useCrm();
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Contact | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return state.contacts;
    return state.contacts.filter((c) => {
      const company = state.companies.find((co) => co.id === c.companyId);
      return [
        c.firstName,
        c.lastName,
        c.email,
        c.phone,
        c.position,
        company?.name,
      ]
        .filter(Boolean)
        .some((s) => s!.toLowerCase().includes(q));
    });
  }, [state.contacts, state.companies, query]);

  function openCreate() {
    setEditing(null);
    setOpen(true);
  }
  function openEdit(contact: Contact) {
    setEditing(contact);
    setOpen(true);
  }

  return (
    <div>
      <PageHeader
        title="Contacts"
        subtitle={`${state.contacts.length} contact(s) dans votre base.`}
        actions={
          <button className="btn-primary" onClick={openCreate}>
            <Plus className="h-4 w-4" /> Nouveau contact
          </button>
        }
      />

      <div className="card mb-4 flex items-center gap-3 p-3">
        <Search className="h-4 w-4 text-nexivo-gray" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Rechercher un contact, email, société…"
          className="flex-1 border-none bg-transparent text-sm outline-none"
        />
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          title="Aucun contact"
          description={
            query
              ? "Aucun contact ne correspond à votre recherche."
              : "Commencez par créer votre premier contact."
          }
          action={
            !query && (
              <button className="btn-primary" onClick={openCreate}>
                <Plus className="h-4 w-4" /> Créer un contact
              </button>
            )
          }
        />
      ) : (
        <div className="card overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-nexivo-surface text-xs uppercase tracking-wide text-nexivo-gray">
              <tr>
                <th className="px-4 py-3 text-left font-medium">Contact</th>
                <th className="px-4 py-3 text-left font-medium">Société</th>
                <th className="px-4 py-3 text-left font-medium">Coordonnées</th>
                <th className="px-4 py-3 text-left font-medium">Étiquettes</th>
                <th className="px-4 py-3 text-left font-medium">Ajouté le</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-nexivo-border">
              {filtered.map((c) => {
                const company = state.companies.find(
                  (co) => co.id === c.companyId
                );
                return (
                  <tr key={c.id} className="hover:bg-nexivo-surface/50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <Avatar
                          firstName={c.firstName}
                          lastName={c.lastName}
                        />
                        <div>
                          <p className="font-medium text-nexivo-ink">
                            {c.firstName} {c.lastName}
                          </p>
                          {c.position && (
                            <p className="text-xs text-nexivo-gray">
                              {c.position}
                            </p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-nexivo-ink">
                      {company?.name ?? (
                        <span className="text-nexivo-gray">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="space-y-1 text-xs text-nexivo-gray">
                        {c.email && (
                          <a
                            href={`mailto:${c.email}`}
                            className="flex items-center gap-1 hover:text-nexivo-blue"
                          >
                            <Mail className="h-3 w-3" /> {c.email}
                          </a>
                        )}
                        {c.phone && (
                          <a
                            href={`tel:${c.phone}`}
                            className="flex items-center gap-1 hover:text-nexivo-blue"
                          >
                            <Phone className="h-3 w-3" /> {c.phone}
                          </a>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1">
                        {(c.tags ?? []).map((t) => (
                          <span
                            key={t}
                            className="badge bg-nexivo-blue/10 text-nexivo-blue"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-xs text-nexivo-gray">
                      {formatDate(c.createdAt)}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex justify-end gap-1">
                        <button
                          className="btn-ghost"
                          onClick={() => openEdit(c)}
                          aria-label="Modifier"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button
                          className="btn-ghost text-nexivo-red hover:bg-nexivo-red/10"
                          onClick={() => {
                            if (
                              confirm(
                                `Supprimer ${c.firstName} ${c.lastName} ?`
                              )
                            ) {
                              deleteContact(c.id);
                            }
                          }}
                          aria-label="Supprimer"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <ContactFormModal
        open={open}
        onClose={() => setOpen(false)}
        contact={editing}
        onSave={(data) => {
          if (editing) {
            updateContact(editing.id, data);
          } else {
            addContact(data);
          }
          setOpen(false);
        }}
      />
    </div>
  );
}

function ContactFormModal({
  open,
  onClose,
  contact,
  onSave,
}: {
  open: boolean;
  onClose: () => void;
  contact: Contact | null;
  onSave: (data: Omit<Contact, "id" | "createdAt">) => void;
}) {
  const { state } = useCrm();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [position, setPosition] = useState("");
  const [companyId, setCompanyId] = useState<string>("");
  const [tags, setTags] = useState("");
  const [notes, setNotes] = useState("");

  // reset when opening
  useEffect(() => {
    if (open) {
      setFirstName(contact?.firstName ?? "");
      setLastName(contact?.lastName ?? "");
      setEmail(contact?.email ?? "");
      setPhone(contact?.phone ?? "");
      setPosition(contact?.position ?? "");
      setCompanyId(contact?.companyId ?? "");
      setTags((contact?.tags ?? []).join(", "));
      setNotes(contact?.notes ?? "");
    }
  }, [open, contact]);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!firstName.trim() || !lastName.trim()) return;
    onSave({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.trim() || undefined,
      phone: phone.trim() || undefined,
      position: position.trim() || undefined,
      companyId: companyId || undefined,
      tags: tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      notes: notes.trim() || undefined,
    });
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={contact ? "Modifier le contact" : "Nouveau contact"}
      footer={
        <>
          <button type="button" className="btn-outline" onClick={onClose}>
            Annuler
          </button>
          <button type="submit" form="contact-form" className="btn-primary">
            Enregistrer
          </button>
        </>
      }
    >
      <form id="contact-form" onSubmit={submit} className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="label">Prénom *</label>
            <input
              required
              className="input"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
          </div>
          <div>
            <label className="label">Nom *</label>
            <input
              required
              className="input"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="label">Email</label>
            <input
              type="email"
              className="input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="label">Poste</label>
            <input
              className="input"
              value={position}
              onChange={(e) => setPosition(e.target.value)}
            />
          </div>
          <div>
            <label className="label">Société</label>
            <select
              className="input"
              value={companyId}
              onChange={(e) => setCompanyId(e.target.value)}
            >
              <option value="">— Aucune —</option>
              {state.companies.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div>
          <label className="label">Étiquettes (séparées par des virgules)</label>
          <input
            className="input"
            placeholder="VIP, Prospect chaud…"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
          />
        </div>
        <div>
          <label className="label">Notes</label>
          <textarea
            className="input min-h-[90px]"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </div>
      </form>
    </Modal>
  );
}
