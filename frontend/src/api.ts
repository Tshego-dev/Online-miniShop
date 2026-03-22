const BASE = '/api';

export interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  category: string;
  image: string;
}

export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
}

export interface Order {
  id: string;
  sessionId: string;
  items: OrderItem[];
  shippingInfo: Record<string, string>;
  total: number;
  status: string;
  createdAt: string;
}

const get = (url: string) => fetch(BASE + url).then(r => r.json());
const post = (url: string, body: unknown) =>
  fetch(BASE + url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) }).then(r => r.json());
const patch = (url: string, body: unknown) =>
  fetch(BASE + url, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) }).then(r => r.json());
const del = (url: string) => fetch(BASE + url, { method: 'DELETE' }).then(r => r.json());

export const api = {
  getProducts: (): Promise<Product[]> => get('/products'),
  addProduct: (p: Omit<Product, 'id'>) => post('/products', p),
  updateStock: (id: string, stock: number) => patch(`/products/${id}/stock`, { stock }),
  deleteProduct: (id: string) => del(`/products/${id}`),
  checkout: (sessionId: string, items: { productId: string; quantity: number }[], shippingInfo: Record<string, string>) =>
    post('/orders', { sessionId, items, shippingInfo }),
  getMyOrders: (sessionId: string): Promise<Order[]> => get(`/orders?sessionId=${sessionId}`),
  getAllOrders: (): Promise<Order[]> => get('/orders/all'),
  updateOrderStatus: (id: string, status: string) => patch(`/orders/${id}/status`, { status }),
};
