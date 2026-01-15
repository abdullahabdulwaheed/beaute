import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { AdminContext } from '../context/AdminContext';
import './AddProduct.css'; // Reusing styles

const EditProduct = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { url, token } = useContext(AdminContext);
    const [categories, setCategories] = useState([]);
    const [newImage, setNewImage] = useState(false);
    const [currentImageUrl, setCurrentImageUrl] = useState("");
    const [loading, setLoading] = useState(true);
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

    const fetchProduct = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${url}/api/products/${id}`);
            const product = response.data;
            setData({
                name: product.name,
                brand: product.brand,
                description: product.description,
                price: product.price,
                category: product.category?._id || product.category,
                stock: product.stock
            });
            setCurrentImageUrl(product.images[0]);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching product", error);
            alert("Product not found");
            navigate('/list-products');
        }
    }

    useEffect(() => {
        fetchCategories();
        fetchProduct();
    }, [id]);

    const onChangeHandler = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setData(prev => ({ ...prev, [name]: value }));
    }

    const onSubmitHandler = async (event) => {
        event.preventDefault();

        let finalImageUrl = currentImageUrl;

        // If new image is selected, upload it first
        if (newImage) {
            const formData = new FormData();
            formData.append("image", newImage);
            try {
                const uploadResponse = await axios.post(`${url}/api/upload`, formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                finalImageUrl = uploadResponse.data;
            } catch (error) {
                console.error("Image upload failed", error);
                alert("Image upload failed, using previous image");
            }
        }

        const productData = {
            ...data,
            price: Number(data.price),
            stock: Number(data.stock),
            images: [finalImageUrl]
        };

        try {
            const response = await axios.put(`${url}/api/products/${id}`, productData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (response.status === 200) {
                alert("Product Updated successfully");
                navigate('/list-products');
            }
        } catch (error) {
            alert(error.response?.data?.message || "Failed to update product");
        }
    }

    if (loading) return <div className='add-product card'><p>Loading product data...</p></div>;

    return (
        <div className='add-product card'>
            <h3>Edit Product</h3>
            <form className='flex-col' onSubmit={onSubmitHandler}>
                <div className="add-img-upload flex-col">
                    <p>Product Image</p>
                    <label htmlFor="image">
                        <div className='img-placeholder'>
                            {newImage ? (
                                <img src={URL.createObjectURL(newImage)} alt="new" />
                            ) : (
                                <img src={currentImageUrl} alt="current" />
                            )}
                        </div>
                        <p style={{ fontSize: '11px', marginTop: '5px', color: 'var(--text-grey)' }}>Click to change image</p>
                    </label>
                    <input onChange={(e) => setNewImage(e.target.files[0])} type="file" id="image" hidden />
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
                <div className="form-actions">
                    <button type="button" className='btn' onClick={() => navigate('/list-products')}>CANCEL</button>
                    <button type='submit' className='add-btn btn btn-primary'>UPDATE PRODUCT</button>
                </div>
            </form>
        </div>
    );
};

export default EditProduct;
