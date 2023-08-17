//Este sera el componente de UI para subir imagenes y mostrarlas.
"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ImagePlus, Trash } from "lucide-react";
import Image from "next/image";
import { CldUploadWidget } from "next-cloudinary";

interface ImageUploadProps{
    disabled?: boolean;
    //Se va a tener la posibilidad de cambiar imagen
    onChange: (value: string)   =>  void; 
    //Se va a tener la posibilidad de cambiar imagen
    onRemove: (value: string)   =>  void;
    //Se va a tener la posibilidad de desplegar varias imagenes a la vez mediante a un array
    value: string[];
}

const ImageUpload: React.FC<ImageUploadProps> = ({
    disabled,
    onChange,
    onRemove,
    value
}) =>{
    const [isMounted, setIsMounted] = useState(false);

    //Con esta funcion nos aseguramos que tanto el lado del cliente como
    //el lado del servidor de esta app esten sincronisados con los modals. 
    useEffect(() =>{
        //Aqui le estamos diciendo al app que se ocupa devolver un valor true 
        //a la funcion setIsMounted para validar que esta pueda desplegar el componente.
        setIsMounted(true);
    }, []);

     //Esta es la funcion para subir las imagenes
     const onUpload = (result:any) =>{
        onChange(result.info.secure_url);
    }

    //Con esta condiconal se valida que si el valor de la funcion ya mencionada en la linea 13
    //es diferente a true, o sea, no este desplegandose entonces que nos devuelva null en el 
    //lado del servidor. 
    if(!isMounted){
        return null;
    }

    return(
        <div>
            <div className="mb-4 flex items-center gap-4">
                {value.map((url) =>(
                    <div key={url} className="relative w-[200px] h-[200px] rounded-md overflow-hidden">
                        <div className="z-10 absolute top-2 right-2">
                            <Button type="button" onClick={() => onRemove(url)} variant="destructive" size="icon">
                                <Trash className="h-4 w-4"/>
                            </Button>
                        </div>
                        <Image fill className="object-cover" alt="name" src={url}/>
                    </div>
                ))}
            </div>
            <CldUploadWidget onUpload={onUpload} uploadPreset="e8fkgmmh">
                {({open}) =>{
                    const onClick = () =>{
                        open();
                    }
                return(
                    <Button type="button" disabled={disabled} variant="secondary" onClick={onClick}>
                        <ImagePlus className="h-4 w-4 mr-2"/>
                        Upload image
                    </Button>
                )
                }}
            </CldUploadWidget>
        </div>
    )
};
export default ImageUpload;