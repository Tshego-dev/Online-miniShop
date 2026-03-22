const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');

const adapter = new FileSync('db.json');
const db = low(adapter);

db.defaults({
  products: [
    { id: '1', name: 'Wireless Headphones', price: 79.99, stock: 15, category: 'Electronics', image: '/headphones.jpg' },
    { id: '2', name: 'Running Shoes', price: 59.99, stock: 8, category: 'Footwear', image: '/runningshoes.jpg' },
    { id: '3', name: 'Coffee Maker', price: 49.99, stock: 0, category: 'Kitchen', image: '/coffeemaker.jpg' },
    { id: '4', name: 'Yoga Mat', price: 29.99, stock: 20, category: 'Sports', image: '/yogamats.jpg' },
    { id: '5', name: 'Desk Lamp', price: 34.99, stock: 5, category: 'Home', image: '/lamp.jpg' },
    { id: '6', name: 'Backpack', price: 44.99, stock: 12, category: 'Accessories', image: '/backpack.jpg' },
  ],
  orders: [],
}).write();

module.exports = db;
