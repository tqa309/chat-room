import React, { useEffect, useState } from "react";
import { auth, db } from "../firebase/config";
import { useHistory } from "react-router-dom";
import { Spin } from "antd";

export const AuthContext = React.createContext();

function AuthProvider({ children }) {
    const [user, setUser] = useState({});
    const history = useHistory();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            if (user) {
                const { displayName, email, uid, photoURL } = user;
                setUser({
                    displayName,
                    email,
                    uid,
                    photoURL,
                    isOnline: true
                });
                setIsLoading(false);
                history.push("/");
                return;
            }
            setIsLoading(false);
            history.push("/login");
        });

        return unsubscribe;
    }, [history]);

    return (
        <AuthContext.Provider value={{ user }}>
            {isLoading ? <Spin /> : children}
        </AuthContext.Provider>
    );
}

export default AuthProvider;
