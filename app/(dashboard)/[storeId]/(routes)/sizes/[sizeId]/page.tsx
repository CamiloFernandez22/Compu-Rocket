//Aqui se va a crear el form de los tammanos

import prismadb from "@/lib/prismadb";
import { SizeForm } from "./components/size-form";

const SizePage = async ({
    params
}:{
    params: {sizeId: string}
}) =>{
    //Esta funcion va a hacer fetch de un tammano existinte usando el ID de la BD en el URL
    const size = await prismadb.size.findUnique({ 
        //Se va a solicitar a prismadb que encuentre un unico ID que coincida con el de sizeId en cuestion. 
        where: {
            id: params.sizeId 
        }
    });
    return(
        <div className="flex-col">
            <div className="flex-1 space-y-4 p-8 pt-6">
                <SizeForm initialData={size}/>
            </div>
        </div>
    );
}

export default SizePage;