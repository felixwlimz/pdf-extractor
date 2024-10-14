import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { currentUser } from "@clerk/nextjs/server";





export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
    const user = await currentUser();

  return (

    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">{children}</main>
      <Footer />
    </div>
  );
}