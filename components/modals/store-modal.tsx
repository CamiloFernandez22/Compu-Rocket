//Aqui utilizamos use client porque Modal es un componente de cliente
"use client";

import * as z from "zod";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
//Aqui se esta importando un Hook para poder usar variables de estado,ver linea 54.
import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

import {useStoreModalStore} from "@/hooks/use-store-modal";
import { Modal } from "@/components/ui/modal";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components//ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";




//Con esta constante estamos condicionando al sistema que al menos 
//debe haber un caracter para poder crear el form.
//Con este objeto estamos importando funcionalidades del modulo zod. 
const formSchema = z.object({
    name: z.string().min(1),
});

//Aqui se declara una variable constate que apunta a una funcion de flecha 
export const StoreModal = () =>{
    const storeModal = useStoreModalStore();
    //Aqui se crea la instancia del hook useState con la constante loading. 
    const [loading, setLoading] = useState(false);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues:{
            name: "",
        },
    });
    //Esta es una funcion que va a permitir crear la tienda en base a la informacion ingresada en el form. 
    const onSubmit = async (values: z.infer<typeof formSchema>) =>{
        try{
            //Le pedimos al sistema que llame a la constante setLoading, se le pasa como paramatero valor bool de true.
            setLoading(true);

            //Aqui basicamente se usa la libreria Axios que nos permite comunicar con los API's del proyecto -
            //- en este caso vamos a crear una constante que pasa los valores ("values") del form -
            //- que se empieza a hacer en la linea 32 en el cual se pasa el valor de name y este se accede -
            //- en la ruta del API stores para jalar y validar esa informacion, la funcion POST viene siendo el endpoint para efectos de NextJS.
            const response = await axios.post('/API/stores', values);
            
            //Aqui se va a redirigir del modal al dashboard, se usara window.location en vez del routing convencional de nextNavigation 
            //para optimizar tiempos de respuesta con la base de datos.
            window.location.assign(`/${response.data.id}`);
        }catch(error){
            //console.log(error);
            //Para optimizar la experiencia de manejo de errores en vez de utilizar el console log de arriba se usara un ToastProvider
            toast.error("Something went wrong...");
        }finally{
            setLoading(false);
        }
    }
    return(
    //Aqui se va a retornar el componente de modal, Aqui se crea el form de crear vista de tienda. 
    <Modal title="Create store" 
    description="Add a new store to manage products and categories" isOpen={storeModal.isOpen} onClose={storeModal.onClose}
    //dentro del form vamos a hacer que handleSubmit use la funcion creada en la linea 31.
    >
     <div>
        <div className="space-y-4 py-2 pb-4">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                    <FormField control={form.control} name="name" render={({field}) =>(
                        <FormItem>
                            <FormLabel>Name</FormLabel>
                            <FormControl>
                                <Input disabled= {loading}placeholder="Enter a store name ..." {...field} />
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )}
                    />
                    <div className="pt-6 space-x-2 flex items-center justify-end w-full">
                        <Button disabled={loading} variant="outline" onClick={storeModal.onClose}>Cancel</Button>
                        <Button disabled={loading} type="submit">Continue</Button>
                    </div>
                </form>
            </Form>
        </div>
     </div>
    </Modal>
    );
};