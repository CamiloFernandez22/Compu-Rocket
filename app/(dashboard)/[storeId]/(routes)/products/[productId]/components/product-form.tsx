//Este es un componente del cliente de esta aplicacion.
"use client";

//Aqui se van a crear las funcionalidades del API
 
//Se va a utilizar Zod Schema, Zod servira para validar inputs, outputs y respuestas de API.
import * as z from "zod";
//Se va a utilizar axios para hacer solicitudes a un determinado endpoint del API mediante cliente HTTP.
import axios from "axios";
import { Product, Image, Category, Color,  Size } from "@prisma/client";
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
import ImageUpload from "@/components/ui/image-upload";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem} from  "@/components/ui/select";

interface ProductFormProps{
    initialData: Product&{
        images: Image[]     //Aqui se va a hacer un objeto images
    }|null;
    categories: Category[];
    colors:     Color[];
    sizes:      Size[];
}
//Aqui se va a instanciar un objeto z de Zod para validar que la variable nombre tenga al menos 1 valor (Letra por ser String)
//y que la variable image siga los parametros indicados.
const formSchema = z.object({
    name:       z.string().min(1),
    images:     z.object({url: z.string()}).array(),
    price:      z.coerce.number().min(1),
    categoryId: z.string().min(1),
    colorId:    z.string().min(1),
    sizeId:     z.string().min(1),
    isFeatured: z.boolean().default(false).optional(),
    isArchived: z.boolean().default(false).optional(),
});

//Aqui se va a crear el type para los valores que tendremos en el product, esto es para no tener que estar llamando al objeto mas adelante sino al type. 
type ProductFormValues = z.infer<typeof formSchema>;


export const ProductForm: React.FC<ProductFormProps> = ({initialData, categories, colors, sizes}) => {
    
    const params = useParams();
    const router = useRouter();

    //Se va a crear la funcionalidad de estados.
    //Aqui se van a crear open y setOpen que van a controlar el modal de alerta.
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const title = initialData ? "Edit product" : "Create product";
    const description = initialData ? "Edit a product" : "Add a new product";
    const toastMessage = initialData ? "Product Updated" : "Product created";
    const action = initialData ? "Save changes" : "Create";

    //Estos seran los valores default del form 
    const form = useForm<ProductFormValues>({
        //A este resolver se le esta pasando de parametro el form schema que se creo en la linea 17.
        resolver: zodResolver(formSchema),
        //Como default values se va a pasar los valores que se le asignaron a initial data que serian
        // valores de la constante store, hover linea 14.
        defaultValues: initialData ?{
            ...initialData,
            price:  parseFloat(String(initialData?.price)),
        } : {
            name:'',
            images: [],
            price: 0,
            categoryId: '',
            colorId: '',
            sizeId: '',
            isFeatured: false,
            isArchived:  false,
        }
    });
    //Aqui se va a crear la funcion de onSubmit
    const onSubmit = async (data: ProductFormValues) => {
        
        try{
            setLoading(true);
            //Aqui se va a hacer uso de Axios para acceder a la tienda mediante el storeId y el path de este proyecto a la carpeta de API "/app/API/stores/route.ts"
            //en el cual se usara la funcion POST a la cual se establecera la conexion por medio de Axios.
            if(initialData){
                await axios.patch(`/API/${params.storeId}/products/${params.productsId}`, data);
            }else{
                await axios.post(`/API/${params.storeId}/products`, data);
            }
            //Esta funcion va a permitir sincronisar de nuevo el componente del lado del servidor el cual en este caso seria el page.tsx de SettingsPage esto para
            //poder realizar el fetch de la informacion de la tienda lo cual seria el storeId y el userId. Como resultado devolvera nueva InitialData.
            router.refresh();
            //Aqui se redirije a la pestanna products.
            router.push(`/${params.storeId}/products`);
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

    //Aqui se va a crear la funcion de borrar products.
    //Para que el usuario pueda borrar la tienda debe primero borrar los contenidos de la tienda (catgorias, productos, ordenes etc..).
    const onDelete= async () =>{
        try{
            setLoading(true)
            await axios.delete(`/API/${params.storeId}/products/${params.productsId}`);
            router.refresh();
            router.push(`/${params.storeId}/products`);
            toast.success("Product deleted.");
        }catch(error){
            toast.error("Oops! Something went wrong");
        } finally{
            setLoading(false)
            setOpen(false)
        }
    }

    
    //Aqui se va a crear el Form de los productos.
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
            <FormField control={form.control} name = "images" render={({field}) =>(
                        <FormItem>
                            <FormLabel>Images</FormLabel>
                            <FormControl>
                                <ImageUpload value={field.value.map((image) => image.url)} disabled={loading} 
                                onChange={(url) => field.onChange([...field.value, {url}])} 
                                onRemove={(url) => field.onChange([...field.value.filter((current) => current.url !== url)])}/>
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )} 
                     />

                <div className="grid grid-cols-3 gap-8">
                    <FormField control={form.control} name="name" render={({field}) =>(
                        <FormItem>
                            <FormLabel>Name</FormLabel>
                            <FormControl>
                                <Input disabled={loading} placeholder="Product name" {...field} />
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )} />
                    
                    <FormField control={form.control} name="price" render={({field}) =>(
                        <FormItem>
                            <FormLabel>Price</FormLabel>
                            <FormControl>
                                <Input disabled={loading} placeholder="0.00" {...field} />
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )} />
                    
                    <FormField control={form.control} name="categoryId" render={({field}) =>(
                        <FormItem>
                            <FormLabel>Category</FormLabel>
                            <Select disabled={loading} onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                                <FormControl>
                                    <SelectTrigger >
                                        <SelectValue defaultValue={field.value} placeholder="Select a category"/>
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {categories.map((category) =>(
                                        <SelectItem key={category.id} value={category.id} >
                                            {category.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <FormMessage/>
                        </FormItem>
                    )} />
                    
                    <FormField control={form.control} name="sizeId" render={({field}) =>(
                        <FormItem>
                            <FormLabel>Size</FormLabel>
                            <Select disabled={loading} onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                                <FormControl>
                                    <SelectTrigger >
                                        <SelectValue defaultValue={field.value} placeholder="Select a size"/>
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {sizes.map((size) =>(
                                        <SelectItem key={size.id} value={size.id} >
                                            {size.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <FormMessage/>
                        </FormItem>
                    )} />
                    
                    <FormField control={form.control} name="colorId" render={({field}) =>(
                        <FormItem>
                            <FormLabel>Color</FormLabel>
                            <Select disabled={loading} onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                                <FormControl>
                                    <SelectTrigger >
                                        <SelectValue defaultValue={field.value} placeholder="Select a color"/>
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {colors.map((colors) =>(
                                        <SelectItem key={colors.id} value={colors.id} >
                                            {colors.name}
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