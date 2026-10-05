import type { Metadata } from "next";
import { adminEnabled, isAdmin } from "@/lib/auth";
import { FIELDS, getTexts } from "@/lib/content";
import { getClientLogos } from "@/lib/logos";
import { AdminPanel, LoginForm } from "./AdminPanel";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "ניהול אתר | באורות",
  robots: { index: false, follow: false },
};

export default async function AdminPage() {
  let content: React.ReactNode;

  if (!adminEnabled()) {
    content = (
      <p className="text-center text-ink-muted">
        פאנל הניהול כבוי. יש להגדיר משתנה סביבה ADMIN_PASSWORD בשרת.
      </p>
    );
  } else if (!(await isAdmin())) {
    content = <LoginForm />;
  } else {
    content = (
      <AdminPanel
        fields={FIELDS.map((f) => ({ ...f }))}
        initialTexts={await getTexts()}
        initialLogos={await getClientLogos()}
      />
    );
  }

  return (
    <div className="fixed inset-0 z-[100] overflow-y-auto bg-bg px-4 py-6 text-ink sm:py-10">
      <div className="mx-auto max-w-3xl">{content}</div>
    </div>
  );
}
