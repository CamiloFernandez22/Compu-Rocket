//interface de props con titulo y descripcion como string
interface HeadingProps{
    title: string;
    description: string;
};
//Aqui se exporta Heading que es un tipo de React FC o componente de funcion. 
export const Heading: React.FC<HeadingProps> = ({title, description}) =>{
    return (
        <div>
            <h2 className="text-3xl font-bold tracking-tight">{title}</h2> 
            <p className="text-sm text-muted-foreground">{description}</p>
        </div>
    )
}