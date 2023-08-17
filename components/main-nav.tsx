//Esto indica que main-nav sera un componente de tipo cliente. 
"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import React from "react";

export function MainNav({
    className,
    ...props
}: React.HTMLAttributes<HTMLElement>){
    const pathname = usePathname();
    const params = useParams();

    //En este objeto se van a crear las rutas en base a los pathnames y params
    const routes = [
       // {   //Aqui en este objeto especial vamos a hacer fetch de la informacion del dashboard mediante store ID el cual se agarra del layout de dashboard
       //     href:`/${params.storeId}`, //aqui ponemos la ruta del link settings que redigira a la tienda activa especifica a ese ID. 
        //    label: 'Dashboard',
        //    active: pathname === `/${params.storeId}`,
       // },

        {   //Aqui en este objeto especial vamos a hacer fetch de la informacion de los billboards mediante store ID el cual se agarra del layout de dashboard
            href:`/${params.storeId}/billboards`, //aqui ponemos la ruta del link settings que redigira a la tienda activa especifica a ese ID. 
           label: 'Billboards',
            active: pathname === `/${params.storeId}/billboards`,
        },

        {   //Aqui en este objeto especial vamos a hacer fetch de la informacion de las categorias mediante store ID el cual se agarra del layout de dashboard
            href:`/${params.storeId}/categories`, //aqui ponemos la ruta del link settings que redigira a la tienda activa especifica a ese ID. 
            label: 'Categories',
            active: pathname === `/${params.storeId}/categories`,
        },

        {   //Aqui en este objeto especial vamos a hacer fetch de la informacion de los tamannos o sizes mediante store ID el cual se agarra del layout de dashboard
            href:`/${params.storeId}/sizes`, //aqui ponemos la ruta del link settings que redigira a la tienda activa especifica a ese ID. 
            label: 'Sizes',
            active: pathname === `/${params.storeId}/sizes`,
        },

        {   //Aqui en este objeto especial vamos a hacer fetch de la informacion de los colores mediante store ID el cual se agarra del layout de dashboard
            href:`/${params.storeId}/colors`, //aqui ponemos la ruta del link settings que redigira a la tienda activa especifica a ese ID. 
            label: 'Colors',
            active: pathname === `/${params.storeId}/colors`,
        },

        {   //Aqui en este objeto especial vamos a hacer fetch de la informacion de los colores mediante store ID el cual se agarra del layout de dashboard
            href:`/${params.storeId}/products`, //aqui ponemos la ruta del link settings que redigira a la tienda activa especifica a ese ID. 
            label: 'Products',
            active: pathname === `/${params.storeId}/products`,
        },

        {   //Aqui en este objeto especial vamos a hacer fetch de la informacion de la tienda mediante store ID el cual se agarra del layout de dashboard
            href:`/${params.storeId}/settings`, //aqui ponemos la ruta del link settings que redigira a la tienda activa especifica a ese ID. 
            label: 'Settings',
            active: pathname === `/${params.storeId}/settings`,
        },
    ];
    return(
        <nav className={cn("flex items-center space-x-4 lg:space-x-6", className)}>
            {routes.map((route) =>(
                //Aqui estamos dandole estilo al href, permtiendo su visibilida en el modo oscuro y claro respectivamente
                <Link key={route.href} href={route.href} className={cn("text-sm font-medium transition-colors hover:text-primary", route.active ? "text-black dark:text-white" : "text-muted-foreground")}>
                {route.label}
                </Link>
            ))}
        </nav>
    )
};