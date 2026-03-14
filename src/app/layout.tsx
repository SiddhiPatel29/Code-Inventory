import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CoreInventory | IMS",
  description: "A modular Inventory Management System",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased font-sans">
        {children}
      </body>
    </html>
  );
}
