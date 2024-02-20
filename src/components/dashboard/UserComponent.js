'use client'

import { useContext } from "react";
import { AuthContext } from "../Auth/AuthProvider";

export default function UserComponent() {
    const {user, signout} = useContext(AuthContext);

    async function handleLogout(){
        signout();
    }
    return ( 
        <>
        {user && <>
            <h2>ID: {user.id}</h2>
            <h2>Usuário: {user.name}</h2>
            <h2>Email: {user.email}</h2>
            <button onClick={handleLogout}>Sair</button>
            </>
        }
        </> 
    );
};