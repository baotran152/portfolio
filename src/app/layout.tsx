import { Analytics } from "@vercel/analytics/react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

// Load Inter font
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Trần Nguyễn Duy Bảo | AI Portfolio",
  description:
    "Interactive portfolio powered by LLMs, built by Trần Nguyễn Duy Bảo. Learn about my projects, skills, and AI engineering experience.",
  keywords: [
    "Bảo Trần",
    "Trần Nguyễn Duy Bảo",
    "AI Engineer",
    "Portfolio",
    "LangChain",
    "LLM",
    "RAG",
    "Computer Vision",
    "Full Stack Developer",
    "Next.js",
    "React",
  ],
  authors: [
    {
      name: "Trần Nguyễn Duy Bảo",
      url: "https://baro1502.github.io",
    },
  ],
  creator: "Trần Nguyễn Duy Bảo",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://baro1502.github.io",
    title: "Trần Nguyễn Duy Bảo | AI Portfolio",
    description:
      "Explore the interactive portfolio of Bảo – AI engineer specializing in LLM agents, Computer Vision, and full-stack development.",
    siteName: "Bảo Trần Portfolio",
  },
  twitter: {
    card: "summary_large_image",
    title: "Bảo Trần | AI Engineer",
    description:
      "Discover my interactive AI portfolio, real-world projects, and experience with LLMs, CV, and ML deployment.",
    creator: "@Baro1502", // if you don’t have Twitter, just remove this
  },
  icons: {
    icon: [
      {
        url: "/logo.jpeg",
        sizes: "any",
      },
    ],
    shortcut: "/logo.jpeg?v=2",
    apple: "/apple-touch-icon.svg?v=2",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
        />
        <link rel="icon" href="/logo.jpeg" sizes="any" />
      </head>
      <body suppressHydrationWarning={true}
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          inter.variable
        )}
      >
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
          <main className="flex min-h-screen flex-col">{children}</main>
          <Toaster />
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}
