import type { Metadata } from "next";
import { getLocale } from "next-intl/server";

import { LegalPage } from "@/components/legal-page";
import { getLegalDoc } from "@/data/legal";

export async function generateMetadata(): Promise<Metadata> {
  const doc = getLegalDoc("privacy", await getLocale());
  return { title: doc.title, description: doc.description };
}

export default function PrivacyPage() {
  return <LegalPage slug="privacy" />;
}
