
//Se va a crear una ruta o endpoint Post para crear un billboard en nuestra tienda.

//Aqui se va a crear el API para la creacion de tienda

import { NextResponse } from "next/server"; //Este modulo permite importar el next response para retornar mensaje en terminal usando el catch. 
import { auth } from "@clerk/nextjs"; //Este modulo permite authenticar y autorizar las rutas del API con el servicio Auth de Clerk.io          
import prismadb from "@/lib/prismadb";
 
export async function POST(
    req: Request,
    //Aqui se le pasara los params, en este caso el objeto params tendra el ID de la tienda que es de tipo String gracias a la estructura de la ruta del API
    //API/[storeId]/billboards/route. 
    { params }: {params:{ storeId: string}}
    //Aqui vamos a tener un try/catch de tipo console log en caso de tener algun error con
    //la llamada al API que pueda desplegarse en terminal (consola). 
){
    try{
        //Aqui se va a utilizar el servicio Auth de Clerk.io para validar la ruta de escritura del POST. 
        const { userId } = auth(); //Ya validado se puede obtener el id del usuario que esta tratando de crear la tienda.
        const body = await req.json();
        const { label, imageUrl } = body;

        //Se necesita validar que haya un usuario registrado con el Auth de Clerk para poder crear tienda
        //Entonces se usara una condicional para hacer la validacion. 

        if(!userId){
            return new NextResponse("Unauthenticated", {status:401}); //con next response se notifica al usuario si este no esta registrado.
        }

        //Se necesita validar que el campo de label de la tienda este llenado para eso se usara una condiconal para validar

        if(!label){
            return new NextResponse("Label is required", {status: 400});
        }

        //Se necesita validar que el campo de label

        if(!imageUrl){
            return new NextResponse("Image URL is required", {status: 400});
        }

        //Se validara que exista un ID de tienda
        if(!params.storeId){
            return new NextResponse("Store ID is required", {status: 400});
        }

        //Se va a validar que el ID de la tienda tenga un ID de usario asociado.
        const storeByUserId = await prisma?.store.findFirst({
            where: {
                id: params.storeId,
                userId
            }
        });

        if(!storeByUserId){
            return new NextResponse("You are unauthorized to modify", {status:403});
        }

        //Aqui se va a crear el body de la consulta 
        const billboard = await prismadb.billboard.create({
            data: {
                label,
                imageUrl,
                storeId: params.storeId
            }
        });
        return NextResponse.json(billboard);
    }catch(error){
        console.log('[BILLBOARDS_POST]', error);
        return new NextResponse("Internal Error", { status: 500 });
    }
};

//Aqui esta la funcion del get **PARA TODOS** nuestros billboards.
//el path seria /API/[storeId]/billboards/GET

export async function GET(
    req: Request,
    //Aqui se le pasara los params, en este caso el objeto params tendra el ID de la tienda que es de tipo String gracias a la estructura de la ruta del API
    //API/[storeId]/billboards/route. 
    { params }: {params:{ storeId: string}}
    //Aqui vamos a tener un try/catch de tipo console log en caso de tener algun error con
    //la llamada al API que pueda desplegarse en terminal (consola). 
){
    try{
        //Se validara que exista un ID de tienda
        if(!params.storeId){
            return new NextResponse("Store ID is required", {status: 400});
        }

        //Aqui se va a crear el body de la consulta 
        const billboards = await prismadb.billboard.findMany({
            where: {
                storeId: params.storeId,
            },
        });
        return NextResponse.json(billboards);
    }catch(error){
        console.log('[BILLBOARDS_GET]', error);
        return new NextResponse("Internal Error", { status: 500 });
    }
};