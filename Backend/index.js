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
// In Vercel, we don't want to crash the whole lambda if DB is slow
const dbPromise = connectDB().catch(err => {
    console.error("Critical: Database connection failed during boot:", err.message);
});

const app = express();

const allowedOrigins = [
    "http://localhost:5173",
    "https://beaute-cosmetics.vercel.app",
    "https://beaute-admin.vercel.app",
];

const corsOptions = {
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin) || origin.endsWith('.vercel.app') || origin.endsWith('.onrender.com')) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Origin", "X-Requested-With", "Content-Type", "Accept", "Authorization"]
};

app.use(cors(corsOptions));
app.options("(.*)", cors(corsOptions));

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
// Vercel filesystem is read-only. We use memoryStorage for Vercel.
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
        // Since Vercel is read-only, you'd usually use Cloudinary/S3.
        // For now, we'll return a placeholder or error to avoid crashes.
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
