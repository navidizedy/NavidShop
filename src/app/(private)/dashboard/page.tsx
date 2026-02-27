import DashHomeView from "./_components/dashHomeView";
import { getAdminDashboardData } from "@/app/actions/getAdminStats";

export const revalidate = 0;

const Dashboard = async () => {
  const data = await getAdminDashboardData();

  if (!data) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center p-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-2">
            Dashboard Unavailable
          </h2>
          <p className="text-gray-400">
            We're having trouble connecting to the database. Please try again
            later.
          </p>
        </div>
      </div>
    );
  }

  return (
    <DashHomeView
      stats={data.stats}
      topProducts={data.topProducts}
      recentOrders={data.recentOrders}
      lowStock={data.lowStock}
      userStats={data.userStats}
    />
  );
};

export default Dashboard;
