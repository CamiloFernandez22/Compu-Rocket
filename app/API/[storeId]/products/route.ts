
//Se va a crear una ruta o endpoint Post para crear un product en nuestra tienda.

//Aqui se va a crear el API para la creacion de tienda

import { NextResponse } from "next/server"; //Este modulo permite importar el next response para retornar mensaje en terminal usando el catch. 
import { auth } from "@clerk/nextjs"; //Este modulo permite authenticar y autorizar las rutas del API con el servicio Auth de Clerk.io          
import prismadb from "@/lib/prismadb";
import { isNamespaceExport } from "typescript";
 
export async function POST(
    req: Request,
    //Aqui se le pasara los params, en este caso el objeto params tendra el ID de la tienda que es de tipo String gracias a la estructura de la ruta del API

    { params }: {params:{ storeId: string}}
    //Aqui vamos a tener un try/catch de tipo console log en caso de tener algun error con
    //la llamada al API que pueda desplegarse en terminal (consola). 
){
    try{
        //Aqui se va a utilizar el servicio Auth de Clerk.io para validar la ruta de escritura del POST. 
        const { userId } = auth(); //Ya validado se puede obtener el id del usuario que esta tratando de crear la tienda.
        const body = await req.json();
        const { name, price, categoryId, colorId, sizeId, images} = body;

        //Se necesita validar que haya un usuario registrado con el Auth de Clerk para poder crear tienda
        //Entonces se usara una condicional para hacer la validacion. 

        if(!userId){
            return new NextResponse("Unauthenticated", {status:401}); //con next response se notifica al usuario si este no esta registrado.
        }

        //Se necesita validar que el campo de nombre del producto este llenado para eso se usara una condiconal para validar

        if(!name){
            return new NextResponse("Name is required", {status: 400});
        }

        //Se necesita validar que el campo de precio

        if(!price){
            return new NextResponse("Price is required", {status: 400});
        }

        //Se necesita validar que el campo de categoryId

        if(!categoryId){
            return new NextResponse("Category  is required", {status: 400});
        }

        //Se necesita validar que el campo de colorId

        if(!colorId){
            return new NextResponse("Color  is required", {status: 400});
        }

        //Se necesita validar que el campo de sizeId

        if(!sizeId){
            return new NextResponse("Size  is required", {status: 400});
        }

        //Se necesita validar que el campo de imagenes, debe de haber valor en el array
        //por lo que aqui se usa el distinto a imagenes.length.
        if(!images || !images.length){
            return new NextResponse("Images are required", {status: 400});
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
        const product = await prismadb.product.create({
            data: {
                name,
                price,
                categoryId,
                colorId,
                sizeId,
                storeId: params.storeId,
                images:{
                    createMany:{
                        data:[
                            ...images.map((image:{url:string}) => image)
                        ]
                    }
                }
            }
        });
        return NextResponse.json(product);
    }catch(error){
        console.log('[PRODUCTS_POST]', error);
        return new NextResponse("Internal Error", { status: 500 });
    }
};

//Aqui esta la funcion del get **PARA TODOS** nuestros productos.
//el path seria /API/[storeId]/products/GET

//En este caso la funcion GET utilizara por decirlo asi "filtros" 
//del front end para desplegar solo la informacion solicitada

export async function GET(
    req: Request,
    //Aqui se le pasara los params, en este caso el objeto params tendra el ID de la tienda que es de tipo String gracias a la estructura de la ruta del API
   
    { params }: {params:{ storeId: string}}
    //Aqui vamos a tener un try/catch de tipo console log en caso de tener algun error con
    //la llamada al API que pueda desplegarse en terminal (consola). 
){
    try{
        //aqui lo que se quiere es que por cada componente (color, categoria, billboard, etc) se busque exclusivamente cada ID.
        const   { searchParams } = new URL(req.url);
        const   categoryId  =   searchParams.get("categoryId")||  undefined;
        const   colorId     =   searchParams.get("colorId")   ||  undefined;
        const   sizeId      =   searchParams.get("sizeId")    ||  undefined;
        //Se validara que exista un ID de tienda
        if(!params.storeId){
            return new NextResponse("Store ID is required", {status: 400});
        }

        //Aqui se va a crear el body de la consulta 
        const products = await prismadb.product.findMany({
            where: {
                storeId: params.storeId,
                categoryId,
                colorId,
                sizeId,
            },
            include:{
                images:     true,
                category:   true,
                color:      true,
                size:       true
            },
            orderBy:{
                createdAt:  'desc'
            }
        });
        return NextResponse.json(products);
    }catch(error){
        console.log('[PRODUCTS_GET]', error);
        return new NextResponse("Internal Error", { status: 500 });
    }
};