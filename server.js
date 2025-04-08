// server.js
require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');
const http = require('http')
const socketHandlers = require('./sockets')
const socketIo = require('socket.io');
const userRoutes = require('./routes/userRoutes')
const adminRoutes = require('./routes/adminRoutes');
const vendorRoutes = require('./routes/vendorRoutes');
const orderRoutes = require('./routes/orderRoutes');
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes')
const reviewRoutes = require('./routes/reviewRoutes')
const categoryRoutes = require('./routes/categoryRouter')
const cartRoutes = require('./routes/cartRoutes')

const User = require('./models/User');
const { authenticate } = require('./helpers/helper');

const app = express();

app.use(express.json());

app.use('/api/admin', authenticate, adminRoutes);
app.use('/api/vendor', authenticate, vendorRoutes);
app.use('/api/orders', authenticate, orderRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/user', authenticate, userRoutes)
app.use('/api/product', productRoutes)
app.use('/api/review', reviewRoutes)
app.use('/api/category', authenticate, categoryRoutes)
app.use('/api/cart', authenticate, cartRoutes)
const PORT = process.env.PORT || 5000;
const server = http.createServer(app)
const io = socketIo(server)
// Middleware for authentication
socketHandlers(io)

connectDB().then(() => {
    server.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
});
