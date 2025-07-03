import React from 'react';
import { TrendingUp, TrendingDown, DollarSign, ShoppingBag } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { StatsCard } from '../../components/dashboard/StatsCard';
import { Table, TableHeader, TableBody, TableRow, TableCell } from '../../components/ui/Table';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { orders } from '../../data/orders';
import { menuItems } from '../../data/menu';

const salesData = [
  { name: 'Jan', sales: 4000, orders: 24 },
  { name: 'Feb', sales: 3000, orders: 18 },
  { name: 'Mar', sales: 5000, orders: 32 },
  { name: 'Apr', sales: 2780, orders: 16 },
  { name: 'May', sales: 6890, orders: 43 },
  { name: 'Jun', sales: 2390, orders: 14 },
  { name: 'Jul', sales: 3490, orders: 20 },
];

const categoryData = [
  { name: 'Coffee', value: 30, color: '#8B4513' },
  { name: 'Main Course', value: 35, color: '#F59E0B' },
  { name: 'Desserts', value: 15, color: '#10B981' },
  { name: 'Beverages', value: 20, color: '#F97316' },
];

export const Reports: React.FC = () => {
  const totalSales = orders.reduce((sum, order) => sum + order.total, 0);
  const totalOrders = orders.length;
  const avgOrderValue = totalSales / totalOrders;

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="text-center sm:text-left">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
          Reports & Analytics
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2 text-sm sm:text-base">
          Detailed insights into your restaurant performance
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <StatsCard
          title="Total Sales"
          value={`$${totalSales.toFixed(2)}`}
          icon={DollarSign}
          color="green"
          change="+15.3% from last month"
        />
        <StatsCard
          title="Total Orders"
          value={totalOrders}
          icon={ShoppingBag}
          color="blue"
          change="+8.1% from last month"
        />
        <StatsCard
          title="Avg Order Value"
          value={`$${avgOrderValue.toFixed(2)}`}
          icon={TrendingUp}
          color="yellow"
          change="+5.4% from last month"
        />
        <StatsCard
          title="Growth Rate"
          value="12.5%"
          icon={TrendingUp}
          color="green"
          change="Monthly growth"
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6">
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Monthly Sales Trend
          </h3>
          <div className="h-64 sm:h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={salesData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="name" 
                  className="text-gray-600 dark:text-gray-400"
                  fontSize={12}
                />
                <YAxis 
                  className="text-gray-600 dark:text-gray-400"
                  fontSize={12}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgb(55 65 81)',
                    border: 'none',
                    borderRadius: '8px',
                    color: 'white',
                    fontSize: '14px'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="sales" 
                  stroke="#F59E0B" 
                  strokeWidth={3}
                  dot={{ fill: '#F59E0B', strokeWidth: 2, r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Sales by Category
          </h3>
          <div className="h-64 sm:h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <Card>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Top Selling Items
        </h3>
        <Table>
          <TableHeader>
            <TableRow>
              <TableCell header>Item</TableCell>
              <TableCell header className="hidden sm:table-cell">Category</TableCell>
              <TableCell header>Price</TableCell>
              <TableCell header className="hidden md:table-cell">Stock</TableCell>
              <TableCell header>Status</TableCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {menuItems.slice(0, 8).map((item) => (
              <TableRow key={item.id}>
                <TableCell>
                  <div className="flex items-center space-x-3">
                    <img
                      className="h-8 w-8 sm:h-10 sm:w-10 rounded-lg object-cover flex-shrink-0"
                      src={item.image}
                      alt={item.name}
                    />
                    <div className="min-w-0 flex-1">
                      <div className="text-sm font-medium text-gray-900 dark:text-white truncate">
                        {item.name}
                      </div>
                      <div className="sm:hidden text-xs text-gray-500 dark:text-gray-400">
                        {item.category}
                      </div>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="hidden sm:table-cell">
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {item.category}
                  </span>
                </TableCell>
                <TableCell className="text-sm text-gray-900 dark:text-white font-medium">
                  ${item.price.toFixed(2)}
                </TableCell>
                <TableCell className="hidden md:table-cell text-sm text-gray-500 dark:text-gray-400">
                  {item.stock}
                </TableCell>
                <TableCell>
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    item.stock > 10 
                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                      : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
                  }`}>
                    {item.stock > 10 ? 'In Stock' : 'Low Stock'}
                  </span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
};