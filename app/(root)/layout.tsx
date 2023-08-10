import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";

//Aqui se va a creear el root lasyout el cual validara la conexion de los otros componentes tales como 
//la autenticacion y redireccion de endpoints. 
export default async function SetupLayout({
    children
}:{
    children: React.ReactNode;
}) {
    ////Se va a importar la constante de userId de Auth de Clerk. 
    const { userId } = auth();
//Se va a validar que el haya un user ID registrado con el servicio de Clerk.
    //Si no hay un  user ID entonces se va a redireccionar al usuario al endpoint de sig in. 
    if(!userId){
        redirect('/sign-in');
    }
    //Aqui se va a buscar la primera ACTIVA tienda que el usuario tiene habilitada
    //La idea de esta funcion es ver si se tiene que redirigir al usuario a una tienda creada en el componente
    // de dashboard o si se queda en el componente root para que use el modal de crear una tienda. 

    //Aqui solo se para el userId porque se supone que debe de tener una tienda ya existente linkeada al user ID. 
    const store = await prismadb.store.findFirst({
        where: {
            userId
        }
    }); 

    //Aqui vamos a redirigir el request a la tienda ya creada mediante su ID
    if(store){
        redirect(`/${store.id}`); 
    }

    return(
        <>
            {children}
        </>
    );
};
