//Esta pagina es para darle estilo a los componenetes de Auth

import React, { Children } from "react"

export default function AuthLayout({
    //Esta funcion va aceptar elementos de tipo hijo para realizar los cambios de layout establecidos
    children
}: {
    children: React.ReactNode
}) {
    //Aqui se inicia la funcion para hacer uso de los elementos hijos
    return(
        //Se utiliza un div para centrar la ventana de Auth en el layout de la pagina web
        //Todos los cambios de estilo que se realicen en esta funcion afectaran las rotas de todos los
        //componentes del folder Auth. 
        <div className = "flex items-center justify-center h-full w-full">
            {children}
        </div>
    )
}