import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { ToastProvider } from "@/components/providers/toast-provider";
import { AnalyticsPlaceholder } from "@/components/providers/analytics-placeholder";
import { ScreenReaderAnnouncer } from "@/components/providers/screen-reader-announcer";
import { ErrorBoundary } from "@/components/ui/error-boundary";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta-sans",
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "ARKA-INS | Prior Authorization Intelligence for RBMs",
  description:
    "AI-powered prior authorization intelligence platform for Utilization Review and RBM partners. Streamline PA workflows, predict denials, and ensure CMS compliance.",
  openGraph: {
    title: "ARKA-INS | Prior Authorization Intelligence for RBMs",
    description:
      "AI-powered prior authorization intelligence platform for Utilization Review and RBM partners. Streamline PA workflows, predict denials, and ensure CMS compliance.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${plusJakartaSans.variable} ${inter.variable} ${jetbrainsMono.variable} font-body antialiased flex flex-col min-h-screen`}
      >
        <ToastProvider>
          <ScreenReaderAnnouncer />
          <Header />
          <main className="flex-1 pt-16">
            <ErrorBoundary logToConsole={true}>
              {children}
            </ErrorBoundary>
          </main>
          <Footer />
          <AnalyticsPlaceholder />
        </ToastProvider>
      </body>
    </html>
  );
}
