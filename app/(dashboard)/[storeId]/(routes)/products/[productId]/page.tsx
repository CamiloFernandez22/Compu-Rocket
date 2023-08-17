//Este es un server component
//Aqui se va a crear el form de los products

import prismadb from "@/lib/prismadb";
import { ProductForm } from "./components/product-form";

const ProductPage = async ({
    params
}:{
    params: {productId: string, storeId: string}
}) =>{
    //Esta funcion va a hacer fetch de un product existinte usando el ID de la BD en el URL
    const product = await prismadb.product.findUnique({ 
        //Se va a solicitar a prismadb que encuentre un unico ID que coincida con el de productId en cuestion. 
        where: {
            id: params.productId
        },
        include: {
            images:true
        }
    });

    //Se van a extraer los valores de las categorias.
    const categories = await prismadb.category.findMany({
        where:{
            storeId: params.storeId,
        }
    })

    //Se van a extraer los valores de los tamannos.
    const size = await prismadb.size.findMany({
        where:{
            storeId: params.storeId,
        }
    })

    //Se van a extraer los valores de los colores.
    const colors = await prismadb.color.findMany({
        where:{
            storeId: params.storeId,
        }
    })

    return(
        <div className="flex-col">
            <div className="flex-1 space-y-4 p-8 pt-6">
                <ProductForm categories={categories} colors={colors} sizes={size} initialData={product}/>
            </div>
        </div>
    );
}

export default ProductPage;