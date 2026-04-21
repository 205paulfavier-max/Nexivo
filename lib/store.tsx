"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type {
  Company,
  Contact,
  CrmState,
  Deal,
  ID,
  Task,
} from "./types";
import { buildSeed } from "./seed";

const STORAGE_KEY = "nexivo-crm:v1";

const emptyState: CrmState = {
  companies: [],
  contacts: [],
  deals: [],
  tasks: [],
};

type CrmContextValue = {
  state: CrmState;
  loaded: boolean;
  resetDemo: () => void;
  clearAll: () => void;
  // companies
  addCompany: (input: Omit<Company, "id" | "createdAt">) => Company;
  updateCompany: (id: ID, patch: Partial<Company>) => void;
  deleteCompany: (id: ID) => void;
  // contacts
  addContact: (input: Omit<Contact, "id" | "createdAt">) => Contact;
  updateContact: (id: ID, patch: Partial<Contact>) => void;
  deleteContact: (id: ID) => void;
  // deals
  addDeal: (
    input: Omit<Deal, "id" | "createdAt" | "updatedAt">
  ) => Deal;
  updateDeal: (id: ID, patch: Partial<Deal>) => void;
  deleteDeal: (id: ID) => void;
  // tasks
  addTask: (input: Omit<Task, "id" | "createdAt">) => Task;
  updateTask: (id: ID, patch: Partial<Task>) => void;
  deleteTask: (id: ID) => void;
};

const CrmContext = createContext<CrmContextValue | null>(null);

function newId() {
  return (
    Date.now().toString(36) + Math.random().toString(36).slice(2, 8)
  ).toUpperCase();
}

function loadInitial(): CrmState {
  if (typeof window === "undefined") return emptyState;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      const seed = buildSeed();
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(seed));
      return seed;
    }
    return JSON.parse(raw) as CrmState;
  } catch {
    return buildSeed();
  }
}

export function CrmProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<CrmState>(emptyState);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setState(loadInitial());
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      /* ignore */
    }
  }, [state, loaded]);

  const resetDemo = useCallback(() => {
    const seed = buildSeed();
    setState(seed);
  }, []);

  const clearAll = useCallback(() => {
    setState(emptyState);
  }, []);

  // companies ---------------------------------------------------------------
  const addCompany: CrmContextValue["addCompany"] = useCallback((input) => {
    const company: Company = {
      ...input,
      id: newId(),
      createdAt: new Date().toISOString(),
    };
    setState((s) => ({ ...s, companies: [company, ...s.companies] }));
    return company;
  }, []);

  const updateCompany: CrmContextValue["updateCompany"] = useCallback(
    (id, patch) => {
      setState((s) => ({
        ...s,
        companies: s.companies.map((c) =>
          c.id === id ? { ...c, ...patch } : c
        ),
      }));
    },
    []
  );

  const deleteCompany: CrmContextValue["deleteCompany"] = useCallback((id) => {
    setState((s) => ({
      ...s,
      companies: s.companies.filter((c) => c.id !== id),
      contacts: s.contacts.map((c) =>
        c.companyId === id ? { ...c, companyId: undefined } : c
      ),
      deals: s.deals.map((d) =>
        d.companyId === id ? { ...d, companyId: undefined } : d
      ),
    }));
  }, []);

  // contacts ----------------------------------------------------------------
  const addContact: CrmContextValue["addContact"] = useCallback((input) => {
    const contact: Contact = {
      ...input,
      id: newId(),
      createdAt: new Date().toISOString(),
    };
    setState((s) => ({ ...s, contacts: [contact, ...s.contacts] }));
    return contact;
  }, []);

  const updateContact: CrmContextValue["updateContact"] = useCallback(
    (id, patch) => {
      setState((s) => ({
        ...s,
        contacts: s.contacts.map((c) =>
          c.id === id ? { ...c, ...patch } : c
        ),
      }));
    },
    []
  );

  const deleteContact: CrmContextValue["deleteContact"] = useCallback((id) => {
    setState((s) => ({
      ...s,
      contacts: s.contacts.filter((c) => c.id !== id),
      deals: s.deals.map((d) =>
        d.contactId === id ? { ...d, contactId: undefined } : d
      ),
      tasks: s.tasks.map((t) =>
        t.contactId === id ? { ...t, contactId: undefined } : t
      ),
    }));
  }, []);

  // deals -------------------------------------------------------------------
  const addDeal: CrmContextValue["addDeal"] = useCallback((input) => {
    const iso = new Date().toISOString();
    const deal: Deal = {
      ...input,
      id: newId(),
      createdAt: iso,
      updatedAt: iso,
    };
    setState((s) => ({ ...s, deals: [deal, ...s.deals] }));
    return deal;
  }, []);

  const updateDeal: CrmContextValue["updateDeal"] = useCallback(
    (id, patch) => {
      setState((s) => ({
        ...s,
        deals: s.deals.map((d) =>
          d.id === id
            ? { ...d, ...patch, updatedAt: new Date().toISOString() }
            : d
        ),
      }));
    },
    []
  );

  const deleteDeal: CrmContextValue["deleteDeal"] = useCallback((id) => {
    setState((s) => ({
      ...s,
      deals: s.deals.filter((d) => d.id !== id),
      tasks: s.tasks.map((t) =>
        t.dealId === id ? { ...t, dealId: undefined } : t
      ),
    }));
  }, []);

  // tasks -------------------------------------------------------------------
  const addTask: CrmContextValue["addTask"] = useCallback((input) => {
    const task: Task = {
      ...input,
      id: newId(),
      createdAt: new Date().toISOString(),
    };
    setState((s) => ({ ...s, tasks: [task, ...s.tasks] }));
    return task;
  }, []);

  const updateTask: CrmContextValue["updateTask"] = useCallback(
    (id, patch) => {
      setState((s) => ({
        ...s,
        tasks: s.tasks.map((t) => (t.id === id ? { ...t, ...patch } : t)),
      }));
    },
    []
  );

  const deleteTask: CrmContextValue["deleteTask"] = useCallback((id) => {
    setState((s) => ({
      ...s,
      tasks: s.tasks.filter((t) => t.id !== id),
    }));
  }, []);

  const value = useMemo<CrmContextValue>(
    () => ({
      state,
      loaded,
      resetDemo,
      clearAll,
      addCompany,
      updateCompany,
      deleteCompany,
      addContact,
      updateContact,
      deleteContact,
      addDeal,
      updateDeal,
      deleteDeal,
      addTask,
      updateTask,
      deleteTask,
    }),
    [
      state,
      loaded,
      resetDemo,
      clearAll,
      addCompany,
      updateCompany,
      deleteCompany,
      addContact,
      updateContact,
      deleteContact,
      addDeal,
      updateDeal,
      deleteDeal,
      addTask,
      updateTask,
      deleteTask,
    ]
  );

  return <CrmContext.Provider value={value}>{children}</CrmContext.Provider>;
}

export function useCrm() {
  const ctx = useContext(CrmContext);
  if (!ctx) throw new Error("useCrm must be used inside CrmProvider");
  return ctx;
}
