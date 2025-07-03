const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const User = require("../models/User");
const Menu = require("../models/Menu");
const Order = require("../models/Order");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB Connected for seeding");
  } catch (error) {
    console.error("❌ Error connecting to MongoDB:", error.message);
    process.exit(1);
  }
};

const seedUsers = async () => {
  const users = [
    {
      nama: "Admin User",
      email: "admin@coffee.com",
      password: await bcrypt.hash("password123", 10), // Hash password
      role: "admin",
      avatar:
        "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1",
      isActive: true,
    },
    {
      nama: "Sarah Johnson",
      email: "cashier1@coffee.com",
      password: await bcrypt.hash("password123", 10), // Hash password
      role: "cashier",
      avatar:
        "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1",
      isActive: true,
    },
    {
      nama: "Mike Wilson",
      email: "cashier2@coffee.com",
      password: await bcrypt.hash("password123", 10), // Hash password
      role: "cashier",
      avatar:
        "https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1",
      isActive: true,
    },
  ];

  await User.deleteMany({});
  await User.insertMany(users);
  console.log("✅ Users seeded successfully");

  return await User.find({});
};

const seedMenu = async () => {
  const menuItems = [
    {
      name: "Espresso",
      description: "Rich and bold espresso shot made from premium coffee beans",
      price: 2.5,
      category: "Coffee",
      image:
        "https://images.pexels.com/photos/312418/pexels-photo-312418.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&dpr=1",
      stock: 50,
      isAvailable: true,
    },
    {
      name: "Cappuccino",
      description: "Classic Italian coffee with steamed milk and foam",
      price: 4.0,
      category: "Coffee",
      image:
        "https://images.pexels.com/photos/302899/pexels-photo-302899.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&dpr=1",
      stock: 45,
      isAvailable: true,
    },
    {
      name: "Latte",
      description: "Smooth espresso with steamed milk and light foam",
      price: 4.5,
      category: "Coffee",
      image:
        "https://images.pexels.com/photos/324028/pexels-photo-324028.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&dpr=1",
      stock: 40,
      isAvailable: true,
    },
    {
      name: "Green Tea",
      description: "Fresh organic green tea with antioxidants",
      price: 3.0,
      category: "Tea",
      image:
        "https://images.pexels.com/photos/1417945/pexels-photo-1417945.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&dpr=1",
      stock: 30,
      isAvailable: true,
    },
    {
      name: "Croissant",
      description: "Buttery, flaky French pastry perfect with coffee",
      price: 3.5,
      category: "Food",
      image:
        "https://images.pexels.com/photos/1070850/pexels-photo-1070850.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&dpr=1",
      stock: 25,
      isAvailable: true,
    },
    {
      name: "Chocolate Cake",
      description: "Rich, moist chocolate cake with dark chocolate frosting",
      price: 5.5,
      category: "Dessert",
      image:
        "https://images.pexels.com/photos/291528/pexels-photo-291528.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&dpr=1",
      stock: 15,
      isAvailable: true,
    },
    {
      name: "Iced Americano",
      description: "Refreshing iced coffee with bold espresso flavor",
      price: 3.75,
      category: "Beverage",
      image:
        "https://images.pexels.com/photos/1251175/pexels-photo-1251175.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&dpr=1",
      stock: 35,
      isAvailable: true,
    },
    {
      name: "Fruit Smoothie",
      description: "Fresh mixed fruit smoothie with yogurt and honey",
      price: 4.25,
      category: "Beverage",
      image:
        "https://images.pexels.com/photos/1092730/pexels-photo-1092730.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&dpr=1",
      stock: 20,
      isAvailable: true,
    },
  ];

  await Menu.deleteMany({});
  await Menu.insertMany(menuItems);
  console.log("✅ Menu items seeded successfully");

  return await Menu.find({});
};

const seedOrders = async (users, menuItems) => {
  const orders = [
    {
      cashierId: users[1]._id, // Sarah Johnson
      items: [
        {
          menuItemId: menuItems[0]._id, // Espresso
          quantity: 2,
          price: menuItems[0].price,
          subtotal: menuItems[0].price * 2,
        },
        {
          menuItemId: menuItems[1]._id, // Cappuccino
          quantity: 1,
          price: menuItems[1].price,
          subtotal: menuItems[1].price * 1,
        },
      ],
      total: menuItems[0].price * 2 + menuItems[1].price * 1,
      paymentMethod: "cash",
      status: "completed",
      customerName: "John Doe",
      customerPhone: "+1234567890",
      notes: "Regular customer",
    },
    {
      cashierId: users[2]._id, // Mike Wilson
      items: [
        {
          menuItemId: menuItems[2]._id, // Latte
          quantity: 1,
          price: menuItems[2].price,
          subtotal: menuItems[2].price * 1,
        },
        {
          menuItemId: menuItems[4]._id, // Croissant
          quantity: 2,
          price: menuItems[4].price,
          subtotal: menuItems[4].price * 2,
        },
      ],
      total: menuItems[2].price * 1 + menuItems[4].price * 2,
      paymentMethod: "card",
      status: "completed",
      customerName: "Jane Smith",
      customerPhone: "+1234567891",
      notes: "To go order",
    },
    {
      cashierId: users[1]._id,
      items: [
        {
          menuItemId: menuItems[5]._id, // Chocolate Cake
          quantity: 1,
          price: menuItems[5].price,
          subtotal: menuItems[5].price * 1,
        },
        {
          menuItemId: menuItems[1]._id, // Cappuccino
          quantity: 2,
          price: menuItems[1].price,
          subtotal: menuItems[1].price * 2,
        },
      ],
      total: menuItems[5].price * 1 + menuItems[1].price * 2,
      paymentMethod: "digital",
      status: "processing",
      customerName: "Bob Johnson",
      customerPhone: "+1234567892",
    },
    {
      cashierId: users[2]._id,
      items: [
        {
          menuItemId: menuItems[6]._id, // Iced Americano
          quantity: 3,
          price: menuItems[6].price,
          subtotal: menuItems[6].price * 3,
        },
      ],
      total: menuItems[6].price * 3,
      paymentMethod: "cash",
      status: "pending",
      customerName: "Alice Brown",
      customerPhone: "+1234567893",
      notes: "Large order for office",
    },
  ];

  await Order.deleteMany({});
  await Order.insertMany(orders);
  console.log("✅ Orders seeded successfully");
};

const seedDatabase = async () => {
  try {
    await connectDB();

    console.log("🌱 Starting database seeding...");

    const users = await seedUsers();
    const menuItems = await seedMenu();
    await seedOrders(users, menuItems);

    console.log("🎉 Database seeding completed successfully!");
    console.log("\n📋 Seeded Data Summary:");
    console.log(`👥 Users: ${users.length}`);
    console.log(`🍽️  Menu Items: ${menuItems.length}`);
    console.log(`📋 Orders: 4`);

    console.log("\n🔐 Demo Login Credentials:");
    console.log("Admin: admin@coffee.com / password123");
    console.log("Cashier 1: cashier1@coffee.com / password123");
    console.log("Cashier 2: cashier2@coffee.com / password123");

    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    process.exit(1);
  }
};

seedDatabase();
