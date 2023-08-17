//Aqui se va a desarrollar nuestro componente de barra de navegacion 
import { UserButton, auth} from "@clerk/nextjs";
import { MainNav } from "@/components/main-nav";
import StoreSwitcher from "@/components/store-switcher";
import { redirect } from "next/navigation";
import prismadb from "@/lib/prismadb";
const Navbar = async () => {
    //Aqui se va a hacer el fetch de todas las tiendas que el usuario loggeado tiene 
    //por medio de esta constante vamos a hacer una instancia del usuario acreditado por medio del servicio Auth de Clerk.io
    const { userId } = auth();

    //Aqui se va a hacer una validacion del estado del usuario al cual se le esta haciendo fetch de Clerk.io Auth.
    //Si no existe un usuario (por el ID) entonces se va a redirigir a la pagina de sign in. 
    if(!userId){
        redirect("/sign-in");
    }
    //Si existe un usuario entonces se mostraran las tiendas disponibles.
    //Para esto se utilizara un fetch a prismaDB que busque todas las tiendas (store) 
    //donde coincida la constante global definida en la linea 10 con la de la BD.
    const stores = await prismadb.store.findMany({
        where: {
            userId: userId 
        },
    });

    return(
        <div className= "border-b">
            <div className="flex h-16 items-center px-4">
                <StoreSwitcher items={stores}/>
                <MainNav className="mx-6"/>
                <div className="ml-auto flex items-center space-x-4">
                    <UserButton afterSignOutUrl="/"/>
                </div>
            </div>
        </div>
    );
}

export default Navbar;