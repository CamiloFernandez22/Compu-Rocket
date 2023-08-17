//Aqui se van a crear las rutas del API que se utilizaran para color.

import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";
import prismadb from "@/lib/prismadb";


//Se creara una ruta la cual se llamara GET esta sirve para hacer fetch del color.

export async function GET(
    _req: Request,
    {params}: {params: {colorId: string}}
) {
    try{
     
        //Se necesita validar que los params de colorId existan para validar que en efecto el color este creada.
        if(!params.colorId){
            return new NextResponse("Color id is required", {status:400})
        }

        //Aqui se va buscar el color y se va a actualizar
        const color = await prismadb.color.findUnique({
            where: {
                id: params.colorId,
            }
        });
        return NextResponse.json(color);
    }catch(error){
        console.log('[COLOR_GET]', error);
        return new NextResponse("Internal error", {status:500});
    }
};

//==============================================================================================================================


//Se creara una ruta la cual se llamara patch esta sirve para actualizar los colores.
export async function PATCH(
    req: Request,
    {params}: {params: {storeId: string, colorId: string}}
) {
    try{
        //Se esta inicializando la constante con el valor de userId el cual se hace fetch de Clerk Auth0.
        const { userId } = auth();
        //Se va a extraer el body del request
        const body = await req.json();

        const { name, value } = body;

        //Se necesita validar que haya un usuario registrado con el Auth de Clerk para poder crear color
        //Entonces se usara una condicional para hacer la validacion.
        if(!userId){
            return new NextResponse("Unauthenticated", {status: 401});
        }

        //Se necesita validar que el campo de label del color este llenado para eso se usara una condiconal para validar
        if(!name){
            return new NextResponse("Name is required", {status:400});
        }

         //Se necesita validar que el campo de label del color este llenado para eso se usara una condiconal para validar
         if(!value){
            return new NextResponse("Value is required", {status:400});
        }

        //Se necesita validar que los params de storeId existan para validar que en efecto la color este creada.
        if(!params.colorId){
            return new NextResponse("Color id is required", {status:400})
        }

        //Se va a hacer fetch de la tienda actual.
        const storeByUserId = await prismadb.store.findFirst({
            where: {
                id: params.storeId,
                userId
            }
        });

        if(!storeByUserId){
            return new NextResponse("Unauthorized", {status:403});
        }

        //Aqui se va buscar el valor de color y se va a actualizar
        const color = await prismadb.color.updateMany({
            where: {
                id: params.colorId,
            },
            data: {
                name,
                value
            }
        });
        //El next response va a devolver un archivo JSON con el objeto de color.
        return NextResponse.json(color);
    }catch(error){
        console.log('[COLOR_PATCH]', error);
        return new NextResponse("Internal error", {status:500});
    }
};

//==============================================================================================================================

//Se creara una ruta la cual se llamara delete esta sirve para borrar el color.

export async function DELETE(
    _req: Request,
    {params}: {params: {storeId: string, colorId: string}}
) {
    try{
        //Se esta inicializando la constante con el valor de userId el cual se hace fetch de Clerk Auth0.
        const { userId } = auth();

        //Se necesita validar que haya un usuario registrado con el Auth de Clerk para poder crear color
        //Entonces se usara una condicional para hacer la validacion.
        if(!userId){
            return new NextResponse("Unauthenticated", {status: 401});
        }

        //Se necesita validar que los params de colorId existan para validar que en efecto el color este creada.
        if(!params.colorId){
            return new NextResponse("Color id is required", {status:400})
        }

          //Se va a hacer fetch de la tienda actual como forma de autorizacion
          const storeByUserId = await prismadb.store.findFirst({
            where: {
                id: params.storeId,
                userId
            }
        });

        if(!storeByUserId){
            return new NextResponse("Unauthorized", {status:403});
        }

        //Aqui se va buscar el color y se va a actualizar
        const color = await prismadb.color.deleteMany({
            where: {
                id: params.colorId,
            }
        });
        return NextResponse.json(color);
    }catch(error){
        console.log('[COLOR_DELETE]', error);
        return new NextResponse("Internal error", {status:500});
    }
};