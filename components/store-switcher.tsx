"use client";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useStoreModalStore } from "@/hooks/use-store-modal";
import { Store } from "@prisma/client";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
//Esto se importa de shadcn/ui, se puede verificar en la carpeta package.json
import { Check, ChevronsUpDown, PlusCircle, Store as StoreIcon} from "lucide-react";
import { cn } from "@/lib/utils";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator } from "@/components/ui/command";

type PopoverTriggerProps = React.ComponentPropsWithoutRef<typeof PopoverTrigger>

//Con este objeto vamos a traernos elementos popover del componente UI de Shadcn popover
interface StoreSwitcherProps extends PopoverTriggerProps{
    //Aqui vamos a tener los elementos que se correran dentro del store switcher, 
    //los cuales estaran en un arreglo de objetos y estos objetos son las tiendas
    //las cuales se consultaran atravez del ORM Prisma. 
    items: Store[];
};

//Esta sera la funcion que exportaremos y usaremos en el componente navbar
export default function StoreSwitcher({ 
    className,
    items = []
}: StoreSwitcherProps){
    //Aqui se definen elementos y constantes que se utilizaran para el store switcher
    const storeModal = useStoreModalStore();
    const params = useParams();
    const router = useRouter();

    //Se va a definir los items que seran iterados
    //la funcion devolvera un objeto inmediato item
    const formattedItems = items.map((item) => ({
        //Se usara el objeto Store el cual tiene los atributos id y name que se usaran a continuacion 
        label: item.name,
        value: item.id
    }));

    //Aqui se definira cual es la tienda seleccionada en el switcher de todas las tiendas que el usuario tiene activas
    //Con esta funcion se esta iterando sobre la funcion de la linea 29 se esta tomando en cuenta solo un item el cual
    //es parametro de la funcion find, se esta comparando el value del item el cual es la tienda seleccionada con el id que
    //esta activo en este momento y cuyo ID aparece en el URL.
    const currentStore = formattedItems.find((item) => item.value === params.storeId);

    //Aqui se va a controlar el estado del Popover
    const [open, setOpen] = useState(false);

    //Con esta funcion se definira que pasa cuando el usuario le da click a uan tienda diferente en el switcher.
    const onStoreSelect = (store: {value: string, label: string}) => {
        //Aqui lo que se hace es que una vez que se le da click a la tienda el switcher se cierra.
        setOpen(false);
        // y se redirige al storeId que se selecciono en el switcher. 
        router.push(`/${store.value}`);
    }

    //Aqui se va a crear el Popover que es el componente que se importo de Shadcn/ui. 
    //Dentro del command vamos a llamar a la funcion del modulo create store funcionalidad que brinda Zustand, el modulo ya instalado en ese componente. 
    return(
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button variant="outline" size="sm" role="combobox" aria-expanded={open} aria-label="Select a Store" className={cn("w-[200px] justify-between", className)}>
                    <StoreIcon className="mr-2 h-4 w-4"/>
                    {currentStore?.label}
                    <ChevronsUpDown className="ml-auto h-4 w-4 shrink-0 opacity-50"/>
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0">
                <Command>
                    <CommandList>
                        <CommandInput placeholder="Search store ..."/>
                        <CommandEmpty>No store found.</CommandEmpty>
                        <CommandGroup heading="Stores">
                            {formattedItems.map((store) =>(
                                <CommandItem key={store.value} onSelect={() => onStoreSelect(store)} className="text-sm">
                                    <StoreIcon className="mr-2 h-4 w-4"/>
                                    {store.label}
                                    <Check className={cn("ml-auto h-4 w-4", currentStore?.value === store.value ? "opacity-100" : "opacity-0")}/>
                                </CommandItem>
                            ))}
                            </CommandGroup>
                    </CommandList>
                    <CommandSeparator/>
                    <CommandList>
                        <CommandGroup>
                            <CommandItem onSelect={() => {
                                setOpen(false);
                                storeModal.onOpen();
                            }}>
                                <PlusCircle className="mr-2 h-5 w-5"/>
                                Create Store
                            </CommandItem>
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
};