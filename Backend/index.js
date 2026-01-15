import path from 'path';
import { fileURLToPath } from 'url';
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';
import userRoutes from './routes/userRoutes.js';
import productRoutes from './routes/productRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import cartRoutes from './routes/cartRoutes.js';
import multer from 'multer';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

// Connect to Database
const dbPromise = connectDB().catch(err => {
    console.error("Critical: Database connection failed during boot:", err.message);
});

const app = express();

// List of allowed origins - Added Render domains explicitly
const allowedOrigins = [
    "http://localhost:5173",
    "https://beaute-cosmetics.vercel.app",
    "https://beaute-admin.vercel.app",
    "https://beaute-admin.onrender.com",
    "https://beaute-cosmetics.onrender.com",
];

const corsOptions = {
    origin: (origin, callback) => {
        // Allow requests with no origin (like mobile apps)
        if (!origin) return callback(null, true);

        const isAllowed = allowedOrigins.includes(origin) ||
            origin.includes('.vercel.app') ||
            origin.includes('.onrender.com');

        if (isAllowed) {
            callback(null, true);
        } else {
            console.error(`CORS Blocked for origin: ${origin}`);
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With", "Accept", "Origin"],
    optionsSuccessStatus: 200 // Some legacy browsers choke on 204
};

// Apply CORS globally
app.use(cors(corsOptions));

// This handles the OPTIONS preflight explicitly to avoid any middleware skipping
app.options(/.*/, cors(corsOptions));

app.use(express.json());

// Middleware to ensure DB is connected for API requests
app.use(async (req, res, next) => {
    await dbPromise;
    next();
});

// Routes
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/cart', cartRoutes);

// File Upload Logic
const isVercel = process.env.VERCEL === '1';
const storage = isVercel
    ? multer.memoryStorage()
    : multer.diskStorage({
        destination(req, file, cb) {
            const uploadPath = 'uploads/';
            if (!fs.existsSync(uploadPath)) {
                fs.mkdirSync(uploadPath, { recursive: true });
            }
            cb(null, uploadPath);
        },
        filename(req, file, cb) {
            cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
        },
    });

const upload = multer({
    storage,
    fileFilter: function (req, file, cb) {
        const filetypes = /jpg|jpeg|png/;
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = filetypes.test(file.mimetype);
        if (extname && mimetype) {
            return cb(null, true);
        }
        cb('Images only!');
    },
});

app.post('/api/upload', upload.single('image'), (req, res) => {
    if (isVercel) {
        return res.status(400).json({ message: "File uploads to local disk are not supported on Vercel. Use Cloudinary/S3." });
    }
    if (req.file) {
        res.send(`/${req.file.path}`);
    } else {
        res.status(400).send("No file uploaded");
    }
});

app.use('/uploads', express.static(path.join(__dirname, '/uploads')));

app.get('/', (req, res) => {
    res.send('BEAUTÉ API is running...');
});

// Error handling
app.use((err, req, res, next) => {
    // Ensure CORS headers are present even in error responses
    const origin = req.headers.origin;
    if (origin && (allowedOrigins.includes(origin) || origin.includes('.onrender.com') || origin.includes('.vercel.app'))) {
        res.header('Access-Control-Allow-Origin', origin);
        res.header('Access-Control-Allow-Credentials', 'true');
    }

    res.status(err.status || 500).json({
        message: err.message || 'Internal Server Error',
        stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    });
});

const PORT = process.env.PORT || 5000;

if (!isVercel && process.env.NODE_ENV !== 'production') {
    app.listen(PORT, console.log(`Server running on port ${PORT}`));
}

export default app;
