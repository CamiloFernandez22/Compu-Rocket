//Este sera un componente del client
"use client";

import { useOrigin } from "@/hooks/use-origin";
import { useParams} from "next/navigation";
import { ApiAlert } from "@/components/ui/api-alert";

//Esta es una interface para la lista de api.
interface ApiListProps{
    entityName: string;
    entityIdName: string;
}
export const ApiList: React.FC<ApiListProps> = ({
    entityName,
    entityIdName,
}) => {
    //Se va a instanciar los params
    const params = useParams();
    //Se va a instanciar los routers
    const origin = useOrigin();

    // Se va a crear el URL base
    const baseUrl = `${origin}/API/${params.storeId}`;

    return(
        <>
        <ApiAlert title="GET" variant="public" description={`${baseUrl}/${entityName}`}/>
        <ApiAlert title="GET" variant="public" description={`${baseUrl}/${entityName}/{${entityIdName}}`}/>
        <ApiAlert title="POST" variant="admin" description={`${baseUrl}/${entityName}`}/>
        <ApiAlert title="PATCH" variant="admin" description={`${baseUrl}/${entityName}/{${entityIdName}}`}/>
        <ApiAlert title="DELETE" variant="admin" description={`${baseUrl}/${entityName}/{${entityIdName}}`}/>

        </>
    )
}