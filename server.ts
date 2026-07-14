import express from 'express';
import type { Order } from './src/types';
// Lightweight runtime shims to avoid requiring @types packages in this environment
declare const process: any;
type Req = { body: any; params: any; query?: any } & Record<string, any>;
type Res = { json: (body: any) => void; status: (code: number) => Res; sendFile?: (path: string) => void } & Record<string, any>;
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';

const app = express();
const PORT = 3000;

app.use(express.json());

const DATA_DIR = path.join(process.cwd(), 'data');
const ORDERS_FILE = path.join(DATA_DIR, 'orders.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Initial seed data
const initialOrders: Order[] = [
  {
    id: 'DZ-74891',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
    customerName: 'بلال عمراني (Bilal Amrani)',
    phoneNumber: '0554123456',
    wilayaCode: 16,
    wilayaNameAr: 'الجزائر العاصمة',
    wilayaNameFr: 'Alger',
    address: 'حي الموز، باب الزوار، عمارة 4ب، شقة 12',
    shippingCompany: 'Yalidine Express',
    shippingType: 'Home',
    shippingFee: 400,
    productPrice: 1990,
    totalPrice: 2390,
    quantity: 1,
    status: 'Pending'
  },
  {
    id: 'DZ-42918',
    timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
    customerName: 'سفيان مراح (Sofiane Merah)',
    phoneNumber: '0661987654',
    wilayaCode: 31,
    wilayaNameAr: 'وهران',
    wilayaNameFr: 'Oran',
    address: 'شارع جبهة التحرير الوطني، عمارة الكرامة، رقم 15',
    shippingCompany: 'ZR Express',
    shippingType: 'Office',
    shippingFee: 300,
    productPrice: 1990,
    totalPrice: 2290,
    quantity: 1,
    status: 'Confirmed'
  },
  {
    id: 'DZ-93821',
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
    customerName: 'ياسمين بوعزيز (Yasmine Bouaziz)',
    phoneNumber: '0770112233',
    wilayaCode: 25,
    wilayaNameAr: 'قسنطينة',
    wilayaNameFr: 'Constantine',
    address: 'حي زواغي سليمان، فيلا 18أ، قسنطينة',
    shippingCompany: 'Yalidine Express',
    shippingType: 'Home',
    shippingFee: 600,
    productPrice: 1990,
    totalPrice: 2590,
    quantity: 1,
    status: 'Shipped'
  },
  {
    id: 'DZ-10492',
    timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
    customerName: 'أمينة بن إسماعيل (Amina Bensmail)',
    phoneNumber: '0540556677',
    wilayaCode: 13,
    wilayaNameAr: 'تلمسان',
    wilayaNameFr: 'Tlemcen',
    address: 'حي الكدية، رقم 42، تلمسان',
    shippingCompany: 'ZR Express',
    shippingType: 'Home',
    shippingFee: 550,
    productPrice: 1990,
    totalPrice: 2540,
    quantity: 1,
    status: 'Cancelled'
  }
];

// Helper to read orders
function readOrders(): Order[] {
  try {
    if (!fs.existsSync(ORDERS_FILE)) {
      fs.writeFileSync(ORDERS_FILE, JSON.stringify(initialOrders, null, 2), 'utf8');
      return initialOrders;
    }
    const data = fs.readFileSync(ORDERS_FILE, 'utf8');
    return JSON.parse(data) as Order[];
  } catch (err) {
    console.error('Error reading orders file:', err);
    return [];
  }
}

// Helper to write orders
function writeOrders(orders: Order[]) {
  try {
    fs.writeFileSync(ORDERS_FILE, JSON.stringify(orders, null, 2), 'utf8');
  } catch (err) {
    console.error('Error writing orders file:', err);
  }
}

// API Routes

// GET: Retrieve all orders
app.get('/api/orders', (req: Req, res: Res) => {
  const orders = readOrders();
  res.json({ success: true, orders });
});

// POST: Place a new order
app.post('/api/orders', (req: Req, res: Res) => {
  const {
    customerName,
    phoneNumber,
    wilayaCode,
    wilayaNameAr,
    wilayaNameFr,
    address,
    shippingCompany,
    shippingType,
    shippingFee,
    productPrice,
    totalPrice,
    quantity
  } = req.body;

  // Strict Algerian format validation
  // Mobile numbers starting with 05, 06, or 07 followed by 8 digits
  const dzPhoneRegex = /^(05|06|07)[0-9]{8}$/;
  if (!customerName || !customerName.trim()) {
    return res.status(400).json({ success: false, message: 'Customer name is required / اسم العميل مطلوب' });
  }
  if (!phoneNumber || !dzPhoneRegex.test(phoneNumber.trim().replace(/\s/g, ''))) {
    return res.status(400).json({ success: false, message: 'Invalid Algerian phone format. Must start with 05, 06, or 07 followed by 8 digits / رقم هاتف جزائري غير صالح' });
  }
  if (!wilayaCode || wilayaCode < 1 || wilayaCode > 69) {
    return res.status(400).json({ success: false, message: 'Invalid Wilaya selected / الولاية المحددة غير صالحة' });
  }
  if (!address || !address.trim()) {
    return res.status(400).json({ success: false, message: 'Delivery address is required / العنوان مطلوب' });
  }

  const orders = readOrders();
  
  // Create unique Order ID (e.g., DZ-XXXXX)
  const orderId = `DZ-${Math.floor(10000 + Math.random() * 90000)}`;
  const parsedQuantity = Number(quantity ?? 1);
  const unitPrice = 1990;
  const calculatedProductPrice = unitPrice * (Number.isFinite(parsedQuantity) && parsedQuantity > 0 ? parsedQuantity : 1);
  const calculatedTotalPrice = calculatedProductPrice + Number(shippingFee || 0);

  const newOrder: Order = {
    id: orderId,
    timestamp: new Date().toISOString(),
    customerName: customerName.trim(),
    phoneNumber: phoneNumber.trim().replace(/\s/g, ''),
    wilayaCode,
    wilayaNameAr,
    wilayaNameFr,
    address: address.trim(),
    shippingCompany,
    shippingType,
    shippingFee: Number(shippingFee),
    productPrice: Number(productPrice ?? calculatedProductPrice),
    totalPrice: Number(totalPrice ?? calculatedTotalPrice),
    quantity: parsedQuantity,
    status: 'Pending'
  };

  orders.unshift(newOrder); // Add to the beginning
  writeOrders(orders);

  res.status(201).json({ success: true, order: newOrder });
});

// PUT: Update order status
app.put('/api/orders/:id', (req: Req, res: Res) => {
  const { id } = req.params;
  const { status } = req.body;
  const allowedStatuses = ['Pending', 'Confirmed', 'Shipped', 'Cancelled'];

  if (!allowedStatuses.includes(status)) {
    return res.status(400).json({ success: false, message: 'Invalid status' });
  }

  const orders = readOrders();
  const index = orders.findIndex((o: any) => o.id === id);

  if (index === -1) {
    return res.status(404).json({ success: false, message: 'Order not found' });
  }

  orders[index].status = status;
  writeOrders(orders);

  res.json({ success: true, order: orders[index] });
});

// DELETE: Remove an order
app.delete('/api/orders/:id', (req: Req, res: Res) => {
  const { id } = req.params;
  const orders = readOrders();
  const filtered = orders.filter((o: any) => o.id !== id);

  if (filtered.length === orders.length) {
    return res.status(404).json({ success: false, message: 'Order not found' });
  }

  writeOrders(filtered);
  res.json({ success: true, message: 'Order deleted successfully' });
});

// GET: Retrieve analytical stats
app.get('/api/stats', (req: Req, res: Res) => {
  const orders = readOrders();
  
  const totalOrders = orders.length;
  const confirmed = orders.filter((o: any) => o.status === 'Confirmed').length;
  const pending = orders.filter((o: any) => o.status === 'Pending').length;
  const shipped = orders.filter((o: any) => o.status === 'Shipped').length;
  const cancelled = orders.filter((o: any) => o.status === 'Cancelled').length;

  const totalRevenue = orders
    .filter((o: any) => o.status === 'Confirmed' || o.status === 'Shipped')
    .reduce((acc: number, o: any) => acc + o.productPrice, 0);

  // Split by shipping company
  const yalidineCount = orders.filter((o: any) => o.shippingCompany === 'Yalidine Express').length;
  const zrCount = orders.filter((o: any) => o.shippingCompany === 'ZR Express').length;

  // Split by Wilaya
  const wilayaMap: Record<string, number> = {};
  orders.forEach((o: any) => {
    const key = `${o.wilayaCode} - ${o.wilayaNameFr}`;
    wilayaMap[key] = (wilayaMap[key] || 0) + 1;
  });

  const wilayaStats = Object.keys(wilayaMap).map(key => ({
    name: key,
    count: wilayaMap[key]
  })).sort((a, b) => b.count - a.count);

  res.json({
    success: true,
    stats: {
      totalOrders,
      confirmed,
      pending,
      shipped,
      cancelled,
      totalRevenue,
      yalidineCount,
      zrCount,
      wilayaStats
    }
  });
});

// Serve the schema details
app.get('/api/schema', (req: Req, res: Res) => {
  const sqlDdl = `CREATE TABLE IF NOT EXISTS orders (
    order_id VARCHAR(50) PRIMARY KEY,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    customer_name VARCHAR(100) NOT NULL,
    phone_number VARCHAR(20) NOT NULL,
    wilaya_code INT NOT NULL,
    wilaya_name_ar VARCHAR(50) NOT NULL,
    wilaya_name_fr VARCHAR(50) NOT NULL,
    address TEXT NOT NULL,
    shipping_company VARCHAR(50) NOT NULL,
    shipping_type VARCHAR(20) NOT NULL,
    shipping_fee DECIMAL(10, 2) NOT NULL,
    product_price DECIMAL(10, 2) NOT NULL,
    total_price DECIMAL(10, 2) NOT NULL,
    order_status VARCHAR(20) DEFAULT 'Pending'
);`;

  const jsonSchema = {
    "$schema": "http://json-schema.org/draft-07/schema#",
    "title": "AlgerianCopperBraceletOrder",
    "type": "object",
    "properties": {
      "id": { "type": "string", "pattern": "^DZ-[0-9]{5}$" },
      "timestamp": { "type": "string", "format": "date-time" },
      "customerName": { "type": "string", "minLength": 1 },
      "phoneNumber": { "type": "string", "pattern": "^0[567][0-9]{8}$" },
      "wilayaCode": { "type": "integer", "minimum": 1, "maximum": 69 },
      "wilayaNameAr": { "type": "string" },
      "wilayaNameFr": { "type": "string" },
      "address": { "type": "string" },
      "shippingCompany": { "type": "string", "enum": ["Yalidine Express", "ZR Express"] },
      "shippingType": { "type": "string", "enum": ["Home", "Office"] },
      "shippingFee": { "type": "number" },
      "productPrice": { "type": "number", "const": 1990 },
      "totalPrice": { "type": "number" },
      "status": { "type": "string", "enum": ["Pending", "Confirmed", "Shipped", "Cancelled"] }
    },
    "required": ["id", "timestamp", "customerName", "phoneNumber", "wilayaCode", "wilayaNameAr", "wilayaNameFr", "address", "shippingCompany", "shippingType", "shippingFee", "productPrice", "totalPrice", "status"]
  };

  res.json({ success: true, sqlDdl, jsonSchema });
});

// Vite server setup or production bundle serving
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Req, res: Res) => {
      const indexPath = path.join(distPath, 'index.html');
      if (typeof res.sendFile === 'function') {
        res.sendFile(indexPath);
      } else if (typeof res.send === 'function') {
        try {
          const html = fs.readFileSync(indexPath, 'utf8');
          res.send(html as any);
        } catch (e) {
          res.status(500).json({ success: false, message: 'Failed to read index.html' });
        }
      }
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Algerian Bracelet E-commerce] Server is running on http://localhost:${PORT}`);
  });
}

startServer();
