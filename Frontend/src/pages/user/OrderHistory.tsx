import React, { useState } from "react";
import { Search, Eye, FileText } from "lucide-react";
import { Card } from "../../components/ui/Card";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";
import { Modal } from "../../components/ui/Modal";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
} from "../../components/ui/Table";
import { useAuth } from "../../context/AuthContext";
import { orders } from "../../data/orders";
import { menuItems } from "../../data/menu";

export const OrderHistory: React.FC = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const userOrders = orders.filter((order) => order.cashierId === user?.id);

  const filteredOrders = userOrders.filter(
    (order) =>
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getMenuItemById = (id: string) => {
    return menuItems.find((item) => item.id === id);
  };

  const viewOrderDetails = (order: any) => {
    setSelectedOrder(order);
    setIsDetailOpen(true);
  };

  const printReceipt = (order: any) => {
    const receipt = `
      Restaurant POS Receipt
      =====================
      Order ID: ${order.id}
      Date: ${new Date(order.createdAt).toLocaleString()}
      Customer: ${order.customerName || "Walk-in Customer"}
      Cashier: ${user?.name}
      
      Items:
      ${order.items
        .map((item: any) => {
          const menuItem = getMenuItemById(item.menuItemId);
          return `${menuItem?.name} x${
            item.quantity
          } - $${item.subtotal.toFixed(2)}`;
        })
        .join("\n")}
      
      Total: $${order.total.toFixed(2)}
      Payment: ${order.paymentMethod.toUpperCase()}
      
      Thank you for your visit!
    `;

    console.log(receipt);
    alert("Receipt sent to printer!");
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="text-center sm:text-left">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
          Order History
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2 text-sm sm:text-base">
          View all your processed orders
        </p>
      </div>

      <Card>
        <div className="mb-4 sm:mb-6">
          <Input
            value={searchTerm}
            onChange={setSearchTerm}
            placeholder="Search orders by ID or customer name..."
            icon={Search}
          />
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableCell header>Order ID</TableCell>
              <TableCell header className="hidden sm:table-cell">
                Customer
              </TableCell>
              <TableCell header>Total</TableCell>
              <TableCell header className="hidden md:table-cell">
                Payment
              </TableCell>
              <TableCell header className="hidden lg:table-cell">
                Date
              </TableCell>
              <TableCell header>Status</TableCell>
              <TableCell header className="text-right">
                Actions
              </TableCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredOrders.map((order) => (
              <TableRow key={order.id}>
                <TableCell className="font-medium">
                  <div>
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      #{order.id}
                    </div>
                    <div className="sm:hidden text-xs text-gray-500 dark:text-gray-400">
                      {order.customerName || "Walk-in Customer"}
                    </div>
                    <div className="sm:hidden text-xs text-gray-500 dark:text-gray-400">
                      {order.items.length} items
                    </div>
                  </div>
                </TableCell>
                <TableCell className="hidden sm:table-cell text-sm text-gray-500 dark:text-gray-400">
                  <div>
                    <div>{order.customerName || "Walk-in Customer"}</div>
                    <div className="text-xs">{order.items.length} items</div>
                  </div>
                </TableCell>
                <TableCell className="text-sm font-medium text-gray-900 dark:text-white">
                  Rp. {order.total.toFixed(3)}
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      order.paymentMethod === "cash"
                        ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                        : "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
                    }`}
                  >
                    {order.paymentMethod.toUpperCase()}
                  </span>
                </TableCell>
                <TableCell className="hidden lg:table-cell text-sm text-gray-500 dark:text-gray-400">
                  {new Date(order.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      order.status === "completed"
                        ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                        : order.status === "pending"
                        ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
                        : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                    }`}
                  >
                    {order.status}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end space-x-1 sm:space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => viewOrderDetails(order)}
                      icon={Eye}
                      className="text-xs"
                    >
                      <span className="hidden sm:inline">View</span>
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => printReceipt(order)}
                      icon={FileText}
                      className="text-xs"
                    >
                      <span className="hidden sm:inline">Print</span>
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {filteredOrders.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500 dark:text-gray-400">No orders found</p>
          </div>
        )}
      </Card>

      <Modal
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        title={`Order Details - #${selectedOrder?.id}`}
        size="lg"
      >
        {selectedOrder && (
          <div className="space-y-4 sm:space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                  Order Information
                </h4>
                <div className="space-y-1 text-sm">
                  <p className="text-gray-600 dark:text-gray-400">
                    <span className="font-medium">Order ID:</span> #
                    {selectedOrder.id}
                  </p>
                  <p className="text-gray-600 dark:text-gray-400">
                    <span className="font-medium">Date:</span>{" "}
                    {new Date(selectedOrder.createdAt).toLocaleString()}
                  </p>
                  <p className="text-gray-600 dark:text-gray-400">
                    <span className="font-medium">Customer:</span>{" "}
                    {selectedOrder.customerName || "Walk-in Customer"}
                  </p>
                  <p className="text-gray-600 dark:text-gray-400">
                    <span className="font-medium">Payment:</span>{" "}
                    {selectedOrder.paymentMethod.toUpperCase()}
                  </p>
                </div>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                  Order Summary
                </h4>
                <div className="space-y-1 text-sm">
                  <p className="text-gray-600 dark:text-gray-400">
                    <span className="font-medium">Items:</span>{" "}
                    {selectedOrder.items.length}
                  </p>
                  <p className="text-gray-600 dark:text-gray-400">
                    <span className="font-medium">Total:</span> Rp.
                    {selectedOrder.total.toFixed(3)}
                  </p>
                  <p className="text-gray-600 dark:text-gray-400">
                    <span className="font-medium">Status:</span>
                    <span
                      className={`ml-1 px-2 py-1 rounded-full text-xs ${
                        selectedOrder.status === "completed"
                          ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                          : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
                      }`}
                    >
                      {selectedOrder.status}
                    </span>
                  </p>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-medium text-gray-900 dark:text-white mb-3">
                Order Items
              </h4>
              <div className="space-y-2">
                {selectedOrder.items.map((item: any) => {
                  const menuItem = getMenuItemById(item.menuItemId);
                  return (
                    <div
                      key={item.id}
                      className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                    >
                      <div className="flex items-center space-x-3 min-w-0 flex-1">
                        {menuItem?.image && (
                          <img
                            src={menuItem.image}
                            alt={menuItem.name}
                            className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg object-cover flex-shrink-0"
                          />
                        )}
                        <div className="min-w-0 flex-1">
                          <p className="font-medium text-gray-900 dark:text-white text-sm sm:text-base truncate">
                            {menuItem?.name}
                          </p>
                          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                            Rp. {item.price.toFixed(3)} x {item.quantity}
                          </p>
                        </div>
                      </div>
                      <p className="font-medium text-gray-900 dark:text-white text-sm sm:text-base ml-4">
                        Rp. {item.subtotal.toFixed(3)}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3 pt-4">
              <Button
                variant="outline"
                onClick={() => printReceipt(selectedOrder)}
                icon={FileText}
                className="w-full sm:w-auto"
              >
                Print Receipt
              </Button>
              <Button
                onClick={() => setIsDetailOpen(false)}
                className="w-full sm:w-auto"
              >
                Close
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
