import React from 'react';
import { DollarSign, ShoppingBag, AlertTriangle, Users } from 'lucide-react';
import { StatsCard } from '../../components/dashboard/StatsCard';
import { SalesChart } from '../../components/dashboard/SalesChart';
import { Card } from '../../components/ui/Card';
import { menuItems } from '../../data/menu';
import { orders } from '../../data/orders';
import { users } from '../../data/users';

export const AdminDashboard: React.FC = () => {
  const todaySales = orders.reduce((sum, order) => sum + order.total, 0);
  const todayOrders = orders.length;
  const lowStockItems = menuItems.filter(item => item.stock < 10);
  const totalUsers = users.filter(user => user.role === 'cashier').length;

  const topProducts = menuItems
    .sort((a, b) => b.stock - a.stock)
    .slice(0, 5);

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
          value={`$${todaySales.toFixed(2)}`}
          icon={DollarSign}
          color="green"
          change="+12% from yesterday"
        />
        <StatsCard
          title="Orders"
          value={todayOrders}
          icon={ShoppingBag}
          color="blue"
          change="+5% from yesterday"
        />
        <StatsCard
          title="Low Stock Items"
          value={lowStockItems.length}
          icon={AlertTriangle}
          color="red"
          change="Needs attention"
        />
        <StatsCard
          title="Active Cashiers"
          value={totalUsers}
          icon={Users}
          color="yellow"
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-6">
        <div className="xl:col-span-2">
          <SalesChart />
        </div>
        
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Top Products
          </h3>
          <div className="space-y-3">
            {topProducts.map((product) => (
              <div key={product.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="flex items-center space-x-3 min-w-0 flex-1">
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg object-cover flex-shrink-0"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-gray-900 dark:text-white text-sm sm:text-base truncate">
                      {product.name}
                    </p>
                    <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                      ${product.price}
                    </p>
                  </div>
                </div>
                <span className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400 flex-shrink-0 ml-2">
                  Stock: {product.stock}
                </span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {lowStockItems.length > 0 && (
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
            <AlertTriangle className="w-5 h-5 text-red-500 mr-2 flex-shrink-0" />
            <span>Low Stock Alert</span>
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {lowStockItems.map((item) => (
              <div key={item.id} className="flex items-center justify-between p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
                <div className="flex items-center space-x-3 min-w-0 flex-1">
                  <img 
                    src={item.image} 
                    alt={item.name}
                    className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg object-cover flex-shrink-0"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-gray-900 dark:text-white text-sm sm:text-base truncate">
                      {item.name}
                    </p>
                    <p className="text-xs sm:text-sm text-red-600 dark:text-red-400">
                      Only {item.stock} left
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};