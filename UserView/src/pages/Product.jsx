import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { StoreContext } from '../context/StoreContext';
import axios from 'axios';
import './Product.css';

const Product = () => {
    const { id } = useParams();
    const { url, addToCart } = useContext(StoreContext);
    const [product, setProduct] = useState(null);

    const fetchProduct = async () => {
        const response = await axios.get(`${url}/api/products/${id}`);
        setProduct(response.data);
    }

    useEffect(() => {
        fetchProduct();
    }, [id]);

    if (!product) return <div className='container'>Loading...</div>;

    return (
        <div className='product-page container fade-in'>
            <div className='product-detail-container'>
                <div className='product-left'>
                    <img src={product.images[0]} alt={product.name} />
                </div>
                <div className='product-right'>
                    <p className='brand-label'>{product.brand}</p>
                    <h1>{product.name}</h1>
                    <p className='category-label'>{product.category.name}</p>
                    <div className='price-stock'>
                        <span className='price'>${product.price.toFixed(2)}</span>
                        <span className={`stock ${product.stock > 0 ? '' : 'out'}`}>
                            {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
                        </span>
                    </div>
                    <p className='description'>{product.description}</p>
                    <button
                        className='btn-primary'
                        disabled={product.stock === 0}
                        onClick={() => addToCart(product._id)}
                    >
                        {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
                    </button>
                    <div className='product-meta'>
                        <p><b>Free Shipping</b> on orders over $50</p>
                        <p><b>Hassle-Free Returns</b> within 30 days</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Product;
