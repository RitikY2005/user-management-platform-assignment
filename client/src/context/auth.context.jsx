import { createContext, useEffect, useState } from "react";
import API, { setAccessToken } from "../utils/axios.util";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [accessTokenState, setAccessTokenState] = useState(null);
    const [loading, setLoading] = useState(true);

    // when token changes , chage it in axios as well 
    const updateAccessToken = (token) => {
        setAccessTokenState(token);
        setAccessToken(token);
    };

    // first time user visiting site 

    const initAuth = async () => {
        try {

            const { data } = await API.post("/api/auth/refresh");

            const accessToken = data.accessToken;

            updateAccessToken(accessToken);

            // Fetch user
            const response = await API.get("/api/user/me");
            const { user } = response.data;
            setUser(user);
        } catch (err) {
            setUser(null);
            updateAccessToken(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        initAuth();
    }, []);

    const login = async (data) => {
        const res = await API.post("/api/auth/login", data);
        const { accessToken, user } = res.data;

        updateAccessToken(accessToken);
        setUser(user);

        return {
            ...res.data
        }
    };

    const register = async (data) => {
        const response = await API.post("/api/auth/register", data);



        updateAccessToken(response.data.accessToken);
        setUser(response.data.user);

        return {
            ...response.data
        }
    };

    const logout = async () => {
        const response = await API.post("/api/auth/logout");
        updateAccessToken(null);
        setUser(null);

        return {
            ...response.data
        }
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                accessToken: accessTokenState,
                loading,
                register,
                login,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};