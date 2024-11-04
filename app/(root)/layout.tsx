import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import { currentUser } from "@clerk/nextjs/server";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await currentUser();

  return (
    <div className="flex flex-col min-h-screen">
      {/* Top Navbar for Login/Signup */}
      <Navbar user={user!} />

      {/* Main Layout with Sidebar */}
      <div className="flex flex-grow">
        <Sidebar /> {/* Sidebar will take up its own space on the left */}

        {/* Main Content Area */}
        <main className="flex-grow p-4 bg-gray-100">
          {children}
        </main>
      </div>

    </div>
  );

}

// return (
//   <div className="flex flex-col min-h-screen">
//     {/* Top Navbar for Login/Signup */}
//     <Navbar user={user!} />

//     {/* Main Layout with Sidebar */}
//     <div className="flex flex-grow">
//       {/* Sidebar with fixed positioning */}
//       <div className="fixed top-0 left-0 h-screen w-64 bg-gray-800 text-white flex flex-col p-6">
//         <Sidebar /> {/* If you have a separate Sidebar component */}
//       </div>

//       {/* Main Content Area */}
//       <main className="ml-64 flex flex-col items-center justify-start p-4 bg-gray-100 flex-grow">
//         <div className="max-w-3xl w-full mx-auto">
//           {children}
//         </div>
//       </main>
//     </div>
//   </div>
// );
// }