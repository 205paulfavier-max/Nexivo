export type ID = string;

export type DealStage =
  | "nouveau"
  | "qualifie"
  | "proposition"
  | "negociation"
  | "gagne"
  | "perdu";

export const DEAL_STAGES: { id: DealStage; label: string; hint: string }[] = [
  { id: "nouveau", label: "Nouveau", hint: "Lead entrant" },
  { id: "qualifie", label: "Qualifié", hint: "Besoin confirmé" },
  { id: "proposition", label: "Proposition", hint: "Devis envoyé" },
  { id: "negociation", label: "Négociation", hint: "Discussion finale" },
  { id: "gagne", label: "Gagné", hint: "Affaire signée" },
  { id: "perdu", label: "Perdu", hint: "Opportunité fermée" },
];

export type TaskStatus = "a_faire" | "en_cours" | "termine";
export type TaskPriority = "basse" | "moyenne" | "haute";

export interface Company {
  id: ID;
  name: string;
  industry?: string;
  website?: string;
  phone?: string;
  address?: string;
  notes?: string;
  createdAt: string;
}

export interface Contact {
  id: ID;
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  position?: string;
  companyId?: ID;
  tags?: string[];
  notes?: string;
  createdAt: string;
}

export interface Deal {
  id: ID;
  title: string;
  amount: number;
  currency: "EUR" | "USD";
  stage: DealStage;
  contactId?: ID;
  companyId?: ID;
  probability: number;
  closeDate?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Task {
  id: ID;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate?: string;
  contactId?: ID;
  dealId?: ID;
  createdAt: string;
}

export interface CrmState {
  companies: Company[];
  contacts: Contact[];
  deals: Deal[];
  tasks: Task[];
}
