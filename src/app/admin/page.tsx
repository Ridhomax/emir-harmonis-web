import prisma from "@/lib/prisma";
import AdminDashboardClient from "@/components/AdminDashboardClient";
import LogoutButton from "@/app/user/LogoutButton";

export default async function AdminPage() {
  const bookings = await prisma.booking.findMany({
    orderBy: { createdAt: 'desc' },
  });

  const members = await prisma.user.findMany({
    where: { role: 'USER' },
    orderBy: { points: 'desc' },
  });

  const blogPosts = await prisma.blogPost.findMany({
    orderBy: { createdAt: 'desc' },
  });

  // Simple aggregation for chart (Mock logic based on real bookings)
  const last7Days = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - i);
    d.setHours(0, 0, 0, 0);
    return d;
  }).reverse();

  const chartData = last7Days.map(date => {
    const nextDate = new Date(date);
    nextDate.setDate(nextDate.getDate() + 1);
    
    const count = bookings.filter((b: any) => b.bookingDate >= date && b.bookingDate < nextDate).length;
    
    return {
      name: date.toLocaleDateString('id-ID', { weekday: 'short' }),
      bookings: count,
      revenue: count * 50000 // Mock revenue: 50k per booking average
    };
  });

  return (
    <div className="min-h-screen bg-slate-50">

      <header className="bg-white border-b px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="Emir Harmonis Logo" className="h-8 w-auto rounded-lg shadow-sm" />
            <h1 className="text-2xl font-bold text-slate-800">Admin Dashboard - Emir Harmonis</h1>
          </div>
          <LogoutButton />
        </div>
      </header>
      <main className="p-6">
        <AdminDashboardClient 
          initialBookings={bookings} 
          members={members} 
          blogPosts={blogPosts}
          chartData={chartData}
        />
      </main>
    </div>
  );
}
