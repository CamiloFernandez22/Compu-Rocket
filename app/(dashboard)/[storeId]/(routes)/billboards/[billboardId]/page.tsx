//Aqui se va a crear el form de los billboards

import prismadb from "@/lib/prismadb";
import { BillboardForm } from "./components/billboard-form";

const BillboardPage = async ({
    params
}:{
    params: {billboardId: string}
}) =>{
    //Esta funcion va a hacer fetch de un billboard existinte usando el ID de la BD en el URL
    const billboard = await prismadb.billboard.findUnique({ 
        //Se va a solicitar a prismadb que encuentre un unico ID que coincida con el de billboardId en cuestion. 
        where: {
            id: params.billboardId
        }
    });
    return(
        <div className="flex-col">
            <div className="flex-1 space-y-4 p-8 pt-6">
                <BillboardForm initialData={billboard}/>
            </div>
        </div>
    );
}

export default BillboardPage;