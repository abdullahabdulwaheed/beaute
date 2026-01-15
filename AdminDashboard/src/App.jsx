import React, { useContext } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AdminContext } from './context/AdminContext';
import Sidebar from './components/Sidebar';
import AdminNavbar from './components/AdminNavbar';
import AdminFooter from './components/AdminFooter';
import AddProduct from './pages/AddProduct';
import ProductList from './pages/ProductList';
import EditProduct from './pages/EditProduct';
import Orders from './pages/Orders';
import Categories from './pages/Categories';
import Users from './pages/Users';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';

const App = () => {
  const { token } = useContext(AdminContext);

  if (!token) {
    return <Login />;
  }

  return (
    <div className='admin-layout'>
      <Sidebar />
      <div className='main-content'>
        <AdminNavbar />
        <Routes>
          <Route path='/dashboard' element={<Dashboard />} />
          <Route path='/add-product' element={<AddProduct />} />
          <Route path='/edit-product/:id' element={<EditProduct />} />
          <Route path='/list-products' element={<ProductList />} />
          <Route path='/orders' element={<Orders />} />
          <Route path='/categories' element={<Categories />} />
          <Route path='/users' element={<Users />} />
          <Route path='*' element={<Navigate to="/dashboard" />} />
        </Routes>
        <AdminFooter />
      </div>
    </div>
  );
};



export default App;
