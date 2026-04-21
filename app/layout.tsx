import type { Metadata } from "next";
import "./globals.css";
import { CrmProvider } from "@/lib/store";
import { Shell } from "./components/Shell";

export const metadata: Metadata = {
  title: "Nexivo CRM",
  description: "CRM interne Nexivo — contacts, deals, tâches, sociétés.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body>
        <CrmProvider>
          <Shell>{children}</Shell>
        </CrmProvider>
      </body>
    </html>
  );
}
