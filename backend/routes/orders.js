const router = require('express').Router();
const db = require('../db');

// POST /orders — checkout
router.post('/', (req, res) => {
  const { sessionId, items, shippingInfo } = req.body;
  if (!sessionId || !items?.length) return res.status(400).json({ error: 'sessionId and items required' });

  const products = db.get('products');
  const orderItems = [];

  for (const { productId, quantity } of items) {
    const product = products.find({ id: productId });
    const p = product.value();
    if (!p) return res.status(404).json({ error: `Product ${productId} not found` });
    if (p.stock < quantity) return res.status(400).json({ error: `Insufficient stock for "${p.name}"` });
    orderItems.push({ productId, name: p.name, price: p.price, quantity });
    product.assign({ stock: p.stock - quantity }).write();
  }

  const total = orderItems.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const order = {
    id: Date.now().toString(),
    sessionId,
    items: orderItems,
    shippingInfo: shippingInfo || {},
    total: +total.toFixed(2),
    status: 'confirmed',
    createdAt: new Date().toISOString(),
  };

  db.get('orders').push(order).write();
  res.status(201).json(order);
});

// GET /orders?sessionId=xxx — order history for a user
router.get('/', (req, res) => {
  const { sessionId } = req.query;
  if (!sessionId) return res.status(400).json({ error: 'sessionId required' });
  const orders = db.get('orders').filter({ sessionId }).value();
  res.json(orders);
});

// GET /orders/all — admin: all orders
router.get('/all', (req, res) => {
  res.json(db.get('orders').value());
});

// PATCH /orders/:id/status — admin: update status
router.patch('/:id/status', (req, res) => {
  const { status } = req.body;
  const order = db.get('orders').find({ id: req.params.id });
  if (!order.value()) return res.status(404).json({ error: 'Not found' });
  order.assign({ status }).write();
  res.json(order.value());
});

module.exports = router;
