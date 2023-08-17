//Aqui se van a crear las rutas del API que se utilizaran para un unico Billboard

import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";
import prismadb from "@/lib/prismadb";


//Se creara una ruta la cual se llamara GET esta sirve para hacer fetch del billboard.

export async function GET(
    _req: Request,
    {params}: {params: {billboardId: string}}
) {
    try{
     
        //Se necesita validar que los params de storeId existan para validar que en efecto la billboard este creada.
        if(!params.billboardId){
            return new NextResponse("Billboard id is required", {status:400})
        }

        //Aqui se va buscar el billboard y se va a actualizar
        const billboard = await prismadb.billboard.findUnique({
            where: {
                id: params.billboardId,
            }
        });
        return NextResponse.json(billboard);
    }catch(error){
        console.log('[BILLBOARD_GET]', error);
        return new NextResponse("Internal error", {status:500});
    }
};

//==============================================================================================================================


//Se creara una ruta la cual se llamara patch esta sirve para actualizar la billboard
export async function PATCH(
    req: Request,
    {params}: {params: {storeId: string, billboardId: string}}
) {
    try{
        //Se esta inicializando la constante con el valor de userId el cual se hace fetch de Clerk Auth0.
        const { userId } = auth();
        //Se va a extraer el body del request
        const body = await req.json();

        const { label, imageUrl } = body;

        //Se necesita validar que haya un usuario registrado con el Auth de Clerk para poder crear billboard
        //Entonces se usara una condicional para hacer la validacion.
        if(!userId){
            return new NextResponse("Unauthenticated", {status: 401});
        }

        //Se necesita validar que el campo de label del billboard este llenado para eso se usara una condiconal para validar
        if(!label){
            return new NextResponse("Label is required", {status:400});
        }

         //Se necesita validar que el campo de label del billboard este llenado para eso se usara una condiconal para validar
         if(!imageUrl){
            return new NextResponse("Image URL is required", {status:400});
        }

        //Se necesita validar que los params de storeId existan para validar que en efecto la billboard este creada.
        if(!params.billboardId){
            return new NextResponse("Billboard id is required", {status:400})
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

        //Aqui se va buscar la billboard y se va a actualizar
        const billboard = await prismadb.billboard.updateMany({
            where: {
                id: params.billboardId,
            },
            data: {
                label,
                imageUrl
            }
        });
        return NextResponse.json(billboard);
    }catch(error){
        console.log('[BILLBOARD_PATCH]', error);
        return new NextResponse("Internal error", {status:500});
    }
};

//==============================================================================================================================

//Se creara una ruta la cual se llamara delete esta sirve para borrar la billboard.

export async function DELETE(
    _req: Request,
    {params}: {params: {storeId: string, billboardId: string}}
) {
    try{
        //Se esta inicializando la constante con el valor de userId el cual se hace fetch de Clerk Auth0.
        const { userId } = auth();

        //Se necesita validar que haya un usuario registrado con el Auth de Clerk para poder crear billboard
        //Entonces se usara una condicional para hacer la validacion.
        if(!userId){
            return new NextResponse("Unauthenticated", {status: 401});
        }

        //Se necesita validar que los params de storeId existan para validar que en efecto la billboard este creada.
        if(!params.storeId){
            return new NextResponse("Billboard id is required", {status:400})
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

        //Aqui se va buscar el billboard y se va a actualizar
        const billboard = await prismadb.billboard.deleteMany({
            where: {
                id: params.billboardId,
            }
        });
        return NextResponse.json(billboard);
    }catch(error){
        console.log('[BILLBOARD_DELETE]', error);
        return new NextResponse("Internal error", {status:500});
    }
};