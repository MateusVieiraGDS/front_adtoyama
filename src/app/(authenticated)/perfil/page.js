import { Suspense } from "react";
import UserComponent from "../../../components/dashboard/UserComponent";

export default function DashboardHome() {

    return ( 
        <>
            <h1>
                Perfil
            </h1>
            <Suspense fallback={(<h1>Carregando...</h1>)}>
                <UserComponent/>
            </Suspense>
        </>
     );
}
