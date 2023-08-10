import { PrismaClient } from "@prisma/client";
//Aqui se va a inicializar prisma del lado del cliente

declare global {
    var prisma: PrismaClient|undefined
};

//Con esta constante lo que se quiere es optimizar los tiempos de respuesta a la BD
//ya que no se estara inicializando de nuevo el cliente Prisma cada vez que se hace un 
//hot reload sino que llama a la funcion global. 
const prismadb = globalThis.prisma || new PrismaClient();
if(process.env.NODE_ENV !== "production") globalThis.prisma = prismadb;
export default prismadb;