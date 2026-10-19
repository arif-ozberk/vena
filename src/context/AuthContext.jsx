import { createContext, useState } from "react";


export const AuthContext = createContext({});


export const AuthContextProvider = ({ children }) => {

    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [userSession, setUserSession] = useState(null);
    const [isSessionLoading, setIsSessionLoading] = useState(true);
    const [loggedUserData, setLoggedUserData] = useState(null);
    const [userImages, setUserImages] = useState([]);


    return (
        <AuthContext.Provider
            value={{
                isAuthenticated, setIsAuthenticated,
                userSession, setUserSession,
                isSessionLoading, setIsSessionLoading,
                loggedUserData, setLoggedUserData,
                userImages, setUserImages
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}