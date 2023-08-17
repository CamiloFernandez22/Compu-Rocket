"use client";
 
//Se va a utilizar Zod Schema, Zod servira para validar inputs, outputs y respuestas de API.
import * as z from "zod";
//Se va a utilizar axios para hacer solicitudes a un determinado endpoint del API mediante cliente HTTP.
import axios from "axios";
import { Billboard, Category } from "@prisma/client";
import { Heading } from "@/components/ui/heading";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import toast from "react-hot-toast";
import { useParams, useRouter } from "next/navigation";
import { AlertModal } from "@/components/modals/alert-modal";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

//Estos seran los props del form category.
interface CategoryFormProps{
    initialData: Category|null;
    billboards: Billboard[];
}
//Aqui se va a instanciar un objeto z de Zod para validar que la variable nombre tenga al menos 1 valor (Letra por ser String).
const formSchema = z.object({
    name: z.string().min(1),
    billboardId: z.string().min(1),
});

//Aqui se va a crear el type para los valores que tendremos en el Category, esto es para no tener que estar llamando al objeto mas adelante sino al type. 
type CategoryFormValues = z.infer<typeof formSchema>;


export const CategoryForm: React.FC<CategoryFormProps> = ({initialData, billboards}) => {
    
    const params = useParams();
    const router = useRouter();

    //Se va a crear la funcionalidad de estados.
    //Aqui se van a crear open y setOpen que van a controlar el modal de alerta.
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const title = initialData ? "Edit category" : "Create category";
    const description = initialData ? "Edit a category" : "Add a new category";
    const toastMessage = initialData ? "Category Updated" : "Category created";
    const action = initialData ? "Save changes" : "Create";


    const form = useForm<CategoryFormValues>({
        //A este resolver se le esta pasando de parametro el form schema que se creo en la linea 17.
        resolver: zodResolver(formSchema),
        //Como default values se va a pasar los valores que se le asignaron a initial data que serian
        // valores de la constante store, hover linea 14.
        defaultValues: initialData || {
            name:'',
            billboardId: ''
        }
    });
    //Aqui se va a crear la funcion de onSubmit
    const onSubmit = async (data: CategoryFormValues) => {
        
        try{
            setLoading(true);
            //Aqui se va a hacer uso de Axios para acceder a la tienda mediante el storeId y el path de este proyecto a la carpeta de API "/app/API/categories/route.ts"
            //en el cual se usara la funcion POST a la cual se establecera la conexion por medio de Axios.
            if(initialData){
                await axios.patch(`/API/${params.storeId}/categories/${params.categoryId}`, data);
            }else{
                await axios.post(`/API/${params.storeId}/categories`, data);
            }
            //Esta funcion va a permitir sincronisar de nuevo el componente del lado del servidor el cual en este caso seria el page.tsx de SettingsPage esto para
            //poder realizar el fetch de la informacion de la tienda lo cual seria el storeId y el userId. Como resultado devolvera nueva InitialData.
            router.refresh();
            //Aqui se redirije a la pestanna categories.
            router.push(`/${params.storeId}/categories`);
            //Toast devolvera un mensaje al usuario indicando que la tienda ha sido actualizada. 
            toast.success(toastMessage);
        }catch(error){
            //Aqui se esta usando toast para crear una notificacion mas llamativa en vez de un console.log
            toast.error("Something went wrong.");
        }finally{
            //Este finally lo que va a hacer es resetear el loading a false.
            setLoading(false);
        }
    };

    //Aqui se va a crear la funcion de borrar Category.
    //Para que el usuario pueda borrar la tienda debe primero borrar los contenidos de la tienda (catgorias, productos, ordenes etc..).
    const onDelete= async () =>{
        try{
            setLoading(true)
            await axios.delete(`/API/${params.storeId}/categories/${params.categoryId}`);
            router.refresh();
            router.push(`/${params.storeId}/categories`)
            toast.success("Category deleted.");
        }catch(error){
            toast.error("Make sure you removed all products using this category first.");
        } finally{
            setLoading(false)
            setOpen(false)
        }
    }

    
    //Aqui se va a crear el Form de los Category.
    return(
        <>
        <AlertModal isOpen={open} onClose={() => setOpen(false)} onConfirm={onDelete} loading={loading}/>

        <div className="flex items-center justify-between">
            <Heading title={title} description={description}/>

            {initialData && (
            <Button disabled={loading} variant="destructive" size="icon" onClick={() => setOpen(true)}> 
            <Trash className="h-4 w-4"/>
            </Button>)
            }
        </div>

        <Separator/>

        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full">
                <div className="grid grid-cols-3 gap-8">
                    <FormField control={form.control} name="name" render={({field}) =>(
                        <FormItem>
                            <FormLabel>Name</FormLabel>
                            <FormControl>
                                <Input disabled={loading} placeholder="Category name" {...field} />
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )} />

        <FormField control={form.control} name="billboardId" render={({field}) =>(
                        <FormItem>
                            <FormLabel>Billboard</FormLabel>
                            <Select disabled={loading} onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                                <FormControl>
                                    <SelectTrigger >
                                        <SelectValue defaultValue={field.value} placeholder="Select a billboard"/>
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {billboards.map((billboard) =>(
                                        <SelectItem key={billboard.id} value={billboard.id} >
                                            {billboard.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <FormMessage/>
                        </FormItem>
                    )} />

                </div>
                <Button disabled={loading} className="ml-auto" type="submit">
                    {action}
                </Button>
            </form>
        </Form>
        <Separator/>
        </>
    );  
};