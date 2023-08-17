import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
 
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

//Aqui vamos a darle foramto a los precios de los productos
export const formatter = new Intl.NumberFormat("en-US",{
  style:  'currency',
  currency: 'USD'
});