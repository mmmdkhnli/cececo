import { RecentActivity } from "@/components/admin/recent-activity";
import { SectionCards } from "@/components/admin/section-cards";

export default function AdminDashboardPage() {
  return (
    <div className="@container/main flex flex-1 flex-col gap-2">
      <div className="flex flex-col gap-4 md:gap-6">
        <SectionCards />
        <RecentActivity />
      </div>
    </div>
  );
}
