import type { Metadata } from "next";
import "./globals.css";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "CECECO — Clean Energy Centre for the ECO Region",
  description: "Driving clean energy and cooperation across the ECO region.",
  icons: {
    icon: "/cececo-ico.png",
    shortcut: "/cececo-ico.png",
    apple: "/cececo-ico.png",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="antialiased" suppressHydrationWarning>
      <body className="antialiased" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
