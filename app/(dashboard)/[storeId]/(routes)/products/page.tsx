// Aqui se va a crear la pagina de los products 

//Aqui se importo la funcion BillbaordClient del componente client
import  { format }  from "date-fns"
import prismadb from "@/lib/prismadb";
import { ProductClient } from "./components/client";
import { ProductColumn} from "./components/columns"
import { formatter } from "@/lib/utils";
const ProductsPage = async ({
    params
}:{
    params:{storeId: string}
}) => {
    //Aqui se va a hacer fetch de los product existentes de la tienda en la que se encuentra el usuario en ese momento para despelgar en el lado del client. 
    const products = await prismadb.product.findMany({
        //Aqui se va a crear el objeto de product usando los params ya inicializados. 
        where:{
            storeId: params.storeId
        },
        //Aqui se van a pasar los distintos modals que ya se crearon como un objeto
        // esto es para poder desplegarlos en la data table en la pestanna principal de producto.
        include:{
            category: true,
            size:     true,
            color:    true,
        },
        orderBy:{
            createdAt:'desc'
        }
    });

    //Aqui se va a pasar la informacion de los products en formato para dataTable,
    // se va a iterar sobre la constante products la cual crea la instancia con la BD de prismaDB.
    const formattedProducts: ProductColumn[] = products.map((item) => ({
        id: item.id,
        name: item.name,
        isFeatured: item.isFeatured,
        isArchived: item.isArchived,
        //Aqui estamos importando la funcion de formatter de utils, esta le dara formato al precio ya definido en la funcion -
        //ya que price esta definido como tipo decimal en la base de datos y formatter ocupa un string se va a pasar a number con el toNumber. 
        price: formatter.format(item.price.toNumber()),
        category: item.category.name,
        size: item.size.name,
        color: item.color.value,
        //Aqui se ocupa convertir el elemento a String por lo cual se debe correr el comando "npm i date-fns"
        createdAt: format(item.createdAt, "MMM do, yyy")
    }));

    return(
        <div className="flex-col">
            <div className="flex-1 space-y-4 p-8 pt-6">
                <ProductClient data={formattedProducts}/>
            </div>
        </div>
    );
}

export default ProductsPage;