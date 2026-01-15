import { createContext, useState, useEffect } from "react";
import axios from "axios";

export const StoreContext = createContext(null);

const StoreContextProvider = (props) => {
    const url = import.meta.env.VITE_API_URL || "http://localhost:5000";
    const [token, setToken] = useState("");
    const [cartItems, setCartItems] = useState({});
    const [productList, setProductList] = useState([]);
    const [categories, setCategories] = useState([]);
    const [user, setUser] = useState(null);
    const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

    const toggleTheme = () => {
        const newTheme = theme === "light" ? "dark" : "light";
        setTheme(newTheme);
        localStorage.setItem("theme", newTheme);
    }

    useEffect(() => {
        document.body.className = theme;
    }, [theme]);


    const fetchProductList = async () => {
        try {
            const response = await axios.get(url + "/api/products", { withCredentials: true });
            if (Array.isArray(response.data)) {
                setProductList(response.data);
            } else {
                console.error("Products API did not return an array:", response.data);
                setProductList([]);
            }
        } catch (error) {
            console.error("Error fetching products", error);
            setProductList([]);
        }
    }

    const fetchCategories = async () => {
        try {
            const response = await axios.get(url + "/api/categories", { withCredentials: true });
            if (Array.isArray(response.data)) {
                setCategories(response.data);
            }
        } catch (error) {
            console.error("Error fetching categories", error);
        }
    }

    const addToCart = async (itemId) => {
        if (!cartItems[itemId]) {
            setCartItems((prev) => ({ ...prev, [itemId]: 1 }));
        } else {
            setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] + 1 }));
        }
        if (token) {
            await axios.post(url + "/api/cart/add", { itemId }, { headers: { Authorization: `Bearer ${token}` }, withCredentials: true });
        }
    }

    const removeFromCart = async (itemId) => {
        setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] - 1 }));
        if (token) {
            await axios.post(url + "/api/cart/remove", { itemId }, { headers: { Authorization: `Bearer ${token}` }, withCredentials: true });
        }
    }

    const loadCartData = async (token) => {
        try {
            const response = await axios.get(url + "/api/cart", { headers: { Authorization: `Bearer ${token}` }, withCredentials: true });
            if (response.data && response.data.cartData) {
                setCartItems(response.data.cartData);
            } else {
                setCartItems({});
            }
        } catch (error) {
            console.error("Error loading cart", error);
            setCartItems({});
        }
    }

    const getTotalCartAmount = () => {
        let totalAmount = 0;
        for (const item in cartItems) {
            if (cartItems[item] > 0) {
                let itemInfo = productList.find((product) => product._id === item);
                if (itemInfo) {
                    totalAmount += itemInfo.price * cartItems[item];
                }
            }
        }
        return totalAmount;
    }


    useEffect(() => {
        async function loadData() {
            await Promise.all([
                fetchProductList(),
                fetchCategories()
            ]);
            if (localStorage.getItem("token")) {
                const storedToken = localStorage.getItem("token");
                setToken(storedToken);
                const storedUser = localStorage.getItem("user");
                if (storedUser && storedUser !== "undefined") {
                    try {
                        setUser(JSON.parse(storedUser));
                    } catch (e) {
                        console.error("Error parsing user from localStorage", e);
                        localStorage.removeItem("user");
                    }
                }
                await loadCartData(storedToken);
            }
        }
        loadData();
    }, []);


    const contextValue = {
        url,
        token,
        setToken,
        cartItems,
        setCartItems,
        addToCart,
        removeFromCart,
        getTotalCartAmount,
        productList,
        categories,
        user,
        setUser,
        theme,
        toggleTheme,
        loadCartData
    };

    return (
        <StoreContext.Provider value={contextValue}>
            {props.children}
        </StoreContext.Provider>
    )
}

export default StoreContextProvider;
