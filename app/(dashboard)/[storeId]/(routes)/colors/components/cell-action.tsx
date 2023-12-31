//Esto sera un componente de tipo cliente 
"use client";

import axios from "axios";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Copy, Edit, MoreHorizontal, Trash } from "lucide-react";
import { ColorColumn } from "./columns";
import { toast } from "react-hot-toast";
import { useRouter, useParams } from "next/navigation";
import { useState } from    "react";
import { AlertModal } from "@/components/modals/alert-modal";

//Esto es una interface de tipo columna 
interface CellActionProps{
    data: ColorColumn;
};

export const CellAction: React.FC<CellActionProps> = ({
    data
}) => {
    //Instancia de funcion router para redireccionar a otros componentes. 
    const router = useRouter();

    //Instancia de funcion params para poder hacer el routeo del componente.
    const params = useParams();

    const   [loading, setLoading] = useState(false);
    const   [open, setOpen]  =  useState(false);  

    //Funcion para poder copiar informacion al clipbaord
    const onCopy = (id: string) => {
        navigator.clipboard.writeText(id);
        toast.success("Color ID copied to the clipboard.");
    };

    //Fucnion para poder borrar informacion/elementos de la tabla de datos.
    const onDelete= async () =>{
        try{
            setLoading(true)
            await axios.delete(`/API/${params.storeId}/colors/${data.id}`);
            router.refresh();
            //router.push(`/${params.storeId}/billboards`);
            toast.success("Color deleted.");
        }catch(error){
            toast.error("Make sure you removed all products using this color first.");
        } finally{
            setLoading(false)
            setOpen(false)
        }
    }

    return(
        //Aqui accionaremos una accion 
        //dropdown menu componente de shadcn
        <>
        <AlertModal isOpen={open} onClose={() => setOpen(false)} onConfirm={onDelete} loading={loading}/>
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                    <span className="sr-only">Open menu</span>
                    <MoreHorizontal className="h-4 w-4"/>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuItem onClick={() => onCopy(data.id)}>
                    <Copy className="mr-2 h-4 w-4"/>
                    Copy Id
                </DropdownMenuItem>
    
                <DropdownMenuItem onClick={() => router.push(`/${params.storeId}/colors/${data.id}`)}>
                    <Edit className="mr-2 h-4 w-4"/>
                    Update
                </DropdownMenuItem>

                <DropdownMenuItem onClick={() => setOpen(true)}>
                    <Trash className="mr-2 h-4 w-4"/>
                    Delete
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
        </>
    );
};