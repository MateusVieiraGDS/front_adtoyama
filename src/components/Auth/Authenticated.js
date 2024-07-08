//import { sa_isAuthenticated } from "../../src/app/ServerActions/LaravelApiService";

import SigninPage from "../../app/(auth)/signin/page";
import { sa_getUser, sa_requireSignin } from "../../app/actions/auth";
import AuthProvider from "./AuthProvider";
import { cookies, headers } from "next/headers";

export default async function Authenticated({children}) {
    let user = null;
    let userResponse = await sa_getUser();
    if(userResponse.success)
        user = userResponse.data;
    return ( 
        <>
            {user ? 
                (
                    <AuthProvider user={user}>
                        {children}
                    </AuthProvider>
                )
                :(
                    <>
                        <SigninPage intercepted={true}/>
                    </>                    
                )
            }
        </>                 
     );
}