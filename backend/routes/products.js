const router = require('express').Router();
const db = require('../db');

router.get('/', (req, res) => {
  res.json(db.get('products').value());
});

router.get('/:id', (req, res) => {
  const product = db.get('products').find({ id: req.params.id }).value();
  if (!product) return res.status(404).json({ error: 'Not found' });
  res.json(product);
});

router.post('/', (req, res) => {
  const { name, price, stock, category, image } = req.body;
  if (!name || price == null || stock == null) return res.status(400).json({ error: 'name, price, stock required' });
  const product = { id: Date.now().toString(), name, price: +price, stock: +stock, category: category || '', image: image || `https://placehold.co/300x200?text=${encodeURIComponent(name)}` };
  db.get('products').push(product).write();
  res.status(201).json(product);
});

router.patch('/:id/stock', (req, res) => {
  const { stock } = req.body;
  if (stock == null) return res.status(400).json({ error: 'stock required' });
  const product = db.get('products').find({ id: req.params.id });
  if (!product.value()) return res.status(404).json({ error: 'Not found' });
  product.assign({ stock: +stock }).write();
  res.json(product.value());
});

router.delete('/:id', (req, res) => {
  const product = db.get('products').find({ id: req.params.id }).value();
  if (!product) return res.status(404).json({ error: 'Not found' });
  db.get('products').remove({ id: req.params.id }).write();
  res.json({ success: true });
});

module.exports = router;
