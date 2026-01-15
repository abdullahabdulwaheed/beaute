import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AdminContext } from '../context/AdminContext';
import './ProductList.css';

import { Link, useNavigate } from 'react-router-dom';

const ProductList = () => {
    const { url, token } = useContext(AdminContext);
    const [list, setList] = useState([]);
    const navigate = useNavigate();

    const fetchList = async () => {
        try {
            const response = await axios.get(`${url}/api/products`);
            setList(response.data);
        } catch (error) {
            console.error("Error fetching product list", error);
        }
    }

    const removeProduct = async (productId) => {
        if (!window.confirm("Are you sure you want to remove this product?")) return;
        try {
            const response = await axios.delete(`${url}/api/products/${productId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            await fetchList();
            if (response.status === 200) {
                alert("Product Removed successfully");
            }
        } catch (error) {
            alert(error.response?.data?.message || "Failed to remove product");
        }
    }

    useEffect(() => {
        fetchList();
    }, []);

    return (
        <div className='list-product-container'>
            <div className='list-header card'>
                <h3>Product Inventory</h3>
                <Link to="/add-product" className='btn btn-primary'>+ Add New Product</Link>
            </div>

            <div className='list-table card'>
                <div className="list-table-header">
                    <b>Image</b>
                    <b>Name</b>
                    <b>Category</b>
                    <b>Price</b>
                    <b>Stock</b>
                    <b>Actions</b>
                </div>
                <div className="list-table-body">
                    {list.length > 0 ? (
                        list.map((item, index) => (
                            <div key={index} className='list-table-row'>
                                <img src={item.images[0]} alt={item.name} className='product-thumb' />
                                <div className='product-name-info'>
                                    <p className='item-name-text'>{item.name}</p>
                                    <p className='item-brand-text'>{item.brand}</p>
                                </div>
                                <p className='category-badge'>{item.category?.name || "Uncategorized"}</p>
                                <p className='price-text'>${item.price.toFixed(2)}</p>
                                <p className={`stock-text ${item.stock < 10 ? 'low-stock' : ''}`}>{item.stock}</p>
                                <div className='action-buttons'>
                                    <button onClick={() => navigate(`/edit-product/${item._id}`)} className='action-btn edit' title="Edit">
                                        <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                                    </button>
                                    <button onClick={() => removeProduct(item._id)} className='action-btn delete' title="Delete">
                                        <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                                    </button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="no-products">No products found.</div>
                    )}
                </div>
            </div>
        </div>
    );
};


export default ProductList;
