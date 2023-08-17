//Aqui se va a crear el form de los tammanos

import prismadb from "@/lib/prismadb";
import { ColorForm } from "./components/color-form";

const ColorPage = async ({
    params
}:{
    params: {colorId: string}
}) =>{
    //Esta funcion va a hacer fetch de un tammano existinte usando el ID de la BD en el URL
    const color = await prismadb.color.findUnique({ 
        //Se va a solicitar a prismadb que encuentre un unico ID que coincida con el de sizeId en cuestion. 
        where: {
            id: params.colorId 
        }
    });
    return(
        <div className="flex-col">
            <div className="flex-1 space-y-4 p-8 pt-6">
                <ColorForm initialData={color}/>
            </div>
        </div>
    );
}

export default ColorPage;