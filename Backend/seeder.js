const mongoose = require('mongoose');
const dotenv = require('dotenv');
const users = require('./data/users');
const admins = require('./data/admins');
const products = require('./data/products');
const categories = require('./data/categories');
const User = require('./models/User');
const Admin = require('./models/Admin');
const Product = require('./models/Product');
const Category = require('./models/Category');
const Order = require('./models/Order');
const connectDB = require('./config/db');
const bcrypt = require('bcryptjs');


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
