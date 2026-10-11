import type { Metadata } from "next";
import { ShopShowcase } from "@/components/boutique/ShopShowcase";

export const metadata: Metadata = {
  title: "Boutique",
  description:
    "Avant-goût de la future boutique officielle du Giron 2028 — démo, produits et prix à venir.",
};

export default function BoutiquePage() {
  return <ShopShowcase />;
}
