//Aqui se van a crear las rutas del API que se utilizaran para un unico category

import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";
import prismadb from "@/lib/prismadb";


//Se creara una ruta la cual se llamara GET esta sirve para hacer fetch del category.

export async function GET(
    _req: Request,
    {params}: {params: {categoryId: string}}
) {
    try{
     
        //Se necesita validar que los params de storeId existan para validar que en efecto la billboard este creada.
        if(!params.categoryId){
            return new NextResponse("Category id is required", {status:400})
        }

        //Aqui se va buscar el category y se va a actualizar
        const category = await prismadb.category.findUnique({
            where: {
                id: params.categoryId,
            }
        });
        return NextResponse.json(category);
    }catch(error){
        console.log('[CATEGORY_GET]', error);
        return new NextResponse("Internal error", {status:500});
    }
};

//==============================================================================================================================


//Se creara una ruta la cual se llamara patch esta sirve para actualizar la category
export async function PATCH(
    req: Request,
    {params}: {params: {storeId: string, categoryId: string}}
) {
    try{
        //Se esta inicializando la constante con el valor de userId el cual se hace fetch de Clerk Auth0.
        const { userId } = auth();
        //Se va a extraer el body del request
        const body = await req.json();

        const { name, billboardId } = body;

        //Se necesita validar que haya un usuario registrado con el Auth de Clerk para poder crear billboard
        //Entonces se usara una condicional para hacer la validacion.
        if(!userId){
            return new NextResponse("Unauthenticated", {status: 401});
        }

        //Se necesita validar que el campo de label del category este llenado para eso se usara una condiconal para validar
        if(!name){
            return new NextResponse("Name is required", {status:400});
        }

         //Se necesita validar que el campo de label del category este llenado para eso se usara una condiconal para validar
         if(!billboardId){
            return new NextResponse("Billboard id is required", {status:400});
        }

        //Se necesita validar que los params de storeId existan para validar que en efecto la billboard este creada.
        if(!params.categoryId){
            return new NextResponse("Category id is required", {status:400})
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

        //Aqui se va buscar la category y se va a actualizar
        const category = await prismadb.category.updateMany({
            where: {
                id: params.categoryId,
            },
            data: {
                name,
                billboardId
            }
        });
        return NextResponse.json(category);
    }catch(error){
        console.log('[CATEGORY_PATCH]', error);
        return new NextResponse("Internal error", {status:500});
    }
};

//==============================================================================================================================

//Se creara una ruta la cual se llamara delete esta sirve para borrar la category.

export async function DELETE(
    _req: Request,
    {params}: {params: {storeId: string, categoryId: string}}
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
        if(!params.categoryId){
            return new NextResponse("Category id is required", {status:400})
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

        //Aqui se va buscar el category y se va a borrar
        const category = await prismadb.category.deleteMany({
            where: {
                id: params.categoryId,
            }
        });
        return NextResponse.json(category);
    }catch(error){
        console.log('[CATEGORY_DELETE]', error);
        return new NextResponse("Internal error", {status:500});
    }
};