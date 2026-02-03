import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "@/styles/globals.css";

const inter = Inter({ subsets: ["latin"] });

const baseUrl =
  process.env.NEXT_PUBLIC_APP_URL ??
  process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: "Les Clefs de l'Immo - Gestion de Patrimoine",
  description: "Application de gestion de parc immobilier - Démo",
  icons: {
    icon: "/images/lesclefs-blason.png",
    apple: "/images/lesclefs-blason.png",
  },
  openGraph: {
    title: "Les Clefs de l'Immo - Gestion de Patrimoine",
    description: "Application de gestion de parc immobilier - Démo",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
