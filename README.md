# BEAUTÉ - Luxury MERN Cosmetics E-commerce Platform

**BEAUTÉ** is a premium, full-stack e-commerce system meticulously designed for the high-end cosmetics industry. It features a sophisticated "Cosmetics Diagram Theme" with a gold-and-cream aesthetic, supporting both light and dark modes for a seamless luxury experience.

---

## 📸 Interface Previews

### **User View**
- **Dynamic Hero Section**: Premium product slider with full-width botanical backgrounds.
- **Curated Catalog**: 30+ products across 20+ specialized categories (Skincare, Fragrance, Luxury Collection).
- **Responsive Navigation**: Adaptive mobile-first design with floating animations.

### **Admin Dashboard**
- **Enterprise Management**: Full CRUD for Products, Categories, and Orders.
- **Themed Controls**: Global action buttons with gold highlights and vector icons.
- **Smart Data**: Real-time stock alerts and role-based access control.

---

## 🛠 Tech Stack

- **Frontend**: React (Vite), Context API, Axios.
- **Backend**: Node.js, Express, JWT (Authentication), Multer (File Uploads).
- **Database**: MongoDB (Mongoose).
- **Styling**: Vanilla CSS (Custom Variable-based Theming).

---

## 🚀 Installation & Setup

### **1. Prerequisites**
- Node.js installed.
- MongoDB instance (Local or Atlas).

### **2. Backend Setup**
1. Navigate to the folder:
   ```bash
   cd Backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure Environment Variables (`.env`):
   ```env
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   ```
4. **Seed the Database**:
   Populate the store with 32 premium products and 25 categories:
   ```bash
   npm run data:import
   ```
5. Start the server:
   ```bash
   npm run dev
   ```

### **3. Admin Dashboard Setup**
1. Navigate to the folder:
   ```bash
   cd AdminDashboard
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Launch the Dashboard:
   ```bash
   npm run dev
   ```
4. **Login Credentials**:
   - **Email**: `admin@gmail.com`
   - **Password**: `admin123`

### **4. User View Setup**
1. Navigate to the folder:
   ```bash
   cd UserView
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Launch the Store:
   ```bash
   npm run dev
   ```

---

## 📂 Project Structure

```bash
├── Backend/
│   ├── config/          # DB Connection
│   ├── data/            # Seed data (products/categories)
│   ├── models/          # Mongoose Schemas
│   ├── routes/          # API Endpoints
│   ├── uploads/         # Hosted Product Images
│   └── seeder.js        # DB Population Script
├── AdminDashboard/
│   ├── src/components/  # Themed Admin UI
│   ├── src/pages/       # Inventory, Orders, Users
│   └── src/index.css    # Global Global Theme Variables
└── UserView/
    ├── src/components/  # Slider, Product Grid
    ├── src/pages/       # Home, Shop, Product Detail
    └── src/context/     # StoreContext (Global State)
```

---

## 💄 Product Gallery (Generated Samples)

The platform includes custom-generated luxury assets for key products:

| Product | Image Preview |
| :--- | :--- |
| **Satin Matte Lipstick** | `lipstick_velvet_red.png` |
| **Golden Sands Sunscreen** | `sunscreen_spf50.png` |
| **Nail Strengthening Oil** | `nail_oil_premium.png` |
| **Strawberry Lip Scrub** | `strawberry_lip_scrub.png` |
| **Youth Moisturizer** | `youth_moisturizer_jar.png` |
| **Bamboo Face Toner** | `bamboo_face_toner.png` |

---

## ✨ Features Highlight

- **Thematic Consistency**: Every UI element, from table headers to action buttons, follows the botanical gold theme.
- **Dynamic Filtering**: The Shop page pulls real-time categories from the database with a horizontal swipe-pill navigation.
- **Secure Auth**: Role-based access ensuring only administrators can access the Enterprise dashboard.
- **Optimized UI**: Lazy-loaded animations and intersection observers for a smooth "fade-in" experience.
