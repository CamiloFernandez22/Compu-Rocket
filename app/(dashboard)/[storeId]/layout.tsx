import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation"

import prismadb from "@/lib/prismadb";
import Navbar from "@/components/navbar"

//Aqui se va a crear el layout de nuestro dashboard, los datos de params se van a almacemar en el arreglo storeId 
export default async function DashboardLayout({
    children,
    params
}:{
    children: React.ReactNode;
    params: {storeId: string}
}) {
    //Se va a importar la constante de userId de Auth de Clerk. 
    const { userId } = auth();

    //Se va a validar que el haya un user ID registrado con el servicio de Clerk.
    //Si no hay un  user ID entonces se va a redireccionar al usuario al endpoint de sig in. 
    if(!userId){
        redirect('/sign-in');
    }

    //Aqui se va a intentar hace un fetch de la tienda para ver si existe.
    const store = await prismadb.store.findFirst({
        // Se usara el  PK de la BD en la tabla de tienda para hacer el fetch, tambien el Pk de usuario usando el gestor de BD PrismaDB. 
        where: {
            id: params.storeId,
            userId
        }
    });

    //Aqui se validara si ya hay una tienda creada
    if (!store){
        redirect('/')
    }
    return (
        //Se abre fragmento
        <>
       <Navbar/>
        {children}
        </>
    );
};
