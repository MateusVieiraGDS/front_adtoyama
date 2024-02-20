'use client'

import { sa_resetPassword, sa_sendForgoutCodeToEmail, sa_signin, sa_signout, sa_validForgoutCode } from "../../app/actions/auth";

const { createContext, useContext } = require("react");

export const AuthContext = createContext({});

export const Auth = ()=> useContext(AuthContext);

export const signin =  async (formData)=>{
    return await sa_signin(formData); 
}

export const sendForgoutCodeToEmail =  async (email)=>{
    return await sa_sendForgoutCodeToEmail(email); 
}

export const validForgoutCode =  async (email)=>{
    return await sa_validForgoutCode(email); 
}

export const resetPassword =  async (email)=>{
    return await sa_resetPassword(email); 
}


export const signout = ()=>{
    sa_signout();
}

export default function AuthProvider({ children, user }) {    
    const isAuthenticated = !!user;   
    return ( 
        <AuthContext.Provider value={{isAuthenticated, user, signin, signout}}>
            {children}
        </AuthContext.Provider>
    );
}