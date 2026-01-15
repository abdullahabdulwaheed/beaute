import mongoose from 'mongoose';
import dotenv from 'dotenv';
import users from './data/users.js';
import admins from './data/admins.js';
import products from './data/products.js';
import categories from './data/categories.js';
import User from './models/User.js';
import Admin from './models/Admin.js';
import Product from './models/Product.js';
import Category from './models/Category.js';
import Order from './models/Order.js';
import connectDB from './config/db.js';
import bcrypt from 'bcryptjs';


dotenv.config();

connectDB();

const importData = async () => {
    try {
        await Order.deleteMany();
        await Product.deleteMany();
        await Category.deleteMany();
        await User.deleteMany();
        await Admin.deleteMany();

        // Hash passwords manually because insertMany bypasses pre('save') hooks
        const salt = await bcrypt.genSalt(10);

        const hashedUsers = await Promise.all(users.map(async u => ({
            ...u,
            password: await bcrypt.hash(u.password, salt)
        })));

        const hashedAdmins = await Promise.all(admins.map(async a => ({
            ...a,
            password: await bcrypt.hash(a.password, salt)
        })));

        await User.insertMany(hashedUsers);
        await Admin.insertMany(hashedAdmins);


        const createdCategories = await Category.insertMany(categories);

        const sampleProducts = products.map((product) => {
            const category = createdCategories.find(c => c.name.toLowerCase() === product.category.toLowerCase());
            return { ...product, category: category._id };
        });

        await Product.insertMany(sampleProducts);

        console.log('Data Imported!');
        process.exit();
    } catch (error) {
        console.error(`${error}`);
        process.exit(1);
    }
};

const destroyData = async () => {
    try {
        await Order.deleteMany();
        await Product.deleteMany();
        await User.deleteMany();
        await Admin.deleteMany();
        await Category.deleteMany();

        console.log('Data Destroyed!');
        process.exit();
    } catch (error) {
        console.error(`${error}`);
        process.exit(1);
    }
};


if (process.argv[2] === '-d') {
    destroyData();
} else {
    importData();
}
