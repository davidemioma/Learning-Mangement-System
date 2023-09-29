import "./globals.css";
import type { Metadata } from "next";
import { Nunito_Sans } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import ToasterProvider from "@/components/providers/toaster-provider";

const font = Nunito_Sans({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "LMS",
  description: "Learning Management System",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={font.className}>
          <ToasterProvider />

          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
