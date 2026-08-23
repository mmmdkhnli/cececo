import type { Metadata } from "next";
import "./globals.css";

// Every page pulls live content from MySQL, so there is nothing meaningful
// to prerender statically at build time.
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "CECECO — Clean Energy Centre for the ECO Region",
  description: "Driving clean energy and cooperation across the ECO region.",
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
