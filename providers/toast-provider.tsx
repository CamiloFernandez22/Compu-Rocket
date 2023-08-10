//Aqui se indica que este componente corre en el lado del cliente
"use client";

import { Toaster } from "react-hot-toast";

//Se crea una funcion en base al modulo de Toaster isntalado en este proyecto para manejar errores
export const ToasterProvider = () =>{
    return<Toaster/>;
};