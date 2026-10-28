import { NoscriptReveal } from "@/components/v3/noscript-reveal";

export default function ProductsLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <NoscriptReveal />
      {children}
    </>
  );
}
