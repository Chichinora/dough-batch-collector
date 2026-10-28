import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "麵團攪拌資料收集",
  description: "平板友善的麵團攪拌批次與時序資料收集系統。",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-Hant">
      <body className="antialiased">{children}</body>
    </html>
  );
}
