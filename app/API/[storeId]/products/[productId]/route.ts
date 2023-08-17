//Aqui se van a crear las rutas del API que se utilizaran para un unico product

import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";
import prismadb from "@/lib/prismadb";


//Se creara una ruta la cual se llamara GET esta sirve para hacer fetch del product.

export async function GET(
    _req: Request,
    {params}: {params: {productId: string}}
) {
    try{
     
        //Se necesita validar que los params de storeId existan para validar que en efecto la product este creada.
        if(!params.productId){
            return new NextResponse("Product id is required", {status:400})
        }

        //Aqui se va buscar el product y se va a actualizar
        const product = await prismadb.product.findUnique({
            where: {
                id: params.productId,
            },
            //esto es lo que se quiere desplegar en el frontend.
            include:{
                images:     true,
                category:   true,
                size:       true,
                color:      true 
            }
        });
        return NextResponse.json(product);
    }catch(error){
        console.log('[PRODUCT_GET]', error);
        return new NextResponse("Internal error", {status:500});
    }
};

//==============================================================================================================================


//Con esta funcion se creara una ruta la cual se llamara patch esta sirve para actualizar el product
export async function PATCH(
    req: Request,
    {params}: {params: {storeId: string, productId: string}}
) {
    try{
        //Se esta inicializando la constante con el valor de userId el cual se hace fetch de Clerk Auth0.
        const { userId } = auth();
        //Se va a extraer el body del request
        const body = await req.json();

        const { name, price, categoryId, colorId, sizeId, images} = body;

        //Se necesita validar que haya un usuario registrado con el Auth de Clerk para poder crear el product
        //Entonces se usara una condicional para hacer la validacion.
        if(!userId){
            return new NextResponse("Unauthenticated", {status: 401});
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

        //Se necesita validar que los params de storeId existan para validar que en efecto el product este creada.
        if(!params.productId){
            return new NextResponse("Product id is required", {status:400})
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

        //Aqui se va buscar el product y se va a actualizar
          await prismadb.product.update({
            where: {
                id: params.productId
            },
            data: {
                name,
                price,
                categoryId,
                colorId,
                sizeId,
                images: {
                    //aqui se eliminan imagenes
                    deleteMany:{},
                },
            },
        });

        //se va a crear una cosntante para crear nuevas imagenes
        const product = await prismadb.product.update({
            where:{
                id: params.productId
            },
            data:{
                images:{
                    createMany:{
                        data:[...images.map((image:{url:string}) => image),]
                    }
                }
            }
        })
        return NextResponse.json(product);
    }catch(error){
        console.log('[PRODUCT_PATCH]', error);
        return new NextResponse("Internal error", {status:500});
    }
};

//==============================================================================================================================

//Se creara una ruta la cual se llamara delete esta sirve para borrar el product.

export async function DELETE(
    _req: Request,
    {params}: {params: {storeId: string, productId: string}}
) {
    try{
        //Se esta inicializando la constante con el valor de userId el cual se hace fetch de Clerk Auth0.
        const { userId } = auth();

        //Se necesita validar que haya un usuario registrado con el Auth de Clerk para poder crear product
        //Entonces se usara una condicional para hacer la validacion.
        if(!userId){
            return new NextResponse("Unauthenticated", {status: 401});
        }

        //Se necesita validar que los params de storeId existan para validar que en efecto el product este creada.
        if(!params.productId){
            return new NextResponse("Product ID is required", {status:400})
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

        //Aqui se va buscar el product y se va a actualizar
        const product = await prismadb.product.deleteMany({
            where: {
                id: params.productId,
            }
        });
        return NextResponse.json(product);
    }catch(error){
        console.log('[PRODUCT_DELETE]', error);
        return new NextResponse("Internal error", {status:500});
    }
};