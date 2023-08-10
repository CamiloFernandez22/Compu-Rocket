//Se importa el modulo de clerk autentication el cual es un servicio
//de autenticacion y autorizacion que tambien utiliza el servicio de
//Google Cloud para hacer la gestion de usuarios. 
import { SignUp } from "@clerk/nextjs";

//Aqui se hace una funcion para el llamado de la pagina de sign up o registro. 
export default function Page() {
  return <SignUp />;
}