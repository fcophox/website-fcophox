import { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    absolute: "CV _ Francisco Hormazábal - Senior Product Designer – IA",
  },
  description: "CV de Francisco Hormazábal, Senior Product Designer con más de 14 años diseñando y escalando productos digitales. Hoy, contractor para clientes internacionales.",
};

export default function CvLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
