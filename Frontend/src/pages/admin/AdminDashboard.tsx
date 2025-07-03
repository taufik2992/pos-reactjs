import React, { useEffect, useState } from 'react';
import { DollarSign, ShoppingBag, AlertTriangle, Users } from 'lucide-react';
import { StatsCard } from '../../components/dashboard/StatsCard';
import { SalesChart } from '../../components/dashboard/SalesChart';
import { Card } from '../../components/ui/Card';
import { dashboardAPI, orderAPI } from '../../services/api';
import toast from 'react-hot-toast';

interface DashboardData {
  overview: {
    totalMenuItems: number;
    totalUsers: number;
    activeUsers: number;
    activeShifts: number;
    totalOrders: number;
    totalRevenue: number;
    avgOrderValue: number;
  };
  orders: {
    today: number;
    week: number;
    month: number;
    total: number;
  };
  revenue: {
    today: number;
    week: number;
    month: number;
    total: number;
  };
  topSellingItems: any[];
  dailySales: any[];
}

export const AdminDashboard: React.FC = () => {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const response = await dashboardAPI.getStats();
        if (response.data.success) {
          setDashboardData(response.data.stats);
        }
      } catch (error) {
        toast.error('Failed to load dashboard data');
        console.error('Dashboard error:', error);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500 dark:text-gray-400">Failed to load dashboard data</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="text-center sm:text-left">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
          Admin Dashboard
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2 text-sm sm:text-base">
          Welcome back! Here's what's happening at your restaurant today.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <StatsCard
          title="Today's Sales"
          value={`$${dashboardData.revenue.today.toFixed(2)}`}
          icon={DollarSign}
          color="green"
          change={`Total: $${dashboardData.revenue.total.toFixed(2)}`}
        />
        <StatsCard
          title="Today's Orders"
          value={dashboardData.orders.today}
          icon={ShoppingBag}
          color="blue"
          change={`Total: ${dashboardData.orders.total}`}
        />
        <StatsCard
          title="Active Users"
          value={dashboardData.overview.activeUsers}
          icon={Users}
          color="yellow"
          change={`Total: ${dashboardData.overview.totalUsers}`}
        />
        <StatsCard
          title="Active Shifts"
          value={dashboardData.overview.activeShifts}
          icon={AlertTriangle}
          color="red"
          change="Currently working"
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-6">
        <div className="xl:col-span-2">
          <SalesChart data={dashboardData.dailySales} />
        </div>
        
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Top Selling Items
          </h3>
          <div className="space-y-3">
            {dashboardData.topSellingItems.slice(0, 5).map((item) => (
              <div key={item._id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="flex items-center space-x-3 min-w-0 flex-1">
                  <img 
                    src={item.menuItem.image || 'https://images.pexels.com/photos/376464/pexels-photo-376464.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&dpr=1'} 
                    alt={item.menuItem.name}
                    className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg object-cover flex-shrink-0"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-gray-900 dark:text-white text-sm sm:text-base truncate">
                      {item.menuItem.name}
                    </p>
                    <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                      ${item.menuItem.price}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400 flex-shrink-0 ml-2">
                    Sold: {item.totalQuantity}
                  </span>
                  <p className="text-xs text-green-600 dark:text-green-400">
                    ${item.totalRevenue.toFixed(2)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <Card padding="sm">
          <div className="text-center">
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
              ${dashboardData.overview.avgOrderValue.toFixed(2)}
            </h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">Avg Order Value</p>
          </div>
        </Card>
        
        <Card padding="sm">
          <div className="text-center">
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
              {dashboardData.overview.totalMenuItems}
            </h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">Menu Items</p>
          </div>
        </Card>
        
        <Card padding="sm">
          <div className="text-center">
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
              ${dashboardData.revenue.week.toFixed(2)}
            </h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">This Week</p>
          </div>
        </Card>
        
        <Card padding="sm">
          <div className="text-center">
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
              ${dashboardData.revenue.month.toFixed(2)}
            </h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">This Month</p>
          </div>
        </Card>
      </div>
    </div>
  );
};