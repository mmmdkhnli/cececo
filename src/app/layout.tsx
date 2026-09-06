import type { Metadata } from "next";
import "./globals.css";

export const dynamic = "force-dynamic";

const SITE_NAME = "CECECO — Clean Energy Centre for the ECO Region";
const SITE_DESCRIPTION = "Driving clean energy and cooperation across the ECO region.";

export const metadata: Metadata = {
  metadataBase: new URL("https://cececo.org"),
  title: {
    default: SITE_NAME,
    template: "%s — CECECO",
  },
  description: SITE_DESCRIPTION,
  icons: {
    icon: "/cececo-ico.png",
    shortcut: "/cececo-ico.png",
    apple: "/cececo-ico.png",
  },
  openGraph: {
    type: "website",
    siteName: "CECECO",
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    url: "https://cececo.org",
    images: ["/cececo-ico.png"],
  },
  twitter: {
    card: "summary",
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    images: ["/cececo-ico.png"],
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
