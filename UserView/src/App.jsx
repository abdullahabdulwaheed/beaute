import React, { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Shop from './pages/Shop';
import Cart from './pages/Cart';
import Product from './pages/Product';
import Login from './pages/Login';
import Register from './pages/Register';
import MyOrders from './pages/MyOrders';
import About from './pages/About';
import Profile from './pages/Profile';
import Checkout from './pages/Checkout';

const App = () => {
  const location = useLocation();

  useEffect(() => {
    const path = location.pathname;
    let pageName = "Home";

    if (path === "/shop") pageName = "Shop Collection";
    else if (path === "/cart") pageName = "Shopping Basket";
    else if (path.startsWith("/product/")) pageName = "Product Details";
    else if (path === "/login") pageName = "Sign In";
    else if (path === "/register") pageName = "Create Account";
    else if (path === "/myorders") pageName = "My Orders";
    else if (path === "/order") pageName = "Checkout";
    else if (path === "/about") pageName = "Our Story";
    else if (path === "/profile") pageName = "My Profile";

    document.title = `BEAUTÉ | ${pageName}`;
  }, [location]);

  return (
    <div className='app'>
      <Navbar />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/shop' element={<Shop />} />
        <Route path='/cart' element={<Cart />} />
        <Route path='/product/:id' element={<Product />} />
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
        <Route path='/myorders' element={<MyOrders />} />
        <Route path='/order' element={<Checkout />} />
        <Route path='/about' element={<About />} />
        <Route path='/profile' element={<Profile />} />
      </Routes>
      <Footer />
    </div>
  );
};

export default App;
