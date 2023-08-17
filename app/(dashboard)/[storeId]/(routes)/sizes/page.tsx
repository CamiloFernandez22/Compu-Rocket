// Aqui se va a crear la pagina de los tamannos 

//Aqui se importo la funcion BillbaordClient del componente client
import  { format }  from "date-fns"
import prismadb from "@/lib/prismadb";
import { SizesClient } from "./components/client";
import { SizeColumn} from "./components/columns"
const SizesPage = async ({
    params
}:{
    params:{storeId: string}
}) => {
    //Aqui se va a hacer fetch de los tamannos existentes de la tienda en la que se encuentra el usuario en ese momento para despelgar en el lado del client. 
    const sizes = await prismadb.size.findMany({
        //Aqui se va a crear el objeto de tamannos usando los params ya inicializados. 
        where:{
            storeId: params.storeId
        },
        orderBy:{
            createdAt:'desc'
        }
    });

    //Aqui se va a pasar la informacion de los tamannos en formato para dataTable.
    const formattedSizes: SizeColumn[] = sizes.map((item) => ({
        id: item.id,
        name: item.name,
        value: item.value,
        //Aqui se ocupa convertir el elemento a String por lo cual se debe correr el comando "npm i date-fns"
        createdAt: format(item.createdAt, "MMM do, yyy")
    }));

    return(
        <div className="flex-col">
            <div className="flex-1 space-y-4 p-8 pt-6">
                <SizesClient data={formattedSizes}/>
            </div>
        </div>
    );
}

export default SizesPage;