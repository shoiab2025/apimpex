// server.js or index.js

import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import chalk from 'chalk'
import { connectMongo } from './config/mongo.js';

import Order from './models/order.model.js';

import responseHandler from './middlewares/responseHandler.js';

// Route imports
import userRoutes from './routes/user.routes.js';
import productRoutes from './routes/product.routes.js';
import orderRoutes from './routes/order.routes.js';
import reviewRoutes from './routes/review.routes.js';
import deliveryRoutes from './routes/delivery.routes.js';
import categoryRoutes from './routes/category.routes.js';
import offerRoutes from './routes/offer.routes.js';
import orderModel from './models/order.model.js';
import deliveryAgentRoutes from './routes/deliveryAgent.routes.js';
// import settingsRoutes from './routes/settings.routes.js';



const app = express();

// Middleware setup
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

app.use(responseHandler)

// Routes
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/deliveries', deliveryRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/offers', offerRoutes);
app.use("/api/delivery-agents", deliveryAgentRoutes);
// app.use('/api/settings', settingsRoutes);

// Error handler (should always be after routes)
// app.use(errorHandler);

app.use((req, res) => {
  return res.status(404).json({
    success: false,
    message: 'API endpoint not found',
    data: [], 
  });
});


const debugOrders = async () => {
  return null
  try {
    let order = '68983cf6fce3f10c00a3efcf'
    order = toObjectId(order);
    const orders = await orderModel.findById(order);
    console.log(chalk.green("Orders fetched successfully:"), orders._id);
  } catch (err) {
    console.error("❌ Error fetching orders:", err);
  }
};


const PORT = process.env.PORT || 4000;

app.listen(PORT,() => {
    console.log(chalk.magenta(`http://localhost:${PORT}`))
    connectMongo();

    debugOrders();
  })
