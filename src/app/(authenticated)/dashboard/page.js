import Link from 'next/link'

export default function DashboardHome() {

    return ( 
        <>
            <div>
                <p>Dashboard, Bem vindo</p>
                <Link href='/perfil'>Perfil</Link>
            </div>            
        </>
     );
}
