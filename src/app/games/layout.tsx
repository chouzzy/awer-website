import type { Metadata } from "next";
import { Big_Shoulders, Manrope } from "next/font/google";

const display = Big_Shoulders({
  subsets: ["latin"],
  weight: ["800", "900"],
  variable: "--font-games-display",
  display: "swap",
});

const body = Manrope({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-games-body",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Awer Games",
  description:
    "Jogos curtos de decisão feitos pela Awer: Jogo da Eleição e Sobe ou Some. Grátis, sem cadastro, direto no navegador do celular ou do computador.",
  alternates: { canonical: "https://www.awer.co/games" },
  openGraph: {
    title: "Awer Games | Awer Consultoria",
    description:
      "Jogos curtos de decisão feitos pela Awer. Grátis, sem cadastro, direto no navegador.",
    url: "https://www.awer.co/games",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className={`${display.variable} ${body.variable}`} style={{ width: "100%" }}>
      {children}
    </div>
  );
}
