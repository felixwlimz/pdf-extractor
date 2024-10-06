import type { Metadata } from "next";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { Poppins } from "next/font/google";

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
            "bg-orange-500 hover:bg-orange-600 text-lg border-none",
        },
      }}
    >
      <html lang="en">
        <body className={poppins.className}>{children}</body>
      </html>
    </ClerkProvider>
  );
}
