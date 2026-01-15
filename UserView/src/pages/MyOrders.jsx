import React, { useContext, useEffect, useState } from 'react';
import { StoreContext } from '../context/StoreContext';
import axios from 'axios';
import './MyOrders.css';

const MyOrders = () => {
    const { url, token } = useContext(StoreContext);
    const [data, setData] = useState([]);

    const fetchOrders = async () => {
        const response = await axios.get(url + "/api/orders/myorders", { headers: { Authorization: `Bearer ${token}` } });
        setData(response.data);
    }

    useEffect(() => {
        if (token) {
            fetchOrders();
        }
    }, [token]);

    return (
        <div className='my-orders container fade-in'>
            <h2>My Orders</h2>
            <div className="container">
                {data.map((order, index) => {
                    return (
                        <div key={index} className='my-orders-order'>
                            <p>📦</p>
                            <p>{order.orderItems.map((item, index) => {
                                if (index === order.orderItems.length - 1) {
                                    return item.name + " x " + item.qty
                                } else {
                                    return item.name + " x " + item.qty + ", "
                                }
                            })}</p>
                            <p>${order.totalPrice.toFixed(2)}</p>
                            <p>Items: {order.orderItems.length}</p>
                            <p><span>&#x25cf;</span> <b>{order.status}</b></p>
                            <button onClick={fetchOrders}>Track Order</button>
                        </div>
                    )
                })}
            </div>
        </div>
    );
};

export default MyOrders;
