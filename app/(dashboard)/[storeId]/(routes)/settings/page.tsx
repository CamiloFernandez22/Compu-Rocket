import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { SettingsForm } from "./components/settings-form";
//Se van a extraer los params de los componentes del servidor a utilizar
interface SettingsPageProps{
    params: {
        storeId: string;
    }
};
    // @ts-ignore
    const SettingsPage: React.FC<SettingsPageProps> = async ({params}) => {
    //Se va a hacer fetch del userId activo a la BD por medio del servicio Auth de Clerk.io.
    const { userId } = auth();
    //Se va a validar que el usuario este validado por el Auth de lo contrario se le redireciona al sign in.
    if(!userId){
        redirect("/sign-in");
    }
    //Se va a encontrar la tienda de los parametros, haciendo fetch de la BD
    const store = await prismadb.store.findFirst({
        where:{
            //El id se va a traer por medio del ID del store.
            id: params.storeId,
            //El userId sera el mismo que se inicializo en la linea 13. 
            userId: userId
        }
    });

    //Este es un mecanismo para evitar errores, si el usaurio ingresa en el URL un ID de tienda no reconocido estando ya autenticado 
    //entonces automaticamente se le redirecciona al dashboard. 
    if(!store){
        redirect("/");
    }
    //Se le va a agragar estilo a los ajustes. 
    return (
        <div className="flex-col">
            <div className="flex-1 space-y-4 p-8 pt-6">
                <SettingsForm initialData={store}/>
            </div>
        </div>
    );
} 

export default SettingsPage;