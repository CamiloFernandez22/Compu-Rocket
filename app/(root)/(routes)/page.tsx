//Aqui utilizamos use client porque Modal es un componente de cliente
"use client";

import { useStoreModalStore } from "@/hooks/use-store-modal";
import { useEffect } from "react";

//Aqui se va a extraer las funciones de estado onOpen y isOpen, esto gracias al servicio de Zustand
//a travez del documento de use-store-modal que es donde instanciamos el objeto a usar. 
const SetupPage = () => {
  //vamos a inicializar las dos constantes a utilizar y como parametro se le pasaran las 
  // funciones de estado de Zustand. 
  const onOpen = useStoreModalStore((state) => state.onOpen);
  const isOpen = useStoreModalStore((state) => state.isOpen);

  //Aqui se hace uso del modulo nativo de React para dar el efecto a nuestro componente.
  useEffect(() =>{
    //Aqui se valida si el modal esta abierto con la condicional
    if(!isOpen){
      //sino esta abierto entonces le pasamos la instruccion de abrir.
      onOpen();
    }
    //Aqui se pasan las constantes como elementos del arreglo de dependencias para poder
    //hacer uso de la funcion.  
  }, [isOpen, onOpen]);
  return null;
}
  
export default SetupPage;