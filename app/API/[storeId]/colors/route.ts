
//Se va a crear una ruta o endpoints para el componente colors en nuestra tienda.

//Aqui se va a crear el API para colors

import { NextResponse } from "next/server"; //Este modulo permite importar el next response para retornar mensaje en terminal usando el catch. 
import { auth } from "@clerk/nextjs"; //Este modulo permite authenticar y autorizar las rutas del API con el servicio Auth de Clerk.io          
import prismadb from "@/lib/prismadb";
 
export async function POST(
    req: Request,
    //Aqui se le pasara los params, en este caso el objeto params tendra el ID de la tienda que es de tipo String gracias a la estructura de la ruta del API
    //API/[storeId]/colors/route. 
    { params }: {params:{ storeId: string}}
    //Aqui vamos a tener un try/catch de tipo console log en caso de tener algun error con
    //la llamada al API que pueda desplegarse en terminal (consola). 
){
    try{
        //Aqui se va a utilizar el servicio Auth de Clerk.io para validar la ruta de escritura del POST. 
        const { userId } = auth(); //Ya validado se puede obtener el id del usuario que esta tratando de crear la tienda.
        const body = await req.json();
        const { name, value } = body;

        //Se necesita validar que haya un usuario registrado con el Auth de Clerk para poder crear tienda
        //Entonces se usara una condicional para hacer la validacion. 

        if(!userId){
            return new NextResponse("Unauthenticated", {status:401}); //con next response se notifica al usuario si este no esta registrado.
        }

        //Se necesita validar que el campo de label de la tienda este llenado para eso se usara una condiconal para validar

        if(!name){
            return new NextResponse("Name is required", {status: 400});
        }

        //Se necesita validar que el campo de label

        if(!value){
            return new NextResponse("ValueL is required", {status: 400});
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

        //********** 
        //Aqui se va a crear el body de la consulta 
        const color = await prismadb.color.create({
            data: {
                name,
                value,
                storeId: params.storeId
            }
        });
        return NextResponse.json(color);
    }catch(error){
        console.log('[COLORS_POST]', error);
        return new NextResponse("Internal Error", { status: 500 });
    }
};

//Aqui esta la funcion del get **PARA TODOS** nuestros colors.
//el path seria /API/[storeId]/colors/GET

export async function GET(
    req: Request,
    //Aqui se le pasara los params, en este caso el objeto params tendra el ID de la tienda que es de tipo String gracias a la estructura de la ruta del API
    //API/[storeId]/colors/route. 
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
        const colors = await prismadb.color.findMany({
            where: {
                storeId: params.storeId,
            },
        });
        return NextResponse.json(colors);
    }catch(error){
        console.log('[COLORS_GET]', error);
        return new NextResponse("Internal Error", { status: 500 });
    }
};