import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI Green Scorecard — Rating the Environmental Impact of AI Companies",
  description:
    "An editorial analysis scoring major AI companies on their environmental footprint. Carbon emissions, water usage, renewable energy, and transparency — all in one place.",
  openGraph: {
    title: "AI Green Scorecard",
    description: "Which AI companies are actually caring for the planet?",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">
        {children}
        {/* Global grain texture — adds print-editorial depth site-wide */}
        <div
          aria-hidden
          className="fixed inset-0 pointer-events-none z-[9990]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='280' height='280'%3E%3Cfilter id='g'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.72' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='280' height='280' filter='url(%23g)' opacity='0.042'/%3E%3C/svg%3E")`,
            opacity: 1,
          }}
        />
      </body>
    </html>
  );
}
