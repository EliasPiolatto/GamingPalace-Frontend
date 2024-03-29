import React, { useEffect, useState } from "react";
import { auth } from "../firebase/firebase.config";
import { createContext, useContext } from "react";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from "firebase/auth";

export const authContext = createContext();

export const useAuth = () => {
    const context = useContext(authContext)
    if(!context) {
        console.log("contexto no creado");
    }
    return context;
};

export function AuthProvider({ children }) {

    const [user, setUser] = useState("");
    useEffect(()=>{
        const suscribed = onAuthStateChanged(auth, (currentUser)=>{
            if(!currentUser){
                console.log("no hay usuario suscrito")
                setUser("")
            } else {
                setUser(currentUser);
            }
        })
        return ()=>suscribed()
    },[])



    const register = async (email, password) => {
        const response = await createUserWithEmailAndPassword(auth, email, password);
        // console.log(response);
    };
    const login = async (email, password) => {
        const response = await signInWithEmailAndPassword(auth, email, password);
        // console.log(response);
        const toRteurn = response.operationType === "signIn" ? true : false;
        return toRteurn;
    };
    const responseGoogle = new GoogleAuthProvider()
    const loginWithGoogle = async () => {
        return await signInWithPopup(auth, responseGoogle)
    };
    const logout = async () => {
        const response = await signOut(auth);
        // console.log(response);
        window.location = "/home";
    };

    return <authContext.Provider
    value={{
        register,
        login,
        loginWithGoogle,
        logout,
        user
    }}>
        {children}
    </authContext.Provider>
};