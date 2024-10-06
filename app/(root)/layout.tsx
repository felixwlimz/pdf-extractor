import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";



export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="m-2 w-full">
      <Navbar />
      {children}
      <Footer />
    </main>
  );
}
