/** @type {import('next').NextConfig} */
const nextConfig = {
    //Aqui se esta creando un objeto images para subir imagens a cloudinary
    images: {
        domains:[
            "res.cloudinary.com"
        ]
    }
}

module.exports = nextConfig
