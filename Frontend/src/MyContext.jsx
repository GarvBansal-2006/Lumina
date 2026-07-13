import React, { createContext, useState, useEffect } from "react";

// Initialize the context
export const MyContext = createContext({});

export const MyContextProvider = ({ children }) => {
    // 1. Core Authentication States
    const [userToken, setUserToken] = useState(localStorage.getItem("token") || null);
    const [userEmail, setUserEmail] = useState(localStorage.getItem("email") || null);
    
    // 2. Core Chat Infrastructure States
    const [threads, setThreads] = useState([]);
    const [activeThreadId, setActiveThreadId] = useState(null);

    // 3. Keep localStorage perfectly synchronized with our React state
    useEffect(() => {
        if (userToken) {
            localStorage.setItem("token", userToken);
            localStorage.setItem("email", userEmail);
        } else {
            localStorage.removeItem("token");
            localStorage.removeItem("email");
        }
    }, [userToken, userEmail]);

    // 4. Wipe out all current user data and active threads on Logout
    const handleLogout = () => {
        setUserToken(null);
        setUserEmail(null);
        setThreads([]);
        setActiveThreadId(null);
    };

    return (
        <MyContext.Provider value={{
            userToken,
            setUserToken,
            userEmail,
            setUserEmail,
            handleLogout,
            threads,
            setThreads,
            activeThreadId,
            setActiveThreadId
        }}>
            {children}
        </MyContext.Provider>
    );
};