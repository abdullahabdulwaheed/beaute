import React, { useContext } from 'react';
import { StoreContext } from '../context/StoreContext';
import { Link } from 'react-router-dom';

const ProductItem = ({ item }) => {
    const { addToCart, removeFromCart, cartItems } = useContext(StoreContext);

    return (
        <div className='product-card'>
            <Link to={`/product/${item._id}`}>
                <img src={item.images[0]} alt={item.name} className='product-image' />
            </Link>
            <div className='product-info'>
                <p className='product-brand'>{item.brand}</p>
                <Link to={`/product/${item._id}`}>
                    <h4 className='product-name'>{item.name}</h4>
                </Link>
                <p className='product-price'>${item.price.toFixed(2)}</p>
                {!cartItems[item._id] ? (
                    <button
                        className='btn-add'
                        onClick={() => addToCart(item._id)}
                    >
                        Add to Cart
                    </button>
                ) : (
                    <div className='item-counter'>
                        <button onClick={() => removeFromCart(item._id)} className='counter-btn minus'>-</button>
                        <span>{cartItems[item._id]}</span>
                        <button onClick={() => addToCart(item._id)} className='counter-btn plus'>+</button>
                    </div>
                )}
            </div>
        </div>
    );

};

export default ProductItem;
