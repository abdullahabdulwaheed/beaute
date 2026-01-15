import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AdminContext } from '../context/AdminContext';

const Categories = () => {
    const { url, token } = useContext(AdminContext);
    const [categories, setCategories] = useState([]);
    const [name, setName] = useState("");

    const fetchCategories = async () => {
        try {
            const response = await axios.get(`${url}/api/categories`);
            setCategories(response.data);
        } catch (error) {
            console.error("Error fetching categories", error);
        }
    }

    const addCategory = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`${url}/api/categories`, { name }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (response.status === 201) {
                setName("");
                fetchCategories();
                alert("Category added successfully");
            }
        } catch (error) {
            alert(error.response?.data?.message || "Failed to add category");
        }
    }

    const deleteCategory = async (id) => {
        if (!window.confirm("Are you sure you want to delete this category?")) return;
        try {
            await axios.delete(`${url}/api/categories/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchCategories();
        } catch (error) {
            alert(error.response?.data?.message || "Failed to delete category");
        }
    }

    useEffect(() => {
        fetchCategories();
    }, []);

    return (
        <div className='categories-page'>
            <h3>Manage Categories</h3>
            <div className="card" style={{ maxWidth: '500px', marginTop: '20px' }}>
                <form onSubmit={addCategory} className='flex-col'>
                    <div className="input-group">
                        <label>New Category Name</label>
                        <input value={name} onChange={(e) => setName(e.target.value)} type="text" placeholder='e.g. Wellness' required />
                    </div>
                    <button type='submit' className='btn btn-primary'>Add Category</button>
                </form>
            </div>

            <div className="card">
                <h4>Existing Categories</h4>
                <table style={{ marginTop: '20px' }}>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {categories.map(c => (
                            <tr key={c._id}>
                                <td>{c.name}</td>
                                <td>
                                    <button onClick={() => deleteCategory(c._id)} className='action-btn delete' title="Delete">
                                        <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Categories;
