import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AdminContext } from '../context/AdminContext';
import './AddProduct.css';

const AddProduct = () => {
    const { url, token } = useContext(AdminContext);
    const [categories, setCategories] = useState([]);
    const [image, setImage] = useState(false);
    const [data, setData] = useState({
        name: "",
        brand: "",
        description: "",
        price: "",
        category: "",
        stock: ""
    });

    const fetchCategories = async () => {
        try {
            const response = await axios.get(`${url}/api/categories`);
            setCategories(response.data);
        } catch (error) {
            console.error("Error fetching categories", error);
        }
    }

    useEffect(() => {
        fetchCategories();
    }, []);

    const onChangeHandler = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setData(data => ({ ...data, [name]: value }));
    }

    const onSubmitHandler = async (event) => {
        event.preventDefault();

        // Form validation
        if (!data.category) {
            alert("Please select a category");
            return;
        }

        const formData = new FormData();
        formData.append("name", data.name);
        formData.append("brand", data.brand);
        formData.append("description", data.description);
        formData.append("price", Number(data.price));
        formData.append("category", data.category);
        formData.append("stock", Number(data.stock));
        formData.append("image", image);

        let imageUrl = "";
        try {
            const uploadResponse = await axios.post(`${url}/api/upload`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            imageUrl = uploadResponse.data;
        } catch (error) {
            console.error("Image upload failed", error);
        }

        const productData = { ...data, images: [imageUrl || 'https://via.placeholder.com/300'] };

        try {
            const response = await axios.post(`${url}/api/products`, productData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (response.status === 201) {
                alert("Product Added successfully");
                setData({
                    name: "",
                    brand: "",
                    description: "",
                    price: "",
                    category: "",
                    stock: ""
                });
                setImage(false);
            }
        } catch (error) {
            alert(error.response?.data?.message || "Failed to add product");
        }
    }

    return (
        <div className='add-product card'>
            <h3>Add New Product</h3>
            <form className='flex-col' onSubmit={onSubmitHandler}>
                <div className="add-img-upload flex-col">
                    <p>Upload Image</p>
                    <label htmlFor="image">
                        <div className='img-placeholder'>
                            {image ? <img src={URL.createObjectURL(image)} alt="" /> : "Click to Upload"}
                        </div>
                    </label>
                    <input onChange={(e) => setImage(e.target.files[0])} type="file" id="image" hidden required />
                </div>
                <div className="add-product-name flex-col">
                    <p>Product Name</p>
                    <input onChange={onChangeHandler} value={data.name} type="text" name='name' placeholder='Type here' required />
                </div>
                <div className="add-product-brand flex-col">
                    <p>Brand</p>
                    <input onChange={onChangeHandler} value={data.brand} type="text" name='brand' placeholder='Type here' required />
                </div>
                <div className="add-product-description flex-col">
                    <p>Product Description</p>
                    <textarea onChange={onChangeHandler} value={data.description} name="description" rows="6" placeholder='Write content here' required></textarea>
                </div>
                <div className="add-category-price">
                    <div className="add-category flex-col">
                        <p>Product Category</p>
                        <select onChange={onChangeHandler} name="category" value={data.category} required>
                            <option value="">Select Category</option>
                            {categories.map(c => (
                                <option key={c._id} value={c._id}>{c.name}</option>
                            ))}
                        </select>
                    </div>
                    <div className="add-price flex-col">
                        <p>Product Price</p>
                        <input onChange={onChangeHandler} value={data.price} type="Number" name='price' placeholder='$20' required />
                    </div>
                    <div className="add-stock flex-col">
                        <p>Stock Quantity</p>
                        <input onChange={onChangeHandler} value={data.stock} type="Number" name='stock' placeholder='50' required />
                    </div>
                </div>
                <button type='submit' className='add-btn btn btn-primary'>ADD PRODUCT</button>
            </form>
        </div>
    );
};

export default AddProduct;
