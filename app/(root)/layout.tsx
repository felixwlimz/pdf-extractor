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
    <main className="m-2 w-full h-screen">
      <Navbar user={user!}/>
      {children}
      <Footer />
    </main>
  );
}
