// Aqui se va a crear la pagina de los banners o billboards 

//Aqui se importo la funcion BillbaordClient del componente client
import  { format }  from "date-fns";
import prismadb from "@/lib/prismadb";
import { CategoryClient } from "./components/client";
import { CategoryColumn } from "./components/columns";

const CategoriesPage = async ({
    params
}:{
    params:{storeId: string}
}) => {
    //Aqui se va a hacer fetch de los billboards existentes de la tienda en la que se encuentra el usuario en ese momento para despelgar en el lado del client. 
    const categories = await prismadb.category.findMany({
        //Aqui se va a crear el objeto de billboards usando los params ya inicializados. 
        where:{
            storeId: params.storeId
        },
        include:{
            billboard: true,
        },
        orderBy:{
            createdAt:'desc'
        }
    });

    //Aqui se va a pasar la informacion de los billboards en formato para dataTable.
    const formattedCategories: CategoryColumn[] = categories.map((item) => ({
        id: item.id,
        name: item.name,
        billboardLabel: item.billboard.label,
        //Aqui se ocupa convertir el elemento a String por lo cual se debe correr el comando "npm i date-fns"
        createdAt: format(item.createdAt, "MMM do, yyy")
    }));

    return(
        <div className="flex-col">
            <div className="flex-1 space-y-4 p-8 pt-6">
                <CategoryClient data={formattedCategories}/>
            </div>
        </div>
    );
}

export default CategoriesPage;