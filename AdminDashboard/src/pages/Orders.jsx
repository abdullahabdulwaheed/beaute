import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AdminContext } from '../context/AdminContext';
import './Orders.css';

const Orders = () => {
    const { url, token } = useContext(AdminContext);
    const [orders, setOrders] = useState([]);

    const fetchAllOrders = async () => {
        try {
            const response = await axios.get(`${url}/api/orders`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setOrders(response.data);
        } catch (error) {
            console.error("Error fetching orders", error);
        }
    }

    const statusHandler = async (event, orderId) => {
        try {
            const response = await axios.put(`${url}/api/orders/${orderId}/deliver`, { status: event.target.value }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (response.status === 200) {
                await fetchAllOrders();
            }
        } catch (error) {
            alert("Error updating status");
        }
    }

    useEffect(() => {
        if (token) {
            fetchAllOrders();
        }
    }, [token]);

    return (
        <div className='order add'>
            <h3>Order Management</h3>
            <div className="order-list">
                {orders.length === 0 ? <p>No orders found.</p> : orders.map((order, index) => (
                    <div key={index} className='order-item card'>
                        <div className='order-icon'>📦</div>
                        <div>
                            <p className='order-item-product'>
                                {order.orderItems.map((item, index) => {
                                    if (index === order.orderItems.length - 1) {
                                        return item.name + " x " + item.qty
                                    } else {
                                        return item.name + " x " + item.qty + ", "
                                    }
                                })}
                            </p>
                            <p className='order-item-name'>{order.shippingAddress.firstName + " " + order.shippingAddress.lastName}</p>
                            <div className='order-item-address'>
                                <p>{order.shippingAddress.address + ","}</p>
                                <p>{order.shippingAddress.city + ", " + order.shippingAddress.country + ", " + order.shippingAddress.postalCode}</p>
                            </div>
                            <p className='order-item-phone'>{order.shippingAddress.phone}</p>
                        </div>
                        <p>Items: {order.orderItems.length}</p>
                        <p>${order.totalPrice.toFixed(2)}</p>
                        <select onChange={(event) => statusHandler(event, order._id)} value={order.status}>
                            <option value="Processing">Processing</option>
                            <option value="Shipped">Shipped</option>
                            <option value="Delivered">Delivered</option>
                        </select>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Orders;
