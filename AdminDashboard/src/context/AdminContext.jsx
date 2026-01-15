import { createContext, useState, useEffect } from "react";

export const AdminContext = createContext(null);

const AdminContextProvider = (props) => {
    const url = import.meta.env.VITE_API_URL || "http://localhost:5000";
    const [token, setToken] = useState(localStorage.getItem("token") || "");
    const [theme, setTheme] = useState(localStorage.getItem("adminTheme") || "light");
    const [admin, setAdmin] = useState(JSON.parse(localStorage.getItem("user")) || null);
    const [showSidebar, setShowSidebar] = useState(false);

    const toggleTheme = () => {
        const newTheme = theme === "light" ? "dark" : "light";
        setTheme(newTheme);
        localStorage.setItem("adminTheme", newTheme);
    }

    const toggleSidebar = () => {
        setShowSidebar(!showSidebar);
    }

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setToken("");
        setAdmin(null);
        window.location.href = "/"; // Redirect to login or home
    }

    useEffect(() => {
        document.body.className = theme;
    }, [theme]);

    const value = {
        url,
        token,
        setToken,
        theme,
        toggleTheme,
        admin,
        setAdmin,
        logout,
        showSidebar,
        setShowSidebar,
        toggleSidebar
    };

    return (
        <AdminContext.Provider value={value}>
            {props.children}
        </AdminContext.Provider>
    )
}

export default AdminContextProvider;
