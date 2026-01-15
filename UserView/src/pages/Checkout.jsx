import React, { useContext, useState, useEffect } from 'react';
import { StoreContext } from '../context/StoreContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import floatingImg from '../assets/cosmetics-floating.png';
import './Checkout.css';

const Checkout = () => {
    const { token, cartItems, productList, getTotalCartAmount, url, theme } = useContext(StoreContext);
    const navigate = useNavigate();

    const [step, setStep] = useState(1); // 1: Address, 2: Payment
    const [data, setData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        street: "",
        city: "",
        state: "",
        zipcode: "",
        country: "",
        phone: ""
    });

    const [paymentMethod, setPaymentMethod] = useState("card");
    const [paymentDetails, setPaymentDetails] = useState({
        cardNumber: "",
        expiry: "",
        cvv: "",
        upiId: ""
    });

    useEffect(() => {
        if (!token) {
            navigate('/login?redirect=checkout');
        } else if (getTotalCartAmount() === 0) {
            navigate('/cart');
        }
    }, [token]);

    const onChangeHandler = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setData(data => ({ ...data, [name]: value }));
    }

    const onPaymentDetailsChange = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setPaymentDetails(prev => ({ ...prev, [name]: value }));
    }

    const nextStep = (e) => {
        e.preventDefault();
        setStep(2);
    }

    const placeOrder = async (e) => {
        e.preventDefault();
        let orderItems = [];
        productList.map((item) => {
            if (cartItems[item._id] > 0) {
                let itemInfo = item;
                itemInfo["quantity"] = cartItems[item._id];
                orderItems.push(itemInfo);
            }
        });

        let orderData = {
            address: data,
            items: orderItems,
            amount: getTotalCartAmount() + 5,
            paymentMethod: paymentMethod,
            paymentDetails: paymentMethod === 'card' ? {
                cardNumber: paymentDetails.cardNumber,
                expiry: paymentDetails.expiry,
                cvv: paymentDetails.cvv
            } : { upiId: paymentDetails.upiId }
        }

        // For now, we simulate success or navigate to a thank you page
        console.log("Placing order:", orderData);
        alert("Order placed successfully with " + paymentMethod.toUpperCase());
        navigate('/myorders');
    }

    return (
        <div className={`checkout-page-v2 ${theme}`}>
            <div className="bg-animations">
                <img src={floatingImg} className="floating-element fe-1" alt="" />
                <img src={floatingImg} className="floating-element fe-2" alt="" />
                <div className="gradient-sphere gs-1"></div>
            </div>

            <div className="checkout-container container">
                <div className="checkout-steps">
                    <div className={`step-indicator ${step >= 1 ? 'active' : ''}`}>
                        <div className="step-num">1</div>
                        <p>Address</p>
                    </div>
                    <div className="step-line"></div>
                    <div className={`step-indicator ${step >= 2 ? 'active' : ''}`}>
                        <div className="step-num">2</div>
                        <p>Payment</p>
                    </div>
                </div>

                <div className="checkout-layout">
                    <div className="checkout-main-form animate-box fade-in-up">
                        {step === 1 ? (
                            <form className='address-form' onSubmit={nextStep}>
                                <h3 className="section-title">Delivery Information</h3>
                                <div className="multi-fields">
                                    <input required name='firstName' onChange={onChangeHandler} value={data.firstName} type="text" placeholder='First name' />
                                    <input required name='lastName' onChange={onChangeHandler} value={data.lastName} type="text" placeholder='Last name' />
                                </div>
                                <input required name='email' onChange={onChangeHandler} value={data.email} type="email" placeholder='Email address' />
                                <input required name='street' onChange={onChangeHandler} value={data.street} type="text" placeholder='Street' />
                                <div className="multi-fields">
                                    <input required name='city' onChange={onChangeHandler} value={data.city} type="text" placeholder='City' />
                                    <input required name='state' onChange={onChangeHandler} value={data.state} type="text" placeholder='State' />
                                </div>
                                <div className="multi-fields">
                                    <input required name='zipcode' onChange={onChangeHandler} value={data.zipcode} type="text" placeholder='Zip code' />
                                    <input required name='country' onChange={onChangeHandler} value={data.country} type="text" placeholder='Country' />
                                </div>
                                <input required name='phone' onChange={onChangeHandler} value={data.phone} type="text" placeholder='Phone' />
                                <button type='submit' className="btn-premium-checkout">CONTINUE TO PAYMENT</button>
                            </form>
                        ) : (
                            <div className='payment-section'>
                                <h3 className="section-title">Payment Method</h3>
                                <div className="payment-options">
                                    <div className={`pay-option ${paymentMethod === 'card' ? 'selected' : ''}`} onClick={() => setPaymentMethod('card')}>
                                        <div className="pay-icon">💳</div>
                                        <div className="pay-info">
                                            <p className="pay-name">Credit / Debit Card</p>
                                            <p className="pay-desc">Safe and secure payment via encrypted gateway</p>
                                        </div>
                                        <div className="pay-check"></div>
                                    </div>

                                    <div className={`pay-option ${paymentMethod === 'upi' ? 'selected' : ''}`} onClick={() => setPaymentMethod('upi')}>
                                        <div className="pay-icon">📱</div>
                                        <div className="pay-info">
                                            <p className="pay-name">UPI Payment</p>
                                            <p className="pay-desc">Pay instantly using Google Pay, PhonePe, or BHIM</p>
                                        </div>
                                        <div className="pay-check"></div>
                                    </div>
                                </div>

                                {/* Dynamic Payment Details */}
                                <div className="payment-details-form fade-in">
                                    {paymentMethod === 'card' ? (
                                        <div className="card-details">
                                            <input required name='cardNumber' onChange={onPaymentDetailsChange} value={paymentDetails.cardNumber} type="text" placeholder='Card Number (16 digits)' maxLength="16" />
                                            <div className="multi-fields">
                                                <input required name='expiry' onChange={onPaymentDetailsChange} value={paymentDetails.expiry} type="text" placeholder='MM/YY' maxLength="5" />
                                                <input required name='cvv' onChange={onPaymentDetailsChange} value={paymentDetails.cvv} type="password" placeholder='CVV' maxLength="3" />
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="upi-details">
                                            <input required name='upiId' onChange={onPaymentDetailsChange} value={paymentDetails.upiId} type="text" placeholder='UPI ID (e.g. user@abc)' />
                                        </div>
                                    )}
                                </div>

                                <div className="payment-actions">
                                    <button onClick={() => setStep(1)} className="btn-back">Back to Address</button>
                                    <button onClick={placeOrder} className="btn-premium-checkout">COMPLETE ORDER</button>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="order-summary-side animate-box slide-in-right">
                        <div className="summary-card-premium">
                            <h3>Order Preview</h3>
                            <div className="mini-product-list">
                                {productList.map((item) => {
                                    if (cartItems[item._id] > 0) {
                                        return (
                                            <div key={item._id} className="mini-item">
                                                <img src={item.images[0]} alt="" />
                                                <div className="mini-details">
                                                    <p className="mini-name">{item.name}</p>
                                                    <p className="mini-qty">Qty: {cartItems[item._id]}</p>
                                                </div>
                                                <p className="mini-price">${(item.price * cartItems[item._id]).toFixed(2)}</p>
                                            </div>
                                        )
                                    }
                                    return null;
                                })}
                            </div>
                            <div className='summary-breakdown'>
                                <div className="summary-row">
                                    <span>Subtotal</span>
                                    <span>${getTotalCartAmount().toFixed(2)}</span>
                                </div>
                                <div className="summary-row">
                                    <span>Shipping</span>
                                    <span>$5.00</span>
                                </div>
                                <div className="summary-divider"></div>
                                <div className="summary-row grand-total">
                                    <span>Total Amount</span>
                                    <span>${(getTotalCartAmount() + 5).toFixed(2)}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout;
