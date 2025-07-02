import React, { useState } from "react";
import {
  Plus,
  Minus,
  ShoppingCart,
  Search,
  CreditCard,
  Banknote,
} from "lucide-react";
import { Card } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { Modal } from "../../components/ui/Modal";
import { MenuItem, OrderItem } from "../../types";
import { menuItems } from "../../data/menu";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";
import QRCode from "qrcode";

export const Orders: React.FC = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [cart, setCart] = useState<OrderItem[]>([]);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [customerName, setCustomerName] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"cash" | "qr">("cash");
  const [qrCodeData, setQrCodeData] = useState("");

  const categories = [
    "All",
    ...Array.from(new Set(menuItems.map((item) => item.category))),
  ];

  const filteredItems = menuItems.filter((item) => {
    const matchesSearch = item.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "All" || item.category === selectedCategory;
    return matchesSearch && matchesCategory && item.isAvailable;
  });

  const addToCart = (menuItem: MenuItem) => {
    const existingItem = cart.find((item) => item.menuItemId === menuItem.id);

    if (existingItem) {
      setCart(
        cart.map((item) =>
          item.menuItemId === menuItem.id
            ? {
                ...item,
                quantity: item.quantity + 1,
                subtotal: (item.quantity + 1) * item.price,
              }
            : item
        )
      );
    } else {
      const newItem: OrderItem = {
        id: Date.now().toString(),
        menuItemId: menuItem.id,
        quantity: 1,
        price: menuItem.price,
        subtotal: menuItem.price,
      };
      setCart([...cart, newItem]);
    }
    toast.success(`${menuItem.name} added to cart`);
  };

  const removeFromCart = (menuItemId: string) => {
    const existingItem = cart.find((item) => item.menuItemId === menuItemId);

    if (existingItem && existingItem.quantity > 1) {
      setCart(
        cart.map((item) =>
          item.menuItemId === menuItemId
            ? {
                ...item,
                quantity: item.quantity - 1,
                subtotal: (item.quantity - 1) * item.price,
              }
            : item
        )
      );
    } else {
      setCart(cart.filter((item) => item.menuItemId !== menuItemId));
    }
  };

  const clearCart = () => setCart([]);
  const getCartTotal = () =>
    cart.reduce((total, item) => total + item.subtotal, 0);
  const getMenuItemById = (id: string) =>
    menuItems.find((item) => item.id === id);

  const handleCheckout = async () => {
    if (cart.length === 0) return toast.error("Cart is empty");

    if (paymentMethod === "qr") {
      const qrData = `Restaurant Payment - Total: $${getCartTotal().toFixed(
        2
      )} - Order ID: ${Date.now()}`;
      try {
        const qrCode = await QRCode.toDataURL(qrData);
        setQrCodeData(qrCode);
      } catch {
        toast.error("Failed to generate QR code");
        return;
      }
    }
    setIsCheckoutOpen(true);
  };

  const completeOrder = () => {
    toast.success(`Order #${Date.now()} completed successfully!`);
    setCart([]);
    setCustomerName("");
    setQrCodeData("");
    setIsCheckoutOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="text-center sm:text-left">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white leading-snug">
          🛒 Create Order
        </h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm mt-2">
          Browse and select menu items for the current customer.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3 order-2 lg:order-1">
          <Card>
            <div className="space-y-4 mb-6">
              <Input
                value={searchTerm}
                onChange={setSearchTerm}
                placeholder="Search menu items..."
                icon={Search}
              />
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-4 py-2 rounded-full text-sm font-medium border transition-all duration-200 ${
                      selectedCategory === category
                        ? "bg-amber-500 text-white border-amber-500 shadow-md"
                        : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 border-gray-300 dark:border-gray-600"
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {filteredItems.map((item) => (
                <div
                  key={item.id}
                  className="rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm hover:shadow-lg transition-shadow"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-72 object-cover"
                  />
                  <div className="p-4 space-y-2">
                    <h3 className="text-base font-semibold text-gray-900 dark:text-white line-clamp-2">
                      {item.name}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
                      {item.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold text-amber-600">
                        Rp. {item.price.toFixed(3)}
                      </span>
                      <Button
                        size="sm"
                        onClick={() => addToCart(item)}
                        icon={Plus}
                        disabled={item.stock === 0}
                        className="text-xs"
                      >
                        Add
                      </Button>
                    </div>
                    {item.stock < 10 && (
                      <p className="text-xs text-red-500">
                        Only {item.stock} left
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <div className="lg:col-span-1 order-1 lg:order-2">
          <Card className="lg:sticky lg:top-20" padding="sm">
            <div className="flex justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                <ShoppingCart className="w-5 h-5 mr-2" /> Cart ({cart.length})
              </h3>
              {cart.length > 0 && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={clearCart}
                  className="text-xs"
                >
                  Clear
                </Button>
              )}
            </div>
            <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
              {cart.length === 0 ? (
                <p className="text-gray-500 dark:text-gray-400 text-center py-4 text-sm">
                  Cart is empty
                </p>
              ) : (
                cart.map((item) => {
                  const menuItem = getMenuItemById(item.menuItemId);
                  return (
                    <div
                      key={item.id}
                      className="flex items-center justify-between bg-gray-50 dark:bg-gray-700 rounded-lg p-3"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 dark:text-white text-sm truncate">
                          {menuItem?.name}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Rp. {item.price.toFixed(3)} each
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => removeFromCart(item.menuItemId)}
                          className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="font-medium text-gray-900 dark:text-white text-sm min-w-[20px] text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => {
                            const menuItem = getMenuItemById(item.menuItemId);
                            if (menuItem) addToCart(menuItem);
                          }}
                          className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="ml-2 text-right">
                        <p className="font-medium text-gray-900 dark:text-white text-sm">
                          Rp. {item.subtotal.toFixed(3)}
                        </p>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
            {cart.length > 0 && (
              <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-lg font-semibold text-gray-900 dark:text-white">
                    Total:
                  </span>
                  <span className="text-xl font-bold text-amber-600">
                    Rp. {getCartTotal().toFixed(3)}
                  </span>
                </div>
                <Button
                  onClick={handleCheckout}
                  className="w-full"
                  size="lg"
                  icon={CreditCard}
                >
                  Checkout
                </Button>
              </div>
            )}
          </Card>
        </div>
      </div>

      <Modal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        title="🧾 Complete Your Order"
        size="lg"
      >
        <div className="space-y-6">
          <Input
            label="Customer Name (Optional)"
            value={customerName}
            onChange={setCustomerName}
            placeholder="Enter customer name"
          />
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Payment Method
            </label>
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => setPaymentMethod("cash")}
                className={`p-4 border rounded-lg flex items-center justify-center space-x-2 transition-colors ${
                  paymentMethod === "cash"
                    ? "border-amber-600 bg-amber-50 dark:bg-amber-900/20 text-amber-600"
                    : "border-gray-300 dark:border-gray-600 hover:border-gray-400"
                }`}
              >
                <Banknote className="w-5 h-5" />{" "}
                <span className="text-base">Cash</span>
              </button>
              <button
                onClick={() => setPaymentMethod("qr")}
                className={`p-4 border rounded-lg flex items-center justify-center space-x-2 transition-colors ${
                  paymentMethod === "qr"
                    ? "border-amber-600 bg-amber-50 dark:bg-amber-900/20 text-amber-600"
                    : "border-gray-300 dark:border-gray-600 hover:border-gray-400"
                }`}
              >
                <CreditCard className="w-5 h-5" />{" "}
                <span className="text-base">QR Code</span>
              </button>
            </div>
          </div>
          {paymentMethod === "qr" && qrCodeData && (
            <div className="text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                Scan QR Code to Pay
              </p>
              <img
                src={qrCodeData}
                alt="QR Code"
                className="max-w-full h-auto mx-auto"
              />
            </div>
          )}
          <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
            <div className="space-y-2">
              {cart.map((item) => {
                const menuItem = getMenuItemById(item.menuItemId);
                return (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400 truncate mr-2">
                      {menuItem?.name} x {item.quantity}
                    </span>
                    <span className="text-gray-900 dark:text-white font-medium">
                      Rp. {item.subtotal.toFixed(3)}
                    </span>
                  </div>
                );
              })}
              <div className="border-t border-gray-200 dark:border-gray-700 pt-2 flex justify-between font-semibold">
                <span className="text-gray-900 dark:text-white">Total:</span>
                <span className="text-amber-600 text-lg">
                  Rp. {getCartTotal().toFixed(3)}
                </span>
              </div>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
            <Button
              variant="outline"
              onClick={() => setIsCheckoutOpen(false)}
              className="w-full sm:flex-1"
            >
              Cancel
            </Button>
            <Button onClick={completeOrder} className="w-full sm:flex-1">
              Complete Order
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
