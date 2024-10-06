import type { Metadata } from "next";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { Roboto } from 'next/font/google'

export const metadata: Metadata = {
  title: "PDF Extractor",
  description: "Extract your PDF files",
};

const roboto = Roboto({
  weight : ['400', '700'],
  subsets : ['latin']
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" className={roboto.className}>
        <body>
         {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
