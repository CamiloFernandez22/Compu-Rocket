//Aqui utilizamos use client porque Modal es un componente de cliente
"use client";

import { StoreModal } from "@/components/modals/store-modal";

import { useEffect, useState } from "react";

export const ModalProvider = () => {
    const [isMounted, setIsMounted] = useState(false);

    //Con esta funcion nos aseguramos que tanto el lado del cliente como
    //el lado del servidor de esta app esten sincronisados con los modals. 
    useEffect(() =>{
        //Aqui le estamos diciendo al app que se ocupa devolver un valor true 
        //a la funcion setIsMounted para validar que esta pueda desplegar el componente.
        setIsMounted(true);
    }, []);

    //Con esta condiconal se valida que si el valor de la funcion ya mencionada en la linea 13
    //es diferente a true, o sea, no este desplegandose entonces que nos devuelva null en el 
    //lado del servidor. 
    if(!isMounted){
        return null;
    }
    //Aqui vamos a retornar un modal en el lado del cliente, anteriormente el lado del servidor
    //no esta renderizando o corriendo un modal. 

    return(
        //Esto es un fragmento hijo.
        //Aqui es donde vamos a llamar a nuestro componente StoreModal 
        //para desplegar la tienda en el lado del cliente. 
    <>
        <StoreModal/>
    </>
    )
}