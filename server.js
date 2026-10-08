const express = require("express");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = process.env.PORT || 3000;
const DB = path.join(__dirname, "orders.json");

app.use(express.json({ limit: "100kb" }));
app.use(express.static(__dirname));

function readOrders() {
  try { return JSON.parse(fs.readFileSync(DB, "utf8")); }
  catch { return []; }
}
function saveOrders(orders) {
  fs.writeFileSync(DB, JSON.stringify(orders, null, 2));
}

app.get("/api/health", (req, res) => res.json({ ok: true, service: "AJWA" }));

app.get("/api/orders", (req, res) => {
  res.json(readOrders().sort((a, b) => b.id - a.id));
});

app.post("/api/orders", (req, res) => {
  const { customer, phone, type, address, items, total } = req.body || {};
  if (!customer || !phone || !Array.isArray(items) || !items.length) {
    return res.status(400).json({ error: "Customer, phone and items are required" });
  }
  const orders = readOrders();
  const order = {
    id: Date.now(),
    orderNumber: "AJ" + String(orders.length + 1).padStart(4, "0"),
    customer: String(customer).trim(),
    phone: String(phone).trim(),
    type: type === "Pickup" ? "Pickup" : "Delivery",
    address: String(address || "").trim(),
    items: items.map(i => ({
      name: String(i.name),
      price: Number(i.price) || 0,
      qty: Number(i.qty) || 1
    })),
    total: Number(total) || 0,
    status: "NEW",
    createdAt: new Date().toISOString()
  };
  orders.push(order);
  saveOrders(orders);
  res.status(201).json(order);
});

app.patch("/api/orders/:id", (req, res) => {
  const allowed = ["NEW", "PREPARING", "READY", "COMPLETED", "CANCELLED"];
  const orders = readOrders();
  const order = orders.find(o => String(o.id) === req.params.id);
  if (!order) return res.status(404).json({ error: "Order not found" });
  if (!allowed.includes(req.body.status)) return res.status(400).json({ error: "Invalid status" });
  order.status = req.body.status;
  order.updatedAt = new Date().toISOString();
  saveOrders(orders);
  res.json(order);
});

app.get("/reception", (req, res) => res.sendFile(path.join(__dirname, "reception.html")));
app.get("*", (req, res) => res.sendFile(path.join(__dirname, "index.html")));

app.listen(PORT, "0.0.0.0", () => console.log(`AJWA running on port ${PORT}`));
