import { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    absolute: "CV _ Francisco Hormazábal - Senior Product Designer – AI",
  },
  description: "CV de Francisco Hormazábal - Senior Product Designer especializado en IA, con más de 14 años diseñando, construyendo y escalando productos digitales en remoto.",
};

export default function CvLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
