import type { Metadata } from "next";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { Poppins } from "next/font/google";
import { Toaster } from "@/components/ui/toaster";

export const metadata: Metadata = {
  title: "PDF Extractor",
  description: "Extract your PDF files",
};

const poppins = Poppins({
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider
      appearance={{
        elements: {
          formButtonPrimary:
            "bg-green-400 hover:bg-green-600-600 text-lg border-none",
        },
      }}
    >
      <html lang="en">
        <body className={poppins.className}>
          {children}
          <Toaster/>
          </body>
      </html>
    </ClerkProvider>
  );
}
