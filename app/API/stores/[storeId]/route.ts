//Aqui se van a crear las rutas del API que se utilizaran para settings (store)

import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";
import prismadb from "@/lib/prismadb";

//Se creara una ruta la cual se llamara patch esta sirve para actualizar la tienda
export async function PATCH(
    req: Request,
    {params}: {params: {storeId: string}}
) {
    try{
        //Se esta inicializando la constante con el valor de userId el cual se hace fetch de Clerk Auth0.
        const { userId } = auth();
        //Se va a extraer el body del request
        const body = await req.json();

        const { name } = body;

        //Se necesita validar que haya un usuario registrado con el Auth de Clerk para poder crear tienda
        //Entonces se usara una condicional para hacer la validacion.
        if(!userId){
            return new NextResponse("Unauthenticated", {status: 401});
        }

        //Se necesita validar que el campo de nombre de la tienda este llenado para eso se usara una condiconal para validar
        if(!name){
            return new NextResponse("Name is required", {status:400});
        }

        //Se necesita validar que los params de storeId existan para validar que en efecto la tienda este creada.
        if(!params.storeId){
            return new NextResponse("Store id is required", {status:400})
        }

        //Aqui se va buscar la tienda y se va a actualizar
        const store = await prismadb.store.updateMany({
            where: {
                id: params.storeId,
                userId
            },
            data: {
                name
            }
        });
        return NextResponse.json(store);
    }catch(error){
        console.log('[STORE_PATCH]', error);
        return new NextResponse("Internal error", {status:500});
    }
};

//==============================================================================================================================

//Se creara una ruta la cual se llamara delete esta sirve para borrar la tienda.

export async function DELETE(
    _req: Request,
    {params}: {params: {storeId: string}}
) {
    try{
        //Se esta inicializando la constante con el valor de userId el cual se hace fetch de Clerk Auth0.
        const { userId } = auth();

        //Se necesita validar que haya un usuario registrado con el Auth de Clerk para poder crear tienda
        //Entonces se usara una condicional para hacer la validacion.
        if(!userId){
            return new NextResponse("Unauthenticated", {status: 401});
        }

        //Se necesita validar que los params de storeId existan para validar que en efecto la tienda este creada.
        if(!params.storeId){
            return new NextResponse("Store id is required", {status:400})
        }

        //Aqui se va buscar la tienda y se va a actualizar
        const store = await prismadb.store.deleteMany({
            where: {
                id: params.storeId,
                userId
            }
        });
        return NextResponse.json(store);
    }catch(error){
        console.log('[STORE_DELETE]', error);
        return new NextResponse("Internal error", {status:500});
    }
};