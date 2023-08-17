//Esto sera parte del lado del cliente
"use client";

import { ApiList } from "@/components/ui/api-list";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { Plus } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { ProductColumn, columns } from "./columns";

//Aqui se va a crear una interface de products para luego ser ustilizada como tag en el page.tsx de products.
interface ProductClientProps{
    data: ProductColumn[]
}

//Se va a crear la constante luego se usara en otros componentes 
export const ProductClient: React.FC<ProductClientProps> = ({
    data
}) =>{

    //Se necesita instanciar los elementos de navegacion para acceder a los endpoints del API.
    //Se crea el router de navegacion 
    const router = useRouter();
    //Se crean los params de navigacion
    const params = useParams();
    //El data table se crea a partir del componente de Shadcn, ver pasos en: https://ui.shadcn.com/docs/components/data-table
    return (
        <>
        <div className="flex items-center justify-between">
            <Heading title={`Products(${data.length})`} description="Manage products for your store"/>
            <Button onClick={()=> router.push(`/${params.storeId}/products/new`)}>
              <Plus className="mr-2 h-4 w-4"/>
               Add new
            </Button>  
        </div>
        <Separator/>
        <DataTable searchKey ="name" columns={columns} data={data}/>
       
        </>
    )
}