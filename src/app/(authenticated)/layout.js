import Authenticated from "../../components/Auth/Authenticated";

export default function AuthenticatedLayout({children}) {

    return ( 
        <Authenticated>
            {children}
        </Authenticated>
     );
}
