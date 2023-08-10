//Aqui se va a crear el API para la creacion de tienda

import { NextResponse } from "next/server"; //Este modulo permite importar el next response para retornar mensaje en terminal usando el catch. 
import { auth } from "@clerk/nextjs"; //Este modulo permite authenticar y autorizar las rutas del API con el servicio Auth de Clerk.io          
import prismadb from "@/lib/prismadb";
 
export async function POST(
    req: Request,
    
    //Aqui vamos a tener un try/catch de tipo console log en caso de tener algun error con
    //la llamada al API que pueda desplegarse en terminal (consola). 
){
    try{
        //Aqui se va a utilizar el servicio Auth de Clerk.io para validar la ruta de escritura del POST. 
        const { userId } = auth(); //Ya validado se puede obtener el id del usuario que esta tratando de crear la tienda.
        const body = await req.json();
        const { name } = body;

        //Se necesita validar que haya un usuario registrado con el Auth de Clerk para poder crear tienda
        //Entonces se usara una condicional para hacer la validacion. 

        if(!userId){
            return new NextResponse("Unauthorized", {status:401}); //con next response se notifica al usuario si este no esta registrado.
        }

        //Se necesita validar que el campo de nombre de la tienda este llenado para eso se usara una condiconal para validar

        if(!name){
            return new NextResponse("Name is required", {status: 400});
        }

        //Aqui se va a crear el body de la consulta 
        const store = await prismadb.store.create({
            data: {
                name,
                userId
            }
        });
        return NextResponse.json(store);
    }catch(error){
        console.log('[STORES_POST]', error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}