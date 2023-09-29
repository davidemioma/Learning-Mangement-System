import Navbar from "@/components/navbar/Navbar";
import Sidebar from "@/components/sidebar/Sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-full">
      <div className="w-full h-[80px] md:pl-56 fixed inset-y-0 z-50">
        <Navbar />
      </div>

      <div className="hidden md:flex flex-col h-full w-56 fixed inset-y-0 z-50">
        <Sidebar />
      </div>

      <main className="pt-[80px] md:pl-56 h-full">{children}</main>
    </div>
  );
}
