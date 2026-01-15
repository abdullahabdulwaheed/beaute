import jwt from 'jsonwebtoken';
import { OAuth2Client } from 'google-auth-library';
import User from '../models/User.js';
import Admin from '../models/Admin.js';

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d'
    });
};

// @desc    Register new user
// @route   POST /api/users
// @access  Public
const registerUser = async (req, res) => {
    const { name, email, password, role } = req.body;

    const userExists = await User.findOne({ email });

    if (userExists) {
        return res.status(400).json({ message: 'User already exists' });
    }

    const user = await User.create({
        name,
        email,
        password,
        role: role || 'user'
    });

    if (user) {
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            profilePic: user.profilePic,
            address: user.address,
            phone: user.phone,
            token: generateToken(user._id)
        });
    } else {
        res.status(400).json({ message: 'Invalid user data' });
    }
};

// @desc    Authenticate a user or admin
// @route   POST /api/users/login
// @access  Public
const loginUser = async (req, res) => {
    const { email, password } = req.body;

    // Check in Admin collection first
    const adminExists = await Admin.findOne({ email }).select('+password');
    if (adminExists && (await adminExists.matchPassword(password))) {
        return res.json({
            _id: adminExists._id,
            name: adminExists.name,
            email: adminExists.email,
            role: 'admin',
            profilePic: "",
            address: "",
            phone: "",
            token: generateToken(adminExists._id)
        });
    }

    // If not admin, check in User collection
    const user = await User.findOne({ email }).select('+password');
    if (user && (await user.matchPassword(password))) {
        return res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            profilePic: user.profilePic || "",
            address: user.address || "",
            phone: user.phone || "",
            token: generateToken(user._id)
        });
    }

    res.status(401).json({ message: 'Invalid email or password' });
};

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = async (req, res) => {
    // Check both if needed, but req.user is already set by middleware
    if (req.user) {
        res.json({
            _id: req.user._id,
            name: req.user.name,
            email: req.user.email,
            role: req.user.role || 'admin'
        });
    } else {
        res.status(404).json({ message: 'User not found' });
    }
};

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
const getUsers = async (req, res) => {
    const users = await User.find({});
    res.json(users);
};

// @desc    Google Login
// @route   POST /api/users/google-login
// @access  Public
const googleLogin = async (req, res) => {
    const { tokenId } = req.body;
    const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

    try {
        const ticket = await client.verifyIdToken({
            idToken: tokenId,
            audience: process.env.GOOGLE_CLIENT_ID
        });

        const { name, email, picture, sub } = ticket.getPayload();

        let user = await User.findOne({ email });

        if (!user) {
            // Create user if doesn't exist
            user = await User.create({
                name,
                email,
                password: Math.random().toString(36).slice(-10), // Random password
                role: 'user'
            });
        }

        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            profilePic: user.profilePic || "",
            address: user.address || "",
            phone: user.phone || "",
            token: generateToken(user._id)
        });
    } catch (error) {
        console.error("Google Login Error:", error);
        res.status(400).json({ message: 'Google login failed' });
    }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = async (req, res) => {
    const user = await User.findById(req.user._id);

    if (user) {
        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;
        user.profilePic = req.body.profilePic !== undefined ? req.body.profilePic : user.profilePic;
        user.address = req.body.address !== undefined ? req.body.address : user.address;
        user.phone = req.body.phone !== undefined ? req.body.phone : user.phone;

        if (req.body.password) {
            user.password = req.body.password;
        }

        const updatedUser = await user.save();

        res.json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            role: updatedUser.role,
            profilePic: updatedUser.profilePic,
            address: updatedUser.address,
            phone: updatedUser.phone,
            token: generateToken(updatedUser._id)
        });
    } else {
        res.status(404).json({ message: 'User not found' });
    }
};

export {
    registerUser,
    loginUser,
    getUserProfile,
    getUsers,
    googleLogin,
    updateUserProfile
};
