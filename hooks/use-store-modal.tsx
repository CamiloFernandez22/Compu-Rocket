//Se importo modulo de zustand que lo que viene a hacer es facilitar temas de 
//funcionalidad de algunos de los componentes
import { create } from  "zustand"; 

//Se crea la interface que se utilizara para darle la funcionalidad de abrir y cerrar a los 
//componentes de dialogo de la tienda. 
interface useStoreModalStore {
    isOpen: boolean;
    onOpen: () => void;
    onClose: () => void;
};

//Aqui se retorna un objeto de tipo media de la interface creada. 
export const useStoreModalStore = create<useStoreModalStore>((set) => ({
    isOpen: false,
    //Se establecen las funciones que permiten la apertura de la ventana de dialogo
    onOpen: () => set({isOpen: true}),
    onClose: () => set({isOpen: false}),
}));