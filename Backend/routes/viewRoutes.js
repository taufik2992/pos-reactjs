const express = require("express");
const Menu = require("../models/Menu");
const Order = require("../models/Order");
const User = require("../models/User");
const Shift = require("../models/Shift");

const router = express.Router();

// Home page - Dashboard
router.get("/", async (req, res) => {
  try {
    const menuCount = await Menu.countDocuments();
    const orderCount = await Order.countDocuments();
    const userCount = await User.countDocuments();
    const activeShifts = await Shift.countDocuments({ status: "active" });

    const recentOrders = await Order.find()
      .populate("cashierId", "nama")
      .sort({ createdAt: -1 })
      .limit(5);

    res.render("dashboard", {
      title: "Coffee Shop Dashboard",
      stats: {
        menuCount,
        orderCount,
        userCount,
        activeShifts,
      },
      recentOrders,
    });
  } catch (error) {
    console.error("Dashboard error:", error);
    res.render("error", {
      title: "Dashboard Error",
      error: "Failed to load dashboard",
    });
  }
});

// Menu page
router.get("/menu", async (req, res) => {
  try {
    const { category, page = 1 } = req.query;
    const limit = 12;

    const query = {};
    if (category) query.category = category;

    const menuItems = await Menu.find(query)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const total = await Menu.countDocuments(query);
    const categories = await Menu.distinct("category");

    res.render("menu", {
      title: "Menu Items",
      menuItems,
      categories,
      currentCategory: category || "All",
      pagination: {
        page: parseInt(page),
        pages: Math.ceil(total / limit),
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1,
      },
    });
  } catch (error) {
    console.error("Menu page error:", error);
    res.render("error", {
      title: "Menu Error",
      error: "Failed to load menu",
    });
  }
});

// Orders page
router.get("/orders", async (req, res) => {
  try {
    const { status, page = 1 } = req.query;
    const limit = 10;

    const query = {};
    if (status) query.status = status;

    const orders = await Order.find(query)
      .populate("cashierId", "nama")
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const total = await Order.countDocuments(query);
    const statuses = ["pending", "processing", "completed", "cancelled"];

    res.render("orders", {
      title: "Orders",
      orders,
      statuses,
      currentStatus: status || "All",
      pagination: {
        page: parseInt(page),
        pages: Math.ceil(total / limit),
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1,
      },
    });
  } catch (error) {
    console.error("Orders page error:", error);
    res.render("error", {
      title: "Orders Error",
      error: "Failed to load orders",
    });
  }
});

// Users page
router.get("/users", async (req, res) => {
  try {
    const { role, page = 1 } = req.query;
    const limit = 10;

    const query = {};
    if (role) query.role = role;

    const users = await User.find(query)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const total = await User.countDocuments(query);
    const roles = ["admin", "cashier"];

    res.render("users", {
      title: "Users",
      users,
      roles,
      currentRole: role || "All",
      pagination: {
        page: parseInt(page),
        pages: Math.ceil(total / limit),
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1,
      },
    });
  } catch (error) {
    console.error("Users page error:", error);
    res.render("error", {
      title: "Users Error",
      error: "Failed to load users",
    });
  }
});

// Reports page
router.get("/reports", (req, res) => {
  res.render("reports", {
    title: "Reports & Analytics",
  });
});

// Login page
router.get("/login", (req, res) => {
  res.render("login", { title: "Login" });
});

// API Testing page
router.get("/api-test", (req, res) => {
  res.render("api-test", { title: "API Testing" });
});

module.exports = router;
