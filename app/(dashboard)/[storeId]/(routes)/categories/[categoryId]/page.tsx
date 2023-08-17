//Aqui se va a crear el form de los billboards

import prismadb from "@/lib/prismadb";
import { CategoryForm } from "./components/category-form";

const CategoryPage = async ({
    params
}:{
    params: {categoryId: string, storeId: string}
}) =>{
    //Esta funcion va a hacer fetch de un Category existinte usando el ID de la BD en el URL
    const category = await prismadb.category.findUnique({ 
        //Se va a solicitar a prismadb que encuentre un unico ID que coincida con el de categoryId en cuestion. 
        where: {
            id: params.categoryId
        }
    });

    //Se va a hacer fetch del componente billboard
    const billboards = await prismadb.billboard.findMany({
        where:{
            storeId: params.storeId
        }
    });
    return(
        <div className="flex-col">
            <div className="flex-1 space-y-4 p-8 pt-6">
                <CategoryForm billboards={billboards} initialData={category}/>
            </div>
        </div>
    );
}

export default CategoryPage;