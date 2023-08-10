//Este archivo modal nos va a servir para estandarizar el uso
//de los distintos componentes tipo dialog que va a tener distintas 
//utilidades dentro del sistema web. 
"use client";

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";

//Se va a inicializar una interface
interface ModalProps{
    title: string;
    description: string;
    isOpen: boolean;
    onClose: () => void;
    children?: React.ReactNode;
};
//Aqui se van a extraer los props creados en la interface ModalProps
export const Modal: React.FC<ModalProps> = ({
    title,
    description,
    isOpen,
    onClose,
    children
}) => {
//Aqui se va a crear una funcion de cambio, esta funcion trabaja atravez de un append
// del UI del compomente dialog de shadcn.

//La constante onChange va a recibir como parametro un elemento open de tipo booleano.
    const onChange = (open:boolean) => {
        //Aqui tenemos una condicional que indica que si el estado de open es diferente, este puede ser true o false 
        //por medio del tipo de dato bool entonces llama a la funcion onClose; 
        if(!open){
            onClose();
        }
    };
    //Aqui vamos a retornar el componente dialog con todos sus sub-componenetes de estructura, los cuales seran:
    //DialogContent, DialogHeader, DialogTitle y DialogDescription.
    return(
        //A la etiqueta de Dialog se le va a poner props que se crearon en la interface ModalProp
        <Dialog open={isOpen} onOpenChange={onChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                    <DialogDescription>
                        {description}
                    </DialogDescription>
                </DialogHeader>
                <div>
                    {children}
                </div>
            </DialogContent>
        </Dialog>
    );
};
